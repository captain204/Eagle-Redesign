"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/cart" className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Form Area */}
                    <div className="flex-1 p-6 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold">Checkout</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className={step >= 1 ? "text-primary font-bold" : ""}>Shipping</span>
                                <span>&gt;</span>
                                <span className={step >= 2 ? "text-primary font-bold" : ""}>Payment</span>
                                <span>&gt;</span>
                                <span className={step >= 3 ? "text-primary font-bold" : ""}>Confirm</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="font-bold text-lg mb-4">Contact Information</h2>
                                <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-colors" />

                                <h2 className="font-bold text-lg pt-4 mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                    <input type="text" placeholder="Last Name" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                    <input type="text" placeholder="State/Province" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />

                                <Button onClick={() => setStep(2)} className="w-full mt-6 bg-black text-white py-6 text-lg hover:bg-gray-800">
                                    Continue to Payment
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-sm">Contact</span>
                                        <span className="font-medium">user@example.com</span>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-primary text-sm font-bold">Change</button>
                                </div>
                                <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-sm">Ship to</span>
                                        <span className="font-medium">123 Lagos Street, Ikeja</span>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-primary text-sm font-bold">Change</button>
                                </div>

                                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                                        <input type="radio" name="payment" defaultChecked className="accent-primary w-5 h-5" />
                                        <span className="font-bold">Paystack (Cards, USSD, Bank Transfer)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                                        <input type="radio" name="payment" className="accent-primary w-5 h-5" />
                                        <span>Pay on Delivery (Lagos Only)</span>
                                    </label>
                                </div>
                                <Button onClick={() => setStep(3)} className="w-full mt-6 bg-primary text-black py-6 text-lg font-bold hover:bg-black hover:text-white shadow-lg">
                                    Pay Now ₦34,400
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-10 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                                <p className="text-gray-500 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
                                <Link href="/">
                                    <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary (Sidebar on desktop) */}
                    <div className="bg-gray-50 p-6 md:p-10 border-l border-gray-100 md:w-80 lg:w-96">
                        <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-4 mb-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-16 h-16 bg-white border rounded-md flex items-center justify-center relative">
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                                        <span className="text-2xl">🎧</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium line-clamp-2">FreePods 4 Active Noise Cancelling</p>
                                        <p className="text-sm text-gray-500">₦21,900</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">₦34,400</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium">Free</span>
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-primary">₦34,400</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
