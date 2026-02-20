"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TopBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary text-white text-xs md:text-sm font-bold py-2 px-4 relative z-[60]">
            <div className="container mx-auto flex items-center justify-center text-center">
                <span>
                    FREE SHIPPING ON ORDERS OVER ₦25,000 | 1 YEAR WARRANTY
                </span>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 md:right-0 p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
