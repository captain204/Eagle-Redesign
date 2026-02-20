"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "FreePods 4 Active Noise Cancelling Earbuds", price: 21900, image: "/images/1steagle/earbuds_blue.jpg", quantity: 1, color: "#1a1a1a" },
        { id: 2, name: "20000mAh Massive Power Bank", price: 12500, image: "/images/1steagle/powerbank_orange.jpg", quantity: 2, color: "black" }
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 20000 ? 0 : 1500;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
                <Link href="/">
                    <Button className="font-bold px-8 py-6 rounded-full text-lg">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 md:line-clamp-1">{item.name}</h3>
                                    <p className="text-gray-500 text-xs mb-2">Color: <span className="inline-block w-3 h-3 rounded-full align-middle ml-1 border border-gray-300" style={{ backgroundColor: item.color }}></span></p>
                                    <div className="font-bold text-primary">₦{item.price.toLocaleString()}</div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-2 hover:bg-gray-200"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-2 hover:bg-gray-200"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-primary bg-primary/10 p-2 rounded">
                                    In Stock
                                </p>
                            )}
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-4 mb-6">
                            <span>Total</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                        <Link href="/checkout">
                            <Button className="w-full bg-primary text-black font-bold py-6 hover:bg-black hover:text-white transition-all text-lg shadow-lg">
                                Checkout <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span> Secure Checkout via Paystack
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
