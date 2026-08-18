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
            type: 'tabs',
            tabs: [
                {
                    label: 'Content',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
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
                    ]
                },
                {
                    label: 'SEO & Metadata',
                    fields: [
                        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
                        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
                        { name: 'focusKeyword', type: 'text', label: 'Focus Keyword' },
                        { name: 'openGraphImage', type: 'relationship', relationTo: 'media', label: 'Open Graph Image (Social Sharing)' },
                    ]
                }
            ]
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
            name: 'estimatedReadingTime',
            type: 'number',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Estimated reading time in minutes (auto-calculated).'
            },
            hooks: {
                beforeChange: [
                    ({ data }) => {
                        if (data && data.content) {
                            const text = JSON.stringify(data.content);
                            // Simple word count approximation
                            const wordCount = text.split(' ').length;
                            return Math.max(1, Math.ceil(wordCount / 200));
                        }
                        return 1;
                    }
                ]
            }
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            defaultValue: ({ user }) => user?.id,
            admin: { position: 'sidebar' }
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: { position: 'sidebar' }
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            admin: { position: 'sidebar' }
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
