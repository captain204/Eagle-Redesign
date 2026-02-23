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
    { id: 1, name: "Power Bank 10000mAh (E10 Plus)", price: 15900, originalPrice: 20000, image: "/images/1steagle/uploaded_media_3_1771516262315.jpg", tag: "Best Seller" },
    { id: 2, name: "Big Generator 60000mAh (E600)", price: 36000, originalPrice: 45000, image: "/images/1steagle/uploaded_media_2_1771516262315.jpg", tag: "New Arrival" },
    { id: 3, name: "Mini Generator 50000mAh (E500)", price: 49500, originalPrice: 60000, image: "/images/1steagle/uploaded_media_4_1771516262315.jpg", tag: "Hot Deal" },
    { id: 4, name: "Mobile Power (Black)", price: 12500, originalPrice: 15000, image: "/images/1steagle/uploaded_media_1_1771516262315.jpg" },
    { id: 5, name: "Power Bank 10000mAh (White)", price: 15900, originalPrice: 20000, image: "/images/1steagle/uploaded_media_3_1771516262315.jpg" },
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

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for fading edges (Desktop only) */}
                <div className="hidden md:block absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#f5f5f5] to-transparent z-10 pointer-events-none" />
                <div className="hidden md:block absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#f5f5f5] to-transparent z-10 pointer-events-none" />

                <div className="container overflow-visible pl-4 md:pl-16 pr-4 md:pr-16">
                    {/* Desktop Carousel */}
                    <motion.div
                        ref={carousel}
                        className="cursor-grab active:cursor-grabbing pb-8 pt-4 -mt-4 hidden md:block"
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ right: 0, left: -width }}
                            dragElastic={0.15}
                            dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                            className="flex gap-6"
                        >
                            {DUMMY_PRODUCTS.map((product) => (
                                <div key={product.id} className="min-w-[240px] shrink-0">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Mobile Grid */}
                    <div className="grid grid-cols-2 gap-3 pb-8 pt-4 -mt-4 md:hidden">
                        {DUMMY_PRODUCTS.map((product) => (
                            <div key={product.id} className="w-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
