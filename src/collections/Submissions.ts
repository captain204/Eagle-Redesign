import type { CollectionConfig } from 'payload'
import { generateSubmissionPDF } from '../lib/pdfGenerator'
import { sendEmail } from '../lib/emailService'

export const Submissions: CollectionConfig = {
    slug: 'submissions',
    admin: {
        useAsTitle: 'id',
        group: 'Ambassadors Portal',
        defaultColumns: ['ambassador', 'distributor', 'status', 'createdAt'],
    },
    hooks: {
        beforeChange: [
            async ({ data, req: { payload, user }, operation }) => {
                if (operation === 'create' && !data.ambassador && user) {
                    const ambassador = await payload.find({
                        collection: 'ambassadors',
                        where: {
                            user: { equals: user.id },
                        },
                    })
                    if (ambassador.docs.length > 0) {
                        data.ambassador = ambassador.docs[0].id
                    }
                }
                return data
            },
        ],
        afterChange: [
            async ({ doc, req: { payload }, operation }) => {
                if (operation === 'create' && !doc.pdfSummary) {
                    try {
                        // 1. Fetch related data for PDF
                        const ambassador = await payload.findByID({
                            collection: 'ambassadors',
                            id: typeof doc.ambassador === 'object' ? doc.ambassador.id : doc.ambassador,
                        })

                        const distributor = doc.distributor ? await payload.findByID({
                            collection: 'distributors',
                            id: typeof doc.distributor === 'object' ? doc.distributor.id : doc.distributor,
                        }) : null

                        const itemsWithProducts = await Promise.all(doc.items.map(async (item: any) => {
                            const product = await payload.findByID({
                                collection: 'products',
                                id: typeof item.product === 'object' ? item.product.id : item.product,
                            })
                            return { ...item, product }
                        }))

                        // 2. Generate PDF
                        const pdfBuffer = await generateSubmissionPDF(
                            { ...doc, items: itemsWithProducts },
                            ambassador,
                            distributor
                        )

                        // 3. Upload PDF to Media
                        const mediaDoc = await payload.create({
                            collection: 'media',
                            data: {
                                alt: `Submission Summary - ${doc.id}`,
                            },
                            file: {
                                data: pdfBuffer,
                                name: `submission-${doc.id}.pdf`,
                                mimetype: 'application/pdf',
                                size: pdfBuffer.length,
                            },
                        })

                        // 4. Update Submission with PDF reference
                        await payload.update({
                            collection: 'submissions',
                            id: doc.id,
                            data: {
                                pdfSummary: mediaDoc.id,
                            },
                        })

                        // 5. Send Email to Ambassador
                        await sendEmail(
                            ambassador.email,
                            `Submission Received - Ref: #${doc.id.slice(-8).toUpperCase()}`,
                            `
                            <h1>Hello ${ambassador.name},</h1>
                            <p>Your product availability request has been received.</p>
                            <p><strong>Distributor:</strong> ${distributor?.businessName || 'Not Found'}</p>
                            <p><strong>Status:</strong> ${doc.status}</p>
                            <p>You can view your submission summary here: <a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}${mediaDoc.url}">Download PDF</a></p>
                            <p>Thank you for being a 1stEagle Ambassador!</p>
                            `
                        )

                        // 6. Send Email to Admins (Sales Admin and Super Admin)
                        const admins = await payload.find({
                            collection: 'users',
                            where: {
                                or: [
                                    { role: { equals: 'super-admin' } },
                                    { role: { equals: 'sales-admin' } },
                                    { role: { equals: 'admin' } }
                                ]
                            }
                        })

                        if (admins.docs.length > 0) {
                            const adminEmails = admins.docs.map(admin => admin.email)
                            await Promise.all(adminEmails.map(email =>
                                sendEmail(
                                    email,
                                    `New Submission Received - Ref: #${doc.id.slice(-8).toUpperCase()}`,
                                    `
                                    <h1>New Submission Notification</h1>
                                    <p>A new product availability request has been submitted by <strong>${ambassador.name}</strong>.</p>
                                    <p><strong>Distributor:</strong> ${distributor?.businessName || 'Not Found'}</p>
                                    <p><strong>Status:</strong> ${doc.status}</p>
                                    <p>View the summary PDF here: <a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}${mediaDoc.url}">Download PDF</a></p>
                                    <p>Link to Admin Panel: <a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/submissions/${doc.id}">View Submission</a></p>
                                    `
                                )
                            ))
                        }
                    } catch (error) {
                        console.error('Error in Submissions afterChange hook:', error);
                    }
                }
            },
        ],
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            if (!user) return false;
            return {
                // Ambassadors can see their own submissions
                'ambassador.user': {
                    equals: user.id,
                },
            }
        },
        create: () => true,
        update: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            return false // Pending review logic
        },
    },
    fields: [
        {
            name: 'ambassador',
            type: 'relationship',
            relationTo: 'ambassadors',
            required: true,
            index: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'distributor',
            type: 'relationship',
            relationTo: 'distributors',
            required: false, // Changed to false to allow "Not Available" distributor
            filterOptions: {
                status: {
                    equals: 'approved',
                },
            },
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'submitted',
            options: [
                { label: 'Submitted', value: 'submitted' },
                { label: 'Reviewed', value: 'reviewed' },
                { label: 'Completed', value: 'completed' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'items',
            type: 'array',
            required: true,
            fields: [
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'product',
                            type: 'relationship',
                            relationTo: 'products',
                            required: true,
                            admin: { width: '50%' },
                        },
                        {
                            name: 'quantity',
                            type: 'number',
                            required: true,
                            min: 1,
                            admin: { width: '50%' },
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'expectedPrice',
                            type: 'number',
                            admin: { width: '50%' },
                        },
                        {
                            name: 'note',
                            type: 'text',
                            admin: { width: '50%' },
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'availabilityStatus',
                            type: 'select',
                            defaultValue: 'pending',
                            options: [
                                { label: 'Pending', value: 'pending' },
                                { label: 'Available', value: 'available' },
                                { label: 'Not Available', value: 'not-available' },
                            ],
                            admin: {
                                width: '50%',
                            },
                        },
                        {
                            name: 'paymentStatus',
                            type: 'select',
                            defaultValue: 'unpaid',
                            options: [
                                { label: 'Unpaid', value: 'unpaid' },
                                { label: 'Paid', value: 'paid' },
                                { label: 'Partial', value: 'partial' },
                            ],
                            admin: {
                                width: '50%',
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: 'adminNotes',
            type: 'textarea',
            access: {
                read: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin',
                update: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin',
            },
        },
        {
            name: 'pdfSummary',
            type: 'relationship',
            relationTo: 'media',
            admin: {
                readOnly: true,
                position: 'sidebar',
            },
        },
    ],
    timestamps: true,
}
