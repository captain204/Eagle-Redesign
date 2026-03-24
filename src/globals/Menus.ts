import type { GlobalConfig } from 'payload'

export const Menus: GlobalConfig = {
    slug: 'menus',
    fields: [
        {
            name: 'items',
            type: 'array',
            fields: [
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Page', value: 'page' },
                        { label: 'Post', value: 'post' },
                        { label: 'Category', value: 'category' },
                        { label: 'Custom link', value: 'custom' },
                    ],
                    defaultValue: 'page',
                },
                {
                    name: 'page',
                    type: 'relationship',
                    relationTo: 'pages',
                    admin: {
                        condition: (_, siblingData) => siblingData.type === 'page',
                    },
                },
                {
                    name: 'post',
                    type: 'relationship',
                    relationTo: 'posts',
                    admin: {
                        condition: (_, siblingData) => siblingData.type === 'post',
                    },
                },
                {
                    name: 'category',
                    type: 'relationship',
                    relationTo: 'categories',
                    admin: {
                        condition: (_, siblingData) => siblingData.type === 'category',
                    },
                },
                {
                    name: 'url',
                    type: 'text',
                    admin: {
                        condition: (_, siblingData) => siblingData.type === 'custom',
                    },
                },
                {
                    name: 'children',
                    type: 'array',
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'type',
                            type: 'select',
                            options: [
                                { label: 'Page', value: 'page' },
                                { label: 'Post', value: 'post' },
                                { label: 'Category', value: 'category' },
                                { label: 'Custom link', value: 'custom' },
                            ],
                            defaultValue: 'page',
                        },
                        {
                            name: 'page',
                            type: 'relationship',
                            relationTo: 'pages',
                            admin: {
                                condition: (_, siblingData) => siblingData.type === 'page',
                            },
                        },
                        {
                            name: 'post',
                            type: 'relationship',
                            relationTo: 'posts',
                            admin: {
                                condition: (_, siblingData) => siblingData.type === 'post',
                            },
                        },
                        {
                            name: 'category',
                            type: 'relationship',
                            relationTo: 'categories',
                            admin: {
                                condition: (_, siblingData) => siblingData.type === 'category',
                            },
                        },
                        {
                            name: 'url',
                            type: 'text',
                            admin: {
                                condition: (_, siblingData) => siblingData.type === 'custom',
                            },
                        },
                    ]
                }
            ],
        },
        {
            name: 'locations',
            type: 'array',
            fields: [
                {
                    name: 'location',
                    type: 'select',
                    options: [
                        { label: 'Header', value: 'header' },
                        { label: 'Footer', value: 'footer' },
                        { label: 'Sidebar', value: 'sidebar' },
                    ],
                    required: true,
                },
                {
                    name: 'menu',
                    type: 'relationship',
                    relationTo: 'menus', // This might need a different approach for multiple menus, but for now we can have one global with multiple locations
                }
            ]
        }
    ],
}
