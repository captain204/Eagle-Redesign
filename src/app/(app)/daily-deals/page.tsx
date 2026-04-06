import { getPayload } from "payload";
import configPromise from "@/payload.config";
import ProductsClient from "../products/ProductsClient";

export default async function DailyDealsPage() {
    const payload = await getPayload({ config: configPromise });

    const [productsResult, categoriesResult] = await Promise.all([
        payload.find({
            collection: "products",
            where: { isDailyDeal: { equals: true }, status: { equals: 'published' }, visibility: { equals: 'visible' } },
            depth: 1,
            limit: 200,
            sort: "-createdAt",
        }),
        payload.find({
            collection: "categories",
            depth: 1,
            limit: 100,
        }),
    ]);

    return (
        <ProductsClient
            initialProducts={productsResult.docs as any}
            categories={categoriesResult.docs as any}
            pageTitle="Daily Deals"
        />
    );
}
