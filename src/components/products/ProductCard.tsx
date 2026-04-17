import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { useCart } from "@/providers/CartProvider";

interface Product {
    id: string | number;
    title: string;
    price: number;
    salePrice?: number;
    mainImage?: any;
    productTags?: any[];
    variations?: any[];
}

export function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    // Determine image URL from Payload Media relationship
    const imageUrl = typeof product.mainImage === 'object'
        ? product.mainImage.url
        : product.mainImage || '/images/placeholder.jpg';

    // Get first tag if available
    const tag = product.productTags && product.productTags.length > 0
        ? (typeof product.productTags[0] === 'object' ? product.productTags[0].name : null)
        : null;

    const variationPrice = ((product.variations ?? []).length > 0) ? product.variations![0].price : 0;
    const variationSalePrice = ((product.variations ?? []).length > 0) ? product.variations![0].salePrice : 0;

    // Safely extract active pricing
    const finalSalePrice = product.salePrice || variationSalePrice || 0;
    const finalPrice = product.price || variationPrice || 0;
    const hasDiscount = !!(finalSalePrice && finalPrice && finalSalePrice < finalPrice);

    // Displayed active price (if has sale price, use it, else generic price)
    const activePrice = finalSalePrice || finalPrice || 0;

    const discount = hasDiscount
        ? Math.round(((finalPrice - finalSalePrice) / finalPrice) * 100)
        : 0;

    return (
        <div className="relative group h-full">
            <Link href={`/product/${product.id}`} className="block h-full">
                <motion.div
                    className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 relative h-full flex flex-col border border-transparent hover:border-gray-100"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                >
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                            -{discount}%
                        </span>
                    )}

                    {/* Tag Badge */}
                    {tag && (
                        <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10 uppercase tracking-widest shadow-sm">
                            {tag}
                        </span>
                    )}

                    <div className="w-full h-[150px] md:h-[220px] bg-white rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors">
                        <Image
                            src={imageUrl}
                            alt={product.title}
                            width={500}
                            height={500}
                            unoptimized
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
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
                        {product.title}
                    </h3>

                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg text-primary">
                                ₦{activePrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                    ₦{finalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        <Button
                            size="icon"
                            className="h-9 w-9 rounded-full bg-black text-white hover:bg-primary hover:text-black transition-all duration-300 shadow-lg z-20"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({
                                    id: product.id,
                                    title: product.title,
                                    price: activePrice,
                                    mainImage: product.mainImage
                                });
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
