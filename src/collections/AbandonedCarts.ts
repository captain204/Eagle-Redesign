import type { CollectionConfig } from 'payload'

export const AbandonedCarts: CollectionConfig = {
    slug: 'abandoned-carts',
    admin: {
        useAsTitle: 'user',
        defaultColumns: ['user', 'totalValue', 'updatedAt'],
    },
    access: {
        read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        create: () => true,
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'items',
            type: 'array',
            fields: [
                { name: 'product', type: 'relationship', relationTo: 'products', required: true },
                { name: 'quantity', type: 'number', required: true, min: 1 },
            ],
        },
        {
            name: 'totalValue',
            type: 'number',
        },
        {
            name: 'lastActivity',
            type: 'date',
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'reminderSent',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            }
        }
    ],
    timestamps: true,
}
