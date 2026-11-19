"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { useOptionalSpinWheel } from "@/providers/SpinWheelProvider";

export function CartDrawer() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, originalCartTotal, spinDiscountTotal, cartCount, getItemPricing } = useCart();
    const spinWheel = useOptionalSpinWheel();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative hover:text-primary transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                    </span>
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea className="flex-1 -mx-6 px-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const imageUrl = (typeof item.mainImage === 'object' && item.mainImage !== null)
                                    ? item.mainImage.url
                                    : (item.mainImage || "/images/placeholder.jpg");

                                const itemPricing = getItemPricing(item);

                                return (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={imageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-primary font-bold">₦{itemPricing.finalUnitPrice.toLocaleString()}</p>
                                                {itemPricing.hasReward && (
                                                    <span className="text-xs text-gray-400 line-through">₦{item.price.toLocaleString()}</span>
                                                )}
                                            </div>
                                            {itemPricing.hasReward && (
                                                <span className="inline-block text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded mt-0.5">
                                                    Spin Bonus -₦{itemPricing.discountPerUnit.toLocaleString()}/item
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <div className="mt-auto pt-4 space-y-3">
                    <Separator />
                    {spinDiscountTotal > 0 ? (
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Items Total</span>
                                <span>₦{originalCartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-700 font-bold">
                                <span className="flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" /> Spin Bonus (≤5%)
                                </span>
                                <span>-₦{spinDiscountTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    ) : (
                        cartItems.length > 0 && spinWheel && spinWheel.spinsRemaining > 0 && (
                            <button
                                type="button"
                                onClick={() => spinWheel.openWheel(null)}
                                className="w-full text-left text-xs font-bold text-orange-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                                    Spin Lucky Wheel for up to 5% OFF!
                                </span>
                                <span className="underline">Spin</span>
                            </button>
                        )
                    )}
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Subtotal</span>
                        <span>₦{cartTotal.toLocaleString()}</span>
                    </div>
                    <Button className="w-full py-6 text-lg font-bold" asChild>
                        <Link href="/checkout">Checkout Now</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/cart">View Cart</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
