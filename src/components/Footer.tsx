import Link from "next/link";

const categoryLinks = [
  { href: "/tools/category/dev", label: "Developer Tools", icon: "🛠️" },
  { href: "/tools/category/seo", label: "SEO Tools", icon: "🔍" },
  { href: "/tools/category/text", label: "Text Tools", icon: "📝" },
  { href: "/tools/category/student", label: "Student Tools", icon: "🎓" },
  { href: "/tools/category/creator", label: "Creator Tools", icon: "🎬" },
  { href: "/tools/category/image", label: "Image Tools", icon: "🖼️" },
  { href: "/tools/category/utility", label: "Utility Tools", icon: "🧮" },
];

const popularTools = [
  { href: "/tools/emi-calculator", label: "EMI Calculator" },
  { href: "/tools/loan-interest-calculator", label: "Loan Interest" },
  { href: "/tools/sip-calculator", label: "SIP Calculator" },
  { href: "/tools/currency-converter", label: "Currency Converter" },
  { href: "/tools/scientific-calculator", label: "Scientific Calculator" },
  { href: "/tools/schema-markup-generator", label: "Schema Markup" },
  { href: "/tools/hreflang-tag-generator", label: "Hreflang Tags" },
  { href: "/tools/redirect-rule-generator", label: "Redirect Rules" },
  { href: "/tools/robots-meta-tag-generator", label: "Robots Meta Tag" },
  { href: "/tools/keyword-cluster-generator", label: "Keyword Clusters" },
  { href: "/tools/youtube-chapter-timestamp-generator", label: "YouTube Chapters" },
  { href: "/tools/engagement-rate-calculator", label: "Engagement Calculator" },
  { href: "/tools/viral-content-calendar-generator", label: "Content Calendar" },
  { href: "/tools/best-time-to-post-planner", label: "Best Time to Post" },
  { href: "/tools/utm-link-builder-for-creators", label: "UTM Link Builder" },
  { href: "/tools/regex-tester-replacer", label: "Regex Tester" },
  { href: "/tools/jwt-decoder-inspector", label: "JWT Decoder" },
  { href: "/tools/http-status-code-lookup", label: "HTTP Status Lookup" },
];

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-base font-semibold text-slate-800">ToolNest</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              70+ free, browser-based tools for developers, SEO, students, creators, and everyday tasks. No sign-up required.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm font-semibold text-slate-800">Tool Categories</p>
            <ul className="mt-3 space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition hover:text-indigo-700">
                    <span>{link.icon}</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <p className="text-sm font-semibold text-slate-800">Popular Tools</p>
            <ul className="mt-3 space-y-2">
              {popularTools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-600 transition hover:text-indigo-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <p className="text-sm font-semibold text-slate-800">Company</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-slate-600 transition hover:text-indigo-700">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 transition hover:text-indigo-700">Contact</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-slate-600 transition hover:text-indigo-700">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-slate-600 transition hover:text-indigo-700">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-slate-600 transition hover:text-indigo-700">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="mt-10 border-t border-slate-200/60 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ToolNest. All rights reserved. Built for speed, privacy, and accessibility.
        </p>
      </div>
    </footer>
  );
}
