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
    hooks: {
        beforeChange: [
            ({ data }) => {
                const newZones: any[] = [];
                
                if (data.defaultShippingPrice !== undefined) {
                    newZones.push({
                        name: 'Default Shipping',
                        regions: [],
                        methods: [{ type: 'flat_rate', cost: data.defaultShippingPrice }]
                    });
                }
            
                if (data.localPickupEnabled) {
                    newZones.push({
                        name: 'Local Pickup',
                        regions: [],
                        methods: [{ type: 'local_pickup', cost: 0 }]
                    });
                }
            
                if (data.stateShippingPrices && Array.isArray(data.stateShippingPrices)) {
                    data.stateShippingPrices.forEach((sp: any) => {
                        newZones.push({
                            name: `State Override: ${sp.state}`,
                            regions: [{ state: sp.state, country: 'Nigeria' }],
                            methods: [{ type: 'flat_rate', cost: sp.price }]
                        });
                    });
                }
                
                data.zones = newZones;
                return data;
            }
        ],
        afterRead: [
            ({ doc }) => {
                let defaultShippingPrice = 0;
                let localPickupEnabled = false;
                const stateShippingPrices: any[] = [];

                if (doc.zones && Array.isArray(doc.zones)) {
                    doc.zones.forEach(zone => {
                        if (zone.name === 'Default Shipping') {
                            defaultShippingPrice = zone.methods?.[0]?.cost || 0;
                        } else if (zone.name === 'Local Pickup') {
                            localPickupEnabled = true;
                        } else if (zone.name?.startsWith('State Override: ')) {
                            stateShippingPrices.push({
                                state: zone.regions?.[0]?.state || '',
                                price: zone.methods?.[0]?.cost || 0
                            });
                        }
                    });
                }

                doc.defaultShippingPrice = defaultShippingPrice;
                doc.localPickupEnabled = localPickupEnabled;
                doc.stateShippingPrices = stateShippingPrices;

                return doc;
            }
        ]
    },
    fields: [
        {
            name: "defaultShippingPrice", virtual: true,
            type: 'number',
            defaultValue: 0,
            required: true,
            label: 'Default Shipping Price',
            admin: {
                description: 'The default shipping price applied to all checkouts if no state is selected or no state override exists.',
            }
        },
        {
            name: "localPickupEnabled", virtual: true,
            type: 'checkbox',
            label: 'Enable Local Pickup',
            defaultValue: true,
            admin: {
                description: 'Allow customers to pick up their orders locally for free.',
            }
        },
        {
            name: "stateShippingPrices", virtual: true,
            type: 'array',
            label: 'State Shipping Prices (Overrides)',
            admin: {
                description: 'Set specific shipping prices for individual Nigerian states.',
            },
            fields: [
                {
                    name: 'state',
                    type: 'select',
                    label: 'State Name',
                    required: true,
                    options: [
                        { label: 'Abia', value: 'Abia' },
                        { label: 'Adamawa', value: 'Adamawa' },
                        { label: 'Akwa Ibom', value: 'Akwa Ibom' },
                        { label: 'Anambra', value: 'Anambra' },
                        { label: 'Bauchi', value: 'Bauchi' },
                        { label: 'Bayelsa', value: 'Bayelsa' },
                        { label: 'Benue', value: 'Benue' },
                        { label: 'Borno', value: 'Borno' },
                        { label: 'Cross River', value: 'Cross River' },
                        { label: 'Delta', value: 'Delta' },
                        { label: 'Ebonyi', value: 'Ebonyi' },
                        { label: 'Edo', value: 'Edo' },
                        { label: 'Ekiti', value: 'Ekiti' },
                        { label: 'Enugu', value: 'Enugu' },
                        { label: 'FCT - Abuja', value: 'FCT - Abuja' },
                        { label: 'Gombe', value: 'Gombe' },
                        { label: 'Imo', value: 'Imo' },
                        { label: 'Jigawa', value: 'Jigawa' },
                        { label: 'Kaduna', value: 'Kaduna' },
                        { label: 'Kano', value: 'Kano' },
                        { label: 'Katsina', value: 'Katsina' },
                        { label: 'Kebbi', value: 'Kebbi' },
                        { label: 'Kogi', value: 'Kogi' },
                        { label: 'Kwara', value: 'Kwara' },
                        { label: 'Lagos', value: 'Lagos' },
                        { label: 'Nasarawa', value: 'Nasarawa' },
                        { label: 'Niger', value: 'Niger' },
                        { label: 'Ogun', value: 'Ogun' },
                        { label: 'Ondo', value: 'Ondo' },
                        { label: 'Osun', value: 'Osun' },
                        { label: 'Oyo', value: 'Oyo' },
                        { label: 'Plateau', value: 'Plateau' },
                        { label: 'Rivers', value: 'Rivers' },
                        { label: 'Sokoto', value: 'Sokoto' },
                        { label: 'Taraba', value: 'Taraba' },
                        { label: 'Yobe', value: 'Yobe' },
                        { label: 'Zamfara', value: 'Zamfara' },
                    ]
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
