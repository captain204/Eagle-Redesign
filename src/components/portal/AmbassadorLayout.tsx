"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    History,
    PlusCircle,
    LogOut,
    Menu,
    X,
    UserCircle
} from "lucide-react";

interface AmbassadorLayoutProps {
    children: React.ReactNode;
}

export default function AmbassadorLayout({ children }: AmbassadorLayoutProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/portal/ambassador" },
        { label: "New Submission", icon: PlusCircle, href: "/portal/ambassador/submit" },
        { label: "History", icon: History, href: "/portal/ambassador/history" },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 lg:hidden flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-sm">1E</span>
                    </div>
                </Link>
                <button onClick={toggleMenu} className="p-2 text-gray-600">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <div className="flex-1 flex pt-16 lg:pt-0">
                {/* Desktop Sidebar / Mobile Menu Drawer */}
                <aside className={`
                    fixed lg:static inset-0 z-50 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                    lg:translate-x-0 transition-transform duration-300 ease-in-out
                    w-64 bg-white border-r flex flex-col
                `}>
                    <div className="p-8 hidden lg:block">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                <span className="text-black font-black text-xl">1E</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Ambassador</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                        }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t space-y-1">
                        <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <UserCircle size={20} />
                            <span className="text-sm font-medium">My Profile</span>
                        </Link>
                        <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 overflow-y-auto">
                    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Footer (Simplified Overlay) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
}
