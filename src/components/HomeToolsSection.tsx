"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

type Category = "all" | "text" | "seo" | "dev" | "student" | "creator" | "image" | "utility";

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All Tools" },
  { key: "dev", label: "Developer" },
  { key: "seo", label: "SEO" },
  { key: "text", label: "Text" },
  { key: "student", label: "Student" },
  { key: "creator", label: "Creator" },
  { key: "image", label: "Image" },
  { key: "utility", label: "Utility" },
];

const featuredDeveloperTools = [
  { slug: "regex-tester-replacer", label: "Regex Tester" },
  { slug: "jwt-decoder-inspector", label: "JWT Decoder" },
  { slug: "cron-expression-builder", label: "Cron Builder" },
  { slug: "sql-formatter-beautifier", label: "SQL Formatter" },
  { slug: "http-status-code-lookup", label: "HTTP Status Lookup" },
];

const featuredCreatorTools = [
  { slug: "youtube-chapter-timestamp-generator", label: "YouTube Chapters" },
  { slug: "engagement-rate-calculator", label: "Engagement Rate" },
  { slug: "viral-content-calendar-generator", label: "Content Calendar" },
  { slug: "best-time-to-post-planner", label: "Best Time to Post" },
  { slug: "utm-link-builder-for-creators", label: "UTM Link Builder" },
];

const featuredSeoTools = [
  { slug: "schema-markup-generator", label: "Schema Markup" },
  { slug: "hreflang-tag-generator", label: "Hreflang Tags" },
  { slug: "redirect-rule-generator", label: "Redirect Rules" },
  { slug: "robots-meta-tag-generator", label: "Robots Meta Tags" },
  { slug: "keyword-cluster-generator", label: "Keyword Clusters" },
];

const featuredUtilityTools = [
  { slug: "emi-calculator", label: "EMI Calculator" },
  { slug: "loan-interest-calculator", label: "Loan Interest" },
  { slug: "sip-calculator", label: "SIP Calculator" },
  { slug: "currency-converter", label: "Currency Converter" },
  { slug: "scientific-calculator", label: "Scientific Calculator" },
];

const featuredImageTools = [
  { slug: "compress-image", label: "Compress Image" },
  { slug: "image-to-pdf-converter", label: "Image to PDF" },
  { slug: "qr-code-generator", label: "QR Code Generator" },
  { slug: "image-cropper", label: "Image Cropper" },
  { slug: "favicon-generator", label: "Favicon Generator" },
];

export default function HomeToolsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return tools;
    return tools.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="space-y-6" aria-labelledby="tools-grid-title">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">⚡</div>
          <h2 id="tools-grid-title" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            All free online tools
          </h2>
        </div>
        <span className="rounded-full border border-indigo-200/50 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-600">
          {filteredTools.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/60 bg-white/75 p-2.5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`pressable micro-lift min-h-10 rounded-full px-4 py-2 text-sm font-bold transition ${
              activeCategory === cat.key
                ? "btn-primary shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                : "bg-white/85 text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {(activeCategory === "all" || activeCategory === "dev") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">🛠️</span>
            <p className="text-sm font-bold text-slate-800">Trending developer tools</p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            High-intent utilities for API debugging, regex testing, authentication inspection, and SQL formatting.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredDeveloperTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "creator") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">🎬</span>
            <p className="text-sm font-bold text-slate-800">Trending creator tools</p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            High-intent tools for YouTube growth, engagement analytics, content planning, and campaign tracking.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredCreatorTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-pink-100 bg-pink-50/80 px-3.5 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "seo") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">🔍</span>
            <p className="text-sm font-bold text-slate-800">Trending SEO tools</p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            High-intent technical SEO tools for schema markup, international targeting, redirect migrations, robots directives, and topic clustering.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredSeoTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "utility") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">🧮</span>
            <p className="text-sm font-bold text-slate-800">Trending utility tools</p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            High-demand finance and daily calculation tools for loans, investments, conversions, and advanced math workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredUtilityTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-cyan-100 bg-cyan-50/80 px-3.5 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "image") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-base">🖼️</span>
            <p className="text-sm font-bold text-slate-800">Trending image tools</p>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            Most-used visual utilities for compression, conversion, asset prep, and social-ready image workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredImageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-orange-100 bg-orange-50/80 px-3.5 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
