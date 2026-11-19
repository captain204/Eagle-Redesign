"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Gift, ShoppingBag, ArrowRight, RotateCw, ShieldCheck, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSpinWheel, SpinWinOutcome } from "@/providers/SpinWheelProvider";
import { useCart } from "@/providers/CartProvider";
import {
    SpinProduct,
    SpinSlice,
    buildWheelSlices,
    calculateSpinDiscount,
    formatNaira,
    getProductPricing,
    pickWeightedSliceIndex,
} from "@/lib/spinWheel";

const SPIN_DURATION_MS = 4600;
const CONFETTI_COLORS = ["#FBBF24", "#F97316", "#EF4444", "#10B981", "#FFFFFF", "#F43F5E"];

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
    const rad = (angleInDegrees * Math.PI) / 180;
    return {
        x: cx + radius * Math.sin(rad),
        y: cy - radius * Math.cos(rad),
    };
}

function describeWedge(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", cx, cy,
        "L", start.x.toFixed(3), start.y.toFixed(3),
        "A", radius, radius, 0, largeArcFlag, 0, end.x.toFixed(3), end.y.toFixed(3),
        "Z",
    ].join(" ");
}

function formatCountdown(msRemaining: number): string {
    if (msRemaining <= 0) return "00:00:00";
    const totalSeconds = Math.floor(msRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((v) => String(v).padStart(2, "0")).join(":");
}

export function SpinWheelModal() {
    const router = useRouter();
    const {
        isMounted,
        isModalOpen,
        closeWheel,
        targetProduct,
        setTargetProduct,
        catalogProducts,
        referencePrice,
        spinsRemaining,
        recordSpinWin,
        globalReward,
        productRewards,
        earliestRewardExpiry,
    } = useSpinWheel();
    const { addToCart } = useCart();

    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winOutcome, setWinOutcome] = useState<SpinWinOutcome | null>(null);
    const [tickStep, setTickStep] = useState(false);
    const [countdownText, setCountdownText] = useState("23:59:59");
    const spinTimerRef = useRef<number | null>(null);
    const tickerIntervalRef = useRef<number | null>(null);

    // Clear win outcome whenever modal reopens or target product switches before spinning
    useEffect(() => {
        if (isModalOpen) {
            setWinOutcome(null);
        }
    }, [isModalOpen]);

    // Live countdown for active bonus / urgency
    useEffect(() => {
        if (!isModalOpen) return;
        const updateTimer = () => {
            if (earliestRewardExpiry) {
                setCountdownText(formatCountdown(earliestRewardExpiry - Date.now()));
            } else {
                // Visual daily countdown until midnight
                const now = new Date();
                const endOfDay = new Date(now);
                endOfDay.setHours(23, 59, 59, 999);
                setCountdownText(formatCountdown(endOfDay.getTime() - now.getTime()));
            }
        };
        updateTimer();
        const id = window.setInterval(updateTimer, 1000);
        return () => window.clearInterval(id);
    }, [isModalOpen, earliestRewardExpiry]);

    // Escape key & scroll lock
    useEffect(() => {
        if (!isModalOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isSpinning) {
                closeWheel();
            }
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isModalOpen, isSpinning, closeWheel]);

    // Cleanup spin timers on unmount
    useEffect(() => {
        return () => {
            if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
            if (tickerIntervalRef.current) window.clearInterval(tickerIntervalRef.current);
        };
    }, []);

    const activeProductPricing = useMemo(() => {
        if (!targetProduct) return null;
        return getProductPricing(targetProduct);
    }, [targetProduct]);

    const wheelReferencePrice = useMemo(() => {
        if (activeProductPricing && activeProductPricing.activePrice > 0) {
            return activeProductPricing.activePrice;
        }
        return referencePrice;
    }, [activeProductPricing, referencePrice]);

    const slices: SpinSlice[] = useMemo(
        () => buildWheelSlices(wheelReferencePrice),
        [wheelReferencePrice]
    );

    const existingRewardForTarget = useMemo(() => {
        const now = Date.now();
        if (targetProduct) {
            const pReward = productRewards[String(targetProduct.id)];
            if (pReward && pReward.expiresAt > now) return pReward;
        }
        if (globalReward && globalReward.expiresAt > now) return globalReward;
        return null;
    }, [targetProduct, productRewards, globalReward]);

    const handleSpin = () => {
        if (isSpinning || spinsRemaining <= 0) return;

        const chosenIndex = pickWeightedSliceIndex(slices);
        const chosenSlice = slices[chosenIndex];
        const sliceAngle = 360 / slices.length;

        // Calculate exact target angle so slice center lands under the 12 o'clock pointer
        const sliceCenterDeg = chosenIndex * sliceAngle;
        const targetMod = (360 - (sliceCenterDeg % 360)) % 360;
        const currentMod = ((rotation % 360) + 360) % 360;
        const deltaToTarget = (targetMod - currentMod + 360) % 360;
        const safeJitter = (Math.random() - 0.5) * (sliceAngle * 0.48);
        const extraSpins = 6 * 360;

        const nextRotation = rotation + extraSpins + deltaToTarget + safeJitter;

        setWinOutcome(null);
        setIsSpinning(true);
        setRotation(nextRotation);

        if (tickerIntervalRef.current) window.clearInterval(tickerIntervalRef.current);
        tickerIntervalRef.current = window.setInterval(() => {
            setTickStep((prev) => !prev);
        }, 120);

        if (spinTimerRef.current) window.clearTimeout(spinTimerRef.current);
        spinTimerRef.current = window.setTimeout(() => {
            if (tickerIntervalRef.current) {
                window.clearInterval(tickerIntervalRef.current);
                tickerIntervalRef.current = null;
            }
            setTickStep(false);
            setIsSpinning(false);
            const outcome = recordSpinWin(chosenSlice, targetProduct);
            if (outcome) {
                setWinOutcome(outcome);
            }
        }, SPIN_DURATION_MS);
    };

    const handleSelectTarget = (product: SpinProduct | null) => {
        if (isSpinning) return;
        setTargetProduct(product);
        setWinOutcome(null);
    };

    const handleClaimForProduct = (goToCheckout: boolean) => {
        if (!targetProduct || !activeProductPricing || activeProductPricing.activePrice <= 0) {
            closeWheel();
            return;
        }
        const varLabel =
            targetProduct.productType === "variable" && activeProductPricing.variation?.name
                ? ` (${activeProductPricing.variation.name})`
                : "";
        addToCart({
            id: targetProduct.id,
            title: `${targetProduct.title}${varLabel}`.trim(),
            price: activeProductPricing.activePrice,
            mainImage: activeProductPricing.variation?.image || targetProduct.mainImage,
            quantity: 1,
        });
        closeWheel();
        if (goToCheckout) {
            router.push("/checkout");
        }
    };

    if (!isMounted || !isModalOpen) return null;

    const marqueeDots = Array.from({ length: 16 });
    const featuredPreviewProducts = (() => {
        const base = catalogProducts.slice(0, 8);
        if (!targetProduct) return base;
        const alreadyIn = base.some((p) => String(p.id) === String(targetProduct.id));
        return alreadyIn ? base : [targetProduct, ...base].slice(0, 8);
    })();
    const activeTargetDiscount =
        targetProduct && activeProductPricing
            ? calculateSpinDiscount(
                  activeProductPricing.activePrice,
                  globalReward,
                  productRewards[String(targetProduct.id)]
              )
            : null;

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
                if (!isSpinning) closeWheel();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="1stEagle Lucky Spin Wheel"
        >
            <div
                className="relative w-full max-w-[490px] max-h-[94vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#9A1B0C] via-[#7F120A] to-[#1C0A09] text-white shadow-[0_25px_70px_rgba(0,0,0,0.65)] border-2 border-amber-400/70 hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Radial Festive Glow */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_25%,rgba(251,191,36,0.32),transparent_70%)]" />

                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => {
                        if (!isSpinning) closeWheel();
                    }}
                    disabled={isSpinning}
                    aria-label="Close spinning wheel"
                    className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white/90 flex items-center justify-center transition-colors disabled:opacity-40"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative z-10 px-4 pt-5 pb-6 sm:px-6">
                    {/* Temu-style Header Banner */}
                    <div className="text-center mb-3">
                        <div className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            1stEagle Lucky Wheel • Max 5% Bonus
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                            SPIN &amp; WIN INSTANT BONUS
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs">
                            <span className="inline-flex items-center gap-1 bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full font-bold text-amber-200">
                                <RotateCw className="w-3 h-3" />
                                {spinsRemaining} {spinsRemaining === 1 ? "Spin" : "Spins"} Left
                            </span>
                            <span className="inline-flex items-center gap-1 bg-black/35 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-mono font-bold text-amber-300">
                                <Clock className="w-3 h-3" />
                                {countdownText}
                            </span>
                        </div>
                    </div>

                    {/* Product Selector / Context Card */}
                    {featuredPreviewProducts.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[11px] uppercase tracking-wider text-amber-200/90 font-bold text-center mb-1.5">
                                {targetProduct ? "Spinning Bonus For:" : "Choose a Product or Spin Storewide:"}
                            </p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                <button
                                    type="button"
                                    disabled={isSpinning}
                                    onClick={() => handleSelectTarget(null)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                        !targetProduct
                                            ? "bg-amber-400 text-black border-amber-300 shadow-md"
                                            : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20"
                                    }`}
                                >
                                    🎁 All Products
                                </button>
                                {featuredPreviewProducts.map((prod) => {
                                    const pricing = getProductPricing(prod);
                                    const isSelected = targetProduct && String(targetProduct.id) === String(prod.id);
                                    return (
                                        <button
                                            key={prod.id}
                                            type="button"
                                            disabled={isSpinning}
                                            onClick={() => handleSelectTarget(prod)}
                                            className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border transition-all max-w-[190px] ${
                                                isSelected
                                                    ? "bg-amber-400 text-black border-amber-300 shadow-md"
                                                    : "bg-white/10 text-white/90 border-white/20 hover:bg-white/20"
                                            }`}
                                        >
                                            <img
                                                src={pricing.imageUrl}
                                                alt={prod.title}
                                                className="w-5 h-5 rounded-full object-cover bg-white shrink-0"
                                            />
                                            <span className="truncate">{prod.title}</span>
                                            <span className={`shrink-0 ${isSelected ? "text-red-800" : "text-amber-300"}`}>
                                                {formatNaira(pricing.activePrice)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Selected Product Actual Price Reminder */}
                    {targetProduct && activeProductPricing && (
                        <div className="mb-3 bg-black/35 border border-amber-400/35 rounded-xl px-3 py-2 flex items-center gap-3">
                            <img
                                src={activeProductPricing.imageUrl}
                                alt={targetProduct.title}
                                className="w-11 h-11 rounded-lg object-contain bg-white p-1 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">{targetProduct.title}</p>
                                <p className="text-[11px] text-amber-200">
                                    Actual Price: <span className="font-bold text-white">{formatNaira(activeProductPricing.activePrice)}</span>{" "}
                                    • Max 5% Bonus: <span className="font-bold text-amber-300">{formatNaira(Math.floor(activeProductPricing.activePrice * 0.05))}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Spinning Wheel Stage */}
                    <div className="relative flex flex-col items-center justify-center my-2">
                        {/* Top Pointer Pin */}
                        <div
                            className={`relative z-30 -mb-3.5 transition-transform duration-100 ${
                                tickStep ? "-rotate-12 scale-105" : "rotate-0"
                            }`}
                        >
                            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />
                            <div className="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white absolute -top-7 left-1/2 -translate-x-1/2 shadow" />
                        </div>

                        {/* Wheel Container */}
                        <div className="relative w-[275px] h-[275px] sm:w-[325px] sm:h-[325px] flex items-center justify-center">
                            {/* Outer Glowing Halo */}
                            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl pointer-events-none" />

                            {/* Static Bezel with Animated Bulbs */}
                            <svg
                                viewBox="0 0 360 360"
                                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                            >
                                <circle
                                    cx="180"
                                    cy="180"
                                    r="174"
                                    fill="none"
                                    stroke="url(#bezelGrad)"
                                    strokeWidth="12"
                                />
                                <defs>
                                    <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FDE68A" />
                                        <stop offset="50%" stopColor="#F59E0B" />
                                        <stop offset="100%" stopColor="#B45309" />
                                    </linearGradient>
                                </defs>
                                {marqueeDots.map((_, idx) => {
                                    const pt = polarToCartesian(180, 180, 174, idx * (360 / 16));
                                    const lit = isSpinning ? (idx + (tickStep ? 1 : 0)) % 2 === 0 : idx % 2 === 0;
                                    return (
                                        <circle
                                            key={idx}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={lit ? 4.2 : 3.2}
                                            fill={lit ? "#FFFBEB" : "#F59E0B"}
                                            opacity={lit ? 1 : 0.65}
                                        />
                                    );
                                })}
                            </svg>

                            {/* Rotating Wheel SVG */}
                            <div
                                className="w-[92%] h-[92%] rounded-full shadow-inner"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transition: isSpinning
                                        ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.85, 0.16, 1)`
                                        : "none",
                                }}
                            >
                                <svg viewBox="0 0 360 360" className="w-full h-full drop-shadow-xl">
                                    {slices.map((slice, idx) => {
                                        const sliceAngle = 360 / slices.length;
                                        const startAngle = idx * sliceAngle - sliceAngle / 2;
                                        const endAngle = idx * sliceAngle + sliceAngle / 2;
                                        const centerAngle = idx * sliceAngle;
                                        const amountText = formatNaira(slice.amount);
                                        const fontSize =
                                            amountText.length > 7 ? 13 : amountText.length > 5 ? 15 : 17;

                                        return (
                                            <g key={slice.id}>
                                                <path
                                                    d={describeWedge(180, 180, 166, startAngle, endAngle)}
                                                    fill={slice.color}
                                                    stroke="#FDE68A"
                                                    strokeWidth="1.5"
                                                />
                                                <g transform={`rotate(${centerAngle} 180 180)`}>
                                                    <text
                                                        x="180"
                                                        y="60"
                                                        textAnchor="middle"
                                                        fill={slice.textColor}
                                                        fontSize={fontSize}
                                                        fontWeight="900"
                                                        fontFamily="Outfit, sans-serif"
                                                    >
                                                        {amountText}
                                                    </text>
                                                    <text
                                                        x="180"
                                                        y="78"
                                                        textAnchor="middle"
                                                        fill={slice.textColor}
                                                        fontSize="10"
                                                        fontWeight="800"
                                                        opacity="0.92"
                                                        fontFamily="Outfit, sans-serif"
                                                    >
                                                        {slice.label}
                                                    </text>
                                                </g>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* Center SPIN Hub Button */}
                            <button
                                type="button"
                                onClick={handleSpin}
                                disabled={isSpinning || spinsRemaining <= 0}
                                aria-label="Spin the wheel"
                                className={`absolute z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.75)] flex flex-col items-center justify-center font-black transition-transform ${
                                    isSpinning
                                        ? "bg-gradient-to-b from-amber-300 to-amber-500 text-black scale-95 cursor-wait"
                                        : spinsRemaining <= 0
                                          ? "bg-gray-700 text-gray-300 border-gray-500 cursor-not-allowed shadow-none"
                                          : "bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 text-black hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                                }`}
                            >
                                <span className="text-base sm:text-lg leading-none tracking-tight">
                                    {isSpinning ? "..." : spinsRemaining > 0 ? "SPIN" : "USED"}
                                </span>
                                {!isSpinning && spinsRemaining > 0 && (
                                    <span className="text-[9px] uppercase tracking-widest mt-0.5 text-red-900 font-extrabold">
                                        Win Bonus
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confetti + Win Reveal Card */}
                    <AnimatePresence>
                        {winOutcome && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="relative mt-4 bg-gradient-to-br from-amber-300 via-yellow-100 to-white text-gray-900 rounded-2xl p-4 shadow-2xl border-2 border-amber-400 overflow-hidden"
                            >
                                {/* Confetti Burst */}
                                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                    {Array.from({ length: 16 }).map((_, idx) => (
                                        <motion.span
                                            key={idx}
                                            initial={{
                                                x: "50%",
                                                y: "30%",
                                                scale: 0,
                                                opacity: 1,
                                            }}
                                            animate={{
                                                x: `${10 + ((idx * 37) % 85)}%`,
                                                y: `${5 + ((idx * 53) % 85)}%`,
                                                scale: [0, 1.2, 0.8],
                                                opacity: [1, 1, 0],
                                                rotate: idx * 45,
                                            }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            className="absolute w-2.5 h-2.5 rounded-sm"
                                            style={{ backgroundColor: CONFETTI_COLORS[idx % CONFETTI_COLORS.length] }}
                                        />
                                    ))}
                                </div>

                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full mb-1.5">
                                        <Gift className="w-3.5 h-3.5" /> Bonus Unlocked!
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-red-600 leading-tight">
                                        {formatNaira(winOutcome.activeReward.maxBonusAmount)} BONUS
                                    </h3>
                                    <p className="text-xs font-bold text-gray-700 mt-0.5">
                                        {winOutcome.activeReward.percent}% OFF{" "}
                                        {targetProduct ? `on ${targetProduct.title}` : "storewide (capped at 5% max per item)"}
                                    </p>

                                    {winOutcome.keptHigherExisting && (
                                        <p className="mt-1.5 text-[11px] bg-amber-200/80 text-amber-950 font-semibold px-2.5 py-1 rounded-lg">
                                            You spun {formatNaira(winOutcome.reward.maxBonusAmount)}, so we kept your higher{" "}
                                            {formatNaira(winOutcome.activeReward.maxBonusAmount)} bonus!
                                        </p>
                                    )}

                                    {targetProduct && activeProductPricing && activeTargetDiscount ? (
                                        <div className="mt-3 bg-white/80 rounded-xl p-3 border border-amber-200">
                                            <div className="flex items-center justify-center gap-3 text-sm mb-2.5">
                                                <span className="text-gray-400 line-through font-bold">
                                                    {formatNaira(activeProductPricing.activePrice)}
                                                </span>
                                                <span className="text-xl font-black text-green-700">
                                                    {formatNaira(activeTargetDiscount.finalUnitPrice)}
                                                </span>
                                                <span className="bg-green-100 text-green-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                                                    Save {formatNaira(activeTargetDiscount.discountPerUnit)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => handleClaimForProduct(false)}
                                                    className="bg-primary hover:bg-orange-600 text-white font-bold text-xs sm:text-sm h-10 rounded-xl"
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                                                    Add to Cart
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleClaimForProduct(true)}
                                                    className="bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm h-10 rounded-xl"
                                                >
                                                    Buy Now <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                            {spinsRemaining > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleSpin}
                                                    className="w-full mt-2 border-amber-500 text-amber-900 bg-amber-100 hover:bg-amber-200 font-bold h-9 rounded-xl text-xs"
                                                >
                                                    Spin Again ({spinsRemaining} Left)
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-3 space-y-2">
                                            {featuredPreviewProducts.length > 0 && (
                                                <div className="grid grid-cols-2 gap-2 text-left">
                                                    {featuredPreviewProducts.slice(0, 2).map((prod) => {
                                                        const p = getProductPricing(prod);
                                                        const d = calculateSpinDiscount(
                                                            p.activePrice,
                                                            winOutcome.activeReward,
                                                            productRewards[String(prod.id)]
                                                        );
                                                        return (
                                                            <button
                                                                key={prod.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    closeWheel();
                                                                    router.push(`/product/${prod.slug || prod.id}`);
                                                                }}
                                                                className="bg-white rounded-xl p-2 border border-amber-200 hover:border-primary transition-colors flex items-center gap-2"
                                                            >
                                                                <img
                                                                    src={p.imageUrl}
                                                                    alt={prod.title}
                                                                    className="w-9 h-9 rounded object-contain shrink-0"
                                                                />
                                                                <div className="min-w-0">
                                                                    <div className="text-[11px] font-bold text-gray-800 truncate">
                                                                        {prod.title}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs">
                                                                        <span className="font-black text-primary">
                                                                            {formatNaira(d.finalUnitPrice)}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-400 line-through">
                                                                            {formatNaira(p.activePrice)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={closeWheel}
                                                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold h-10 rounded-xl shadow"
                                                >
                                                    Shop Now &amp; Auto-Apply Bonus
                                                </Button>
                                                {spinsRemaining > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleSpin}
                                                        className="border-amber-500 text-amber-900 bg-amber-100 hover:bg-amber-200 font-bold h-10 rounded-xl"
                                                    >
                                                        Spin Again ({spinsRemaining})
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Reward Summary if already won earlier (and not just spun now) */}
                    {!winOutcome && existingRewardForTarget && (
                        <div className="mt-3 bg-white/10 border border-amber-300/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                            <div>
                                <p className="font-bold text-amber-300">
                                    Active Bonus: {formatNaira(existingRewardForTarget.maxBonusAmount)} ({existingRewardForTarget.percent}% OFF)
                                </p>
                                <p className="text-white/75 text-[11px]">
                                    Auto-applies in Cart &amp; Checkout (up to 5% max per item).
                                </p>
                            </div>
                            {spinsRemaining > 0 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleSpin}
                                    disabled={isSpinning}
                                    className="bg-amber-400 text-black hover:bg-amber-300 font-bold rounded-full shrink-0 text-xs h-8"
                                >
                                    Try Better
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Fair Cap Footer Note */}
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-amber-100/75 text-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>
                            Bonuses apply automatically at checkout and never exceed 5% of any product&apos;s actual price.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
