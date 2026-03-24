import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
    slug: 'navigation',
    label: 'Navigation Locations',
    access: {
        read: () => true,
    },
    fields: [
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
                    relationTo: 'menus',
                    required: true,
                }
            ]
        }
    ],
}
