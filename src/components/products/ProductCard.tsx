import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { QuickViewModal } from "@/components/products/QuickViewModal";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    tag?: string;
}

export function ProductCard({ product }: { product: Product }) {
    // Calculate discount percentage
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="relative group h-full">
            <Link href={`/product/${product.id}`} className="block h-full">
                <motion.div
                    className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 relative h-full flex flex-col border border-transparent hover:border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                            -{discount}%
                        </span>
                    )}

                    {/* Tag Badge */}
                    {product.tag && (
                        <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10 uppercase tracking-widest shadow-sm">
                            {product.tag}
                        </span>
                    )}

                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Quick View Button (Desktop) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5 backdrop-blur-[1px]">
                            <div onClick={(e) => e.preventDefault()}>
                                <QuickViewModal product={product}>
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-white text-black hover:bg-black hover:text-white shadow-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> Quick View
                                    </Button>
                                </QuickViewModal>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg text-primary">₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                    ₦{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <Button
                            size="icon"
                            className="h-9 w-9 rounded-full bg-black text-white hover:bg-primary hover:text-black transition-all duration-300 shadow-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                toast.success("Added to cart: " + product.name);
                                // Add to cart logic here
                            }}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
