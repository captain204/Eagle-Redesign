import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import jsQR from 'jsqr'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const decodeQRCodeHook: CollectionBeforeChangeHook = async ({
    data,
    req,
    operation,
}) => {
    if (data.oldQRCodeImage) {
        try {
            const media = await req.payload.findByID({
                collection: 'media',
                id: data.oldQRCodeImage,
            });

            if (media && media.url) {
                // Determine absolute path to the file
                // Usually public/media/filename
                const filePath = path.join(process.cwd(), 'public', media.url);

                if (fs.existsSync(filePath)) {
                    const image = sharp(filePath);
                    const { data: pixelData, info } = await image
                        .ensureAlpha()
                        .raw()
                        .toBuffer({ resolveWithObject: true });

                    const code = jsQR(
                        new Uint8ClampedArray(pixelData),
                        info.width,
                        info.height
                    );

                    if (code && code.data) {
                        data.description = `Auto-decoded URL: ${code.data}\n${data.description || ''}`;
                        if (!data.targetUrl) {
                            data.targetUrl = code.data;
                        }
                        // Optionally set a default slug if not provided
                        if (!data.slug) {
                            const url = new URL(code.data);
                            data.slug = url.pathname.split('/').pop() || 'redirect';
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error decoding QR code:', error);
        }
    }
    return data;
}

export const QRCodes: CollectionConfig = {
    slug: 'qr-codes',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'redirectUrl'],
        group: 'Marketing',
    },
    hooks: {
        beforeChange: [decodeQRCodeHook],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'Redirect Slug (e.g., /q/legacy-scan)',
        },
        {
            name: 'targetUrl',
            type: 'text',
            required: true,
            defaultValue: 'https://www.1steagle.com.ng',
            label: 'Target Redirect URL',
        },
        {
            name: 'oldQRCodeImage',
            type: 'upload',
            relationTo: 'media',
            label: 'Old QR Code Image (For reference)',
        },
        {
            name: 'redirectType',
            type: 'select',
            defaultValue: '307',
            options: [
                { label: '301 (Permanent)', value: '301' },
                { label: '302 (Found)', value: '302' },
                { label: '307 (Temporary)', value: '307' },
            ],
            admin: { position: 'sidebar' },
        },
        {
            name: 'qrCodePreview',
            type: 'ui',
            label: 'Current Redirect QR',
            admin: {
                components: {
                    Field: '/components/admin/QRCodeRedirectPreview#QRCodeRedirectPreview',
                },
            },
        },
        {
            name: 'description',
            type: 'textarea',
        },
    ],
}
