import type { GlobalConfig } from 'payload'

export const Notifications: GlobalConfig = {
    slug: 'notifications',
    fields: [
        {
            name: 'alerts',
            type: 'array',
            fields: [
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Info', value: 'info' },
                        { label: 'Success', value: 'success' },
                        { label: 'Warning', value: 'warning' },
                        { label: 'Error', value: 'error' },
                    ],
                    required: true,
                },
                { name: 'message', type: 'text', required: true },
                { name: 'link', type: 'text' },
                { name: 'read', type: 'checkbox', defaultValue: false },
            ],
        },
    ],
}
