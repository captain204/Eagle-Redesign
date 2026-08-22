import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    access: {
        create: () => true, // Anyone can register
        read: ({ req: { user } }) => !!user, // Only logged in users can see other users (or themselves)
    },
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'role',
            type: 'select',
            options: [
                { label: 'Super Admin', value: 'super-admin' },
                { label: 'Administrator', value: 'admin' },
                { label: 'Sales Admin', value: 'sales-admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Author', value: 'author' },
                { label: 'Contributor', value: 'contributor' },
                { label: 'Moderator', value: 'moderator' },
                { label: 'Viewer', value: 'viewer' },
            ],
        },
        {
            name: 'avatar',
            type: 'relationship',
            relationTo: 'media',
        },
        {
            name: 'deactivated',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'referralCode',
            type: 'text',
            unique: true,
            index: true,
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
            hooks: {
                beforeValidate: [
                    ({ value }) => {
                        if (value) return value;
                        // Generate a 6-character alphanumeric code
                        return Math.random().toString(36).substring(2, 8).toUpperCase();
                    }
                ]
            }
        },
        {
            name: 'referredBy',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'payoutDetails',
            type: 'group',
            fields: [
                {
                    name: 'phone',
                    type: 'text',
                    label: 'Phone Number',
                },
                {
                    name: 'bankName',
                    type: 'text',
                    label: 'Bank Name',
                },
                {
                    name: 'accountName',
                    type: 'text',
                    label: 'Account Name',
                },
                {
                    name: 'accountNumber',
                    type: 'text',
                    label: 'Account Number',
                },
            ],
            admin: {
                description: 'Used for manual referral payouts.',
            }
        },
    ],
}

