import type { Metadata } from "next";
import Link from "next/link";
import HomeToolsSection from "@/components/HomeToolsSection";
import { FAQSchema, ItemListSchema, OrganizationSchema, WebSiteSchema } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";
import { categoryMeta } from "@/lib/categories";

export const metadata: Metadata = {
  title: "ToolNest — 70+ Free Online Tools for Developers, SEO, Students & Creators",
  description: "Use 70+ free browser-based tools: JSON formatter, regex tester, JWT decoder, SQL formatter, QR code generator, EMI calculator, image compressor, and more. No signup needed.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ToolNest — 70+ Free Online Tools",
    description: "70+ free, fast, browser-based tools for developers, SEO, students, creators, image tasks, and daily utilities. No sign-up required.",
    url: "/",
    siteName: "ToolNest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — 70+ Free Online Tools",
    description: "70+ free browser-based tools for developers, SEO, students, creators, image tasks, and daily utilities.",
    site: "@toolnest",
    creator: "@toolnest",
  },
  keywords: [
    "free online tools",
    "developer tools",
    "regex tester",
    "jwt decoder",
    "cron expression builder",
    "sql formatter",
    "http status code lookup",
    "seo tools",
    "student tools",
    "creator tools",
    "image tools",
    "json formatter",
    "qr code generator",
    "emi calculator",
    "gpa calculator",
    "hashtag generator",
    "compress image online",
  ],
};

export default function HomePage() {
  const homeFaqs = [
    { question: "Are all tools on ToolNest free?", answer: "Yes, every tool on ToolNest is 100% free to use with no hidden fees, sign-ups, or usage limits." },
    { question: "Is my data safe when using these tools?", answer: "Absolutely. All tools run entirely in your browser. Your data is never sent to any server or stored anywhere." },
    { question: "Do I need to create an account?", answer: "No. You can use any tool immediately without creating an account or providing any personal information." },
    { question: "How many tools does ToolNest offer?", answer: "ToolNest currently offers 70+ free tools across 7 categories: Developer, SEO, Text, Student, Creator, Image, and Utility." },
    { question: "Can I use these tools on my phone?", answer: "Yes. Every tool is designed with a mobile-first approach and works smoothly on phones, tablets, and desktop computers." },
    { question: "How often are new tools added?", answer: "We regularly add new tools based on user feedback and trending needs. Bookmark this page to stay updated." },
  ];

  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />
      <FAQSchema items={homeFaqs} />
      <ItemListSchema
        items={tools.map((t) => ({
          name: t.name,
          url: `${siteConfig.url}/tools/${t.slug}`,
        }))}
      />

      {/* Hero */}
      <section className="reveal-up relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_16px_40px_rgba(99,102,241,0.1)] backdrop-blur-xl sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/40 via-purple-50/30 to-cyan-100/40" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-linear-to-br from-indigo-200/20 to-violet-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-linear-to-tr from-cyan-200/20 to-sky-200/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
            70+ Tools &bull; Free &bull; No Sign-up &bull; Browser-based
          </p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Free Online Tools for{" "}
            <span className="gradient-text">Developers, SEO, Students & Creators</span>
          </h1>
          <p className="mt-5 text-balance text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
            Solve daily tasks in seconds — format JSON, generate QR codes, calculate EMI, compress images, create hashtags, plan studies, and much more. All tools run 100% in your browser with zero data collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#tools" className="pressable btn-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm shadow-[0_4px_16px_rgba(99,102,241,0.3)] sm:w-auto">
              Explore All Tools
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </Link>
            <Link href="/about" className="pressable btn-secondary inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 py-3 text-sm sm:w-auto">
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "70+", label: "Free Tools", icon: "⚡" },
            { value: "7", label: "Categories", icon: "📂" },
            { value: "100%", label: "Browser-based", icon: "🔒" },
            { value: "0", label: "Data Collected", icon: "🛡️" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card flex flex-col items-center gap-1 rounded-2xl p-4 text-center">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">{stat.value}</span>
              <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category cards */}
      <section className="reveal-up reveal-delay-1 mt-10 rounded-3xl border border-white/50 bg-white/65 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">📂</div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Browse by category</h2>
            <p className="mt-0.5 text-sm text-slate-500">Choose a category to find the right tool fast.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryMeta.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/tools/category/${cat.slug}`}
                className="group gradient-border flex min-h-36 flex-col items-center justify-center gap-2.5 rounded-2xl bg-white/85 p-5 text-center shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] transition hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_16px_32px_rgba(99,102,241,0.1)]"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">{cat.icon}</span>
                <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">{cat.name} Tools</span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">{count} tools</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All tools grid */}
      <section id="tools" className="reveal-up reveal-delay-2 mt-10 scroll-mt-24 rounded-3xl border border-white/50 bg-white/65 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8">
        <HomeToolsSection />
      </section>

      {/* SEO content */}
      <section className="reveal-up reveal-delay-2 mt-12 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Why ToolNest is the best free online tools website</h2>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          <p>
            ToolNest brings together 70+ professional-grade utilities in one fast, clean interface. Whether you are a developer debugging JSON payloads, an SEO specialist optimizing meta tags, a student calculating CGPA, a content creator generating hashtags, or anyone who needs to compress an image or calculate EMI — we have the right tool for you.
          </p>
          <p>
            Every tool runs entirely in your browser. Your data never leaves your device, which means maximum privacy and zero latency. There is no account to create, no software to install, and no usage limits. Just open a tool and start working.
          </p>
          <p>
            Our tools are organized into seven categories: <Link href="/tools/category/dev" className="font-medium text-indigo-700 hover:underline">Developer</Link>, <Link href="/tools/category/seo" className="font-medium text-indigo-700 hover:underline">SEO</Link>, <Link href="/tools/category/text" className="font-medium text-indigo-700 hover:underline">Text</Link>, <Link href="/tools/category/student" className="font-medium text-indigo-700 hover:underline">Student</Link>, <Link href="/tools/category/creator" className="font-medium text-indigo-700 hover:underline">Creator</Link>, <Link href="/tools/category/image" className="font-medium text-indigo-700 hover:underline">Image</Link>, and <Link href="/tools/category/utility" className="font-medium text-indigo-700 hover:underline">Utility</Link>. Each tool includes detailed instructions, practical examples, common mistakes to avoid, and answers to frequently asked questions.
          </p>
          <p>
            The website is statically generated for instant load times and optimized for Core Web Vitals. Mobile-first design ensures every tool works perfectly on phones, tablets, and desktops. Internal linking between related tools helps you discover relevant utilities and complete multi-step workflows efficiently.
          </p>
          <p>
            Bookmark ToolNest as your go-to utility hub. New tools are added regularly based on user feedback. If you find our tools helpful, share them with your classmates, colleagues, or community.
          </p>
        </div>
      </section>

      {/* FAQ for homepage */}
      <section className="reveal-up reveal-delay-3 mt-8 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">❓</div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-3">
          {homeFaqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200/60 bg-white/80 p-4 transition hover:border-indigo-200/60">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-bold text-slate-800 group-open:text-indigo-600">
                {faq.question}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
