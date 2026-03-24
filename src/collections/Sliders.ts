import type { CollectionConfig } from 'payload'

export const Sliders: CollectionConfig = {
    slug: 'sliders',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'subtitle', 'active'],
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
            name: 'subtitle',
            type: 'text',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'link',
            type: 'text',
            label: 'Link (URL)',
        },
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'order',
            type: 'number',
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
