"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
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
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 sm:min-w-52"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-[15vh] backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/70 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 70+ free tools…"
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setOpen(false); setQuery(""); }}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {query.length < 2 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">Type at least 2 characters to search…</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">No tools found for &quot;{query}&quot;</p>
              ) : (
                <ul>
                  {results.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => { setOpen(false); setQuery(""); }}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-indigo-50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{tool.shortDescription}</p>
                        </div>
                        <span className={`mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${categoryColors[tool.category] ?? "bg-slate-100 text-slate-600"}`}>
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
