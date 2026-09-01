import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const payload = await getPayload({ config: configPromise })
        
        // Security check
        const { user } = await payload.auth({ headers: await headers() })
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const products = await payload.find({
            collection: 'products',
            limit: 10000,
            depth: 1, // to get images
        })

        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.1steagle.com.ng';

        const data = products.docs.map((p: any) => {
            // Extract image URLs
            const images: string[] = [];
            if (p.mainImage && p.mainImage.url) {
                images.push(serverUrl + p.mainImage.url);
            }
            if (p.gallery && Array.isArray(p.gallery)) {
                p.gallery.forEach((g: any) => {
                    if (g.image && g.image.url) {
                        images.push(serverUrl + g.image.url);
                    }
                })
            }

            // Extract plain text from description
            let description = '';
            if (p.description && p.description.root && Array.isArray(p.description.root.children)) {
               description = p.description.root.children.map((c: any) => c.children?.map((textNode: any) => textNode.text).join('')).join('\n');
            }

            return {
                title: p.title,
                slug: p.slug,
                price: p.price,
                salePrice: p.salePrice || '',
                sku: p.sku || '',
                shortDescription: p.shortDescription || '',
                description: description,
                images: images.join(','),
                stock_status: p.stockStatus || 'instock',
            }
        })

        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'csv' })

        return new NextResponse(buffer, {
            headers: {
                'Content-Disposition': 'attachment; filename="products_export.csv"',
                'Content-Type': 'text/csv',
            }
        })
    } catch (error: any) {
        console.error('Export error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
