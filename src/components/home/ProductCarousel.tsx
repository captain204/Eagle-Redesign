"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    tag?: string;
}

const DUMMY_PRODUCTS: Product[] = [
    { id: 1, name: "1stEagle Power Bank 10000mAh (E10 Plus)", price: 15900, originalPrice: 20000, image: "/images/1steagle/uploaded_media_3.jpg", tag: "Best Seller" },
    { id: 2, name: "1stEagle Big Generator 60000mAh (E600)", price: 36000, originalPrice: 45000, image: "/images/1steagle/uploaded_media_2.jpg", tag: "New Arrival" },
    { id: 3, name: "1stEagle Mini Generator 50000mAh (E500)", price: 49500, originalPrice: 60000, image: "/images/1steagle/uploaded_media_4.jpg", tag: "Hot Deal" },
    { id: 4, name: "1stEagle Mobile Power (Black)", price: 12500, originalPrice: 15000, image: "/images/1steagle/uploaded_media_1.jpg" },
    { id: 5, name: "1stEagle Power Bank 10000mAh (White)", price: 15900, originalPrice: 20000, image: "/images/1steagle/uploaded_media_3.jpg" },
];

export function ProductCarousel({ title }: { title: string }) {
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, []);

    return (
        <div className="py-12">
            <div className="container mb-6 flex justify-between items-end">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button variant="link" className="text-primary p-0">View All</Button>
            </div>

            <div className="container overflow-hidden pl-4 md:pl-0">
                <motion.div
                    ref={carousel}
                    className="cursor-grab overflow-hidden active:cursor-grabbing"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6"
                    >
                        {DUMMY_PRODUCTS.map((product) => (
                            <div key={product.id} className="min-w-[200px] md:min-w-[240px]">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
