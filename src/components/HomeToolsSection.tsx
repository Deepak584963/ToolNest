"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

type Category = "all" | "text" | "seo" | "dev" | "student" | "creator" | "image" | "utility" | "pdf";

const categories: { key: Category; label: string; icon: string }[] = [
  { key: "all", label: "All Tools", icon: "✨" },
  { key: "dev", label: "Developer", icon: "🛠️" },
  { key: "seo", label: "SEO", icon: "🔍" },
  { key: "text", label: "Text", icon: "📝" },
  { key: "student", label: "Student", icon: "🎓" },
  { key: "creator", label: "Creator", icon: "🎬" },
  { key: "image", label: "Image", icon: "🖼️" },
  { key: "utility", label: "Utility", icon: "🧮" },
  { key: "pdf", label: "PDF", icon: "📄" },
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
  { slug: "qr-code-generator", label: "QR Code Generator" },
  { slug: "image-cropper", label: "Image Cropper" },
  { slug: "favicon-generator", label: "Favicon Generator" },
];

const featuredTextTools = [
  { slug: "word-counter-reading-time", label: "Word Counter" },
  { slug: "lorem-ipsum-generator", label: "Lorem Ipsum" },
  { slug: "text-cleaner", label: "Text Cleaner" },
];

const featuredStudentTools = [
  { slug: "percentage-calculator", label: "Percentage Calculator" },
  { slug: "cgpa-to-percentage-converter", label: "CGPA Converter" },
  { slug: "attendance-calculator", label: "Attendance Tracker" },
  { slug: "gpa-calculator", label: "GPA Calculator" },
  { slug: "exam-countdown-timer", label: "Exam Countdown" },
];

const featuredPdfTools = [
  { slug: "image-to-pdf-converter", label: "Image to PDF" },
  { slug: "merge-pdf", label: "Merge PDF" },
  { slug: "split-pdf", label: "Split PDF" },
  { slug: "pdf-to-text-extractor", label: "PDF to Text" },
  { slug: "protect-pdf", label: "Protect PDF" },
  { slug: "unlock-pdf", label: "Unlock PDF" },
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)]">⚡</div>
          <h2 id="tools-grid-title" className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            All free online tools
          </h2>
        </div>
        <span className="rounded-full border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-violet-50 px-3.5 py-1 text-xs font-bold text-indigo-600 shadow-[0_1px_4px_rgba(99,102,241,0.08)] dark:border-indigo-500/30 dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-400">
          {filteredTools.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/60 bg-white/80 p-2.5 shadow-[0_1px_4px_rgba(15,23,42,0.03)] dark:border-slate-700/60 dark:bg-slate-800/60">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`pressable min-h-10 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
              activeCategory === cat.key
                ? "btn-primary shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                : "bg-white/90 text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-600 hover:shadow-[0_2px_8px_rgba(99,102,241,0.06)] dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"
            }`}
          >
            <span className="mr-1.5 inline-block text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {(activeCategory === "all" || activeCategory === "dev") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🛠️</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending developer tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            High-intent utilities for API debugging, regex testing, authentication inspection, and SQL formatting.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredDeveloperTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 sm:py-1.5 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "creator") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🎬</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending creator tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            High-intent tools for YouTube growth, engagement analytics, content planning, and campaign tracking.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredCreatorTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-pink-100 bg-pink-50/80 px-3.5 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-100 sm:py-1.5 dark:border-pink-900/50 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:bg-pink-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "seo") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending SEO tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            High-intent technical SEO tools for schema markup, international targeting, redirect migrations, robots directives, and topic clustering.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredSeoTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:py-1.5 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "utility") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🧮</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending utility tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            High-demand finance and daily calculation tools for loans, investments, conversions, and advanced math workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredUtilityTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-cyan-100 bg-cyan-50/80 px-3.5 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100 sm:py-1.5 dark:border-cyan-900/50 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:bg-cyan-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "image") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🖼️</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending image tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Most-used visual utilities for compression, conversion, asset prep, and social-ready image workflows.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredImageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-orange-100 bg-orange-50/80 px-3.5 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 sm:py-1.5 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "text") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">📝</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending text tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Essential writing utilities for word counting, placeholder text generation, and content cleanup.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredTextTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-amber-100 bg-amber-50/80 px-3.5 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 sm:py-1.5 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "student") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🎓</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending student tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Must-have academic utilities for grade tracking, attendance monitoring, exam planning, and GPA calculations.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredStudentTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-violet-100 bg-violet-50/80 px-3.5 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100 sm:py-1.5 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {(activeCategory === "all" || activeCategory === "pdf") && (
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] sm:p-6 dark:border-slate-700/60 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-base">📄</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trending PDF tools</h3>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Secure client-side PDF utilities to split, merge, lock, and unlock your documents completely in your browser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredPdfTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="pressable micro-lift rounded-full border border-red-100 bg-red-50/80 px-3.5 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 sm:py-1.5 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
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
