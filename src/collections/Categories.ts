import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'title',
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
            required: true,
            unique: true,
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'image',
            type: 'relationship',
            relationTo: 'media',
        },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'categories',
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
