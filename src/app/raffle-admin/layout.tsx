import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/app/(app)/globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Raffle Admin - 1stEagle Technology",
  description: "Secure management dashboard for raffle entries.",
};

export default function RaffleAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-outfit bg-[#f5f5f5]`}>
        {children}
      </body>
    </html>
  );
}
