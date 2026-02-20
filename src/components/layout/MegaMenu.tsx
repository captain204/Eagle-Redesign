"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { ChevronDown, Headphones, Zap, Battery, Watch } from "lucide-react";

const categories = [
    {
        title: "Audio",
        href: "/audio",
        icon: <Headphones className="w-5 h-5 mb-2 text-primary" />,
        items: ["Wireless Earbuds", "Headphones", "Bluetooth Speakers", "Soundbars"],
    },
    {
        title: "Power",
        href: "/power",
        icon: <Battery className="w-5 h-5 mb-2 text-primary" />,
        items: ["Power Banks", "Wall Chargers", "Car Chargers", "Cables"],
    },
    {
        title: "Wearables",
        href: "/wearables",
        icon: <Watch className="w-5 h-5 mb-2 text-primary" />,
        items: ["Smart Watches", "Fitness Trackers", "Smart Bands", "Accessories"],
    },
    {
        title: "Personal Care",
        href: "/care",
        icon: <Zap className="w-5 h-5 mb-2 text-primary" />,
        items: ["Electric Toothbrushes", "Hair Trimmers", "Grooming Kits", "Hair Dryers"],
    },
];

export function MegaMenu() {
    return (
        <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link
                    href="/products"
                    className="group flex items-center gap-1 text-white/90 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide cursor-pointer h-full flex items-center"
                >
                    Products <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[90vw] max-w-[1000px] bg-white p-0 shadow-2xl border-none overflow-hidden z-[60]" align="start" sideOffset={10}>
                <div className="grid grid-cols-4 bg-gray-50/50">
                    {categories.map((category) => (
                        <div key={category.title} className="p-6 hover:bg-white transition-colors border-r last:border-r-0 border-gray-100">
                            <Link href={category.href} className="block group">
                                <div className="flex items-center gap-2 mb-4">
                                    {category.icon}
                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{category.title}</h3>
                                </div>
                            </Link>
                            <ul className="space-y-3">
                                {category.items.map((item) => (
                                    <li key={item}>
                                        <Link
                                            href={`${category.href}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                            className="text-sm text-gray-500 hover:text-primary hover:underline transition-all block"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Featured Section */}
                    <div className="col-span-4 bg-gray-900 text-white p-6 flex justify-between items-center bg-[url('/images/pattern.png')] bg-cover">
                        <div>
                            <h4 className="font-bold text-xl mb-2 text-primary">New Arrivals</h4>
                            <p className="text-gray-400 text-sm mb-4">Check out the latest tech gear dropping this week.</p>
                            <Link href="/new-arrivals" className="text-sm border-b border-primary pb-1 hover:text-primary transition-colors">Shop Now &rarr;</Link>
                        </div>
                        {/* We would put a featured image here */}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
