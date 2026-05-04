// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import MobileNav from "@/components/ui/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Odara - African Marketplace",
  description:
    "Discover authentic African products, deals, and new arrivals at Odara marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Navbar — fixed on mobile, sticky on desktop.
            The spacer div inside Navbar (h-[108px] block md:hidden) handles
            the top offset on mobile so content isn't hidden behind the fixed bar. */}
        <Navbar />

        {/* Main content:
            - pb-16 on mobile prevents content hiding behind the bottom MobileNav
            - md:pb-0 resets padding on desktop where MobileNav is hidden        */}
        <main className="pb-16 md:pb-0">{children}</main>

        {/* Mobile-only bottom nav — md:hidden is handled inside MobileNav */}
        <MobileNav />
      </body>
    </html>
  );
}