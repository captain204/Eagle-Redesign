"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
    id: string | number;
    title: string;
    price: number;
    mainImage?: any;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem("cartState");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart from local storage", error);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cartState", JSON.stringify(cartItems));
        }
    }, [cartItems, isMounted]);

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success(`Added ${product.title} to cart`);
    };

    const removeFromCart = (id: string | number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string | number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // To prevent hydration errors, we can return null before mounting, but it might flicker. Better to just provide default empty cart until hydrated.
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
                    cartCount: 0,
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
                cartCount,
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
