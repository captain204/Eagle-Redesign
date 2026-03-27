import type { GlobalConfig } from 'payload'

export const Support: GlobalConfig = {
    slug: 'support-info',
    admin: {
        group: 'Settings',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'phoneNumbers',
            type: 'array',
            label: 'Phone Numbers',
            minRows: 1,
            maxRows: 3,
            fields: [
                {
                    name: 'number',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'email',
            type: 'email',
            required: true,
            defaultValue: 'care@1st𝓔agle.com',
        },
        {
            name: 'address',
            type: 'textarea',
            label: 'Physical Address',
        },
        {
            name: 'workingHours',
            type: 'text',
            label: 'Working Hours',
            defaultValue: 'Mon - Fri: 9am - 6pm',
        },
        {
            name: 'supportDescription',
            type: 'richText',
            label: 'Support Page Description',
        },
    ],
}
