import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";
import ThemeProvider from "@/components/ThemeProvider";
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
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "ToolNest — 70+ Free Online Tools",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — 70+ Free Online Tools",
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
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
  verification: {
    google: "googlef2df34d8de1e60a6",
  },
  other: {
    "theme-color": siteConfig.themeColor,
    "color-scheme": "light dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteConfig.name,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
        <AdSenseScript />
        <a href="#main-content" className="sr-only z-50 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to main content
        </a>
        <div className="min-h-screen bg-linear-to-br from-indigo-50/60 via-sky-50/40 to-violet-50/50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80 dark:text-slate-100">
          <Header />
          <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{children}</main>
          <Footer />
          <ConsentBanner />
        </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
