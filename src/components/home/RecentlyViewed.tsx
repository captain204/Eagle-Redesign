"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { History } from "lucide-react";

interface Product {
    id: string | number;
    title: string;
    price: number;
    salePrice?: number;
    mainImage?: any;
    productTags?: any[];
}

export function RecentlyViewed({ products = [] }: { products?: Product[] }) {
    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="container">
                <div className="flex items-center gap-2 mb-6 text-gray-500">
                    <History className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wide text-sm">Recently Viewed</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <motion.div key={product.id} className="min-w-0" whileHover={{ y: -5 }}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
