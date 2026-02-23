"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [query, results.length]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const categoryColors: Record<string, string> = {
    dev: "bg-blue-50 text-blue-700",
    seo: "bg-purple-50 text-purple-700",
    text: "bg-slate-100 text-slate-700",
    student: "bg-emerald-50 text-emerald-700",
    creator: "bg-pink-50 text-pink-700",
    image: "bg-orange-50 text-orange-700",
    utility: "bg-teal-50 text-teal-700",
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pressable flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-slate-200/60 bg-white/85 px-0 text-sm text-slate-400 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(99,102,241,0.06)] backdrop-blur-xl transition-all duration-200 hover:border-indigo-200/60 hover:text-indigo-600 hover:shadow-[0_2px_8px_rgba(99,102,241,0.1)] sm:h-auto sm:w-auto sm:min-w-56 sm:justify-start sm:px-3.5 sm:py-2"
        aria-label="Search tools"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search tools…</span>
        <kbd className="ml-auto hidden rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-overlay bg-slate-900/30 px-3 pt-16 sm:px-4 sm:pt-[15vh]">
          <div className="fade-scale-in w-full max-w-lg rounded-2xl border border-white/60 bg-white/95 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_24px_56px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((prev) => (results.length === 0 ? -1 : (prev + 1) % results.length));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((prev) => (results.length === 0 ? -1 : (prev <= 0 ? results.length - 1 : prev - 1)));
                  }
                  if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
                    e.preventDefault();
                    const slug = results[activeIndex].slug;
                    setOpen(false);
                    setQuery("");
                    router.push(`/tools/${slug}`);
                  }
                }}
                placeholder="Search 70+ free tools…"
                className="flex-1 bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setOpen(false); setQuery(""); }}
                className="pressable rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <span className="sm:hidden">Close</span>
                <span className="hidden sm:inline">ESC</span>
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-2 sm:max-h-80">
              {results.length > 0 ? <p className="px-3 pb-2 text-[11px] text-slate-400">Use ↑ ↓ to navigate and Enter to open</p> : null}
              {query.length < 2 ? (
                <div className="px-3 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-xl shadow-[0_2px_8px_rgba(99,102,241,0.1)]">🔍</div>
                  <p className="mt-3 text-sm font-medium text-slate-500">Search 70+ free tools</p>
                  <p className="mt-1 text-xs text-slate-400">Type at least 2 characters to search…</p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-gray-50 text-xl">🤔</div>
                  <p className="mt-3 text-sm font-medium text-slate-500">No tools found for &quot;{query}&quot;</p>
                  <p className="mt-1 text-xs text-slate-400">Try a different keyword or browse categories</p>
                </div>
              ) : (
                <ul>
                  {results.map((tool, index) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => { setOpen(false); setQuery(""); }}
                        className={`pressable micro-lift flex items-start gap-3 rounded-xl px-3 py-3 transition ${activeIndex === index ? "bg-indigo-50/90 border border-indigo-100" : "border border-transparent hover:bg-indigo-50/70"}`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{tool.shortDescription}</p>
                        </div>
                        <span className={`mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[tool.category] ?? "bg-slate-100 text-slate-600"}`}>
                          {tool.category}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
