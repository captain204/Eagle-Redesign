"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const name = `${firstName} ${lastName}`.trim();
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name,
                    email, 
                    password,
                    role: "viewer"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0]?.message || "Failed to register. Please try again.");
            }

            // Redirect to login on success
            router.push("/login?message=" + encodeURIComponent("Registration successful. Please sign in."));
        } catch (err: any) {
            setError(err.message || "Failed to register. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
                
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center font-medium">{error}</div>}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                required 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                                required 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 font-bold text-lg bg-primary text-black hover:bg-black hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
