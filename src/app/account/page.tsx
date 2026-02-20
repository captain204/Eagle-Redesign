"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, User, MapPin, LogOut } from "lucide-react";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("orders");

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-8 border-b pb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Hello,</p>
                                <p className="font-bold text-lg">User Name</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-primary text-black font-bold" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Package className="w-4 h-4" /> Orders
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "profile" ? "bg-primary text-black font-bold" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <User className="w-4 h-4" /> Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab("address")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "address" ? "bg-primary text-black font-bold" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <MapPin className="w-4 h-4" /> Addresses
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-8">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white p-6 md:p-10 rounded-lg shadow-sm">
                        {activeTab === "orders" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Order History</h2>
                                <div className="space-y-4">
                                    {/* Mock Order */}
                                    <div className="border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-sm text-gray-400 mb-1">Order #123456</p>
                                            <p className="font-bold">FreePods 4 Active Noise Cancelling Earbuds</p>
                                            <p className="text-sm text-gray-500">Placed on Oct 12, 2023</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">DELIVERED</span>
                                            <p className="font-bold mt-2">₦21,900</p>
                                        </div>
                                    </div>
                                    {/* Mock Order 2 */}
                                    <div className="border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-sm text-gray-400 mb-1">Order #123455</p>
                                            <p className="font-bold">20000mAh Power Bank</p>
                                            <p className="text-sm text-gray-500">Placed on Sep 05, 2023</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">DELIVERED</span>
                                            <p className="font-bold mt-2">₦12,500</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" defaultValue="User" className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" defaultValue="Name" className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input type="email" defaultValue="user@example.com" className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary" disabled />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button className="bg-black text-white hover:bg-gray-800 px-8">Save Changes</Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "address" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Saved Addresses</h2>
                                <div className="border p-4 rounded-lg relative">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button className="text-primary text-sm font-bold hover:underline">Edit</button>
                                        <button className="text-red-500 text-sm font-bold hover:underline">Delete</button>
                                    </div>
                                    <p className="font-bold mb-1">User Name</p>
                                    <p className="text-gray-600 text-sm">123 Lagos Street, Ikeja</p>
                                    <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
                                    <p className="text-gray-600 text-sm mt-2">+234 800 000 0000</p>
                                </div>
                                <Button className="mt-6 bg-primary text-black hover:bg-black hover:text-white border border-primary font-bold">
                                    Add New Address
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
