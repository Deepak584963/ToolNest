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
  { href: "/tools/json-formatter-validator", label: "JSON Formatter" },
  { href: "/tools/qr-code-generator", label: "QR Code Generator" },
  { href: "/tools/emi-calculator", label: "EMI Calculator" },
  { href: "/tools/percentage-calculator", label: "Percentage Calculator" },
  { href: "/tools/instagram-hashtag-generator", label: "Hashtag Generator" },
  { href: "/tools/compress-image", label: "Compress Image" },
  { href: "/tools/word-counter-reading-time", label: "Word Counter" },
  { href: "/tools/meta-title-description-preview", label: "Meta Tag Preview" },
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
              55+ free, browser-based tools for developers, SEO, students, creators, and everyday tasks. No sign-up required.
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
