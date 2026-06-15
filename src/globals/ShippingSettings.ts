import type { GlobalConfig } from 'payload'

export const ShippingSettings: GlobalConfig = {
    slug: 'shipping-settings',
    label: 'Shipping',
    admin: {
        group: 'Settings',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'defaultShippingPrice',
            type: 'number',
            defaultValue: 0,
            required: true,
            label: 'Default Shipping Price',
            admin: {
                description: 'The default shipping price applied to all checkouts if no state is selected or no state override exists.',
            }
        },
        {
            name: 'localPickupEnabled',
            type: 'checkbox',
            label: 'Enable Local Pickup',
            defaultValue: true,
            admin: {
                description: 'Allow customers to pick up their orders locally for free.',
            }
        },
        {
            name: 'stateShippingPrices',
            type: 'array',
            label: 'State Shipping Prices (Overrides)',
            admin: {
                description: 'Set specific shipping prices for individual Nigerian states.',
            },
            fields: [
                {
                    name: 'state',
                    type: 'text',
                    label: 'State Name',
                    required: true,
                },
                {
                    name: 'price',
                    type: 'number',
                    label: 'Shipping Price',
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
                },
                {
                    name: 'regions',
                    type: 'array',
                    fields: [
                        { name: 'country', type: 'text' },
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
                        },
                        { name: 'label', type: 'text' },
                        { name: 'cost', type: 'number', defaultValue: 0 },
                        { name: 'minAmount', type: 'number' },
                    ],
                },
            ],
        }
    ],
}
