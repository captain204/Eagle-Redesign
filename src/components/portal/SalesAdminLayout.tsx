"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Truck,
    Settings,
    LogOut,
    ChevronRight,
    Bell,
    Menu,
    X
} from 'lucide-react';
import SalesAdminGuard from '@/components/portal/SalesAdminGuard';

interface SalesAdminLayoutProps {
    children: React.ReactNode;
}

export default function SalesAdminLayout({ children }: SalesAdminLayoutProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/portal/sales-admin' },
        { label: 'Submissions', icon: FileText, href: '/portal/sales-admin/submissions' },
        { label: 'Distributors', icon: Truck, href: '/portal/sales-admin/distributors' },
    ];

    return (
        <SalesAdminGuard>
            <div className="min-h-screen bg-[#0a0a0c] text-white flex">
                {/* Sidebar Overlay (Mobile only) */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                        onClick={toggleMenu}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col fixed h-full z-[70] transition-transform duration-300 lg:translate-x-0
                    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="p-8 flex items-center justify-between lg:block">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(255,255,0,0.3)]">
                                <span className="text-black font-black text-xl">1E</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Sales Admin</span>
                        </Link>
                        <button onClick={toggleMenu} className="lg:hidden text-white p-2">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} className={isActive ? 'text-primary' : 'group-hover:text-white transition-colors'} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight size={16} />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10 space-y-2">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 p-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                        >
                            <Settings size={20} />
                            <span className="font-medium text-sm">Main CMS</span>
                        </Link>
                        <button
                            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 min-h-screen relative overflow-x-hidden">
                    {/* Top Header */}
                    <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-lg font-semibold text-gray-400 uppercase tracking-widest text-[10px]">
                                {pathname.split('/').pop()?.replace('-', ' ')}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-6">
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors hidden sm:block">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                            </button>
                            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold">Admin Portal</p>
                                    <p className="text-[10px] text-primary uppercase font-bold tracking-tighter">Sales Management</p>
                                </div>
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-tr from-primary to-[#ff8c00] border-2 border-white/20 shadow-lg shadow-primary/20"></div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>

                    {/* Abstract Background Elements */}
                    <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
                    <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
                </main>
            </div>
        </SalesAdminGuard>
    );
}
