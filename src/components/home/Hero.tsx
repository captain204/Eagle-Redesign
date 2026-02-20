"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
    {
        id: 1,
        title: "Power Your World",
        subtitle: "1stEagle High Capacity Generators",
        image: "/images/1steagle/hero_1.jpg",
        bgColor: "bg-[#1a1a1a]",
    },
    {
        id: 2,
        title: "Stay Connected",
        subtitle: "Premium Power Banks",
        image: "/images/1steagle/powerbank_orange.jpg",
        bgColor: "bg-[#0d0d0d]",
    },
    {
        id: 3,
        title: "Pure Sound",
        subtitle: "True Wireless Earbuds",
        image: "/images/1steagle/earbuds_blue.jpg",
        bgColor: "bg-[#222222]",
    },
];

export function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-black group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute inset-0 flex items-center justify-center ${slides[current].bgColor}`}
                >
                    <div className="absolute inset-0 z-0">
                        <img
                            src={slides[current].image}
                            alt={slides[current].title}
                            className="w-full h-full object-cover opacity-60"
                        />
                    </div>
                    {/* Content Container */}
                    <div className="container relative h-full flex flex-col justify-center px-6 md:px-12 z-20">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-xl space-y-4"
                        >
                            <h2 className="text-primary font-bold tracking-widest uppercase text-sm md:text-base">
                                {slides[current].subtitle}
                            </h2>
                            <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight">
                                {slides[current].title}
                            </h1>
                            <Button className="bg-primary text-black hover:bg-white hover:text-black font-bold rounded-full px-8 py-6 text-lg transition-all transform hover:scale-105">
                                Buy Now
                            </Button>
                        </motion.div>
                    </div>

                    {/* Background Pattern/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-primary hover:text-black transition-all opacity-0 group-hover:opacity-100 z-30"
            >
                <ChevronRight size={32} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-300 rounded-full h-2 ${index === current ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
