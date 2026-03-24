"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { ChevronDown, Headphones, Zap, Battery, Watch } from "lucide-react";

interface Category {
    id: string | number;
    title: string;
    slug: string;
    image?: any;
    parent?: any;
}

export function MegaMenu({ categories = [] }: { categories?: Category[] }) {
    // Get top level categories (up to 4 for the grid)
    const topLevelCategories = categories.filter(c => !c.parent).slice(0, 4);

    return (
        <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link
                    href="/products"
                    className="group flex items-center gap-1 text-white/90 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide cursor-pointer h-full"
                >
                    Products <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[90vw] max-w-[1000px] bg-white p-0 shadow-2xl border-none overflow-hidden z-[60]" align="start" sideOffset={10}>
                <div className="grid grid-cols-4 bg-gray-50/50">
                    {topLevelCategories.map((category) => {
                        // Find subclasses based on the parent.id or parent
                        const subCategories = categories.filter(c => typeof c.parent === 'object' ? c.parent?.id === category.id : c.parent === category.id);
                        return (
                            <div key={category.title} className="p-6 hover:bg-white transition-colors border-r last:border-r-0 border-gray-100">
                                <Link href={`/products?category=${category.slug}`} className="block group">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{category.title}</h3>
                                    </div>
                                </Link>
                                <ul className="space-y-3">
                                    {subCategories.slice(0, 6).map((sub) => (
                                        <li key={sub.id}>
                                            <Link
                                                href={`/products?category=${sub.slug}`}
                                                className="text-sm text-gray-500 hover:text-primary hover:underline transition-all block"
                                            >
                                                {sub.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}

                    {/* Featured Section */}
                    <div className="col-span-4 bg-gray-900 text-white p-6 flex justify-between items-center bg-[url('/images/pattern.png')] bg-cover">
                        <div>
                            <h4 className="font-bold text-xl mb-2 text-primary">Daily Deals</h4>
                            <p className="text-gray-400 text-sm mb-4">Check out the latest tech gear dropping this week.</p>
                            <Link href="/daily-deals" className="text-sm border-b border-primary pb-1 hover:text-primary transition-colors">Shop Now &rarr;</Link>
                        </div>
                        {/* We would put a featured image here */}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
