import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'content',
        defaultColumns: ['user', 'post', 'status', 'createdAt'],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => {
            if (user?.role === 'admin' || user?.role === 'moderator') return true
            if (!user) return false;
            return {
                user: {
                    equals: user.id,
                },
            }
        },
        delete: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'moderator',
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            defaultValue: ({ user }) => user?.id,
        },
        {
            name: 'post',
            type: 'relationship',
            relationTo: 'posts',
            required: true,
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Spam', value: 'spam' },
                { label: 'Trash', value: 'trash' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'replies',
            type: 'relationship',
            relationTo: 'comments',
            hasMany: true,
        },
    ],
    timestamps: true,
}
