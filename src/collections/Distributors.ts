import type { CollectionConfig } from 'payload'
import { nigeriaData } from '../lib/nigeriaData'

const stateOptions = Object.keys(nigeriaData).map(state => ({ label: state, value: state }));
const allLgas = Object.values(nigeriaData).flat().sort();
const lgaOptions = Array.from(new Set(allLgas)).map(lga => ({ label: lga, value: lga }));

export const Distributors: CollectionConfig = {
    slug: 'distributors',
    admin: {
        useAsTitle: 'businessName',
        group: 'Ambassadors Portal',
        defaultColumns: ['businessName', 'state', 'category', 'status'],
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            return {
                status: {
                    equals: 'approved',
                },
            }
        },
        create: () => true, // Anyone can register/onboard
        update: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            return false // Distributors cannot self-edit after submission (or need specific logic)
        },
    },
    fields: [
        {
            name: 'businessName',
            type: 'text',
            required: true,
        },
        {
            name: 'contactPerson',
            type: 'text',
            required: true,
        },
        {
            name: 'phone',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
        },
        {
            name: 'state',
            type: 'select',
            required: true,
            options: stateOptions,
            admin: {
                description: 'Select the state in Nigeria',
            },
        },
        {
            name: 'lga',
            type: 'select',
            required: true,
            options: lgaOptions,
            admin: {
                description: 'Select the Local Government Area',
            },
        },
        {
            name: 'area',
            type: 'text',
            required: false,
            admin: {
                description: 'Specific area or ward in the LGA',
            },
        },
        {
            name: 'businessAddress',
            type: 'textarea',
            required: true,
        },
        {
            name: 'category',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
            ],
            access: {
                update: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin',
            },
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
