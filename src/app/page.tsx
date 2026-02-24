import type { Metadata } from "next";
import Link from "next/link";
import HomeToolsSection from "@/components/HomeToolsSection";
import RecentFavorites from "@/components/RecentFavorites";
import { FAQSchema, ItemListSchema, OrganizationSchema, WebSiteSchema } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";
import { categoryMeta } from "@/lib/categories";

export const metadata: Metadata = {
  title: "ToolNest — 110+ Free Online Tools for Developers, SEO, Students & Creators",
  description: "Use 110+ free browser-based tools: JSON formatter, regex tester, JWT decoder, SQL formatter, QR code generator, EMI calculator, image compressor, and more. No signup needed.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ToolNest — 110+ Free Online Tools",
    description: "110+ free, fast, browser-based tools for developers, SEO, students, creators, image tasks, and daily utilities. No sign-up required.",
    url: "/",
    siteName: "ToolNest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — 110+ Free Online Tools",
    description: "110+ free browser-based tools for developers, SEO, students, creators, image tasks, and daily utilities.",
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
    { question: "How many tools does ToolNest offer?", answer: "ToolNest currently offers 110+ free tools across 7 categories: Developer, SEO, Text, Student, Creator, Image, and Utility." },
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
      <section className="reveal-up relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_16px_40px_rgba(99,102,241,0.1)] backdrop-blur-xl sm:p-10 lg:p-14 dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_16px_40px_rgba(99,102,241,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/40 via-purple-50/30 to-cyan-100/40 dark:from-indigo-900/20 dark:via-purple-900/10 dark:to-cyan-900/15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-linear-to-br from-indigo-200/25 to-violet-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 animate-float-delayed rounded-full bg-linear-to-tr from-cyan-200/25 to-sky-200/25 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 animate-float-slow rounded-full bg-linear-to-br from-violet-200/15 to-pink-200/15 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.08)]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            110+ Tools &bull; Free &bull; No Sign-up &bull; Browser-based
          </p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
            Free Online Tools for{" "}
            <span className="gradient-text">Developers, SEO, Students & Creators</span>
          </h1>
          <p className="mt-5 text-balance text-base leading-7 text-slate-500 sm:text-lg sm:leading-8 dark:text-slate-400">
            Solve daily tasks in seconds — format JSON, generate QR codes, calculate EMI, compress images, create hashtags, plan studies, and much more. All tools run 100% in your browser with zero data collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#tools" className="pressable btn-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm shadow-[0_4px_20px_rgba(99,102,241,0.35)] sm:w-auto">
              Explore All Tools
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </Link>
            <Link href="/about" className="pressable btn-secondary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-sm sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "110+", label: "Free Tools", icon: "⚡", color: "from-indigo-500/10 to-violet-500/10" },
            { value: "7", label: "Categories", icon: "📂", color: "from-cyan-500/10 to-sky-500/10" },
            { value: "100%", label: "Browser-based", icon: "🔒", color: "from-emerald-500/10 to-teal-500/10" },
            { value: "0", label: "Data Collected", icon: "🛡️", color: "from-amber-500/10 to-orange-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`stat-card group flex flex-col items-center gap-1.5 rounded-2xl bg-gradient-to-br ${stat.color} p-4 text-center`}>
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{stat.icon}</span>
              <span className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-slate-100">{stat.value}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent & Favorites Dashboard */}
      <div className="mt-6">
        <RecentFavorites />
      </div>

      {/* Category cards */}
      <section className="reveal-up reveal-delay-1 mt-10 rounded-3xl border border-white/50 bg-white/65 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)]">📂</div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Browse by category</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Choose a category to find the right tool fast.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryMeta.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/tools/category/${cat.slug}`}
                className="card-hover-glow group gradient-border flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl bg-white/88 p-5 text-center shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_20px_rgba(99,102,241,0.05)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(99,102,241,0.1),0_20px_40px_rgba(99,102,241,0.1)] dark:bg-slate-800/60"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{cat.icon}</span>
                <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">{cat.name} Tools</span>
                <span className="rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-0.5 text-[10px] font-bold text-indigo-600 shadow-[0_1px_4px_rgba(99,102,241,0.08)] dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-400">{count} tools</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All tools grid */}
      <section id="tools" className="reveal-up reveal-delay-2 mt-10 scroll-mt-24 rounded-3xl border border-white/50 bg-white/65 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/50 dark:bg-slate-800/40">
        <HomeToolsSection />
      </section>

      {/* SEO content */}
      <section className="reveal-up reveal-delay-2 mt-12 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)]">✨</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Why ToolNest is the best free online tools website</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 dark:text-slate-400">
          <p>
            ToolNest brings together 110+ professional-grade utilities in one fast, clean interface. Whether you are a developer debugging JSON payloads, an SEO specialist optimizing meta tags, a student calculating CGPA, a content creator generating hashtags, or anyone who needs to compress an image or calculate EMI — we have the right tool for you.
          </p>
          <p>
            Every tool runs entirely in your browser. Your data never leaves your device, which means maximum privacy and zero latency. There is no account to create, no software to install, and no usage limits. Just open a tool and start working.
          </p>
          <p>
            Our tools are organized into eight categories: <Link href="/tools/category/dev" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Developer</Link>, <Link href="/tools/category/seo" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">SEO</Link>, <Link href="/tools/category/text" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Text</Link>, <Link href="/tools/category/student" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Student</Link>, <Link href="/tools/category/creator" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Creator</Link>, <Link href="/tools/category/image" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Image</Link>, <Link href="/tools/category/utility" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">Utility</Link>, and <Link href="/tools/category/pdf" className="font-medium text-indigo-700 hover:underline dark:text-indigo-400">PDF</Link>. Each tool includes detailed instructions, practical examples, common mistakes to avoid, and answers to frequently asked questions.
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
      <section className="reveal-up reveal-delay-3 mt-8 rounded-3xl border border-white/50 bg-white/70 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.07)] sm:p-8 dark:border-slate-700/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)]">❓</div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-3">
          {homeFaqs.map((faq, index) => (
            <details key={faq.question} className="group rounded-2xl border border-slate-200/60 bg-white/85 p-4 transition-all duration-200 hover:border-indigo-200/60 hover:shadow-[0_2px_8px_rgba(99,102,241,0.06)] open:border-indigo-200/50 open:bg-white/95 dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/40 dark:open:border-indigo-500/30 dark:open:bg-slate-800/80">
              <summary className="flex cursor-pointer items-center gap-3 text-sm font-bold text-slate-800 group-open:text-indigo-600 dark:text-slate-200 dark:group-open:text-indigo-400">
                <span className="faq-number">{index + 1}</span>
                <span className="flex-1">{faq.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </summary>
              <p className="mt-3 pl-10 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
