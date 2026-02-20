import type { Metadata } from "next";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import HomeToolsSection from "@/components/HomeToolsSection";
import { ItemListSchema, WebSiteSchema } from "@/components/JsonLd";
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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — 70+ Free Online Tools",
    description: "70+ free browser-based tools for developers, SEO, students, creators, image tasks, and daily utilities.",
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
  return (
    <>
      <WebSiteSchema />
      <ItemListSchema
        items={tools.map((t) => ({
          name: t.name,
          url: `${siteConfig.url}/tools/${t.slug}`,
        }))}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_15px_45px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/40 via-purple-100/30 to-cyan-100/40" />
        <div className="relative max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            70+ Tools • Free • No Sign-up • Browser-based
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Free Online Tools for Developers, SEO, Students & Creators
          </h1>
          <p className="mt-4 text-balance text-base leading-7 text-slate-600 sm:text-lg">
            Solve daily tasks in seconds — format JSON, generate QR codes, calculate EMI, compress images, create hashtags, plan studies, and much more. All tools run 100% in your browser with zero data collection and no account required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Fast browser processing",
              "Privacy-first workflows",
              "Mobile-friendly interface",
              "No sign-up needed",
            ].map((item) => (
              <span key={item} className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#tools" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Explore All Tools ↓
            </Link>
            <Link href="/about" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-indigo-50">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Browse by category</h2>
        <p className="mt-2 text-sm text-slate-600">Choose a category to find the right tool fast.</p>
        <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryMeta.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/tools/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-white/70 bg-white/80 p-5 text-center shadow-[0_10px_30px_rgba(79,70,229,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(6,182,212,0.15)]"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700">{cat.name} Tools</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{count} tools</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All tools grid */}
      <section id="tools" className="mt-10 scroll-mt-24">
        <HomeToolsSection />
      </section>

      <AdPlaceholder slot="3333333333" />

      {/* SEO content */}
      <section className="mt-12 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Why ToolNest is the best free online tools website</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
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
      <section className="mt-8 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {[
            { q: "Are all tools on ToolNest free?", a: "Yes, every tool on ToolNest is 100% free to use with no hidden fees, sign-ups, or usage limits." },
            { q: "Is my data safe when using these tools?", a: "Absolutely. All tools run entirely in your browser. Your data is never sent to any server or stored anywhere." },
            { q: "Do I need to create an account?", a: "No. You can use any tool immediately without creating an account or providing any personal information." },
            { q: "How many tools does ToolNest offer?", a: "ToolNest currently offers 70+ free tools across 7 categories: Developer, SEO, Text, Student, Creator, Image, and Utility." },
            { q: "Can I use these tools on my phone?", a: "Yes. Every tool is designed with a mobile-first approach and works smoothly on phones, tablets, and desktop computers." },
            { q: "How often are new tools added?", a: "We regularly add new tools based on user feedback and trending needs. Bookmark this page to stay updated." },
          ].map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-slate-200 bg-white/60 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 group-open:text-indigo-700">{faq.q}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
