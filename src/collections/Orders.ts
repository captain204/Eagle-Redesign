import type { CollectionConfig } from 'payload'
import { nigeriaData } from '../lib/nigeriaData'

const stateOptions = Object.keys(nigeriaData).map(state => ({ label: state, value: state }));

export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['id', 'customer', 'total', 'status', 'createdAt'],
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor') return true
            if (!user) return false;
            return {
                customer: {
                    equals: user.id,
                },
            }
        },
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'editor',
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'users',
            required: false,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
            admin: {
                position: 'sidebar'
            }
        },
        {
            name: 'items',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                },
                {
                    name: 'quantity',
                    type: 'number',
                    required: true,
                    min: 1,
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                }
            ]
        },
        {
            name: 'total',
            type: 'number',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            required: true,
            options: [
                { label: 'Pending Payment', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Refunded', value: 'refunded' },
                { label: 'Failed', value: 'failed' },
            ],
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'paymentStatus',
            type: 'select',
            defaultValue: 'unpaid',
            options: [
                { label: 'Unpaid', value: 'unpaid' },
                { label: 'Paid', value: 'paid' },
            ],
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'shippingAddress',
            type: 'group',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'street', type: 'text' },
                { name: 'lga', type: 'text', label: 'LGA' },
                {
                    name: 'state',
                    type: 'select',
                    options: stateOptions,
                },
                { name: 'country', type: 'text' },
                { name: 'zip', type: 'text' },
            ]
        },
        {
            name: 'billingAddress',
            type: 'group',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'street', type: 'text' },
                { name: 'lga', type: 'text', label: 'LGA' },
                {
                    name: 'state',
                    type: 'select',
                    options: stateOptions,
                },
                { name: 'country', type: 'text' },
                { name: 'zip', type: 'text' },
            ]
        },
        {
            name: 'notes',
            type: 'textarea',
        },
        {
            name: 'emailSent',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                readOnly: true,
            }
        },
        {
            name: 'appliedReferralCode',
            type: 'text',
            admin: {
                position: 'sidebar',
                readOnly: true,
            }
        }
    ],
    hooks: {
        afterChange: [
            async ({ doc, previousDoc, req }) => {
                // If payment status just changed to paid
                if (doc.paymentStatus === 'paid' && previousDoc.paymentStatus !== 'paid') {
                    // 1. Process Referral Earnings
                    if (doc.appliedReferralCode) {
                        try {
                            const referrerResult = await req.payload.find({
                                collection: 'users',
                                where: {
                                    referralCode: { equals: doc.appliedReferralCode }
                                },
                            })
                            
                            const referrer = referrerResult.docs[0]
                            
                            if (referrer) {
                                let totalCommission = 0;
                                for (const item of doc.items || []) {
                                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                                    if (productId) {
                                        const product = await req.payload.findByID({
                                            collection: 'products',
                                            id: productId,
                                        });
                                        const perc = product.referralPercentage || 0;
                                        if (perc > 0) {
                                            totalCommission += (item.price * item.quantity * perc) / 100;
                                        }
                                    }
                                }
                                
                                if (totalCommission > 0) {
                                    await req.payload.create({
                                        collection: 'referralEarnings',
                                        data: {
                                            referrer: referrer.id,
                                            order: doc.id,
                                            amountEarned: totalCommission,
                                            status: 'paid',
                                        }
                                    });

                                    // Email: Send Referral Commission Email
                                    await req.payload.sendEmail({
                                        to: referrer.email,
                                        subject: 'You earned a referral commission!',
                                        html: `<h1>Congratulations!</h1><p>You just earned ₦${totalCommission.toLocaleString('en-NG')} from a referral purchase.</p>`
                                    })
                                }
                            }
                        } catch (err) {
                            console.error('Error processing referral:', err)
                        }
                    }

                    // 2. Email: Order Completed/Paid Email to Customer
                    if (doc.email) {
                        try {
                            await req.payload.sendEmail({
                                to: doc.email,
                                subject: 'Your Order has been Paid & Confirmed',
                                html: `<h1>Thank You!</h1><p>Your order #${doc.id} is confirmed and being processed.</p>`
                            })
                        } catch (e) {
                            console.error('Failed to send order paid email', e)
                        }
                    }
                }
            }
        ]
    },
    timestamps: true,
}
