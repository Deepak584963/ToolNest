import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Browse our collection of free developer and SEO tools.",
};

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-7xl font-extrabold text-indigo-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-800">
        Page Not Found
      </h2>
      <p className="mt-3 max-w-md text-slate-600">
        Sorry, the page you&rsquo;re looking for doesn&rsquo;t exist or has been
        moved. Try browsing our free tools below.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
        >
          Go to Homepage
        </Link>
        <Link
          href="/about"
          className="rounded-xl border border-indigo-200 bg-white px-6 py-3 font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
        >
          About ToolNest
        </Link>
      </div>

      <div className="mt-12 max-w-lg text-left">
        <h3 className="mb-3 text-lg font-semibold text-slate-700">
          Popular Tools
        </h3>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
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
                className="block rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
