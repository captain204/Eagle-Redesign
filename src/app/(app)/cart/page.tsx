"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { useOptionalSpinWheel } from "@/providers/SpinWheelProvider";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, originalCartTotal, spinDiscountTotal, getItemPricing } = useCart();
    const spinWheel = useOptionalSpinWheel();

    const subtotal = cartTotal;
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
                    <Button className="font-bold px-8 py-6 rounded-full text-lg shadow-lg">
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
                        {cartItems.map((item) => {
                            const imageUrl = (typeof item.mainImage === 'object' && item.mainImage !== null) ? item.mainImage.url : (item.mainImage || '/images/placeholder.jpg');
                            const itemPricing = getItemPricing(item);

                            return (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <img src={imageUrl} alt={item.title} className="w-full h-full object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 md:line-clamp-1">{item.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="font-bold text-primary">₦{itemPricing.finalUnitPrice.toLocaleString()}</div>
                                            {itemPricing.hasReward && (
                                                <div className="text-xs text-gray-400 line-through">₦{item.price.toLocaleString()}</div>
                                            )}
                                        </div>
                                        {itemPricing.hasReward && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full mt-1">
                                                <Sparkles className="w-3 h-3" /> Spin Bonus -₦{itemPricing.discountPerUnit.toLocaleString()}/unit ({itemPricing.effectivePercent}%)
                                            </span>
                                        )}
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
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₦{originalCartTotal.toLocaleString()}</span>
                            </div>
                            {spinDiscountTotal > 0 && (
                                <div className="flex justify-between text-green-700 font-bold">
                                    <span className="flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> Spin Wheel Bonus
                                    </span>
                                    <span>-₦{spinDiscountTotal.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-primary bg-primary/10 p-2 rounded">
                                    In Stock
                                </p>
                            )}
                            {spinDiscountTotal === 0 && spinWheel && spinWheel.spinsRemaining > 0 && (
                                <button
                                    type="button"
                                    onClick={() => spinWheel.openWheel(null)}
                                    className="w-full text-left text-xs font-bold text-orange-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2.5 flex items-center justify-between transition-colors"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-orange-600" />
                                        Spin Wheel for up to 5% OFF!
                                    </span>
                                    <span className="underline">Spin Now</span>
                                </button>
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
