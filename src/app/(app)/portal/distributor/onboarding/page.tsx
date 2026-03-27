"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { nigeriaData } from "@/lib/nigeriaData";

export default function DistributorRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        contactPerson: "",
        email: "",
        phone: "",
        state: "",
        lga: "",
        area: "",
        businessAddress: "",
        category: "",
        description: "",
    });

    const [availableLgas, setAvailableLgas] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "state") {
            setFormData(prev => ({ ...prev, lga: "" }));
            setAvailableLgas(value ? nigeriaData[value] : []);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/distributors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    status: "pending",
                }),
            });

            if (!response.ok) throw new Error("Failed to submit distributor application");

            router.push("/login?message=Application submitted! Admin will review and approve your account shortly.");
        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex items-center justify-center px-4">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Distributor Onboarding</h1>
                <p className="text-gray-600 mb-8 text-center italic">Register your business as a 1st𝓔agle Distributor</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <input
                                name="businessName"
                                type="text"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                            <input
                                name="contactPerson"
                                type="text"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                                required
                            >
                                <option value="">Select State</option>
                                {Object.keys(nigeriaData).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Local Government Area (LGA)</label>
                            <select
                                name="lga"
                                value={formData.lga}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white"
                                required
                                disabled={!formData.state}
                            >
                                <option value="">Select LGA</option>
                                {availableLgas.map(lga => (
                                    <option key={lga} value={lga}>{lga}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Ward</label>
                            <input
                                name="area"
                                type="text"
                                placeholder="Enter area or 'Other'"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Specify your area or type 'Other' if not listed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                            <input
                                name="category"
                                type="text"
                                placeholder="e.g. Electronics, Clothing..."
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                        <textarea
                            name="businessAddress"
                            value={formData.businessAddress}
                            onChange={handleChange}
                            rows={2}
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 font-bold text-lg bg-primary text-black hover:bg-black hover:text-white transition-colors"
                    >
                        {isLoading ? "Submitting Application..." : "Register as Distributor"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Looking for ambassador registration? <Link href="/portal/ambassador/register" className="text-primary font-bold hover:underline">Click here</Link>
                </div>
            </div>
        </div>
    );
}
