"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, Star } from "lucide-react";
import React, { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    tag?: string;
    description?: string;
}

export function QuickViewModal({ product, children }: { product: Product, children: React.ReactNode }) {
    const [quantity, setQuantity] = useState(1);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-gray-100 p-8 flex items-center justify-center relative aspect-square md:aspect-auto">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    <div className="p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            {product.tag && (
                                <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                                    {product.tag}
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold text-black">4.8</span>
                                <span className="text-gray-400 font-normal">(120)</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h2>
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-3xl font-extrabold text-primary">₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through mb-1">₦{product.originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Experience premium sound quality with the latest audio technology. Long-lasting battery life, noise cancellation, and ergonomic design for all-day comfort.
                        </p>

                        <div className="mt-auto space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        className="px-3 py-2 hover:bg-gray-100 font-bold"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >-</button>
                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                    <button
                                        className="px-3 py-2 hover:bg-gray-100 font-bold"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >+</button>
                                </div>
                                <Button
                                    className="flex-1 h-11 text-base font-bold shadow-lg bg-black hover:bg-gray-900 text-white"
                                    onClick={() => toast.success("Added to cart: " + product.name)}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                </Button>
                            </div>
                            <Button variant="link" className="w-full text-gray-500 hover:text-black">
                                View Full Details
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
