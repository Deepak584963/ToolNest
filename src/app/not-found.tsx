import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Browse our collection of 70+ free developer, SEO, student, creator, and utility tools.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Page Not Found — ToolNest",
    description: "The page you are looking for does not exist. Browse our collection of 70+ free online tools.",
    type: "website",
  },
};

export default function NotFound() {
  return (
    <section className="reveal-up flex flex-col items-center justify-center py-20 text-center">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-indigo-100/40 to-violet-100/40 blur-2xl" />
        <h1 className="relative gradient-text text-8xl font-extrabold sm:text-9xl">404</h1>
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-800 sm:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-3 max-w-md text-slate-500 leading-relaxed">
        Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist or has been
        moved. Try browsing our free tools below.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="pressable btn-primary inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 text-sm shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Go to Homepage
        </Link>
        <Link
          href="/about"
          className="pressable btn-secondary inline-flex min-h-12 items-center gap-2 rounded-full px-7 py-3 text-sm"
        >
          About ToolNest
        </Link>
      </div>

      <div className="mt-14 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 text-sm shadow-[0_2px_8px_rgba(99,102,241,0.1)]">🔥</div>
          <h3 className="text-lg font-bold text-slate-800">Popular Tools</h3>
        </div>
        <ul className="grid gap-2.5 text-sm sm:grid-cols-2">
          {[
            { name: "JSON Formatter & Validator", slug: "json-formatter-validator" },
            { name: "Meta Title & Description Preview", slug: "meta-title-description-preview" },
            { name: "Password Strength Checker", slug: "password-strength-checker" },
            { name: "UUID Generator", slug: "uuid-generator" },
            { name: "CSS Minifier & Beautifier", slug: "css-minifier-beautifier" },
            { name: "Word Counter & Reading Time", slug: "word-counter-reading-time" },
          ].map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="card-hover-glow group flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/85 px-4 py-3 text-slate-700 transition-all duration-200 hover:border-indigo-200/60 hover:text-indigo-600 hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs transition-transform duration-200 group-hover:scale-110">→</span>
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
