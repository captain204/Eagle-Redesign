"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";

interface Product {
    id: string | number;
    title: string;
    price: number;
    salePrice?: number;
    mainImage?: any;
    productTags?: any[];
}

export function ProductCarousel({ title, products = [], viewAllHref = '/products' }: { title: string, products?: Product[], viewAllHref?: string }) {
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
                {viewAllHref ? (
                    <Link href={viewAllHref}>
                        <Button variant="link" className="text-primary p-0">View All</Button>
                    </Link>
                ) : (
                    <Button variant="link" className="text-primary p-0">View All</Button>
                )}
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
                            {products.map((product) => (
                                <div key={product.id} className="min-w-[240px] shrink-0">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Mobile Carousel (Native Scroll) */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-8 pt-4 -mt-4 md:hidden hide-scrollbar">
                        {products.map((product) => (
                            <div key={product.id} className="w-[calc(50%-0.375rem)] shrink-0 snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
