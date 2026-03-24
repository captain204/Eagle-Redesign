import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'author', 'category', 'status'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            unique: true,
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (value) return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                        return data?.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    },
                ],
            },
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
        },
        {
            name: 'featuredImage',
            type: 'relationship',
            relationTo: 'media',
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            defaultValue: ({ user }) => user?.id,
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
        },
        {
            name: 'publishedDate',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Private', value: 'private' },
                { label: 'Trash', value: 'trash' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
    versions: {
        drafts: true,
    },
}
