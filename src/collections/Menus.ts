import type { CollectionConfig } from 'payload'

export const Menus: CollectionConfig = {
    slug: 'menus',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },
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
    ],
}
