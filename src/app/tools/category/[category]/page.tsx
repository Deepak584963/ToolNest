import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { categoryMeta, getCategoryMeta, getCategorySlugs } from "@/lib/categories";
import { tools } from "@/lib/tools";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) {
    return { title: "Category Not Found" };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/tools/category/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/tools/category/${meta.slug}`,
      siteName: "ToolNest",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      site: "@toolnest",
    },
    keywords: meta.keywords,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === meta.slug);
  const otherCategories = categoryMeta.filter((c) => c.slug !== meta.slug);
  const featuredDevTools = [
    { slug: "regex-tester-replacer", name: "Regex Tester & Replacer", description: "Test patterns and run replacements with live match previews." },
    { slug: "jwt-decoder-inspector", name: "JWT Decoder & Inspector", description: "Decode token payloads and inspect claims safely in your browser." },
    { slug: "cron-expression-builder", name: "Cron Expression Builder", description: "Generate cron schedules with readable summaries and presets." },
    { slug: "sql-formatter-beautifier", name: "SQL Formatter & Beautifier", description: "Beautify or minify SQL queries for debugging and documentation." },
    { slug: "http-status-code-lookup", name: "HTTP Status Code Lookup", description: "Find status meanings and copy response templates quickly." },
  ];
  const featuredCreatorTools = [
    { slug: "youtube-chapter-timestamp-generator", name: "YouTube Chapter Timestamp Generator", description: "Generate chapter timestamps from your topic outline and video length." },
    { slug: "engagement-rate-calculator", name: "Engagement Rate Calculator", description: "Measure social post performance by followers, reach, and views." },
    { slug: "viral-content-calendar-generator", name: "Viral Content Calendar Generator", description: "Build monthly posting plans with pillars, angles, and formats." },
    { slug: "best-time-to-post-planner", name: "Best Time to Post Planner", description: "Plan posting windows by platform, timezone, and audience region." },
    { slug: "utm-link-builder-for-creators", name: "UTM Link Builder for Creators", description: "Create campaign-trackable links for bios, stories, and posts." },
  ];
  const featuredSeoTools = [
    { slug: "schema-markup-generator", name: "Schema Markup Generator", description: "Generate JSON-LD for Article, Product, and FAQ pages with ready-to-publish snippets." },
    { slug: "hreflang-tag-generator", name: "Hreflang Tag Generator", description: "Create alternate language/region tags and x-default mappings for international SEO." },
    { slug: "redirect-rule-generator", name: "Redirect Rule Generator", description: "Generate migration redirect rules for Apache, Nginx, and Netlify in one place." },
    { slug: "robots-meta-tag-generator", name: "Robots Meta Tag Generator", description: "Build robots meta and X-Robots-Tag directives with advanced snippet controls." },
    { slug: "keyword-cluster-generator", name: "Keyword Cluster Generator", description: "Cluster keywords by topic and intent with instant title and H1 ideas." },
  ];
  const featuredUtilityTools = [
    { slug: "emi-calculator", name: "EMI Calculator", description: "Estimate monthly EMI with total payment and total interest instantly." },
    { slug: "loan-interest-calculator", name: "Loan Interest Calculator", description: "Analyze amortization and total interest for your loan tenure." },
    { slug: "sip-calculator", name: "SIP Calculator", description: "Project SIP growth with maturity, invested amount, and wealth gain." },
    { slug: "currency-converter", name: "Currency Converter", description: "Convert major currencies quickly with practical reference exchange rates." },
    { slug: "scientific-calculator", name: "Scientific Calculator", description: "Perform advanced math with trigonometric and scientific operations." },
  ];
  const featuredImageTools = [
    { slug: "compress-image", name: "Compress Image", description: "Reduce image file size while preserving visual quality for faster page loads." },
    { slug: "qr-code-generator", name: "QR Code Generator", description: "Generate scannable QR codes for links, text, and contact info." },
    { slug: "image-cropper", name: "Image Cropper", description: "Crop photos to exact dimensions for social posts, banners, and thumbnails." },
    { slug: "favicon-generator", name: "Favicon Generator", description: "Create favicon sizes for modern browsers and platform icon requirements." },
    { slug: "image-color-palette-extractor", name: "Image Color Palette Extractor", description: "Extract dominant colors from images for branding and design consistency." },
  ];
  const featuredTextTools = [
    { slug: "word-counter-reading-time", name: "Word Counter & Reading Time", description: "Count words, characters, and estimate reading time with SEO content insights." },
    { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text by words, sentences, or paragraphs for wireframes." },
    { slug: "text-cleaner", name: "Text Cleaner", description: "Remove extra spaces, line noise, and hidden junk characters from pasted text." },
  ];
  const featuredStudentTools = [
    { slug: "percentage-calculator", name: "Percentage Calculator", description: "Find percentages, percentage change, and part-of-total values instantly." },
    { slug: "cgpa-to-percentage-converter", name: "CGPA to Percentage Converter", description: "Convert CGPA to percentage using common university grading formulas." },
    { slug: "attendance-calculator", name: "Attendance Calculator", description: "Track attendance percentage and find how many classes you can skip safely." },
    { slug: "gpa-calculator", name: "GPA Calculator", description: "Calculate semester and cumulative GPA with custom credit hours and grading scales." },
    { slug: "exam-countdown-timer", name: "Exam Countdown Timer", description: "Set target exam dates and see a live countdown in days, hours, and minutes." },
  ];
  const featuredPdfTools = [
    { slug: "image-to-pdf-converter", name: "Image to PDF Converter", description: "Convert one or multiple images into a shareable PDF document in your browser." },
    { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDF documents into a single file." },
    { slug: "split-pdf", name: "Split PDF", description: "Separate one page or a whole set for easy conversion into independent PDF files." },
    { slug: "pdf-to-text-extractor", name: "PDF to Text Extractor", description: "Extract text from PDF documents instantly in your browser." },
    { slug: "protect-pdf", name: "Protect PDF", description: "Encrypt your PDF with a password to prevent unauthorized access." },
  ];

  // Generate FAQ items for this category
  const faqs = [
    {
      question: `How many ${meta.name.toLowerCase()} tools are available on ToolNest?`,
      answer: `ToolNest offers ${categoryTools.length} free ${meta.name.toLowerCase()} tools that you can use directly in your browser without signing up.`,
    },
    {
      question: `Are these ${meta.name.toLowerCase()} tools free to use?`,
      answer: `Yes, all ${meta.name.toLowerCase()} tools on ToolNest are completely free. There are no hidden fees, sign-ups, or usage limits.`,
    },
    {
      question: `Do these tools send my data to a server?`,
      answer: `No, all ToolNest tools run entirely in your browser. Your data stays on your device and is never transmitted to any server.`,
    },
    {
      question: `Can I use these tools on mobile devices?`,
      answer: `Yes, every tool is designed with a mobile-first approach and works smoothly on phones, tablets, and desktops.`,
    },
  ];

  return (
    <article className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/#tools` },
          { name: `${meta.name} Tools`, url: `${siteConfig.url}/tools/category/${meta.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />
      <CollectionPageSchema
        name={`${meta.name} Tools`}
        description={meta.description}
        url={`${siteConfig.url}/tools/category/${meta.slug}`}
        items={categoryTools.map((t) => ({
          name: t.name,
          url: `${siteConfig.url}/tools/${t.slug}`,
        }))}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="reveal-up text-sm">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="inline-flex items-center gap-1 font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>Home</Link></li>
          <li aria-hidden className="text-slate-300 dark:text-slate-600">›</li>
          <li><Link href="/#tools" className="font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">Tools</Link></li>
          <li aria-hidden className="text-slate-300 dark:text-slate-600">›</li>
          <li className="rounded-full bg-indigo-50/80 px-2.5 py-0.5 font-semibold text-indigo-600 text-xs dark:bg-indigo-500/20 dark:text-indigo-300">{meta.name} Tools</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="reveal-up reveal-delay-1 relative overflow-hidden rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_16px_40px_rgba(99,102,241,0.1)] sm:p-8 lg:p-10 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-cyan-900/20" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-float rounded-full bg-linear-to-br from-indigo-200/20 to-violet-200/20 blur-3xl dark:from-indigo-500/10 dark:to-violet-500/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 animate-float-delayed rounded-full bg-linear-to-tr from-cyan-200/15 to-sky-200/15 blur-3xl dark:from-cyan-500/10 dark:to-sky-500/10" />
        <div className="relative">
        <p className="mb-3 text-4xl drop-shadow">{meta.icon}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          Free Online <span className="gradient-text">{meta.name} Tools</span>
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-400">
          {meta.description}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300">
          <span className="pulse-dot" />
          {categoryTools.length} free tools available
        </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section aria-label={`${meta.name} tools list`} className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/75 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-7 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {meta.slug === "dev" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-none">🛠️</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top developer tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand developer utilities for regex debugging, JWT token inspection, cron schedule creation, SQL query formatting, and HTTP status code references.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredDevTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "creator" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 text-lg shadow-[0_2px_8px_rgba(236,72,153,0.1)]">🎬</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top creator tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand creator utilities for YouTube chapters, engagement analysis, monthly content planning, posting-time optimization, and campaign link tracking.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredCreatorTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "seo" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(139,92,246,0.1)]">🔍</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top SEO tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand SEO utilities for structured data, hreflang deployment, redirect migrations, robots directives, and keyword clustering workflows.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredSeoTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "utility" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 text-lg shadow-[0_2px_8px_rgba(20,184,166,0.1)]">🧮</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top utility tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand utility tools for EMI planning, loan analysis, SIP growth estimation, currency conversion, and scientific calculations.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredUtilityTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "image" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 text-lg shadow-[0_2px_8px_rgba(249,115,22,0.1)]">🖼️</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top image tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand image utilities for compression, conversion, cropping, favicon creation, and fast visual asset preparation.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredImageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "text" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 text-lg shadow-[0_2px_8px_rgba(245,158,11,0.1)]">📝</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top text tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore essential writing utilities for word counting, placeholder text generation, and content cleanup before publishing.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredTextTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "student" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 text-lg shadow-[0_2px_8px_rgba(139,92,246,0.1)]">🎓</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top student tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand academic utilities for grade tracking, attendance monitoring, GPA calculations, and exam countdowns.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredStudentTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "pdf" && (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-rose-50 text-lg shadow-[0_2px_8px_rgba(220,38,38,0.1)]">📄</div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Top PDF tools</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
            Explore high-demand secure client-side PDF utilities to split, merge, lock, and unlock your documents completely in your browser.
          </p>
          <div className="gradient-divider mt-4" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featuredPdfTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover-glow pressable group rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
              >
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition dark:text-slate-200 dark:group-hover:text-indigo-400">{tool.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Long description / SEO content */}
      <section className="reveal-up reveal-delay-3 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-none">📋</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">About our {meta.name.toLowerCase()} tools</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 dark:text-slate-400">
          <p>{meta.longDescription}</p>
          <p>
            Every tool in this category runs entirely in your browser — your data never leaves your device. There is no account to create, no download to install, and no usage limit. Just open the tool, enter your data, and get instant results. This privacy-first approach makes ToolNest trusted by thousands of professionals, students, and hobbyists worldwide.
          </p>
          <p>
            Each tool includes detailed instructions, real-world examples, frequently asked questions, and links to related utilities. Whether you are a beginner or an experienced professional, you will find the guidance you need to use each tool effectively. Bookmark this page to return quickly whenever you need a {meta.name.toLowerCase()} tool.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="reveal-up reveal-delay-3 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-none">❓</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Frequently asked questions</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-3">
          {faqs.map((faq, i) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200/60 bg-white/80 p-4 transition-all duration-200 hover:border-indigo-200/60 open:border-indigo-200/50 open:bg-white/95 open:shadow dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/40 dark:open:border-indigo-500/30 dark:open:bg-slate-800/80">
              <summary className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-slate-800 group-open:text-indigo-600 dark:text-slate-200 dark:group-open:text-indigo-400">
                <span className="faq-number text-[11px]">{i + 1}</span>
                <span className="flex-1">{faq.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </summary>
              <p className="mt-3 pl-9 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Explore other categories */}
      <section className="reveal-up reveal-delay-3 rounded-3xl border border-white/50 bg-white/82 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/60 dark:bg-slate-800/40 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)] dark:shadow-none">📂</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore other categories</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/category/${cat.slug}`}
              className="card-hover-glow pressable group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/88 p-4 transition-all duration-200 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">{cat.icon}</span>
              <div>
                <span className="block text-sm font-bold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">{cat.name} Tools</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{tools.filter((t) => t.category === cat.slug).length} tools</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
