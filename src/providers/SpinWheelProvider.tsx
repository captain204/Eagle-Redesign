"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
    MAX_SPINS_PER_CYCLE,
    MAX_SPIN_BONUS_PERCENT,
    SPIN_REWARD_TTL_MS,
    SpinProduct,
    SpinReward,
    SpinSlice,
    ProductSpinDiscount,
    calculateSpinDiscount,
    computeReferencePrice,
    getProductPricing,
} from "@/lib/spinWheel";

const STORAGE_KEYS = {
    GLOBAL_REWARD: "eagle_spin_global_reward_v1",
    PRODUCT_REWARDS: "eagle_spin_product_rewards_v1",
    QUOTA: "eagle_spin_quota_v1",
    POPUP_SEEN: "eagle_spin_popup_seen_v1",
} as const;

export interface SpinWinOutcome {
    reward: SpinReward;
    keptHigherExisting: boolean;
    activeReward: SpinReward;
}

interface SpinWheelContextType {
    isMounted: boolean;
    isModalOpen: boolean;
    targetProduct: SpinProduct | null;
    setTargetProduct: (product: SpinProduct | null) => void;
    openWheel: (product?: SpinProduct | null) => void;
    closeWheel: () => void;
    globalReward: SpinReward | null;
    productRewards: Record<string, SpinReward>;
    spinsRemaining: number;
    quotaResetAt: number;
    catalogProducts: SpinProduct[];
    referencePrice: number;
    registerCatalogProducts: (products: SpinProduct[]) => void;
    recordSpinWin: (slice: SpinSlice, target?: SpinProduct | null) => SpinWinOutcome | null;
    consumeAppliedRewards: (productIds: (string | number)[]) => void;
    getProductSpinDiscount: (productId: string | number, unitPrice: number) => ProductSpinDiscount;
    hasAnyActiveReward: boolean;
    earliestRewardExpiry: number | null;
}

const SpinWheelContext = createContext<SpinWheelContextType | undefined>(undefined);

function safeReadStorage<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function safeWriteStorage(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage quota or private mode errors
    }
}

function sanitizeReward(raw: any, now: number): SpinReward | null {
    if (!raw || typeof raw !== "object") return null;
    const percent = Number(raw.percent);
    const maxBonusAmount = Number(raw.maxBonusAmount);
    const expiresAt = Number(raw.expiresAt);
    const wonAt = Number(raw.wonAt);
    const referencePrice = Number(raw.referencePrice);

    if (!Number.isFinite(percent) || percent <= 0 || percent > MAX_SPIN_BONUS_PERCENT) return null;
    if (!Number.isFinite(maxBonusAmount) || maxBonusAmount <= 0) return null;
    if (!Number.isFinite(expiresAt) || expiresAt <= now) return null;

    return {
        id: String(raw.id || `spin_${wonAt || now}`),
        percent,
        maxBonusAmount: Math.floor(maxBonusAmount),
        mode: raw.mode === "product" ? "product" : "storewide",
        productId: raw.productId ? String(raw.productId) : undefined,
        productTitle: raw.productTitle ? String(raw.productTitle) : undefined,
        referencePrice: Number.isFinite(referencePrice) && referencePrice > 0 ? referencePrice : 0,
        wonAt: Number.isFinite(wonAt) ? wonAt : now,
        expiresAt,
    };
}

export function SpinWheelProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetProduct, setTargetProduct] = useState<SpinProduct | null>(null);
    const [globalReward, setGlobalReward] = useState<SpinReward | null>(null);
    const [productRewards, setProductRewards] = useState<Record<string, SpinReward>>({});
    const [spinsRemaining, setSpinsRemaining] = useState<number>(MAX_SPINS_PER_CYCLE);
    const [quotaResetAt, setQuotaResetAt] = useState<number>(0);
    const [catalogProducts, setCatalogProducts] = useState<SpinProduct[]>([]);
    const hasFetchedCatalogRef = useRef(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const now = Date.now();
        setIsMounted(true);

        const storedGlobal = sanitizeReward(safeReadStorage(STORAGE_KEYS.GLOBAL_REWARD), now);
        if (storedGlobal) {
            setGlobalReward(storedGlobal);
        } else if (typeof window !== "undefined") {
            try {
                window.localStorage.removeItem(STORAGE_KEYS.GLOBAL_REWARD);
            } catch {}
        }

        const rawProdMap = safeReadStorage<Record<string, any>>(STORAGE_KEYS.PRODUCT_REWARDS);
        if (rawProdMap && typeof rawProdMap === "object") {
            const cleanMap: Record<string, SpinReward> = {};
            for (const [k, v] of Object.entries(rawProdMap)) {
                const valid = sanitizeReward(v, now);
                if (valid) cleanMap[k] = valid;
            }
            setProductRewards(cleanMap);
            safeWriteStorage(STORAGE_KEYS.PRODUCT_REWARDS, cleanMap);
        }

        const storedQuota = safeReadStorage<{ remaining?: number; resetAt?: number }>(STORAGE_KEYS.QUOTA);
        if (
            storedQuota &&
            typeof storedQuota.resetAt === "number" &&
            storedQuota.resetAt > now &&
            typeof storedQuota.remaining === "number"
        ) {
            setSpinsRemaining(Math.max(0, Math.min(MAX_SPINS_PER_CYCLE, Math.floor(storedQuota.remaining))));
            setQuotaResetAt(storedQuota.resetAt);
        } else {
            const nextReset = now + SPIN_REWARD_TTL_MS;
            setSpinsRemaining(MAX_SPINS_PER_CYCLE);
            setQuotaResetAt(nextReset);
            safeWriteStorage(STORAGE_KEYS.QUOTA, {
                remaining: MAX_SPINS_PER_CYCLE,
                resetAt: nextReset,
            });
        }
    }, []);

    // Lazy fetch published products when wheel opens if catalog wasn't seeded by page props
    const ensureCatalogProducts = useCallback(async () => {
        if (hasFetchedCatalogRef.current || catalogProducts.length > 0) return;
        hasFetchedCatalogRef.current = true;
        try {
            const res = await fetch(
                "/api/products?where[status][equals]=published&where[visibility][equals]=visible&limit=12&depth=1"
            );
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data?.docs) && data.docs.length > 0) {
                setCatalogProducts((prev) => {
                    const existingIds = new Set(prev.map((p) => String(p.id)));
                    const incoming = data.docs.filter(
                        (p: SpinProduct) => !existingIds.has(String(p.id)) && getProductPricing(p).activePrice > 0
                    );
                    return incoming.length > 0 ? [...prev, ...incoming] : prev;
                });
            }
        } catch {
            // Silently fall back to default reference price
        }
    }, [catalogProducts.length]);

    const registerCatalogProducts = useCallback((products: SpinProduct[]) => {
        if (!Array.isArray(products) || products.length === 0) return;
        setCatalogProducts((prev) => {
            const existingIds = new Set(prev.map((p) => String(p.id)));
            const validIncoming = products.filter(
                (p) => p && p.id && !existingIds.has(String(p.id)) && getProductPricing(p).activePrice > 0
            );
            if (validIncoming.length === 0) return prev;
            return [...prev, ...validIncoming].slice(0, 20);
        });
    }, []);

    const markPopupSeen = useCallback(() => {
        safeWriteStorage(STORAGE_KEYS.POPUP_SEEN, { seenAt: Date.now() });
    }, []);

    const openWheel = useCallback(
        (product: SpinProduct | null = null) => {
            setTargetProduct(product);
            setIsModalOpen(true);
            markPopupSeen();
            void ensureCatalogProducts();
        },
        [ensureCatalogProducts, markPopupSeen]
    );

    const closeWheel = useCallback(() => {
        setIsModalOpen(false);
        markPopupSeen();
    }, [markPopupSeen]);

    // Auto-open once per 24h on Homepage for new/unrewarded visitors
    useEffect(() => {
        if (!isMounted) return;
        if (pathname !== "/") return;
        if (globalReward || spinsRemaining <= 0) return;

        const seen = safeReadStorage<{ seenAt?: number }>(STORAGE_KEYS.POPUP_SEEN);
        const now = Date.now();
        if (seen && typeof seen.seenAt === "number" && now - seen.seenAt < SPIN_REWARD_TTL_MS) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTargetProduct(null);
            setIsModalOpen(true);
            markPopupSeen();
            void ensureCatalogProducts();
        }, 2400);

        return () => window.clearTimeout(timer);
    }, [isMounted, pathname, globalReward, spinsRemaining, markPopupSeen, ensureCatalogProducts]);

    const referencePrice = useMemo(() => computeReferencePrice(catalogProducts), [catalogProducts]);

    const recordSpinWin = useCallback(
        (slice: SpinSlice, target: SpinProduct | null = null): SpinWinOutcome | null => {
            const now = Date.now();

            // Check quota freshness
            let currentSpins = spinsRemaining;
            let currentReset = quotaResetAt;
            if (!currentReset || currentReset <= now) {
                currentSpins = MAX_SPINS_PER_CYCLE;
                currentReset = now + SPIN_REWARD_TTL_MS;
            }
            if (currentSpins <= 0) return null;

            const nextSpins = Math.max(0, currentSpins - 1);
            setSpinsRemaining(nextSpins);
            setQuotaResetAt(currentReset);
            safeWriteStorage(STORAGE_KEYS.QUOTA, {
                remaining: nextSpins,
                resetAt: currentReset,
            });

            const targetPrice = target ? getProductPricing(target).activePrice : referencePrice;
            const cappedPercent = Math.min(MAX_SPIN_BONUS_PERCENT, Math.max(0.5, slice.percent));
            const maxAllowed = Math.floor(targetPrice * (MAX_SPIN_BONUS_PERCENT / 100));
            const safeAmount = Math.max(1, Math.min(slice.amount, maxAllowed));

            const newReward: SpinReward = {
                id: `spin_${now}_${Math.random().toString(36).slice(2, 7)}`,
                percent: cappedPercent,
                maxBonusAmount: safeAmount,
                mode: target ? "product" : "storewide",
                productId: target ? String(target.id) : undefined,
                productTitle: target ? target.title : undefined,
                referencePrice: targetPrice,
                wonAt: now,
                expiresAt: now + SPIN_REWARD_TTL_MS,
            };

            if (target) {
                const key = String(target.id);
                const existing = sanitizeReward(productRewards[key], now);
                const keptHigher = Boolean(
                    existing && existing.maxBonusAmount >= newReward.maxBonusAmount && existing.percent >= newReward.percent
                );
                const winner = keptHigher && existing ? existing : newReward;

                const nextMap = { ...productRewards, [key]: winner };
                setProductRewards(nextMap);
                safeWriteStorage(STORAGE_KEYS.PRODUCT_REWARDS, nextMap);

                return {
                    reward: newReward,
                    keptHigherExisting: keptHigher,
                    activeReward: winner,
                };
            } else {
                const existing = sanitizeReward(globalReward, now);
                const keptHigher = Boolean(
                    existing && existing.maxBonusAmount >= newReward.maxBonusAmount && existing.percent >= newReward.percent
                );
                const winner = keptHigher && existing ? existing : newReward;

                setGlobalReward(winner);
                safeWriteStorage(STORAGE_KEYS.GLOBAL_REWARD, winner);

                return {
                    reward: newReward,
                    keptHigherExisting: keptHigher,
                    activeReward: winner,
                };
            }
        },
        [spinsRemaining, quotaResetAt, referencePrice, productRewards, globalReward]
    );

    const consumeAppliedRewards = useCallback(
        (productIds: (string | number)[]) => {
            if (globalReward) {
                setGlobalReward(null);
                if (typeof window !== "undefined") {
                    try {
                        window.localStorage.removeItem(STORAGE_KEYS.GLOBAL_REWARD);
                    } catch {}
                }
            }

            if (productIds.length > 0 && Object.keys(productRewards).length > 0) {
                const idsSet = new Set(productIds.map((id) => String(id)));
                const nextMap: Record<string, SpinReward> = {};
                let changed = false;
                for (const [k, v] of Object.entries(productRewards)) {
                    if (idsSet.has(k)) {
                        changed = true;
                    } else {
                        nextMap[k] = v;
                    }
                }
                if (changed) {
                    setProductRewards(nextMap);
                    safeWriteStorage(STORAGE_KEYS.PRODUCT_REWARDS, nextMap);
                }
            }
        },
        [globalReward, productRewards]
    );

    const getProductSpinDiscount = useCallback(
        (productId: string | number, unitPrice: number): ProductSpinDiscount => {
            const prodReward = productRewards[String(productId)] || null;
            return calculateSpinDiscount(unitPrice, globalReward, prodReward);
        },
        [globalReward, productRewards]
    );

    const hasAnyActiveReward = useMemo(() => {
        if (!isMounted) return false;
        const now = Date.now();
        if (globalReward && globalReward.expiresAt > now) return true;
        return Object.values(productRewards).some((r) => r.expiresAt > now);
    }, [isMounted, globalReward, productRewards]);

    const earliestRewardExpiry = useMemo(() => {
        if (!isMounted) return null;
        const now = Date.now();
        const expiries: number[] = [];
        if (globalReward && globalReward.expiresAt > now) expiries.push(globalReward.expiresAt);
        for (const r of Object.values(productRewards)) {
            if (r.expiresAt > now) expiries.push(r.expiresAt);
        }
        return expiries.length > 0 ? Math.min(...expiries) : null;
    }, [isMounted, globalReward, productRewards]);

    return (
        <SpinWheelContext.Provider
            value={{
                isMounted,
                isModalOpen,
                targetProduct,
                setTargetProduct,
                openWheel,
                closeWheel,
                globalReward,
                productRewards,
                spinsRemaining,
                quotaResetAt,
                catalogProducts,
                referencePrice,
                registerCatalogProducts,
                recordSpinWin,
                consumeAppliedRewards,
                getProductSpinDiscount,
                hasAnyActiveReward,
                earliestRewardExpiry,
            }}
        >
            {children}
        </SpinWheelContext.Provider>
    );
}

export function useSpinWheel() {
    const context = useContext(SpinWheelContext);
    if (!context) {
        throw new Error("useSpinWheel must be used within a SpinWheelProvider");
    }
    return context;
}

export function useOptionalSpinWheel() {
    return useContext(SpinWheelContext) ?? null;
}

