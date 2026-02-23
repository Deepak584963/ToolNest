"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Tools", icon: "⚡" },
  { href: "/about", label: "About", icon: "💡" },
  { href: "/contact", label: "Contact", icon: "✉️" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/tools");
    return pathname === href;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${scrolled ? "header-scrolled border-slate-200/40 bg-white/90 dark:border-slate-700/40 dark:bg-slate-900/90" : "border-white/50 bg-white/72 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(99,102,241,0.06)] dark:border-slate-800/50 dark:bg-slate-900/72"}`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex min-h-10 items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100" onClick={() => setMenuOpen(false)}>
          <div className="relative">
            <Image src="/toolnest-logo.svg" alt="ToolNest logo" width={32} height={32} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
            <div className="absolute -inset-1 rounded-full bg-indigo-400/15 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
          </div>
          <span className="inline-flex items-center gap-2.5">
            <span className="gradient-text text-xl">ToolNest</span>
            <span className="hidden items-center gap-1 rounded-full border border-indigo-200/60 bg-indigo-50/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:inline-flex dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-400">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              110+ tools
            </span>
          </span>
        </Link>
        <div className="hidden items-center gap-2 sm:flex sm:gap-3">
          <SearchBar />
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`pressable rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      isActive(item.href) ? "btn-primary shadow-[0_4px_16px_rgba(99,102,241,0.3)]" : "text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <SearchBar />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-indigo-500"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative h-5 w-5">
              <span className={`absolute left-0.5 top-1 block h-0.5 w-4 transform rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-2.5 rotate-45" : ""}`} />
              <span className={`absolute left-0.5 top-2.5 block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
              <span className={`absolute left-0.5 top-4 block h-0.5 w-4 transform rounded-full bg-current transition-all duration-300 ${menuOpen ? "top-2.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-nav" className="fade-scale-in border-t border-white/50 bg-white/92 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:hidden dark:border-slate-700/50 dark:bg-slate-900/95">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`pressable flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition ${isActive(item.href) ? "btn-primary rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.25)]" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"}`}
                  >
                    <span className="text-lg">{item.icon}</span>
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
