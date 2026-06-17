"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const msg = searchParams.get("message");
        if (msg) setMessage(msg);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0]?.message || "Invalid email or password");
            }

            const userRole = data?.user?.role;
            
            // Redirect based on role
            if (userRole === "contributor") {
                router.push("/portal/ambassador/history");
            } else if (userRole === "sales-admin") {
                router.push("/portal/sales-admin");
            } else if (userRole === "admin" || userRole === "super-admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
            
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                
                {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium">{message}</div>}
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-center font-medium">{error}</div>}
                
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-primary" /> Remember me
                        </label>
                        <Link href="#" className="text-primary hover:underline">Forgot Password?</Link>
                    </div>
                    <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 font-bold text-lg bg-black text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
}
