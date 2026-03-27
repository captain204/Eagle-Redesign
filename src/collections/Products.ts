import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'price', 'productType', 'status'],
        components: {
            beforeListTable: ['/components/admin/ImportProductsInline#ImportProductsInline'],
        },
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Product Info',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'slug',
                            type: 'text',
                            required: true,
                            unique: true,
                        },
                        {
                            name: 'shortDescription',
                            type: 'textarea',
                            label: 'Short Description',
                        },
                        {
                            name: 'description',
                            type: 'richText',
                            label: 'Main Description',
                        },
                    ],
                },
                {
                    label: 'Product Data',
                    fields: [
                        {
                            name: 'productType',
                            type: 'select',
                            defaultValue: 'simple',
                            options: [
                                { label: 'Simple Product', value: 'simple' },
                                { label: 'Variable Product', value: 'variable' },
                                { label: 'Grouped Product', value: 'grouped' },
                                { label: 'Digital Product', value: 'digital' },
                                { label: 'External/Affiliate Product', value: 'external' },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'price',
                                    type: 'number',
                                    required: true,
                                    min: 0,
                                    admin: {
                                        width: '50%',
                                        condition: (data) => data.productType !== 'variable',
                                    },
                                },
                                {
                                    name: 'salePrice',
                                    type: 'number',
                                    min: 0,
                                    admin: {
                                        width: '50%',
                                        condition: (data) => data.productType !== 'variable',
                                    },
                                },
                            ],
                        },
                        {
                            name: 'variations',
                            type: 'array',
                            label: 'Product Variations',
                            admin: {
                                condition: (data) => data.productType === 'variable',
                            },
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                                        { name: 'sku', type: 'text', admin: { width: '50%' } },
                                    ],
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        { name: 'price', type: 'number', required: true, admin: { width: '50%' } },
                                        { name: 'salePrice', type: 'number', admin: { width: '50%' } },
                                    ],
                                },
                                {
                                    name: 'stockQuantity',
                                    type: 'number',
                                },
                                {
                                    name: 'image',
                                    type: 'relationship',
                                    relationTo: 'media',
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'isDailyDeal',
                                    type: 'checkbox',
                                    label: 'Is Daily Deal',
                                    defaultValue: false,
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'isHotNew',
                                    type: 'checkbox',
                                    label: 'Is Hot New',
                                    defaultValue: false,
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            name: 'externalUrl',
                            type: 'text',
                            label: 'External URL',
                            admin: {
                                condition: (data) => data.productType === 'external',
                            },
                        },
                    ],
                },

                {
                    label: 'Inventory',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'sku',
                                    type: 'text',
                                    label: 'SKU',
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'stockStatus',
                                    type: 'select',
                                    defaultValue: 'instock',
                                    options: [
                                        { label: 'In Stock', value: 'instock' },
                                        { label: 'Out of Stock', value: 'outofstock' },
                                        { label: 'On Backorder', value: 'onbackorder' },
                                    ],
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            name: 'manageStock',
                            type: 'checkbox',
                            defaultValue: false,
                        },
                        {
                            name: 'stockQuantity',
                            type: 'number',
                            admin: {
                                condition: (data) => data.manageStock,
                            },
                        },
                    ],
                },
                {
                    label: 'Shipping',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                { name: 'weight', type: 'number', admin: { width: '25%' } },
                                { name: 'length', type: 'number', admin: { width: '25%' } },
                                { name: 'width', type: 'number', admin: { width: '25%' } },
                                { name: 'height', type: 'number', admin: { width: '25%' } },
                            ],
                        },
                    ],
                },
                {
                    label: 'SEO',
                    fields: [
                        { name: 'metaTitle', type: 'text' },
                        { name: 'metaDescription', type: 'textarea' },
                        { name: 'keywords', type: 'text' },
                    ],
                },
                {
                    label: 'QR Code',
                    fields: [
                        {
                            name: 'qrCodeUI',
                            type: 'ui',
                            admin: {
                                components: {
                                    Field: '/components/admin/ProductQRCode#ProductQRCode',
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            name: 'mainImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Main Product Image',
            admin: { position: 'sidebar' },
        },
        {
            name: 'gallery',
            type: 'array',
            label: 'Product Gallery Images',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: { position: 'sidebar' },
        },
        {
            name: 'productTags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
            label: 'Tags',
            admin: { position: 'sidebar' },
        },
        {
            name: 'visibility',
            type: 'select',
            defaultValue: 'visible',
            options: [
                { label: 'Visible', value: 'visible' },
                { label: 'Hidden', value: 'hidden' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            admin: { position: 'sidebar' },
        },
    ],
}
