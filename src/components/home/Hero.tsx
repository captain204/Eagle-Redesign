"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DURATION = 6000; // 6 seconds per slide

// Animation variants for staggered text reveal
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const textVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8
        }
    }
};

export function Hero({ slides = [] }: { slides?: any[] }) {
    const [current, setCurrent] = useState(0);

    // Default fallback if no slides provided
    const displaySlides = slides.length > 0 ? slides : [
        {
            id: 'fallback-1',
            title: "Premium Home Electronics",
            subtitle: "1stEagle Solutions",
            image: "/images/1steagle/slide_powerbank.jpg",
            link: "/products"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % displaySlides.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [current, displaySlides.length]); // reset timer when manually changing slides

    const nextSlide = () => setCurrent((prev) => (prev + 1) % displaySlides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

    return (
        <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-white group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-white"
                >
                    {/* Background Image with Ken Burns Zoom Effect */}
                    <motion.div
                        className="absolute inset-0 z-0 origin-center"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.05 }} // Reduced zoom scale for better performance
                        transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    >
                        <Image
                            src={displaySlides[current].image}
                            alt={displaySlides[current].title}
                            fill
                            priority={current === 0} // Prioritize first slide
                            className="object-cover opacity-90 mix-blend-multiply"
                            sizes="100vw"
                        />
                    </motion.div>

                    {/* Premium Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-10 pointer-events-none md:hidden" />

                    {/* Content Container */}
                    <div className="container relative h-full flex flex-col justify-center px-6 md:px-12 z-20">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="max-w-2xl space-y-6"
                        >
                            <motion.h2
                                variants={textVariants}
                                className="text-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm flex items-center gap-4"
                            >
                                <span className="w-8 h-[2px] bg-primary"></span>
                                {displaySlides[current].subtitle}
                            </motion.h2>

                            <motion.h1
                                variants={textVariants}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight"
                            >
                                {displaySlides[current].title}
                            </motion.h1>

                            <motion.div variants={textVariants}>
                                <Link href={displaySlides[current].link || "/products"}>
                                    <Button className="mt-4 bg-primary text-white hover:bg-slate-900 hover:text-white font-extrabold rounded-full px-8 py-6 text-base md:text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,102,0,0.3)]">
                                        Shop Collection
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows (Visible on Hover for desktop, always on for mobile) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 rounded-full hover:bg-slate-100 transition-all opacity-0 md:group-hover:opacity-100 z-30 shadow-md"
            >
                <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 rounded-full hover:bg-slate-100 transition-all opacity-0 md:group-hover:opacity-100 z-30 shadow-md"
            >
                <ChevronRight size={24} strokeWidth={2.5} />
            </button>

            {/* Animated Progress Bar Pagination */}
            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex space-x-3 z-30">
                {displaySlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className="relative h-1 md:h-1.5 w-12 md:w-16 bg-slate-200 rounded-full overflow-hidden"
                    >
                        {index === current && (
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                                className="absolute top-0 left-0 h-full bg-primary"
                            />
                        )}
                        {index < current && (
                            <div className="absolute top-0 left-0 h-full w-full bg-slate-300" />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
