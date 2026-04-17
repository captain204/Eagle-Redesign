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
        }
    ],
    timestamps: true,
}
