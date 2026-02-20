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
    <header className="sticky top-0 z-40 border-b border-white/65 bg-white/74 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-10 items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-900" onClick={() => setMenuOpen(false)}>
          <Image src="/toolnest-logo.svg" alt="ToolNest logo" width={28} height={28} />
          <span className="inline-flex items-center gap-2">
            ToolNest
            <span className="hidden rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 sm:inline">70+ tools</span>
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
                    className={`pressable micro-lift rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isActive(item.href) ? "bg-indigo-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.35)]" : "text-slate-700 hover:bg-white/85 hover:text-indigo-700"}`}
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
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-nav" className="border-t border-white/70 bg-white/84 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:hidden">
          <nav aria-label="Mobile navigation">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`pressable block min-h-11 rounded-xl px-3 py-3 text-base font-semibold ${isActive(item.href) ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
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
