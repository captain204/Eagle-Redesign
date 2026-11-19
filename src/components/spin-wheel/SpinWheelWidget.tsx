"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import { useSpinWheel } from "@/providers/SpinWheelProvider";
import { SPIN_TIERS, formatNaira } from "@/lib/spinWheel";

const HIDDEN_PATH_PREFIXES = [
    "/checkout",
    "/portal",
    "/verify-purchase",
    "/distributor-raffle",
    "/raffle-admin",
    "/admin",
];

export function SpinWheelWidget() {
    const pathname = usePathname();
    const {
        isMounted,
        isModalOpen,
        openWheel,
        spinsRemaining,
        globalReward,
        hasAnyActiveReward,
        earliestRewardExpiry,
    } = useSpinWheel();

    const [isHiddenByUser, setIsHiddenByUser] = useState(false);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        if (!earliestRewardExpiry) {
            setCountdown("");
            return;
        }
        const update = () => {
            const diff = earliestRewardExpiry - Date.now();
            if (diff <= 0) {
                setCountdown("");
                return;
            }
            const totalSec = Math.floor(diff / 1000);
            const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
            const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
            const s = String(totalSec % 60).padStart(2, "0");
            setCountdown(`${h}:${m}:${s}`);
        };
        update();
        const id = window.setInterval(update, 1000);
        return () => window.clearInterval(id);
    }, [earliestRewardExpiry]);

    if (!isMounted || isModalOpen || isHiddenByUser) return null;
    if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) return null;
    if (spinsRemaining <= 0 && !hasAnyActiveReward) return null;

    return (
        <div className="fixed bottom-20 md:bottom-8 left-4 md:left-6 z-40 flex items-center group">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => openWheel(null)}
                    aria-label="Open Lucky Spin Wheel"
                    className="flex items-center gap-2.5 bg-gradient-to-r from-[#B91C1C] via-[#EA580C] to-[#F59E0B] text-white pl-2 pr-3.5 py-2 rounded-full shadow-[0_8px_25px_rgba(234,88,12,0.45)] border-2 border-amber-300/90 hover:scale-105 active:scale-95 transition-all"
                >
                    {/* Mini Animated SVG Wheel */}
                    <div className="relative w-9 h-9 rounded-full bg-amber-300 p-0.5 shadow-inner shrink-0">
                        <svg
                            viewBox="0 0 40 40"
                            className="w-full h-full animate-[spin_10s_linear_infinite]"
                        >
                            {SPIN_TIERS.map((tier, idx) => {
                                const startAngle = idx * 45;
                                const endAngle = startAngle + 45;
                                const r1 = ((startAngle - 90) * Math.PI) / 180;
                                const r2 = ((endAngle - 90) * Math.PI) / 180;
                                const x1 = 20 + 19 * Math.cos(r1);
                                const y1 = 20 + 19 * Math.sin(r1);
                                const x2 = 20 + 19 * Math.cos(r2);
                                const y2 = 20 + 19 * Math.sin(r2);
                                return (
                                    <path
                                        key={tier.id}
                                        d={`M 20 20 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 19 19 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
                                        fill={tier.color}
                                        stroke="#FFFBEB"
                                        strokeWidth="0.6"
                                    />
                                );
                            })}
                            <circle cx="20" cy="20" r="4.5" fill="#FFFBEB" stroke="#B45309" strokeWidth="1" />
                        </svg>
                    </div>

                    <div className="text-left leading-tight">
                        {hasAnyActiveReward ? (
                            <>
                                <div className="text-[11px] font-black uppercase tracking-wide flex items-center gap-1 text-amber-200">
                                    <Sparkles className="w-3 h-3" /> Bonus Active
                                </div>
                                <div className="text-xs font-extrabold text-white">
                                    {globalReward
                                        ? `Up to ${formatNaira(globalReward.maxBonusAmount)}`
                                        : "Product Bonus"}
                                    {countdown ? ` • ${countdown}` : ""}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-[11px] font-black uppercase tracking-wide flex items-center gap-1 text-amber-200">
                                    <Sparkles className="w-3 h-3" /> Spin &amp; Win
                                </div>
                                <div className="text-xs font-extrabold text-white">
                                    Up to 5% OFF ({spinsRemaining})
                                </div>
                            </>
                        )}
                    </div>
                </button>

                {/* Dismiss Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsHiddenByUser(true);
                    }}
                    aria-label="Hide spin wheel button"
                    className="absolute -top-2 -right-1.5 w-5 h-5 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-white/30 shadow text-[10px] opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

