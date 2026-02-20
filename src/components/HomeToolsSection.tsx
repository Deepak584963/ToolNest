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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 id="tools-grid-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          All free online tools
        </h2>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {filteredTools.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/70 p-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`pressable micro-lift min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === cat.key
                ? "bg-indigo-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.34)]"
                : "bg-white/85 text-slate-700 hover:bg-white hover:text-indigo-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {(activeCategory === "all" || activeCategory === "dev") && (
        <div className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_26px_rgba(79,70,229,0.08)] sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Trending developer tools</p>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            High-intent utilities for API debugging, regex testing, authentication inspection, and SQL formatting.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredDeveloperTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "creator") && (
        <div className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_26px_rgba(79,70,229,0.08)] sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Trending creator tools</p>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            High-intent tools for YouTube growth, engagement analytics, content planning, and campaign tracking.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredCreatorTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-700 transition hover:bg-pink-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "seo") && (
        <div className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_26px_rgba(79,70,229,0.08)] sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Trending SEO tools</p>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            High-intent technical SEO tools for schema markup, international targeting, redirect migrations, robots directives, and topic clustering.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredSeoTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "utility") && (
        <div className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_26px_rgba(79,70,229,0.08)] sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Trending utility tools</p>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            High-demand finance and daily calculation tools for loans, investments, conversions, and advanced math workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredUtilityTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100 sm:py-1.5"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "image") && (
        <div className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-[0_10px_26px_rgba(79,70,229,0.08)] sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Trending image tools</p>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Most-used visual utilities for compression, conversion, asset prep, and social-ready image workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredImageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 sm:py-1.5"
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
