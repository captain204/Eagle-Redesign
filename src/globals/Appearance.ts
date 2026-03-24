import type { GlobalConfig } from 'payload'

export const Appearance: GlobalConfig = {
    slug: 'appearance',
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Branding',
                    fields: [
                        { name: 'logo', type: 'relationship', relationTo: 'media' },
                        { name: 'favicon', type: 'relationship', relationTo: 'media' },
                        {
                            type: 'row',
                            fields: [
                                { name: 'primaryColor', type: 'text', defaultValue: '#000000', admin: { width: '50%' } },
                                { name: 'secondaryColor', type: 'text', defaultValue: '#ffffff', admin: { width: '50%' } },
                            ]
                        },
                        { name: 'fontFamily', type: 'text', defaultValue: 'Inter, sans-serif' },
                    ]
                },
                {
                    label: 'Layout',
                    fields: [
                        {
                            name: 'headerType',
                            type: 'select',
                            options: [
                                { label: 'Default', value: 'default' },
                                { label: 'Transparent', value: 'transparent' },
                                { label: 'Centered', value: 'centered' },
                            ],
                            defaultValue: 'default',
                        },
                        {
                            name: 'footerLayout',
                            type: 'select',
                            options: [
                                { label: 'Minimal', value: 'minimal' },
                                { label: 'Multi-column', value: 'multi_column' },
                            ],
                            defaultValue: 'multi_column',
                        },
                        {
                            name: 'blogLayout',
                            type: 'select',
                            options: [
                                { label: 'Grid', value: 'grid' },
                                { label: 'List', value: 'list' },
                            ],
                            defaultValue: 'grid',
                        }
                    ]
                },
                {
                    label: 'Widgets/Sidebars',
                    fields: [
                        {
                            name: 'sidebarEnabled',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                        {
                            name: 'footerWidgets',
                            type: 'array',
                            fields: [
                                { name: 'title', type: 'text' },
                                { name: 'content', type: 'richText' },
                            ]
                        }
                    ]
                }
            ]
        }
    ],
}
