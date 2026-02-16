import type { Metadata } from "next";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import HomeToolsSection from "@/components/HomeToolsSection";
import { WebSiteSchema } from "@/components/JsonLd";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "ToolNest",
  description: "Fast, free online tools for JSON, SEO, text cleanup, and developer workflows.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ToolNest",
    description: "Use 15 browser-based tools for SEO, developer tasks, and content optimization.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest",
    description: "Use 15 browser-based tools for SEO, developer tasks, and content optimization.",
  },
};

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_15px_45px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/40 via-purple-100/30 to-cyan-100/40" />
        <div className="relative max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Fast • Free • Browser-based
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">ToolNest — Free Online Tech Tools</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Solve daily developer, SEO, and content tasks in seconds with modern, client-side tools. No sign-up, no backend processing, and fully optimized for speed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/tools/${tools[0]?.slug}`} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Start with JSON Tool
            </Link>
            <Link href="/about" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-indigo-50">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <HomeToolsSection />
      </section>

      <AdPlaceholder slot="3333333333" />

      <section className="mt-12 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Why these online utilities help modern teams</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
          <p>
            Fast iteration matters across development, publishing, and SEO workflows. Small tasks like formatting JSON, fixing metadata length, cleaning copied text, or generating a sitemap can repeatedly interrupt focused work. This platform is built to remove that friction with lightweight browser-based tools that open instantly and run fully client side.
          </p>
          <p>
            Every utility on this website is designed around practical output: copy-ready snippets, clear validation feedback, and simple controls that work on desktop and mobile. Developers can debug payloads and generate UUIDs quickly. Bloggers can measure reading time and prepare slugs. SEO users can test canonical strategy, robots rules, and social previews before publishing live pages.
          </p>
          <p>
            The site structure also supports technical SEO best practices. Each tool has a dedicated crawlable URL, focused metadata, internal links to related utilities, and long-form educational content that explains when and how to apply each tool correctly. This combination improves user trust, session depth, and discoverability for long-tail search queries.
          </p>
          <p>
            Because there is no CMS and no backend dependency, the website is easy to deploy and maintain. Static generation keeps performance high and hosting costs low, while keeping the interface reliable under traffic spikes. The result is a practical utility hub for developers, students, and site owners who need clean output and straightforward guidance.
          </p>
        </div>
      </section>
    </>
  );
}
