import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ToolNest, our mission, the team behind the tools, and why we built this platform.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_12px_34px_rgba(79,70,229,0.1)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/35 via-sky-100/20 to-cyan-100/35" />
      <div className="relative">
      <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">About ToolNest</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Built for speed, privacy, and usability</h1>

      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Our Mission</h2>
          <p className="mt-2">
            ToolNest was created with a clear mission: provide fast, reliable, and free online utilities that solve small but frequent technical problems. Whether you are a developer debugging an API response, a blogger optimizing an article for search engines, a student learning about web technologies, or a website owner preparing metadata, our tools are designed to save you time and effort every day.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">What We Offer</h2>
          <p className="mt-2">
            We provide a curated collection of 15+ browser-based tools spanning three categories:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Developer tools:</strong> JSON formatter, Base64 encoder/decoder, CSS minifier, UUID generator, and password strength checker for everyday coding tasks.</li>
            <li><strong>SEO tools:</strong> Meta tag previews, robots.txt and sitemap generators, canonical URL checkers, Open Graph preview, keyword density analysis, and slug generators for on-page optimization.</li>
            <li><strong>Text utilities:</strong> Word counter with reading time estimates, Lorem Ipsum generator, and text cleaner for content preparation workflows.</li>
          </ul>
          <p className="mt-2">
            Every tool runs entirely in your browser. Your data stays on your device and is never uploaded to our servers for processing.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Why ToolNest?</h2>
          <p className="mt-2">
            Most online tool websites are cluttered with intrusive ads, require sign-ups, or are slow to load. ToolNest takes a different approach. We built everything with performance-first principles using Next.js static generation, ensuring pages load instantly. The interface follows modern design patterns with clean typography, intuitive controls, and mobile-responsive layouts.
          </p>
          <p className="mt-2">
            Beyond the tools themselves, every page includes detailed educational content explaining what each tool does, when to use it, how it works, practical examples, and common mistakes to avoid. This makes ToolNest not just a utility platform but also a learning resource.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Our Approach to Quality</h2>
          <p className="mt-2">
            We believe utility tools should be trustworthy and transparent. Our tools use well-established algorithms and follow documented web standards. All SEO guidance aligns with current search engine documentation and industry best practices. Tool outputs are deterministic and reproducible, meaning you get the same result every time for the same input.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Technology Stack</h2>
          <p className="mt-2">
            ToolNest is built with Next.js (App Router) and TypeScript for type safety and maintainability. The UI uses Tailwind CSS for consistent styling across all pages. The entire site is statically generated for optimal performance and deployed on Vercel&apos;s edge network for fast global access.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">Get in Touch</h2>
          <p className="mt-2">
            We are always working to improve existing tools and add new ones based on user feedback. If you have suggestions, found an issue, or want to collaborate, visit our{" "}
            <Link href="/contact" className="font-semibold text-indigo-700 hover:text-indigo-800">Contact page</Link> to reach out. You can also review our{" "}
            <Link href="/privacy-policy" className="font-semibold text-indigo-700 hover:text-indigo-800">Privacy Policy</Link>,{" "}
            <Link href="/terms-of-service" className="font-semibold text-indigo-700 hover:text-indigo-800">Terms of Service</Link>, and{" "}
            <Link href="/disclaimer" className="font-semibold text-indigo-700 hover:text-indigo-800">Disclaimer</Link> for full transparency about how the site operates.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
