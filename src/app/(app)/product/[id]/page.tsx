import { getPayload } from "payload";
import configPromise from "@/payload.config";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }> | { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const payload = await getPayload({ config: configPromise });

    try {
        const product = await payload.findByID({ collection: "products", id, depth: 0 });
        return {
            title: `${product.title} | 1st𝓔agle`,
            description: product.shortDescription as string || "Product details",
        }
    } catch (e) {
        return { title: 'Product Not Found' }
    }
}

export default async function ProductDetailPage({ params }: Props) {
    // Await params to fix Next 15 rules
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const payload = await getPayload({ config: configPromise });

    let product;
    try {
        product = await payload.findByID({ collection: "products", id, depth: 1 });
    } catch (e) {
        return notFound();
    }

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
