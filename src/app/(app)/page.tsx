import { Hero } from "@/components/home/Hero";
import { NewUserZone } from "@/components/home/NewUserZone";
import { Headphones, Battery, Watch, Zap, Speaker, Smartphone } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

// Lazy load below-the-fold components
const ProductCarousel = dynamic(() => import("@/components/home/ProductCarousel").then(mod => mod.ProductCarousel), {
  loading: () => <div className="h-96 flex items-center justify-center bg-gray-50 animate-pulse rounded-3xl m-4">Loading Products...</div>,
  ssr: true
});

const FlashSales = dynamic(() => import("@/components/home/FlashSales").then(mod => mod.FlashSales), {
  loading: () => <div className="h-64 flex items-center justify-center bg-gray-50 animate-pulse rounded-3xl m-4">Loading Flash Sales...</div>,
  ssr: true
});

const RecentlyViewed = dynamic(() => import("@/components/home/RecentlyViewed").then(mod => mod.RecentlyViewed), {
  loading: () => <div className="h-48 flex items-center justify-center bg-gray-50 animate-pulse rounded-3xl m-4">Loading History...</div>,
  ssr: true
});

const AppDownloadSection = dynamic(() => import("@/components/home/AppDownloadSection").then(mod => mod.AppDownloadSection), {
  ssr: true
});

const Newsletter = dynamic(() => import("@/components/home/Newsletter").then(mod => mod.Newsletter), {
  ssr: true
});

// Cache Payload fetch
const getDailyDeals = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const deals = await payload.find({
        collection: "products",
        where: { isDailyDeal: { equals: true }, status: { equals: 'published' }, visibility: { equals: 'visible' } },
        limit: 10,
        depth: 1,
      });
      return deals.docs as any[];
    } catch (err) {
      return [];
    }
  },
  ['daily-deals'],
  { revalidate: 3600, tags: ['products'] }
);

const getHotNewProducts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const hotNew = await payload.find({
        collection: "products",
        where: { isHotNew: { equals: true }, status: { equals: 'published' }, visibility: { equals: 'visible' } },
        limit: 10,
        depth: 1,
      });
      return hotNew.docs as any[];
    } catch (err) {
      return [];
    }
  },
  ['hot-new-products'],
  { revalidate: 3600, tags: ['products'] }
);

const getFeaturedProducts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const productsResult = await payload.find({
        collection: "products",
        where: { status: { equals: 'published' }, visibility: { equals: 'visible' } },
        sort: "-createdAt",
        limit: 10,
        depth: 1,
      });
      return productsResult.docs as any[];
    } catch (err) {
      console.warn("Failed to fetch products:", err);
      return [];
    }
  },
  ['featured-products'],
  { revalidate: 3600, tags: ['products'] }
);

const getCategories = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const categoriesResult = await payload.find({
        collection: "categories",
        sort: "-createdAt",
        limit: 6,
        depth: 1,
      });
      return categoriesResult.docs as any[];
    } catch (err) {
      console.warn("Failed to fetch categories:", err);
      return [];
    }
  },
  ['homepage-categories'],
  { revalidate: 3600, tags: ['categories'] }
);

const getWelcomeCoupon = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const coupons = await payload.find({
        collection: "coupons",
        where: { code: { contains: "WELCOME" } },
        sort: "-createdAt",
        limit: 1,
      });
      return coupons.docs[0] as any;
    } catch (err) {
      return null;
    }
  },
  ['welcome-coupon'],
  { revalidate: 3600, tags: ['coupons'] }
);

const getSliders = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });
    try {
      const slidersResult = await payload.find({
        collection: "sliders",
        where: {
          active: { equals: true }
        },
        sort: "order",
        depth: 1,
      });
      return (slidersResult.docs as any[]).map((s: any) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        image: s.image?.url || "/images/placeholder.jpg",
        link: s.link
      }));
    } catch (err) {
      console.warn("Failed to fetch sliders:", err);
      return [];
    }
  },
  ['homepage-sliders'],
  { revalidate: 3600, tags: ['sliders'] }
);

export default async function Home() {
  const [featuredProducts, categories, sliders, dailyDeals, hotNewProducts, welcomeCoupon] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSliders(),
    getDailyDeals(),
    getHotNewProducts(),
    getWelcomeCoupon(),
  ]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Hero slides={sliders} />
      <NewUserZone
        couponCode={welcomeCoupon?.code}
        discountAmount={welcomeCoupon?.amount ? `₦${welcomeCoupon.amount.toLocaleString()} OFF` : undefined}
        expiryDate={welcomeCoupon?.expiresAt ? new Date(welcomeCoupon.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined}
      />

      {/* Category Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8 md:py-12 bg-white container mx-auto rounded-3xl relative z-10 shadow-sm border border-gray-100 mb-8"
      >
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {categories.map((cat, i) => (
            <Link key={cat.id || i} href={`/products?category=${cat.title}`} className="group flex flex-col items-center gap-3 cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm overflow-hidden"
              >
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.image.alt || cat.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-2xl">{cat.title.charAt(0)}</span>
                )}
              </motion.div>
              <span className="font-semibold text-gray-800 text-sm">{cat.title}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      <Suspense fallback={<div className="h-64 bg-gray-50" />}>
        <FlashSales products={featuredProducts.slice(0, 5)} />
      </Suspense>

      {/* Daily Deals Section (Dynamic) */}
      {dailyDeals.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="py-16 bg-white"
        >
          <div className="container">
            <h2 className="text-3xl font-extrabold text-center mb-12 uppercase tracking-tight">Daily Deals</h2>
              <Suspense fallback={<div className="h-96" />}>
              <ProductCarousel title="" products={dailyDeals} viewAllHref="/daily-deals" />
            </Suspense>
          </div>
        </motion.section>
      )}

      {/* Hot New Section (Dynamic) */}
      {hotNewProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="py-16 bg-gray-50"
        >
          <div className="container">
            <h2 className="text-3xl font-extrabold text-center mb-12 uppercase tracking-tight">Hot New Items</h2>
              <Suspense fallback={<div className="h-96" />}>
              <ProductCarousel title="" products={hotNewProducts} viewAllHref="/hot-new" />
            </Suspense>
          </div>
        </motion.section>
      )}

      {/* Recommended */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="py-16 container"
      >
        <h2 className="text-3xl font-extrabold mb-8 uppercase text-left tracking-tight">Recommended For You</h2>
          <Suspense fallback={<div className="h-96" />}>
          <ProductCarousel title="" products={featuredProducts} viewAllHref="/products" />
        </Suspense>
      </motion.section>

      {/* Corporate / B2B Banner */}
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
          <Link href="/contact?source=corporate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-black transition-colors font-bold text-lg"
            >
              Contact Sales
            </motion.button>
          </Link>
        </div>
      </motion.section>

      <Suspense fallback={<div className="h-48" />}>
        <RecentlyViewed products={featuredProducts.slice(0, 6)} />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <AppDownloadSection />
      </Suspense>

      <Suspense fallback={<div className="h-48" />}>
        <Newsletter />
      </Suspense>
    </div>
  );
}
