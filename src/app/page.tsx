import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Newsletter } from "@/components/home/Newsletter";
import { NewUserZone } from "@/components/home/NewUserZone";
import { FlashSales } from "@/components/home/FlashSales";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { Headphones, Battery, Watch, Zap, Speaker, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const categories = [
    { name: "Audio", icon: <Headphones className="w-8 h-8" />, href: "/audio" },
    { name: "Power", icon: <Battery className="w-8 h-8" />, href: "/power" },
    { name: "Wearables", icon: <Watch className="w-8 h-8" />, href: "/wearables" },
    { name: "Personal Care", icon: <Zap className="w-8 h-8" />, href: "/care" },
    { name: "Home App.", icon: <Speaker className="w-8 h-8" />, href: "/home-appliances" },
    { name: "Accessories", icon: <Smartphone className="w-8 h-8" />, href: "/accessories" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Light gray background for the body to match Oraimo's clean look */}

      <Hero />

      <NewUserZone />

      {/* Category Section */}
      <section className="py-8 md:py-12 bg-white container mx-auto rounded-3xl relative z-10 shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="group flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                {cat.icon}
              </div>
              <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <FlashSales />

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-12 uppercase tracking-tight">New Arrivals</h2>
          <ProductCarousel title="" />
        </div>
      </section>

      {/* Recommended */}
      <section className="py-16 container">
        <h2 className="text-3xl font-extrabold mb-8 uppercase text-left tracking-tight">Recommended For You</h2>
        <ProductCarousel title="" />
      </section>

      {/* Corporate / B2B Banner (Mockup) */}
      <section className="w-full bg-black py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 opacity-20 bg-[url('/images/pattern.png')] bg-cover"></div>
        <div className="container relative z-10">
          <h2 className="text-3xl font-bold mb-4">Corporate Procurement</h2>
          <p className="mb-8 text-gray-400 max-w-2xl mx-auto">Get the best deals for your business. Bulk orders, custom branding, and priority support available.</p>
          <button className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-black transition-all font-bold text-lg">
            Contact Sales
          </button>
        </div>
      </section>

      <RecentlyViewed />

      <Newsletter />
    </div>
  );
}
