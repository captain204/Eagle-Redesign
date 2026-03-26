"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, Heart, Truck, ShieldCheck } from "lucide-react";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
    const defaultImage = typeof product.mainImage === 'object' ? product.mainImage.url : (product.mainImage || "/images/placeholder.jpg");
    const galleryImages = product.gallery ? product.gallery.map((g: any) => typeof g.image === 'object' ? g.image.url : g.image) : [];
    const allImages = [defaultImage, ...galleryImages].filter(Boolean);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Fallback for UI if variations/colors exist in schema
    const colors = ["#1a1a1a", "#ffffff", "#82E600"];
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    const router = useRouter();

    const price = product.salePrice || product.price || 0;
    const originalPrice = product.price || 0;

    const handleAddToCart = () => {
        toast.success(`Added ${quantity} ${product.title} to cart!`);
        // Optional logic to actually add to local cart context
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    Home / Products / {product.title}
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border">
                                <Image
                                    src={allImages[selectedImage]}
                                    alt={product.title}
                                    width={800}
                                    height={800}
                                    unoptimized
                                    className="w-full h-full object-contain p-4"
                                    priority
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} view ${i + 1}`}
                                            width={100}
                                            height={100}
                                            unoptimized
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 md:p-10 flex flex-col">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary-foreground/80 text-xs font-bold px-2 py-1 rounded">OFFICIAL STORE</span>
                                {originalPrice > price && (
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">HOT SALE</span>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{product.title}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current text-gray-300" />
                                </div>
                                <span className="text-sm text-gray-500">({product.reviews || Math.floor(Math.random() * 200)} Reviews)</span>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-extrabold text-primary">₦{price.toLocaleString()}</span>
                                    {originalPrice > price && (
                                        <span className="text-lg text-gray-400 line-through mb-1">₦{originalPrice.toLocaleString()}</span>
                                    )}
                                </div>
                                {originalPrice > price && (
                                    <p className="text-sm text-primary font-medium">You save ₦{(originalPrice - price).toLocaleString()}</p>
                                )}
                            </div>

                            {/* Quantity & Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-primary text-black font-bold text-lg h-auto py-3 hover:bg-black hover:text-white transition-all shadow-lg shadow-primary/20">
                                    Add to Cart
                                </Button>
                                <Button
                                    onClick={() => router.push('/checkout')}
                                    className="flex-1 bg-black text-white font-bold text-lg h-auto py-3 hover:bg-gray-800 transition-all shadow-lg">
                                    Buy Now
                                </Button>
                            </div>

                            {/* Features / Services */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="flex gap-3 items-center text-sm text-gray-600 p-3 bg-gray-50 rounded bg-opacity-50">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <span>Fast Delivery Available</span>
                                </div>
                                <div className="flex gap-3 items-center text-sm text-gray-600 p-3 bg-gray-50 rounded bg-opacity-50">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>Quality Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details & Specs */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-10">
                        <h3 className="text-xl font-bold mb-6 border-b pb-4">Product Description</h3>
                        <div className="prose max-w-none text-gray-600">
                            {product.shortDescription && <p className="mb-4 text-lg font-medium">{product.shortDescription}</p>}
                            {product.description && (
                                <div dangerouslySetInnerHTML={{ __html: product.description }} className="mt-4" />
                            )}
                            {!product.description && !product.shortDescription && (
                                <p>No detailed description available for this product.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Specs */}
                    <div className="bg-white rounded-xl shadow-sm p-6 max-h-fit">
                        <h3 className="text-xl font-bold mb-6 border-b pb-4">Specifications</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-500">SKU</span>
                                <span className="font-bold text-gray-900">{product.sku || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-500">Stock</span>
                                <span className="font-bold text-gray-900">{product.stockStatus === 'instock' ? 'In Stock' : 'Unavailable'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
                        <ProductCarousel title="" products={relatedProducts} />
                    </div>
                )}

            </div>
        </div>
    );
}
