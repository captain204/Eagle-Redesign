import type { GlobalConfig } from 'payload'

export const ShippingSettings: GlobalConfig = {
    slug: 'shipping-settings',
    fields: [
        {
            name: 'zones',
            type: 'array',
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
