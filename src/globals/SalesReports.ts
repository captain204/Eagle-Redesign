import type { GlobalConfig } from 'payload'

export const SalesReports: GlobalConfig = {
    slug: 'sales-reports',
    fields: [
        {
            name: 'reports',
            type: 'array',
            fields: [
                { name: 'name', type: 'text', required: true },
                {
                    name: 'type',
                    type: 'select',
                    options: [
                        { label: 'Revenue', value: 'revenue' },
                        { label: 'Orders', value: 'orders' },
                        { label: 'Customers', value: 'customers' },
                        { label: 'Product Performance', value: 'products' },
                    ],
                    required: true,
                },
                {
                    name: 'dateRange', type: 'group', fields: [
                        { name: 'from', type: 'date' },
                        { name: 'to', type: 'date' },
                    ]
                },
                { name: 'data', type: 'json' },
            ],
        },
    ],
}
