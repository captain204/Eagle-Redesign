import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/(app)/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      <body className={`${inter.variable} font-sans bg-[#f5f5f5]`}>
        {children}
      </body>
    </html>
  );
}
