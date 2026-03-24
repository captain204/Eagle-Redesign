import type { CollectionConfig } from 'payload'
import { nigeriaData } from '../lib/nigeriaData'

const stateOptions = Object.keys(nigeriaData).map(state => ({ label: state, value: state }));
const allLgas = Object.values(nigeriaData).flat().sort();
const lgaOptions = Array.from(new Set(allLgas)).map(lga => ({ label: lga, value: lga }));

export const Ambassadors: CollectionConfig = {
    slug: 'ambassadors',
    admin: {
        useAsTitle: 'name',
        group: 'Ambassadors Portal',
    },
    access: {
        read: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            if (!user) return false;
            return {
                id: {
                    equals: user.id,
                },
            }
        },
        create: () => true, // Anyone can register
        update: ({ req: { user } }) => {
            if (user?.role === 'super-admin' || user?.role === 'admin' || user?.role === 'sales-admin') return true
            if (!user) return false;
            return {
                id: {
                    equals: user.id,
                },
            }
        },
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'name',
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
            name: 'phone',
            type: 'text',
            required: true,
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
            name: 'address',
            type: 'textarea',
        },
        {
            name: 'profilePhoto',
            type: 'relationship',
            relationTo: 'media',
        },
    ],
}
