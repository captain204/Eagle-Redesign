"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { History } from "lucide-react";

// Mock Data reusing the structure
const RECENT_PRODUCTS = [
    { id: 101, name: "1stEagle Power Bank 10000mAh (E10 Plus)", price: 15900, originalPrice: 20000, image: "/images/1steagle/uploaded_media_3_1771516262315.jpg", tag: "Best Seller" },
    { id: 102, name: "1stEagle Big Generator 60000mAh (E600)", price: 36000, image: "/images/1steagle/uploaded_media_2_1771516262315.jpg" },
    { id: 103, name: "1stEagle Mini Generator 50000mAh (E500)", price: 49500, originalPrice: 60000, image: "/images/1steagle/uploaded_media_4_1771516262315.jpg" },
    { id: 104, name: "1stEagle Mobile Power (Black)", price: 12500, image: "/images/1steagle/uploaded_media_1_1771516262315.jpg" },
];

export function RecentlyViewed() {
    return (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="container">
                <div className="flex items-center gap-2 mb-6 text-gray-500">
                    <History className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wide text-sm">Recently Viewed</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {RECENT_PRODUCTS.map((product) => (
                        <motion.div key={product.id} className="min-w-0" whileHover={{ y: -5 }}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
