export const MAX_SPIN_BONUS_PERCENT = 5;
export const DEFAULT_WHEEL_REFERENCE_PRICE = 30000;
export const SPIN_REWARD_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_SPINS_PER_CYCLE = 2;

export interface SpinTier {
    id: string;
    percent: number;
    weight: number;
    label: string;
    color: string;
    textColor: string;
    accent?: boolean;
}

export interface SpinSlice extends SpinTier {
    amount: number;
}

export interface SpinProduct {
    id: string | number;
    slug?: string;
    title: string;
    price: number;
    salePrice?: number;
    mainImage?: any;
    variations?: any[];
    referralPercentage?: number;
    productType?: string;
}

export interface SpinReward {
    id: string;
    percent: number;
    maxBonusAmount: number;
    mode: "storewide" | "product";
    productId?: string;
    productTitle?: string;
    referencePrice: number;
    wonAt: number;
    expiresAt: number;
}

export interface ProductSpinDiscount {
    discountPerUnit: number;
    finalUnitPrice: number;
    effectivePercent: number;
    maxAllowedFivePercent: number;
    hasReward: boolean;
    rewardSource: "product" | "storewide" | null;
}

export interface ProductPricing {
    basePrice: number;
    baseSalePrice: number;
    finalPrice: number;
    finalSalePrice: number;
    activePrice: number;
    hasDiscount: boolean;
    discountPercent: number;
    imageUrl: string;
    variation: any | null;
}

// 8 alternating slices strictly capped between 1% and 5% (average ~2.36%)
export const SPIN_TIERS: SpinTier[] = [
    {
        id: "tier-5",
        percent: 5,
        weight: 5,
        label: "5% MAX",
        color: "#FBBF24",
        textColor: "#111827",
        accent: true,
    },
    {
        id: "tier-1-5",
        percent: 1.5,
        weight: 18,
        label: "1.5% OFF",
        color: "#DC2626",
        textColor: "#FFFFFF",
    },
    {
        id: "tier-3-5",
        percent: 3.5,
        weight: 9,
        label: "3.5% OFF",
        color: "#EA580C",
        textColor: "#FFFFFF",
    },
    {
        id: "tier-1",
        percent: 1,
        weight: 15,
        label: "1% OFF",
        color: "#18181B",
        textColor: "#FCD34D",
    },
    {
        id: "tier-4",
        percent: 4,
        weight: 7,
        label: "4% OFF",
        color: "#E11D48",
        textColor: "#FFFFFF",
    },
    {
        id: "tier-2",
        percent: 2,
        weight: 22,
        label: "2% OFF",
        color: "#F97316",
        textColor: "#FFFFFF",
    },
    {
        id: "tier-3",
        percent: 3,
        weight: 11,
        label: "3% OFF",
        color: "#059669",
        textColor: "#FFFFFF",
    },
    {
        id: "tier-2-5",
        percent: 2.5,
        weight: 13,
        label: "2.5% OFF",
        color: "#B45309",
        textColor: "#FFFFFF",
    },
];

export function formatNaira(amount: number): string {
    const safe = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
    return `₦${safe.toLocaleString()}`;
}

export function getProductPricing(product: SpinProduct, selectedVarIdx = 0): ProductPricing {
    const variations = Array.isArray(product?.variations) ? product.variations : [];
    const hasVariations = variations.length > 0;
    const safeIdx = selectedVarIdx >= 0 && selectedVarIdx < variations.length ? selectedVarIdx : 0;
    const variation = hasVariations ? variations[safeIdx] : null;
    const hasActiveVariation = Boolean(
        variation && (Number(variation.price) > 0 || Number(variation.salePrice) > 0)
    );

    const rawSale = hasActiveVariation ? variation.salePrice : (product?.salePrice || 0);
    const rawPrice = hasActiveVariation ? variation.price : (product?.price || 0);

    const baseSalePrice = Number(rawSale) || 0;
    const basePrice = Number(rawPrice) || 0;
    const refPercent = Number(product?.referralPercentage) || 0;

    const finalSalePrice = baseSalePrice > 0 ? baseSalePrice + baseSalePrice * (refPercent / 100) : 0;
    const finalPrice = basePrice > 0 ? basePrice + basePrice * (refPercent / 100) : 0;
    const activePrice = finalSalePrice || finalPrice || 0;

    const hasDiscount = !!(finalSalePrice && finalPrice && finalSalePrice < finalPrice);
    const discountPercent = hasDiscount
        ? Math.round(((finalPrice - finalSalePrice) / finalPrice) * 100)
        : 0;

    const variationImg =
        variation?.image && typeof variation.image === "object" && variation.image !== null
            ? variation.image.url
            : typeof variation?.image === "string"
              ? variation.image
              : null;

    const mainImg =
        typeof product?.mainImage === "object" && product.mainImage !== null
            ? product.mainImage.url
            : product?.mainImage || null;

    const imageUrl = variationImg || mainImg || "/images/placeholder.jpg";

    return {
        basePrice,
        baseSalePrice,
        finalPrice,
        finalSalePrice,
        activePrice,
        hasDiscount,
        discountPercent,
        imageUrl,
        variation,
    };
}

export function computeReferencePrice(products: SpinProduct[]): number {
    const prices = products
        .map((p) => getProductPricing(p).activePrice)
        .filter((p) => Number.isFinite(p) && p >= 1000)
        .sort((a, b) => a - b);

    if (prices.length === 0) {
        return DEFAULT_WHEEL_REFERENCE_PRICE;
    }

    const mid = Math.floor(prices.length / 2);
    return prices.length % 2 === 0
        ? Math.round((prices[mid - 1] + prices[mid]) / 2)
        : Math.round(prices[mid]);
}

export function buildWheelSlices(referencePrice: number): SpinSlice[] {
    const effectivePrice =
        Number.isFinite(referencePrice) && referencePrice >= 100
            ? referencePrice
            : DEFAULT_WHEEL_REFERENCE_PRICE;

    const maxFivePercent = Math.floor(effectivePrice * (MAX_SPIN_BONUS_PERCENT / 100));

    return SPIN_TIERS.map((tier) => {
        const cappedPercent = Math.min(MAX_SPIN_BONUS_PERCENT, Math.max(0, tier.percent));
        const rawAmount = Math.floor((effectivePrice * cappedPercent) / 100);
        const amount = Math.min(rawAmount, maxFivePercent);
        return {
            ...tier,
            percent: cappedPercent,
            amount,
        };
    });
}

export function pickWeightedSliceIndex(slices: SpinSlice[]): number {
    const totalWeight = slices.reduce((sum, s) => sum + Math.max(0, s.weight), 0);
    if (totalWeight <= 0) return 0;

    let randomFraction = Math.random();
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
        const buf = new Uint32Array(1);
        window.crypto.getRandomValues(buf);
        randomFraction = buf[0] / (0xffffffff + 1);
    }

    let threshold = randomFraction * totalWeight;
    for (let i = 0; i < slices.length; i++) {
        threshold -= Math.max(0, slices[i].weight);
        if (threshold <= 0) return i;
    }
    return slices.length - 1;
}

function isValidReward(reward: SpinReward | null | undefined, now: number): reward is SpinReward {
    if (!reward) return false;
    if (!Number.isFinite(reward.percent) || reward.percent <= 0) return false;
    if (!Number.isFinite(reward.maxBonusAmount) || reward.maxBonusAmount <= 0) return false;
    if (!Number.isFinite(reward.expiresAt) || reward.expiresAt <= now) return false;
    return true;
}

function computeRewardAmountForUnitPrice(unitPrice: number, reward: SpinReward): number {
    const cappedPercent = Math.min(MAX_SPIN_BONUS_PERCENT, Math.max(0, reward.percent));
    const fivePercentCeiling = Math.floor(unitPrice * (MAX_SPIN_BONUS_PERCENT / 100));
    const percentBasedAmount = Math.floor((unitPrice * cappedPercent) / 100);
    return Math.max(0, Math.min(percentBasedAmount, Math.floor(reward.maxBonusAmount), fivePercentCeiling));
}

export function calculateSpinDiscount(
    unitPrice: number,
    globalReward: SpinReward | null,
    productReward?: SpinReward | null,
    now = Date.now()
): ProductSpinDiscount {
    const safePrice = Number.isFinite(unitPrice) && unitPrice > 0 ? unitPrice : 0;
    const maxAllowedFivePercent = Math.floor(safePrice * (MAX_SPIN_BONUS_PERCENT / 100));

    if (safePrice <= 0 || maxAllowedFivePercent <= 0) {
        return {
            discountPerUnit: 0,
            finalUnitPrice: safePrice,
            effectivePercent: 0,
            maxAllowedFivePercent: 0,
            hasReward: false,
            rewardSource: null,
        };
    }

    const globalBonus = isValidReward(globalReward, now)
        ? computeRewardAmountForUnitPrice(safePrice, globalReward)
        : 0;

    const productBonus = isValidReward(productReward, now)
        ? computeRewardAmountForUnitPrice(safePrice, productReward)
        : 0;

    let discountPerUnit = 0;
    let rewardSource: "product" | "storewide" | null = null;

    if (productBonus > 0 && productBonus >= globalBonus) {
        discountPerUnit = productBonus;
        rewardSource = "product";
    } else if (globalBonus > 0) {
        discountPerUnit = globalBonus;
        rewardSource = "storewide";
    }

    // Hard final cap at 5% of unitPrice
    discountPerUnit = Math.max(0, Math.min(discountPerUnit, maxAllowedFivePercent));
    const finalUnitPrice = Math.max(0, safePrice - discountPerUnit);
    const effectivePercent = safePrice > 0 ? Math.round((discountPerUnit / safePrice) * 1000) / 10 : 0;

    return {
        discountPerUnit,
        finalUnitPrice,
        effectivePercent,
        maxAllowedFivePercent,
        hasReward: discountPerUnit > 0,
        rewardSource,
    };
}
