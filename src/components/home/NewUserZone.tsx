"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NewUserZone({
    couponCode = "WELCOME5000",
    discountAmount = "₦5,000 OFF",
    expiryDate = "30 Aug 2026"
}: {
    couponCode?: string;
    discountAmount?: string;
    expiryDate?: string;
}) {
    return (
        <section className="container py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-3xl p-6 md:p-10 relative overflow-hidden text-white shadow-xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold mb-4 backdrop-blur-sm border border-white/20">
                            <Gift className="w-4 h-4" /> New User Gift
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Get <span className="text-yellow-300">{discountAmount}</span> Your First Order
                        </h2>
                        <p className="text-white/90 text-lg max-w-xl mb-6 font-medium">
                            Join the 1st𝓔agle family today and enjoy exclusive perks, early access to sales, and premium support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 text-lg h-12 rounded-full shadow-lg transition-transform hover:scale-105">
                                Claim Coupon Now
                            </Button>
                            <Link href="/brand-story">
                                <Button variant="outline" size="lg" className="w-full border-white text-red-900 bg-white/40 hover:bg-white/20 hover:text-white font-bold h-12 rounded-full backdrop-blur-sm">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block relative">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="bg-white p-4 rounded-xl shadow-2xl transform rotate-3"
                        >
                            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 w-64 text-center">
                                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Coupon Code</div>
                                <div className="text-2xl font-black text-gray-800 tracking-widest uppercase">{couponCode}</div>
                                <div className="text-xs text-gray-400 mt-2">Valid until {expiryDate}</div>
                            </div>
                        </motion.div>
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-bold p-3 rounded-full shadow-lg transform rotate-12">
                            Limited Time!
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
