import { getPayload } from "payload";
import configPromise from "@/payload.config";
import ProductDetailClient from "./ProductDetailClient";
import { notFound, redirect } from "next/navigation";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        console.warn('Could not decode slug in metadata:', slug);
    }
    const payload = await getPayload({ config: configPromise });

    try {
        let product;
        
        // Find by slug
        const productRes = await payload.find({
            collection: "products",
            where: { slug: { equals: decodedSlug } },
            depth: 0,
        });
        product = productRes.docs[0];

        // Fallback to ID
        if (!product && !isNaN(Number(slug))) {
            try {
                product = await payload.findByID({ collection: "products", id: slug, depth: 0 });
            } catch (e) {}
        }

        if (!product) throw new Error("Not found");

        return {
            title: `${product.title} | 1st𝓔agle`,
            description: product.shortDescription as string || "Product details",
        }
    } catch (e) {
        return { title: 'Product Not Found' }
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        console.warn('Could not decode slug in page:', slug);
    }

    const payload = await getPayload({ config: configPromise });

    let product;
    
    // Try finding by slug first
    try {
        const productRes = await payload.find({
            collection: "products",
            where: { slug: { equals: decodedSlug } },
            depth: 1,
        });
        product = productRes.docs[0];
    } catch (e) {
        console.error(`Error querying by slug:`, e);
    }

    // Fallback to ID (Backwards Compatibility)
    if (!product && !isNaN(Number(slug))) {
        try {
            product = await payload.findByID({ collection: "products", id: slug, depth: 1 });
        } catch (e) {}
    }

    if (!product) {
        return notFound();
    }

    // Redirect to slug if accessed via ID and slug exists
    if (product.slug && String(product.id) === slug) {
        redirect(`/product/${encodeURIComponent(product.slug)}`);
    }

    // Use the actual product ID for fetching related products
    const id = product.id; 

    // Fetch related products based on categories
    const categoryIds = product.categories?.map((c: any) => typeof c === 'object' ? c.id : c) || [];
    let relatedProducts = [];

    if (categoryIds.length > 0) {
        const relatedRes = await payload.find({
            collection: "products",
            where: {
                and: [
                    { id: { not_equals: id } },
                    { categories: { in: categoryIds } }
                ]
            },
            limit: 6,
            depth: 1,
        });
        relatedProducts = relatedRes.docs;
    } else {
        // Fallback to recent products if no categories
        const recentRes = await payload.find({
            collection: "products",
            where: {
                id: { not_equals: id }
            },
            sort: "-createdAt",
            limit: 6,
            depth: 1,
        });
        relatedProducts = recentRes.docs;
    }

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
