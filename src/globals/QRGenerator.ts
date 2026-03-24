import type { GlobalConfig } from 'payload'

export const QRGenerator: GlobalConfig = {
    slug: 'qr-generator',
    label: 'QR Generator',
    admin: {
        group: 'Marketing',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'generatorUI',
            type: 'ui',
            admin: {
                components: {
                    Field: '/components/admin/QRGeneratorComponent#QRGeneratorComponent',
                },
            },
        },
    ],
}
