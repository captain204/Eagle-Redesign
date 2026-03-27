"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { CartDrawer } from "@/components/layout/CartDrawer";

interface Category {
    id: string | number;
    title: string;
    slug: string;
    image?: any;
    parent?: any;
}

export function Header({ categories = [] }: { categories?: Category[] }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Daily Deals", href: "/daily-deals" },
        { name: "Hot & New", href: "/hot-new" },
        { name: "Support", href: "/support" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/95 backdrop-blur-md py-2 shadow-lg" : "bg-black/60 backdrop-blur-sm py-4"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="shrink-0 flex items-center gap-1 group">
                    <div className="relative w-20 h-8 md:w-32 md:h-12"> {/* Further reduced size for mobile */}
                        <Image
                            src="/images/1steagle/logo.jpg"
                            alt="1st𝓔agle"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Central Search Bar - Desktop */}
                <div className="hidden md:flex flex-1 max-w-2xl items-stretch h-10 shadow-sm relative group/search">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[160px] rounded-r-none bg-gray-100 border-r border-gray-300 focus:ring-0 text-gray-700 h-full font-medium">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.filter(c => !c.parent).map((c) => (
                                <SelectItem key={c.id} value={c.slug}>{c.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                        <Input
                            type="search"
                            placeholder="Search products, brands and categories..."
                            className="w-full h-full rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white text-black px-4"
                        />
                    </div>
                    <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-black h-full px-6 font-bold">
                        <Search className="w-5 h-5" />
                    </Button>
                </div>

                {/* Desktop Navigation & Icons */}
                <div className="flex items-center gap-2 lg:gap-6">
                    {/* Desktop Menu Links */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <MegaMenu categories={categories} />
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white/90 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-3 lg:gap-4 text-white">
                        <button className="md:hidden hover:text-primary transition-colors p-2">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/account" className="hidden md:flex flex-col items-center hover:text-primary transition-colors group">
                            <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] uppercase font-bold mt-0.5 hidden xl:block">Account</span>
                        </Link>

                        {/* Cart Drawer Component */}
                        <div className="flex flex-col items-center group cursor-pointer">
                            <CartDrawer />
                            <span className="text-[10px] uppercase font-bold mt-0.5 hidden xl:block group-hover:text-primary transition-colors">Cart</span>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl h-screen animate-accordion-down">
                    <div className="relative mb-4">
                        <Input
                            placeholder="Search..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                        />
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    <Link
                        href="/products"
                        className="text-white hover:text-primary py-3 border-b border-white/10 text-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Browse All Products
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white hover:text-primary py-3 border-b border-white/10 text-lg font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/account"
                        className="text-white hover:text-primary py-3 flex items-center gap-3 mt-4 text-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <User className="w-5 h-5" /> My Account
                    </Link>
                </div>
            )}
        </header>
    );
}
