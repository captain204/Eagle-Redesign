"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { nigeriaData } from "@/lib/nigeriaData";

export default function AmbassadorRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        state: "",
        lga: "",
        area: "",
        address: "",
        password: "",
        confirmPassword: "",
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Creating user account...");
            const userResponse = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: "contributor",
                }),
            });

            const userData = await userResponse.json();

            if (!userResponse.ok) {
                console.error("User creation failed:", userData);
                throw new Error(userData.errors?.[0]?.message || "Failed to create user account");
            }

            const userId = userData.doc?.id || userData.id;
            if (!userId) throw new Error("User created but ID not returned");

            console.log("Creating ambassador profile for user:", userId);
            const ambassadorResponse = await fetch("/api/ambassadors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: userId,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    state: formData.state,
                    lga: formData.lga,
                    area: formData.area || "N/A",
                    address: formData.address,
                }),
            });

            const ambassadorData = await ambassadorResponse.json();

            if (!ambassadorResponse.ok) {
                console.error("Ambassador profile creation failed:", ambassadorData);
                throw new Error(ambassadorData.errors?.[0]?.message || "Failed to create ambassador profile");
            }

            console.log("Registration successful! Redirecting to login...");
            // Use window.location.href as a fallback if router.push is flaky
            router.push("/login?message=Registration successful! Please login.");
        } catch (error: any) {
            console.error("Registration Error:", error);
            alert(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex items-center justify-center px-4">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Ambassador Registration</h1>
                <p className="text-gray-600 mb-8 text-center italic">Join the 1st𝓔agle Ambassador Program</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address (Optional)</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 font-bold text-lg bg-primary text-black hover:bg-black hover:text-white transition-colors"
                    >
                        {isLoading ? "Registering..." : "Become an Ambassador"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}

