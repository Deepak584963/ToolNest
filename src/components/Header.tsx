"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

const navItems = [
  { href: "/", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/tools");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/72 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(99,102,241,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex min-h-10 items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900" onClick={() => setMenuOpen(false)}>
          <Image src="/toolnest-logo.svg" alt="ToolNest logo" width={30} height={30} className="transition-transform group-hover:scale-105" />
          <span className="inline-flex items-center gap-2">
            <span className="gradient-text">ToolNest</span>
            <span className="hidden rounded-full border border-indigo-200/60 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:inline">70+ tools</span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 sm:flex sm:gap-3">
          <SearchBar />
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-0.5 sm:gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`pressable micro-lift rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${isActive(item.href) ? "btn-primary shadow-[0_4px_16px_rgba(99,102,241,0.3)]" : "text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-700"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <SearchBar />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="pressable micro-lift min-h-10 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-indigo-300 hover:text-indigo-700"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-nav" className="fade-scale-in border-t border-white/50 bg-white/88 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`pressable block min-h-11 rounded-xl px-4 py-3 text-base font-semibold ${isActive(item.href) ? "btn-primary rounded-xl" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
