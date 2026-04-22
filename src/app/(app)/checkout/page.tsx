"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/providers/CartProvider";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { usePaystackPayment } from "react-paystack";
import { nigeriaData } from "@/lib/nigeriaData";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { cartItems, cartTotal, clearCart } = useCart();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [phone, setPhone] = useState("");

    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await fetch('/api/products?limit=6');
                const data = await res.json();
                if (data.docs) setRecommendedProducts(data.docs);
            } catch (e) { }
        };
        fetchRecs();
    }, []);

    const [reference] = useState(() => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!key || (!key.startsWith('pk_test_') && !key.startsWith('pk_live_'))) {
            console.error('Invalid Paystack public key');
            toast.error('Payment system misconfigured. Please contact support.');
        }
    }, []);

    const config = useMemo(() => ({
        reference,
        email,
        amount: Math.round(cartTotal * 100),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        metadata: {
            custom_fields: [
                { display_name: "Customer Name", variable_name: "customer_name", value: `${firstName} ${lastName}` },
            ],
        },
    }), [reference, email, cartTotal, firstName, lastName]);

    const onSuccess = useCallback(async (reference: any) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/paystack/verify?reference=${reference.reference}`);
            const data = await res.json();

            if (data.success || data.data?.status === 'success') {
                toast.success("Payment successful!");
                clearCart();
                setStep(3);
            } else {
                toast.error("Payment verification failed. Contact support.");
            }
        } catch (error) {
            console.error('Paystack verification error:', error);
            toast.error("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [clearCart]);

    const onClose = useCallback(() => {
        toast.info("Payment cancelled");
        setIsLoading(false);
    }, []);

    const initializePayment = usePaystackPayment(config);

    const handleCheckout = async () => {
        if (!email || !firstName || !lastName || !address || !city || !state || !phone) {
            toast.error("Please fill in all shipping details");
            setStep(1);
            return;
        }
        if (cartItems.length === 0 || cartTotal <= 0) {
            toast.error("Invalid cart. Please refresh and try again.");
            return;
        }

        setIsLoading(true);
        try {
            let customerId: string | undefined;
            try {
                const userRes = await fetch("/api/users/me");
                if (userRes.ok) {
                    const userData = await userRes.json();
                    customerId = userData?.user?.id;
                }
            } catch { }

            const orderData = {
                email,
                items: cartItems.map(item => ({ product: item.id, quantity: item.quantity, price: item.price })),
                total: cartTotal,
                status: 'pending',
                paymentStatus: 'unpaid',
                shippingAddress: {
                    name: `${firstName} ${lastName}`,
                    street: address,
                    lga: city,
                    state,
                    country: 'Nigeria',
                },
                ...(customerId && { customer: customerId }),
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok && data.doc) {
                const orderId = data.doc.id;

                const updatedConfig = {
                    ...config,
                    metadata: {
                        ...config.metadata,
                        orderId,
                        customer_phone: phone,
                    },
                };

                const initFn = usePaystackPayment(updatedConfig);
                initFn({ onSuccess, onClose });

                setTimeout(() => {
                    if (isLoading) {
                        toast.error("Payment window was blocked. Please allow popups for this site.");
                        setIsLoading(false);
                    }
                }, 3500);
            } else {
                toast.error(data.errors?.[0]?.message || "Failed to create order");
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error("Network error during checkout. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/cart" className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                    <div className="flex-1 p-6 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold">Checkout</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span className={step >= 1 ? "text-primary font-bold" : ""}>Shipping</span>
                                <span>&gt;</span>
                                <span className={step >= 2 ? "text-primary font-bold" : ""}>Payment</span>
                                <span>&gt;</span>
                                <span className={step >= 3 ? "text-primary font-bold" : ""}>Confirm</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="font-bold text-lg mb-4">Contact Information</h2>
                                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                <h2 className="font-bold text-lg pt-4 mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                </div>
                                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City / LGA" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                    <select value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none">
                                        <option value="" disabled>Select State</option>
                                        {Object.keys(nigeriaData).map((st) => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                </div>
                                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary outline-none" />
                                <Button onClick={() => {
                                    if (!email || !firstName || !lastName || !address || !city || !state || !phone) {
                                        toast.error("Please fill in all shipping details");
                                        return;
                                    }
                                    setStep(2);
                                }} className="w-full mt-6 bg-black text-white py-6 text-lg hover:bg-gray-800">
                                    Continue to Payment
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-50">
                                    <div className="flex flex-col"><span className="text-gray-500 text-sm">Contact</span><span className="font-medium">{email}</span></div>
                                    <button onClick={() => setStep(1)} className="text-primary text-sm font-bold">Change</button>
                                </div>
                                <div className="border p-4 rounded-lg flex items-center justify-between bg-gray-50">
                                    <div className="flex flex-col"><span className="text-gray-500 text-sm">Ship to</span><span className="font-medium">{address}, {city}, {state}</span></div>
                                    <button onClick={() => setStep(1)} className="text-primary text-sm font-bold">Change</button>
                                </div>
                                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                                        <input type="radio" name="payment" defaultChecked className="accent-primary w-5 h-5" />
                                        <span className="font-bold">Paystack (Cards, USSD, Bank Transfer)</span>
                                    </label>
                                </div>
                                <Button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0} className="w-full mt-6 bg-primary text-black py-6 text-lg font-bold hover:bg-black hover:text-white shadow-lg">
                                    {isLoading ? 'Opening Payment Window...' : `Pay Now ₦${cartTotal.toLocaleString()}`}
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-10 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                                <p className="text-gray-500 mb-8">Thank you for your purchase. You will receive an email confirmation shortly.</p>
                                <Link href="/">
                                    <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">Continue Shopping</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 md:p-10 border-l border-gray-100 md:w-80 lg:w-96">
                        <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => {
                                const imageUrl = typeof item.mainImage === 'object' ? item.mainImage?.url : item.mainImage || '/images/placeholder.jpg';
                                return (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-white border rounded-md flex items-center justify-center relative overflow-hidden">
                                            <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10">{item.quantity}</span>
                                            <img src={imageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                            <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">₦{cartTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium">Free</span></div>
                        </div>
                        <div className="border-t pt-4 mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-primary">₦{cartTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {recommendedProducts.length > 0 && (
                    <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <ProductCarousel title="You may also like" products={recommendedProducts} />
                    </div>
                )}
            </div>
        </div>
    );
}