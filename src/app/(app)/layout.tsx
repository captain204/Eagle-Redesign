import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import PerformancePolyfill from "@/components/layout/PerformancePolyfill";
import { CartProvider } from "@/providers/CartProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "1stEagle Technology Official Store",
  description: "Explore the best of smart accessories and power solutions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "1stEagle",
  },
};

export const viewport = {
  themeColor: "#FF6600",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { getPayload } from "payload";
import configPromise from "@/payload.config";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayload({ config: configPromise });
  const categoriesResult = await payload.find({
    collection: "categories",
    sort: "-createdAt",
    depth: 1,
    limit: 100, // retrieve a sufficient amount of categories
  });
  const categories = categoriesResult.docs as any;

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-outfit`}>
        <PerformancePolyfill />
        <CartProvider>
          <TopBar />
          <Header categories={categories} />
          <main className="pb-16 md:pb-0">{children}</main> {/* Add padding bottom for mobile nav */}
          <Footer />
          <BottomNav />
          <Toaster />
          <WhatsAppIcon />
        </CartProvider>
      </body>
    </html>
  );
}
