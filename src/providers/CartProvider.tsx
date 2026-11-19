"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { toast } from "sonner";
import { useOptionalSpinWheel } from "@/providers/SpinWheelProvider";
import { calculateSpinDiscount, ProductSpinDiscount } from "@/lib/spinWheel";

export interface CartItem {
    id: string | number;
    title: string;
    price: number;
    mainImage?: any;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    originalCartTotal: number;
    spinDiscountTotal: number;
    cartCount: number;
    getItemPricing: (item: Pick<CartItem, "id" | "price">) => ProductSpinDiscount;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_PRICING = (price: number): ProductSpinDiscount =>
    calculateSpinDiscount(price, null, null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const spinWheel = useOptionalSpinWheel();

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedCart = localStorage.getItem("cartState");
            if (storedCart) {
                const parsed = JSON.parse(storedCart);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            }
        } catch (error) {
            console.error("Failed to parse cart from local storage", error);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem("cartState", JSON.stringify(cartItems));
            } catch (error) {
                console.error("Failed to persist cart to local storage", error);
            }
        }
    }, [cartItems, isMounted]);

    const addToCart = useCallback(
        (product: Omit<CartItem, "quantity"> & { quantity?: number }) => {
            const qty = product.quantity || 1;
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
                    return prev.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + qty, price: product.price }
                            : item
                    );
                }
                return [...prev, { ...product, quantity: qty }];
            });
            toast.success(`Added ${qty} ${product.title} to cart`);
        },
        []
    );

    const removeFromCart = useCallback((id: string | number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string | number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const getItemPricing = useCallback(
        (item: Pick<CartItem, "id" | "price">): ProductSpinDiscount => {
            if (!isMounted || !spinWheel) {
                return DEFAULT_PRICING(item.price);
            }
            return spinWheel.getProductSpinDiscount(item.id, item.price);
        },
        [isMounted, spinWheel]
    );

    const { originalCartTotal, spinDiscountTotal, cartTotal } = useMemo(() => {
        let original = 0;
        let discount = 0;
        let finalTotal = 0;

        for (const item of cartItems) {
            const pricing = getItemPricing(item);
            original += item.price * item.quantity;
            discount += pricing.discountPerUnit * item.quantity;
            finalTotal += pricing.finalUnitPrice * item.quantity;
        }

        return {
            originalCartTotal: original,
            spinDiscountTotal: discount,
            cartTotal: Math.max(0, finalTotal),
        };
    }, [cartItems, getItemPricing]);

    const cartCount = useMemo(
        () => cartItems.reduce((count, item) => count + item.quantity, 0),
        [cartItems]
    );

    if (!isMounted) {
        return (
            <CartContext.Provider
                value={{
                    cartItems: [],
                    addToCart,
                    removeFromCart,
                    updateQuantity,
                    clearCart,
                    cartTotal: 0,
                    originalCartTotal: 0,
                    spinDiscountTotal: 0,
                    cartCount: 0,
                    getItemPricing: (item) => DEFAULT_PRICING(item.price),
                }}
            >
                {children}
            </CartContext.Provider>
        );
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                originalCartTotal,
                spinDiscountTotal,
                cartCount,
                getItemPricing,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
