import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">ToolNest</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
              Free, browser-based developer and SEO tools. No sign-up required.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <Link href="/about" className="transition hover:text-indigo-700">About</Link>
            <Link href="/contact" className="transition hover:text-indigo-700">Contact</Link>
            <Link href="/terms-of-service" className="transition hover:text-indigo-700">Terms</Link>
            <Link href="/privacy-policy" className="transition hover:text-indigo-700">Privacy</Link>
            <Link href="/disclaimer" className="transition hover:text-indigo-700">Disclaimer</Link>
          </nav>
        </div>
        {/* Bottom copyright */}
        <p className="mt-8 border-t border-slate-200/60 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ToolNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
