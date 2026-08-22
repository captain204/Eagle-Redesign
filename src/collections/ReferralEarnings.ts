import type { CollectionConfig } from 'payload'

export const ReferralEarnings: CollectionConfig = {
    slug: 'referralEarnings',
    admin: {
        useAsTitle: 'id',
        defaultColumns: ['referrer', 'amountEarned', 'expectedPayout', 'status', 'earnedAt'],
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'admin' || user?.role === 'super-admin') return true
            if (!user) return false;
            return {
                referrer: {
                    equals: user.id,
                },
            }
        },
        create: () => false, // Only created via hooks
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'super-admin',
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'referrer',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            index: true,
        },
        {
            name: 'order',
            type: 'relationship',
            relationTo: 'orders',
            required: true,
        },
        {
            name: 'amountEarned',
            type: 'number',
            required: true,
            min: 0,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            required: true,
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'earnedAt',
            type: 'date',
            required: true,
            index: true,
            defaultValue: () => new Date().toISOString(),
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'expectedPayout',
            type: 'ui',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/components/admin/ExpectedPayoutField#ExpectedPayoutField',
                    Cell: '@/components/admin/ExpectedPayoutCell#ExpectedPayoutCell',
                }
            }
        },
    ],
    timestamps: true,
}
