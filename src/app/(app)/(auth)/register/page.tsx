"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex items-center justify-center">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-primary outline-none" required />
                    </div>
                    <Button className="w-full py-6 font-bold text-lg bg-primary text-black hover:bg-black hover:text-white">
                        Register
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
