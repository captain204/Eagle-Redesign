import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
    slug: 'coupons',
    admin: {
        useAsTitle: 'code',
        defaultColumns: ['code', 'discountType', 'amount', 'expiresAt'],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'code',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'discountType',
            type: 'select',
            defaultValue: 'percentage',
            required: true,
            options: [
                { label: 'Percentage Discount', value: 'percentage' },
                { label: 'Fixed Cart Discount', value: 'fixed_cart' },
                { label: 'Fixed Product Discount', value: 'fixed_product' },
            ],
        },
        {
            name: 'amount',
            type: 'number',
            required: true,
            min: 0,
        },
        {
            name: 'expiresAt',
            type: 'date',
        },
        {
            name: 'usageLimit',
            type: 'number',
        },
        {
            name: 'usageCount',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
            }
        }
    ],
}
