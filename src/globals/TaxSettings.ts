import type { GlobalConfig } from 'payload'

export const TaxSettings: GlobalConfig = {
    slug: 'tax-settings',
    fields: [
        {
            name: 'taxEnabled',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'taxInclusive',
            type: 'checkbox',
            label: 'Prices include tax',
            defaultValue: false,
        },
        {
            name: 'taxRules',
            type: 'array',
            fields: [
                { name: 'country', type: 'text', required: true },
                { name: 'state', type: 'text' },
                { name: 'rate', type: 'number', required: true, label: 'Tax Rate (%)' },
                { name: 'label', type: 'text', defaultValue: 'Tax' },
            ],
            admin: {
                condition: (data) => data.taxEnabled,
            }
        },
    ],
}
