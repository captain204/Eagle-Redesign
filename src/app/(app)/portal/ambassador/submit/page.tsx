"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AmbassadorLayout from "@/components/portal/AmbassadorLayout";

interface Product {
    id: string;
    title: string;
    sku?: string;
}

interface Distributor {
    id: string;
    businessName: string;
}

export default function SubmitProductListPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [selectedDistributor, setSelectedDistributor] = useState("");
    const [items, setItems] = useState([{ product: "", quantity: 1, expectedPrice: "", note: "" }]);

    useEffect(() => {
        // Fetch products and approved distributors
        const fetchData = async () => {
            try {
                const [prodRes, distRes] = await Promise.all([
                    fetch("/api/products?limit=100"),
                    fetch("/api/distributors?where[status][equals]=approved")
                ]);
                const prodData = await prodRes.json();
                const distData = await distRes.json();
                setProducts(prodData.docs);
                setDistributors(distData.docs);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    const addItem = () => {
        setItems([...items, { product: "", quantity: 1, expectedPrice: "", note: "" }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDistributor) {
            alert("Please select a distributor");
            return;
        }

        setIsLoading(true);
        try {
            // In a real scenario, we'd get the ambassador ID from the session
            // For now, we'll assume a dummy ID or that the API handles user context
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    distributor: selectedDistributor === "not-found" ? null : selectedDistributor,
                    items: items.map(item => ({
                        ...item,
                        quantity: Number(item.quantity),
                        expectedPrice: item.expectedPrice ? Number(item.expectedPrice) : undefined,
                        availabilityStatus: "pending",
                        paymentStatus: "unpaid",
                    })),
                    status: "submitted",
                }),
            });

            if (!response.ok) throw new Error("Failed to submit list");

            router.push("/portal/ambassador/history?message=Submission successful!");
        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AmbassadorLayout>
            <div className="max-w-4xl mx-auto bg-white p-4 md:p-8 rounded-xl shadow-lg border">
                <h1 className="text-2xl font-bold mb-6 text-primary">Submit Product Availability Request</h1>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    {/* Distributor Selection */}
                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg border">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Distributor</label>
                        <select
                            value={selectedDistributor}
                            onChange={(e) => setSelectedDistributor(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white text-sm md:text-base"
                            required
                        >
                            <option value="">-- Choose a Distributor --</option>
                            {distributors.map(d => (
                                <option key={d.id} value={d.id}>{d.businessName}</option>
                            ))}
                            <option value="not-found">Not Available (Distributor not found)</option>
                        </select>
                    </div>

                    {/* Product Items */}
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Products</h2>
                            <Button type="button" onClick={addItem} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white w-full sm:w-auto">
                                + Add Product
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-[#fafafa] relative">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Product</label>
                                    <select
                                        value={item.product}
                                        onChange={(e) => updateItem(index, "product", e.target.value)}
                                        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
                                        required
                                    >
                                        <option value="">-- Select Product --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.title} {p.sku ? `(${p.sku})` : ""}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Quantity</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                        min="1"
                                        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Exp. Price</label>
                                        <input
                                            type="number"
                                            value={item.expectedPrice}
                                            onChange={(e) => updateItem(index, "expectedPrice", e.target.value)}
                                            placeholder="Optional"
                                            className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary outline-none text-sm"
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <div className="md:col-span-4 mt-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Note / Spec</label>
                                    <input
                                        type="text"
                                        value={item.note}
                                        onChange={(e) => updateItem(index, "note", e.target.value)}
                                        placeholder="Add any specific details or variations..."
                                        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-primary outline-none text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 md:py-6 font-bold text-lg bg-primary text-black hover:bg-black hover:text-white transition-all transform hover:scale-[1.01]"
                    >
                        {isLoading ? "Submitting List..." : "Submit Availability Request"}
                    </Button>
                </form>
            </div>
        </AmbassadorLayout>
    );
}
