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
    ],
}

