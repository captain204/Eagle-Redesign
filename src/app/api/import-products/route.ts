import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Simple helper to convert string to slug
const toSlug = (str: string) => str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

// Helper to convert HTML to simple Lexical structure
const htmlToLexical = (html: string) => {
    return {
        root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
                {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                        {
                            mode: 'normal',
                            text: html.replace(/<[^>]*>?/gm, ''), // Basic strip tags
                            type: 'text',
                            style: '',
                            detail: 0,
                            version: 1,
                        },
                    ],
                },
            ],
        },
    }
}

async function downloadAndCreateMedia(payload: any, url: string, alt: string) {
    if (!url || !url.startsWith('http')) return null;

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)

        const blob = await response.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        const filename = url.split('/').pop() || 'imported-image.jpg'

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: alt || filename,
            },
            file: {
                data: buffer,
                name: filename,
                mimetype: blob.type || 'image/jpeg',
                size: buffer.length,
            },
        })
        return media.id
    } catch (err) {
        console.error(`Media import error for ${url}:`, err)
        return null
    }
}

export async function POST(req: Request) {
    try {
        const payload = await getPayload({ config: configPromise })
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        const results = {
            success: 0,
            errors: 0,
            details: [] as string[],
        }

        for (const row of data as any[]) {
            try {
                // Map WooCommerce standard headers or fallback to previous ones
                const title = row.Name || row.Title || row.title || row.post_title || 'Untitled Product'

                // Duplicate check
                const existingProduct = await payload.find({
                    collection: 'products',
                    where: {
                        title: { equals: title }
                    }
                });

                if (existingProduct.totalDocs > 0) {
                    results.details.push(`Skipped duplicate: ${title}`);
                    continue;
                }

                const rawPrice = row['Regular price'] || row.price || row.Price || row.regular_price || 0
                const rawSalePrice = row['Sale price'] || row.salePrice || row.sale_price || 0
                const sku = String(row.SKU || row.sku || '')
                const descriptionHtml = row.Description || row.description || row.post_content || ''
                const shortDescription = row['Short description'] || row.shortDescription || row.short_description || row.post_excerpt || ''
                const slug = row.Slug || row.slug || toSlug(title)
                const imageList = row.Images || row.images || row.image || ''
                const imageUrls = typeof imageList === 'string' ? imageList.split(',').map(u => u.trim()) : []

                // Process Images
                let mainImageId = null
                const galleryIds: string[] = []

                if (imageUrls.length > 0) {
                    mainImageId = await downloadAndCreateMedia(payload, imageUrls[0], title)
                    if (imageUrls.length > 1) {
                        for (let i = 1; i < imageUrls.length; i++) {
                            const id = await downloadAndCreateMedia(payload, imageUrls[i], `${title} gallery ${i}`)
                            if (id) galleryIds.push(id)
                        }
                    }
                }

                // Fallback to placeholder if mainImage is still null and required in schema
                if (!mainImageId) {
                    const defaultMedia = await payload.find({ collection: 'media', limit: 1 });
                    mainImageId = defaultMedia.docs[0]?.id || null;
                }

                if (!mainImageId) {
                    throw new Error('Please upload at least one image in the Media library first to use as a placeholder.');
                }

                await payload.create({
                    collection: 'products',
                    data: {
                        title,
                        slug,
                        price: Number(rawPrice),
                        salePrice: rawSalePrice ? Number(rawSalePrice) : undefined,
                        sku,
                        status: 'published',
                        shortDescription,
                        description: htmlToLexical(descriptionHtml),
                        mainImage: mainImageId,
                        gallery: galleryIds.map(id => ({ image: id })),
                        productType: 'simple',
                        stockStatus: row['In stock?'] === '0' || row.stock_status === 'outofstock' ? 'outofstock' : 'instock',
                    } as any,
                })
                results.success++
            } catch (err: any) {
                results.errors++
                results.details.push(`Error importing ${row.Name || row.Title || row.title || 'Unknown'}: ${err.message}`)
            }
        }

        return NextResponse.json(results)
    } catch (error: any) {
        console.error('Import error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
