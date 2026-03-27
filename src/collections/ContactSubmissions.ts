import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
    slug: 'contact-submissions',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email', 'subject', 'createdAt'],
        group: 'Admin',
    },
    access: {
        read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        create: () => true, // Anyone can submit a contact form
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'company',
            type: 'text',
        },
        {
            name: 'subject',
            type: 'text',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'source',
            type: 'select',
            options: [
                { label: 'General Contact', value: 'general' },
                { label: 'Corporate Procurement', value: 'corporate' },
                { label: 'Support', value: 'support' },
            ],
            defaultValue: 'general',
        },
    ],
    timestamps: true,
}
