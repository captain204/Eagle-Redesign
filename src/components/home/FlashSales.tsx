"use client";

import Link from "next/link";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Timer, Zap } from "lucide-react";

export function FlashSales({ products = [] }: { products?: any[] }) {
    return (
        <section className="py-16 container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                        <Timer className="w-4 h-4" /> Limited Time Offer
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight">Flash Sales</h2>

                        {/* Countdown Timer */}
                        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 bg-black/90 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg shadow-lg w-fit">
                            <div className="flex flex-col items-center">
                                <span className="text-lg md:text-xl font-mono font-bold leading-none">02</span>
                                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase">Hrs</span>
                            </div>
                            <span className="text-lg md:text-xl font-bold -mt-3">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-lg md:text-xl font-mono font-bold leading-none">14</span>
                                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase">Min</span>
                            </div>
                            <span className="text-lg md:text-xl font-bold -mt-3">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-lg md:text-xl font-mono font-bold leading-none text-primary">35</span>
                                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase">Sec</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link href="/flash-sales" className="text-primary font-bold flex items-center gap-1 hover:underline group">
                    View All Deals <span className="text-xl group-hover:translate-x-1 transition-transform">›</span>
                </Link>
            </div>

            <div className="relative">
                <div className="absolute -top-4 -right-4 md:-top-10 md:-right-10 z-0 opacity-10 pointer-events-none">
                    <Zap className="w-40 h-40 text-primary rotate-12" />
                </div>
                <div className="relative z-10">
                    <ProductCarousel title="" products={products} />
                </div>
            </div>
        </section>
    );
}
