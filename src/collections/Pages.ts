import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Page Content',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'layout',
                            type: 'blocks',
                            blocks: [
                                {
                                    slug: 'hero',
                                    fields: [
                                        { name: 'heading', type: 'text', required: true },
                                        { name: 'subheading', type: 'text' },
                                        { name: 'backgroundImage', type: 'relationship', relationTo: 'media' },
                                    ],
                                },
                                {
                                    slug: 'content',
                                    fields: [
                                        { name: 'text', type: 'richText', required: true },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'SEO',
                    fields: [
                        { name: 'metaTitle', type: 'text' },
                        { name: 'metaDescription', type: 'textarea' },
                        { name: 'keywords', type: 'text' },
                    ],
                },
            ],
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'featuredImage',
            type: 'relationship',
            relationTo: 'media',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'pages',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'template',
            type: 'select',
            options: [
                { label: 'Default', value: 'default' },
                { label: 'Full Width', value: 'fullWidth' },
                { label: 'Sidebar', value: 'sidebar' },
            ],
            defaultValue: 'default',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'pageOrder',
            type: 'number',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
            },
        },
    ],
    versions: {
        drafts: true,
    },
}

