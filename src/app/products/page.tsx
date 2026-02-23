"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronDown } from "lucide-react";

// Mock Data
const PRODUCTS = [
    { id: 1, name: "FreePods 4 Active Noise Cancelling Earbuds", price: 21900, originalPrice: 35000, image: "/images/1steagle/earbuds_blue.jpg", tag: "Best Seller", category: "Audio" },
    { id: 2, name: "Watch 2 Pro Bluetooth Calling Smart Watch", price: 28500, originalPrice: 45000, image: "/images/1steagle/hero_1.jpg", tag: "New", category: "Wearables" },
    { id: 3, name: "20000mAh Massive Power Bank", price: 12500, originalPrice: 15000, image: "/images/1steagle/powerbank_orange.jpg", category: "Power" },
    { id: 4, name: "AniFast 20W Fast Charger Kit", price: 6500, image: "/images/1steagle/usb_red.jpg", category: "Accessories" },
    { id: 5, name: "Mobile Power (Black)", price: 18900, originalPrice: 24000, image: "/images/1steagle/uploaded_media_1_1771516262315.jpg", category: "Audio" },
    { id: 6, name: "Big Generator 60000mAh", price: 36000, image: "/images/1steagle/uploaded_media_2_1771516262315.jpg", category: "Personal Care" },
    { id: 7, name: "Power Bank 10000mAh", price: 15900, image: "/images/1steagle/uploaded_media_3_1771516262315.jpg", category: "Accessories" },
    { id: 8, name: "Mini Generator 50000mAh", price: 49500, originalPrice: 60000, image: "/images/1steagle/uploaded_media_4_1771516262315.jpg", category: "Audio" },
];

const CATEGORIES = ["All", "Audio", "Power", "Wearables", "Accessories", "Personal Care"];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(50000);

    const filteredProducts = PRODUCTS.filter(
        (product) =>
            (selectedCategory === "All" || product.category === selectedCategory) &&
            product.price <= priceRange
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold uppercase">All Products</h1>
                    <p className="text-gray-500 text-sm mt-2">Home / Products</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                        {/* Categories */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                                Categories <ChevronDown className="w-4 h-4" />
                            </h3>
                            <ul className="space-y-3">
                                {CATEGORIES.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`text-sm w-full text-left hover:text-primary transition-colors ${selectedCategory === cat ? "text-primary font-bold" : "text-gray-600"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-4">Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>₦0</span>
                                <span>₦{priceRange.toLocaleString()}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
                            <span className="text-gray-500 text-sm">
                                Showing {filteredProducts.length} results
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Sort by:</span>
                                <select className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer outline-none">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg">
                                <p className="text-gray-500">No products found in this range.</p>
                                <button
                                    onClick={() => { setSelectedCategory("All"); setPriceRange(100000) }}
                                    className="text-primary hover:underline mt-2 text-sm font-bold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
