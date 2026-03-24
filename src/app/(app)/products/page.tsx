import { getPayload } from "payload";
import configPromise from "@/payload.config";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
    const payload = await getPayload({ config: configPromise });

    // Fetch products and categories concurrently
    const [productsResult, categoriesResult] = await Promise.all([
        payload.find({
            collection: "products",
            depth: 1,
            limit: 200,
            sort: "-createdAt"
        }),
        payload.find({
            collection: "categories",
            depth: 1,
            limit: 100
        })
    ]);

    return (
        <ProductsClient
            initialProducts={productsResult.docs as any}
            categories={categoriesResult.docs as any}
        />
    );
}
