"use client";

import { Apple, Smartphone } from "lucide-react";

export function AppDownloadSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
                            Get the <span className="text-primary">1st𝓔agle</span> App
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                            Experience the world-class shopping experience on your mobile. Download our app for exclusive deals, faster checkouts, and real-time tracking.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            {/* App Store Button */}
                            <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group">
                                <Apple className="w-8 h-8 group-hover:text-primary transition-colors" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Download on the</div>
                                    <div className="text-xl font-semibold leading-none">App Store</div>
                                </div>
                            </button>

                            {/* Play Store Button */}
                            <button className="flex items-center justify-center gap-3 bg-white text-black border-2 border-gray-200 px-6 py-4 rounded-2xl hover:border-black transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group">
                                <Smartphone className="w-8 h-8 group-hover:text-primary transition-colors" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-gray-500">GET IT ON</div>
                                    <div className="text-xl font-semibold leading-none text-black">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full max-w-sm mx-auto lg:max-w-md hidden md:block">
                        {/* Using a placeholder shape/div since we don't have a phone mockup image */}
                        <div className="relative w-64 h-[500px] mx-auto bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden shadow-primary/20 rotate-12 hover:rotate-0 transition-transform duration-700 ease-out">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-7 bg-gray-900 rounded-b-3xl w-1/2 mx-auto z-20"></div>
                            {/* Screen Content Simulation */}
                            <div className="absolute inset-0 bg-white">
                                <div className="w-full h-48 bg-orange-100 flex items-center justify-center">
                                    <div className="text-primary font-bold text-2xl tracking-tighter">1st𝓔agle</div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-gray-100 rounded-2xl"></div>
                                        <div className="h-24 bg-gray-100 rounded-2xl"></div>
                                    </div>
                                    <div className="h-12 bg-primary/20 rounded-xl mt-8"></div>
                                </div>
                                {/* Simulated Bottom Nav */}
                                <div className="absolute bottom-0 w-full h-16 bg-gray-50 border-t border-gray-100 flex justify-around items-center px-4">
                                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
