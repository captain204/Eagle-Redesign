import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'General',
                    fields: [
                        { name: 'siteTitle', type: 'text', required: true },
                        { name: 'tagline', type: 'text' },
                        { name: 'logo', type: 'relationship', relationTo: 'media' },
                        { name: 'favicon', type: 'relationship', relationTo: 'media' },
                        { name: 'timezone', type: 'text', defaultValue: 'UTC' },
                        { name: 'language', type: 'text', defaultValue: 'en' },
                    ],
                },
                {
                    label: 'Contact',
                    fields: [
                        { name: 'contactEmail', type: 'text' },
                        {
                            name: 'socialLinks',
                            type: 'array',
                            fields: [
                                { name: 'platform', type: 'text' },
                                { name: 'url', type: 'text' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Reading/Writing',
                    fields: [
                        { name: 'homepage', type: 'relationship', relationTo: 'pages' },
                        { name: 'postsPage', type: 'relationship', relationTo: 'pages' },
                        { name: 'defaultCategory', type: 'relationship', relationTo: 'categories' },
                    ],
                },
                {
                    label: 'Media Settings',
                    fields: [
                        { name: 'uploadLimit', type: 'number', label: 'Upload Limit (MB)', defaultValue: 10 },
                        {
                            name: 'imageSizes',
                            type: 'array',
                            fields: [
                                { name: 'name', type: 'text' },
                                { name: 'width', type: 'number' },
                                { name: 'height', type: 'number' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}

