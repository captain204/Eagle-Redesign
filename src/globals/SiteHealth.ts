import type { GlobalConfig } from 'payload'

export const SiteHealth: GlobalConfig = {
    slug: 'site-health',
    admin: {
        group: 'Admin',
    },
    fields: [
        {
            name: 'status',
            type: 'select',
            defaultValue: 'healthy',
            options: [
                { label: 'Healthy', value: 'healthy' },
                { label: 'Warning', value: 'warning' },
                { label: 'Critical', value: 'critical' },
            ],
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'checks',
            type: 'array',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'status', type: 'text' },
                { name: 'message', type: 'textarea' },
            ],
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'lastChecked',
            type: 'date',
            admin: {
                readOnly: true,
            }
        }
    ],
}
