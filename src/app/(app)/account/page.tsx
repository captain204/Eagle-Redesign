"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, User, MapPin, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState("orders");
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch current user
                const userRes = await fetch("/api/users/me");
                if (!userRes.ok) throw new Error("Not logged in");
                const userData = await userRes.json();
                
                if (!userData.user) {
                    router.push("/login?message=Please login to view your account.");
                    return;
                }
                
                setUser(userData.user);

                // Fetch orders for this user
                const ordersRes = await fetch(`/api/orders?where[customer][equals]=${userData.user.id}&sort=-createdAt`);
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData.docs || []);
                }
            } catch (error) {
                console.error("Failed to load account data:", error);
                router.push("/login?message=Please login to view your account.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/users/logout", { method: "POST" });
            router.push("/login?message=You have been logged out.");
            router.refresh();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-8 border-b pb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm">Hello,</p>
                                <p className="font-bold text-lg truncate">{user.name || user.email.split('@')[0]}</p>
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
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-8">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white p-6 md:p-10 rounded-lg shadow-sm">
                        {activeTab === "orders" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Order History</h2>
                                {orders.length === 0 ? (
                                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4 hover:shadow-sm transition-shadow">
                                                <div>
                                                    <p className="font-bold text-sm text-gray-400 mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="font-bold">
                                                        {order.items?.length > 0 ? (
                                                            `${order.items[0]?.product?.title || 'Unknown Product'} ${order.items.length > 1 ? `+ ${order.items.length - 1} more items` : ''}`
                                                        ) : (
                                                            'Empty Order'
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="font-bold mt-2">₦{order.total?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input type="text" defaultValue={user.name?.split(' ')[0] || ''} className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input type="text" defaultValue={user.name?.split(' ').slice(1).join(' ') || ''} className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input type="email" defaultValue={user.email || ''} className="w-full p-3 border rounded-lg outline-none focus:ring-1 focus:ring-primary bg-gray-50" disabled />
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                                    </div>
                                    <div className="md:col-span-2 mt-2">
                                        <Button type="submit" className="bg-black text-white hover:bg-gray-800 px-8">Save Changes</Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "address" && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Saved Addresses</h2>
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                                    <p className="text-gray-500 mb-4">You have not saved any addresses yet.</p>
                                    <Button className="bg-primary text-black hover:bg-black hover:text-white border border-primary font-bold">
                                        Add New Address
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
