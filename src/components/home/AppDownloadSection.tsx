"use client";

import { Apple, Smartphone } from "lucide-react";

export function AppDownloadSection() {
    return (
        <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <img
                    src="/images/talent-hunt.jpg"
                    alt="1st Eagle Talent Hunt"
                    className="w-full max-w-4xl h-auto rounded-3xl shadow-2xl object-cover mb-12"
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                    {/* App Store Button */}
                    <a href="https://apps.apple.com/ng/app/1st-eagle-store/id6755090747" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group min-w-[200px]">
                        <Apple className="w-8 h-8 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Download on the</div>
                            <div className="text-xl font-semibold leading-none">App Store</div>
                        </div>
                    </a>

                    {/* Play Store Button */}
                    <a href="https://play.google.com/store/apps/details?id=com.eagle.dmi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-white text-black border-2 border-gray-200 px-6 py-4 rounded-2xl hover:border-black transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl active:scale-95 group min-w-[200px]">
                        <Smartphone className="w-8 h-8 group-hover:text-primary transition-colors" />
                        <div className="text-left">
                            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-gray-500">GET IT ON</div>
                            <div className="text-xl font-semibold leading-none text-black">Google Play</div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
