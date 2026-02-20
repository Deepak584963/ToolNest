import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
    { slug: "image-to-pdf-converter", name: "Image to PDF Converter", description: "Convert one or more images into shareable PDF documents in your browser." },
    { slug: "image-cropper", name: "Image Cropper", description: "Crop photos to exact dimensions for social posts, banners, and thumbnails." },
    { slug: "favicon-generator", name: "Favicon Generator", description: "Create favicon sizes for modern browsers and platform icon requirements." },
    { slug: "image-color-palette-extractor", name: "Image Color Palette Extractor", description: "Extract dominant colors from images for branding and design consistency." },
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

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="reveal-up text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-indigo-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/#tools" className="hover:text-indigo-700">Tools</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700">{meta.name} Tools</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="reveal-up reveal-delay-1 relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_12px_34px_rgba(79,70,229,0.1)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/35 via-sky-100/20 to-cyan-100/35" />
        <div className="relative">
        <p className="mb-2 text-4xl">{meta.icon}</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Free Online {meta.name} Tools
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {meta.description}
        </p>
        <p className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {categoryTools.length} free tools available
        </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section aria-label={`${meta.name} tools list`} className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {meta.slug === "dev" && (
        <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Top developer tools for API and backend workflows</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Explore high-demand developer utilities for regex debugging, JWT token inspection, cron schedule creation, SQL query formatting, and HTTP status code references.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredDevTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700">{tool.name}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "creator" && (
        <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Top creator tools for growth and analytics workflows</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Explore high-demand creator utilities for YouTube chapters, engagement analysis, monthly content planning, posting-time optimization, and campaign link tracking.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredCreatorTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700">{tool.name}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "seo" && (
        <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Top SEO tools for technical audits and content planning</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Explore high-demand SEO utilities for structured data, hreflang deployment, redirect migrations, robots directives, and keyword clustering workflows.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredSeoTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700">{tool.name}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "utility" && (
        <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Top utility tools for finance and daily calculations</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Explore high-demand utility tools for EMI planning, loan analysis, SIP growth estimation, currency conversion, and scientific calculations.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredUtilityTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700">{tool.name}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {meta.slug === "image" && (
        <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Top image tools for web assets and social workflows</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
            Explore high-demand image utilities for compression, conversion, cropping, favicon creation, and fast visual asset preparation.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredImageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-slate-800 hover:text-indigo-700">{tool.name}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Long description / SEO content */}
      <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">About our {meta.name.toLowerCase()} tools</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
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
      <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white/70 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 group-open:text-indigo-700">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Explore other categories */}
      <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Explore other tool categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/category/${cat.slug}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-4 transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{cat.name} Tools</p>
                <p className="text-xs text-slate-500">{tools.filter((t) => t.category === cat.slug).length} tools</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
