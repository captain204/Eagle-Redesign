"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

// Mock Cart Item Type
interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export function CartDrawer() {
    const [items, setItems] = useState<CartItem[]>([
        {
            id: 1,
            name: "Power Bank 10000mAh (E10 Plus)",
            price: 15900,
            image: "/images/1steagle/uploaded_media_3_1771516262315.jpg",
            quantity: 1,
        },
        {
            id: 2,
            name: "Mobile Power (Black)",
            price: 12500,
            image: "/images/1steagle/uploaded_media_1_1771516262315.jpg",
            quantity: 2,
        },
    ]);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const updateQuantity = (id: number, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter((item) => item.quantity > 0)
        );
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative hover:text-primary transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea className="flex-1 -mx-6 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                        <p className="text-primary font-bold mt-1">₦{item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-destructive hover:text-destructive" onClick={() => updateQuantity(item.id, -100)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="mt-auto pt-4 space-y-4">
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Subtotal</span>
                        <span>₦{total.toLocaleString()}</span>
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
