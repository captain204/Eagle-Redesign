"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, Star } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";

interface Product {
    id: string | number;
    slug?: string;
    title: string;
    price: number;
    salePrice?: number;
    mainImage?: any;
    productTags?: any[];
    description?: any;
    variations?: any[];
    referralPercentage?: number;
}

export function QuickViewModal({ product, children }: { product: Product, children: React.ReactNode }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVarIdx, setSelectedVarIdx] = useState(0);
    const router = useRouter();
    const { addToCart } = useCart();

    const variation = (product.variations && product.variations.length > 0) ? product.variations[selectedVarIdx] : null;

    const imageUrl = (variation && variation.image && typeof variation.image === 'object' && variation.image !== null)
        ? variation.image.url
        : (typeof product.mainImage === 'object' && product.mainImage !== null)
            ? product.mainImage.url
            : product.mainImage || '/images/placeholder.jpg';

    const tag = product.productTags && product.productTags.length > 0
        ? (typeof product.productTags[0] === 'object' && product.productTags[0] !== null ? product.productTags[0].name : null)
        : null;

    const baseSalePrice = variation ? variation.salePrice : product.salePrice;
    const basePrice = variation ? variation.price : product.price;
    const refPercent = product.referralPercentage || 0;

    const finalSalePrice = baseSalePrice > 0 ? baseSalePrice + (baseSalePrice * (refPercent / 100)) : 0;
    const finalPrice = basePrice > 0 ? basePrice + (basePrice * (refPercent / 100)) : 0;
    
    const activePrice = finalSalePrice || finalPrice || 0;
    const hasDiscount = !!(finalSalePrice && finalPrice && finalSalePrice < finalPrice);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
                <DialogTitle className="sr-only">Quick View Product</DialogTitle>
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="bg-gray-100 p-8 flex items-center justify-center relative aspect-square md:aspect-auto">
                        <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            {tag && (
                                <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                                    {tag}
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold text-black">4.8</span>
                                <span className="text-gray-400 font-normal">(120)</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-gray-900">{product.title}</h2>
                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-3xl font-extrabold text-primary">
                                ₦{activePrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-gray-400 line-through mb-1">
                                    ₦{finalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {product.description ? (typeof product.description === 'string' ? product.description : 'Premium quality product designed for durability and performance.') : 'Experience premium quality with this latest product. Long-lasting design and ergonomic feel.'}
                        </p>

                        {product.variations && product.variations.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Select Option:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variations.map((v: any, idx: number) => (
                                        <button
                                            key={v.id || idx}
                                            onClick={() => setSelectedVarIdx(idx)}
                                            className={`px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${
                                                selectedVarIdx === idx 
                                                ? 'border-primary bg-primary text-black' 
                                                : 'border-gray-300 text-gray-700 hover:border-gray-500'
                                            }`}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                    onClick={() => {
                                        if (activePrice <= 0) {
                                            toast.error("This product's price is not configured correctly.");
                                            return;
                                        }
                                        addToCart({
                                            id: product.id,
                                            title: `${product.title} ${variation ? `(${variation.name})` : ''}`.trim(),
                                            price: activePrice,
                                            mainImage: variation?.image || product.mainImage,
                                            quantity: quantity
                                        });
                                        toast.success(`Added to cart: ${product.title} ${variation ? `(${variation.name})` : ''}`);
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                </Button>
                            </div>
                            <Button variant="link" className="w-full text-gray-500 hover:text-black" onClick={() => router.push(`/product/${product.slug || product.id}`)}>
                                View Full Details
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
