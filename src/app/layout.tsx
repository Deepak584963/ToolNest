import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ToolNest — 70+ Free Online Tools",
    template: "%s | ToolNest",
  },
  description: "70+ free online tools for developers, SEO, students, creators, image processing, and everyday utilities. No sign-up, runs in your browser.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ToolNest — 70+ Free Online Tools",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — 70+ Free Online Tools",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdSenseScript />
        <a href="#main-content" className="sr-only z-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to main content
        </a>
        <div className="min-h-screen bg-linear-to-br from-indigo-100/55 via-sky-100/45 to-cyan-100/55 text-slate-900">
          <Header />
          <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{children}</main>
          <Footer />
          <ConsentBanner />
        </div>
      </body>
    </html>
  );
}
