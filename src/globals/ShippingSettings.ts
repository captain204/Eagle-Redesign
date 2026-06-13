import type { GlobalConfig } from 'payload'

export const ShippingSettings: GlobalConfig = {
    slug: 'shipping-settings',
    fields: [
        {
            name: 'defaultShippingPrice',
            type: 'number',
            defaultValue: 0,
            required: true,
            admin: {
                description: 'The default shipping price applied to all checkouts if no state is selected or no state override exists.',
            }
        },
        {
            name: 'stateShippingPrices',
            type: 'array',
            admin: {
                description: 'Set specific shipping prices for individual Nigerian states.',
            },
            fields: [
                {
                    name: 'state',
                    type: 'text', // A simple text field is fine, the frontend uses exact strings
                    required: true,
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                }
            ]
        },
        {
            name: 'zones',
            type: 'array',
            admin: {
                hidden: true,
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'regions',
                    type: 'array',
                    fields: [
                        { name: 'country', type: 'text', required: true },
                        { name: 'state', type: 'text' },
                    ],
                },
                {
                    name: 'methods',
                    type: 'array',
                    fields: [
                        {
                            name: 'type',
                            type: 'select',
                            options: [
                                { label: 'Flat Rate', value: 'flat_rate' },
                                { label: 'Free Shipping', value: 'free_shipping' },
                                { label: 'Local Pickup', value: 'local_pickup' },
                            ],
                            required: true,
                        },
                        { name: 'label', type: 'text', required: true },
                        { name: 'cost', type: 'number', defaultValue: 0 },
                        { name: 'minAmount', type: 'number', label: 'Minimum Amount for Free Shipping', admin: { condition: (_, data) => data.type === 'free_shipping' } },
                    ],
                },
            ],
        },
    ],
}
