import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
    slug: 'audit-logs',
    admin: {
        useAsTitle: 'action',
        defaultColumns: ['user', 'action', 'collectionName', 'createdAt'],
    },
    access: {
        read: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
        create: () => true, // System will create logs
        update: () => false,
        delete: ({ req: { user } }) => user?.role === 'super-admin',
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'action',
            type: 'select',
            required: true,
            options: [
                { label: 'Create', value: 'create' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Login', value: 'login' },
                { label: 'Logout', value: 'logout' },
            ],
        },
        {
            name: 'collectionName',
            type: 'text',
        },
        {
            name: 'recordId',
            type: 'text',
        },
        {
            name: 'details',
            type: 'json',
        },
        {
            name: 'ipAddress',
            type: 'text',
        }
    ],
    timestamps: true,
}
