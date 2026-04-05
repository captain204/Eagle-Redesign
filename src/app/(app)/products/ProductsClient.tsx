"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronDown } from "lucide-react";

interface Category {
    id: string | number;
    title: string;
    slug: string;
}

export default function ProductsClient({ initialProducts, categories, pageTitle = "All Products" }: { initialProducts: any[], categories: Category[], pageTitle?: string }) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(100000); // Increased default range

    const filteredProducts = initialProducts.filter(
        (product) => {
            // Check if product belongs to selected category
            let matchesCategory = selectedCategory === "All";
            if (!matchesCategory && product.categories) {
                // If categories is an array of objects (depth: 1)
                matchesCategory = product.categories.some((c: any) => c.title === selectedCategory || c.slug === selectedCategory);
            }

            // Check price
            const productPrice = product.salePrice || product.price || 0;
            const matchesPrice = productPrice <= priceRange;

            return matchesCategory && matchesPrice;
        }
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold uppercase">{pageTitle}</h1>
                    <p className="text-gray-500 text-sm mt-2">Home / {pageTitle}</p>
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
                                <li>
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className={`text-sm w-full text-left hover:text-primary transition-colors ${selectedCategory === "All" ? "text-primary font-bold" : "text-gray-600"
                                            }`}
                                    >
                                        All
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`text-sm w-full text-left hover:text-primary transition-colors ${selectedCategory === cat.slug ? "text-primary font-bold" : "text-gray-600"
                                                }`}
                                        >
                                            {cat.title}
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
                                max="200000"
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
                                    onClick={() => { setSelectedCategory("All"); setPriceRange(200000) }}
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
