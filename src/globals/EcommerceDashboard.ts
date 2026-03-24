import type { GlobalConfig } from 'payload'

export const EcommerceDashboard: GlobalConfig = {
    slug: 'ecommerce-dashboard',
    fields: [
        {
            name: 'stats',
            type: 'group',
            fields: [
                {
                    type: 'row',
                    fields: [
                        { name: 'dailySales', type: 'number', admin: { readOnly: true, width: '33%' } },
                        { name: 'weeklySales', type: 'number', admin: { readOnly: true, width: '33%' } },
                        { name: 'monthlyRevenue', type: 'number', admin: { readOnly: true, width: '33%' } },
                    ]
                },
                {
                    type: 'row',
                    fields: [
                        { name: 'ordersToday', type: 'number', admin: { readOnly: true, width: '50%' } },
                        { name: 'pendingOrders', type: 'number', admin: { readOnly: true, width: '50%' } },
                    ]
                }
            ]
        },
        {
            name: 'topSellingProducts',
            type: 'array',
            fields: [
                { name: 'product', type: 'relationship', relationTo: 'products' },
                { name: 'salesCount', type: 'number' },
                { name: 'revenue', type: 'number' },
            ],
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'recentOrders',
            type: 'relationship',
            relationTo: 'orders',
            hasMany: true,
            admin: {
                readOnly: true,
            }
        }
    ],
}
