import type { CollectionConfig } from 'payload'

export const ProductReviews: CollectionConfig = {
    slug: 'product-reviews',
    admin: {
        useAsTitle: 'summary',
        defaultColumns: ['product', 'user', 'rating', 'status'],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'moderator',
        delete: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'moderator',
    },
    fields: [
        {
            name: 'product',
            type: 'relationship',
            relationTo: 'products',
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            defaultValue: ({ user }) => user?.id,
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
        },
        {
            name: 'summary',
            type: 'text',
            required: true,
        },
        {
            name: 'review',
            type: 'textarea',
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Spam', value: 'spam' },
            ],
            admin: {
                position: 'sidebar',
            }
        }
    ],
    timestamps: true,
}
