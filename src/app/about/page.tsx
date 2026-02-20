import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ToolNest, our mission, the team behind the tools, and why we built this platform.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About ToolNest",
    description: "Learn how ToolNest builds fast, privacy-first tools for developers, SEO, students, creators, and daily workflows.",
    url: "/about",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "About ToolNest",
    description: "Learn how ToolNest builds fast, privacy-first tools for developers, SEO, students, creators, and daily workflows.",
    site: "@toolnest",
  },
};

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_34px_rgba(99,102,241,0.08)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-indigo-200/15 to-violet-200/15 blur-3xl" />
      <div className="relative">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
        About ToolNest
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Built for <span className="gradient-text">speed, privacy, and usability</span></h1>

      <div className="gradient-divider mt-6" />
      <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Our Mission</h2>
          <p className="mt-2">
            ToolNest was created with a clear mission: provide fast, reliable, and free online utilities that solve small but frequent technical problems. Whether you are a developer debugging an API response, a blogger optimizing an article for search engines, a student learning about web technologies, or a website owner preparing metadata, our tools are designed to save you time and effort every day.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">What We Offer</h2>
          <p className="mt-2">
            We provide a curated collection of 70+ browser-based tools spanning seven categories:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Developer tools:</strong> JSON formatter, Base64 encoder/decoder, CSS minifier, UUID generator, regex tester, JWT decoder, cron builder, and more for everyday coding tasks.</li>
            <li><strong>SEO tools:</strong> Schema markup generator, meta tag previews, robots.txt and sitemap generators, canonical URL checkers, hreflang tags, keyword clustering, and slug generators for on-page optimization.</li>
            <li><strong>Text utilities:</strong> Word counter with reading time estimates, Lorem Ipsum generator, and text cleaner for content preparation workflows.</li>
            <li><strong>Student tools:</strong> Percentage calculator, CGPA converter, attendance tracker, GPA calculator, exam countdown timer, study planner, and marks-required calculator for academic needs.</li>
            <li><strong>Creator tools:</strong> YouTube chapter generator, engagement rate calculator, content calendar planner, best-time-to-post planner, UTM link builder, and hashtag generators for social media growth.</li>
            <li><strong>Image tools:</strong> Image compressor, image-to-PDF converter, image cropper, QR code generator, favicon generator, and color palette extractor for visual workflows.</li>
            <li><strong>Utility tools:</strong> EMI calculator, loan interest calculator, SIP calculator, currency converter, scientific calculator, and unit converters for everyday calculations.</li>
          </ul>
          <p className="mt-2">
            Every tool runs entirely in your browser. Your data stays on your device and is never uploaded to our servers for processing.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Why ToolNest?</h2>
          <p className="mt-2">
            Most online tool websites are cluttered with intrusive ads, require sign-ups, or are slow to load. ToolNest takes a different approach. We built everything with performance-first principles using Next.js static generation, ensuring pages load instantly. The interface follows modern design patterns with clean typography, intuitive controls, and mobile-responsive layouts.
          </p>
          <p className="mt-2">
            Beyond the tools themselves, every page includes detailed educational content explaining what each tool does, when to use it, how it works, practical examples, and common mistakes to avoid. This makes ToolNest not just a utility platform but also a learning resource.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Our Approach to Quality</h2>
          <p className="mt-2">
            We believe utility tools should be trustworthy and transparent. Our tools use well-established algorithms and follow documented web standards. All SEO guidance aligns with current search engine documentation and industry best practices. Tool outputs are deterministic and reproducible, meaning you get the same result every time for the same input.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Technology Stack</h2>
          <p className="mt-2">
            ToolNest is built with Next.js (App Router) and TypeScript for type safety and maintainability. The UI uses Tailwind CSS for consistent styling across all pages. The entire site is statically generated for optimal performance and deployed on Vercel&apos;s edge network for fast global access.
          </p>
        </div>

        <div className="section-accent rounded-2xl border border-slate-100/80 bg-white/70 p-5 pl-6 sm:p-6 sm:pl-7">
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">Get in Touch</h2>
          <p className="mt-2">
            We are always working to improve existing tools and add new ones based on user feedback. If you have suggestions, found an issue, or want to collaborate, visit our{" "}
            <Link href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-700">Contact page</Link> to reach out. You can also review our{" "}
            <Link href="/privacy-policy" className="font-semibold text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>,{" "}
            <Link href="/terms-of-service" className="font-semibold text-indigo-600 hover:text-indigo-700">Terms of Service</Link>, and{" "}
            <Link href="/disclaimer" className="font-semibold text-indigo-600 hover:text-indigo-700">Disclaimer</Link> for full transparency about how the site operates.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
