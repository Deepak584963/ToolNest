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
  { href: "/tools/compress-image", label: "Compress Image" },
  { href: "/tools/image-to-pdf-converter", label: "Image to PDF" },
  { href: "/tools/image-cropper", label: "Image Cropper" },
  { href: "/tools/favicon-generator", label: "Favicon Generator" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/50 bg-white/60 backdrop-blur-xl">
      <div className="gradient-divider" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <p className="text-lg font-extrabold gradient-text">ToolNest</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              70+ free, browser-based tools for developers, SEO, students, creators, and everyday tasks. No sign-up required.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Fast &bull; Private &bull; Free forever
            </div>
          </div>

          {/* Categories */}
          <nav aria-label="Tool categories" className="sm:col-span-1 lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tool Categories</p>
            <ul className="mt-4 space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-indigo-600">
                    <span>{link.icon}</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular Tools */}
          <nav aria-label="Popular tools" className="sm:col-span-1 lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Popular Tools</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {popularTools.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-600 transition hover:text-indigo-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal & Info */}
          <nav aria-label="Company links" className="sm:col-span-2 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/about" className="text-sm text-slate-600 transition hover:text-indigo-600">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 transition hover:text-indigo-600">Contact</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-slate-600 transition hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-slate-600 transition hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-slate-600 transition hover:text-indigo-600">Disclaimer</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-slate-600 transition hover:text-indigo-600">RSS Feed</Link></li>
            </ul>
          </nav>
        </div>

        {/* Bottom copyright */}
        <div className="gradient-divider mt-10" />
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ToolNest. All rights reserved. Built for speed, privacy, and accessibility.
        </p>
      </div>
    </footer>
  );
}
