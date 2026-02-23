import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Newsletter } from "@/components/home/Newsletter";
import { NewUserZone } from "@/components/home/NewUserZone";
import { FlashSales } from "@/components/home/FlashSales";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { AppDownloadSection } from "@/components/home/AppDownloadSection";
import { Headphones, Battery, Watch, Zap, Speaker, Smartphone } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8 md:py-12 bg-white container mx-auto rounded-3xl relative z-10 shadow-sm border border-gray-100 mb-8"
      >
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="group flex flex-col items-center gap-3 cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
              >
                {cat.icon}
              </motion.div>
              <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      <FlashSales />

      {/* Daily Deals */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="py-16 bg-white"
      >
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-12 uppercase tracking-tight">Daily Deals</h2>
          <ProductCarousel title="" />
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="py-16 container"
      >
        <h2 className="text-3xl font-extrabold mb-8 uppercase text-left tracking-tight">Recommended For You</h2>
        <ProductCarousel title="" />
      </motion.section>

      {/* Corporate / B2B Banner (Mockup) */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full bg-black py-16 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/10 opacity-20 bg-[url('/images/pattern.png')] bg-cover"></div>
        <div className="container relative z-10">
          <h2 className="text-3xl font-bold mb-4">Corporate Procurement</h2>
          <p className="mb-8 text-gray-400 max-w-2xl mx-auto">Get the best deals for your business. Bulk orders, custom branding, and priority support available.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-black transition-colors font-bold text-lg"
          >
            Contact Sales
          </motion.button>
        </div>
      </motion.section>

      <RecentlyViewed />

      <AppDownloadSection />

      <Newsletter />
    </div>
  );
}
