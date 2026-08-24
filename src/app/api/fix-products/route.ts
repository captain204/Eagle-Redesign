import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Find all products that might be missing visibility
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
    });

    let updatedCount = 0;
    for (const product of products.docs) {
      if (!product.visibility) {
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            visibility: 'visible',
          } as any
        });
        updatedCount++;
      }
    }

    // Revalidate the Next.js cache so the homepage sees the products
    // @ts-ignore - Next.js experimental types require 2 args, but runtime accepts 1
    revalidateTag('products');
    // @ts-ignore
    revalidateTag('categories');
    // @ts-ignore
    revalidateTag('daily-deals');
    // @ts-ignore
    revalidateTag('hot-new-products');
    // @ts-ignore
    revalidateTag('featured-products');

    return NextResponse.json({
      success: true,
      message: `Fixed ${updatedCount} products and revalidated cache.`
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "An error occurred.",
      error: error?.message || String(error)
    }, { status: 500 });
  }
}
