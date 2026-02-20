"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, Heart, Truck, ShieldCheck } from "lucide-react";
import { ProductCarousel } from "@/components/home/ProductCarousel";

// Mock Data for a single product (In a real app, fetch based on ID)
const PRODUCT = {
    id: 1,
    name: "FreePods 4 Active Noise Cancelling Earbuds",
    price: 21900,
    originalPrice: 35000,
    description: "Experience the ultimate freedom with FreePods 4. Featuring advanced Active Noise Cancellation, transparency mode, and rich, immersive sound. The ergonomic design ensures a comfortable fit for all-day listening.",
    rating: 4.8,
    reviews: 1245,
    images: [
        "/images/1steagle/earbuds_blue.jpg",
        "/images/1steagle/powerbank_orange.jpg",
        "/images/1steagle/uploaded_media_1_1771516262315.jpg",
        "/images/1steagle/uploaded_media_2_1771516262315.jpg"
    ],
    colors: ["#1a1a1a", "#ffffff", "#82E600"],
    specs: [
        { label: "Bluetooth Version", value: "V5.2" },
        { label: "Battery Life", value: "8.5 hours (ANC off)" },
        { label: "Waterproof", value: "IPX5" },
        { label: "Range", value: "10m" }
    ]
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);

    // Use params.id in a real app to fetch data
    console.log("Viewing product:", params.id);

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    Home / Audio / {PRODUCT.name}
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
                            <div className="aspect-square md:h-[500px] md:aspect-auto bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                                {/* Main Image */}
                                <img src={PRODUCT.images[selectedImage]} alt={PRODUCT.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {PRODUCT.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-md border-2 flex items-center justify-center bg-white ${selectedImage === i ? "border-primary" : "border-transparent hover:border-gray-200"
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 md:p-10 flex flex-col">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary-foreground/80 text-xs font-bold px-2 py-1 rounded">OFFICIAL STORE</span>
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">HOT SALE</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{PRODUCT.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current text-gray-300" />
                                </div>
                                <span className="text-sm text-gray-500">({PRODUCT.reviews} Reviews)</span>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-extrabold text-primary">₦{PRODUCT.price.toLocaleString()}</span>
                                    <span className="text-lg text-gray-400 line-through mb-1">₦{PRODUCT.originalPrice.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-primary font-medium">You save ₦{(PRODUCT.originalPrice - PRODUCT.price).toLocaleString()}</p>
                            </div>

                            {/* Color Selection */}
                            <div className="mb-6">
                                <span className="block text-sm font-bold text-gray-700 mb-3">Color</span>
                                <div className="flex gap-3">
                                    {PRODUCT.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 ring-2 ring-offset-2 transition-all ${selectedColor === color ? "ring-primary border-white" : "ring-transparent border-gray-200 hover:scale-110"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
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
                                <Button className="flex-1 bg-primary text-black font-bold text-lg h-auto py-3 hover:bg-black hover:text-white transition-all shadow-lg shadow-primary/20">
                                    Add to Cart
                                </Button>
                                <button className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Features / Services */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="flex gap-3 items-center text-sm text-gray-600 p-3 bg-gray-50 rounded bg-opacity-50">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <span>Free Shipping over ₦20,000</span>
                                </div>
                                <div className="flex gap-3 items-center text-sm text-gray-600 p-3 bg-gray-50 rounded bg-opacity-50">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>1 Year Warranty</span>
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
                            <p className="mb-4">{PRODUCT.description}</p>
                            <h4 className="font-bold text-black mt-6 mb-2">Key Features</h4>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Active Noise Cancellation up to 40dB</li>
                                <li>Transparency Mode to hear your surroundings</li>
                                <li>36-hour batter life with charging case</li>
                                <li>5-min charge for 100 mins playing</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Specs */}
                    <div className="bg-white rounded-xl shadow-sm p-6 max-h-fit">
                        <h3 className="text-xl font-bold mb-6 border-b pb-4">Specifications</h3>
                        <ul className="space-y-4">
                            {PRODUCT.specs.map((spec, i) => (
                                <li key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{spec.label}</span>
                                    <span className="font-bold text-gray-900">{spec.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
                    <ProductCarousel title="" />
                </div>

            </div>
        </div>
    );
}
