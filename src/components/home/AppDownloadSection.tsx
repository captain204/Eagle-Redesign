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
                            Ready to show the world what you’ve got? Join the <span className="text-primary">1st𝓔agle</span> Talent Hunt today.
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                            Download our app from the Play Store or App Store, submit your entry, and take your shot at being discovered. Get direct access to the competition, real-time updates, and a smooth experience built for winners.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            {/* App Store Button */}
                            <a href="https://apps.apple.com/ng/app/1st-eagle-store/id6755090747" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group">
                                <Apple className="w-8 h-8 group-hover:text-primary transition-colors" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Download on the</div>
                                    <div className="text-xl font-semibold leading-none">App Store</div>
                                </div>
                            </a>

                            {/* Play Store Button */}
                            <a href="https://play.google.com/store/apps/details?id=com.eagle.dmi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-white text-black border-2 border-gray-200 px-6 py-4 rounded-2xl hover:border-black transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group">
                                <Smartphone className="w-8 h-8 group-hover:text-primary transition-colors" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-gray-500">GET IT ON</div>
                                    <div className="text-xl font-semibold leading-none text-black">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="relative w-full max-w-sm mx-auto lg:max-w-md hidden md:block">
                        <img
                            src="/images/talent-hunt.jpg"
                            alt="1st Eagle Talent Hunt"
                            className="w-full h-auto rounded-[3rem] shadow-2xl object-cover hover:scale-105 transition-transform duration-500 border-8 border-gray-900"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
