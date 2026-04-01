import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./global.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // CLS: mencegah layout shift saat font loading
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: {
    template: "%s | PortalNews",
    default: "PortalNews — Berita Terkini & Terpercaya",
  },
  description: "Portal berita terkini dan terpercaya dari berbagai kategori",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PortalNews",
    title: "PortalNews — Berita Terkini & Terpercaya",
    description: "Portal berita terkini dan terpercaya dari berbagai kategori",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortalNews — Berita Terkini & Terpercaya",
    description: "Portal berita terkini dan terpercaya dari berbagai kategori",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
