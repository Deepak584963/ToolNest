"use client";

import Link from "next/link";
import { useFavoriteTools, useRecentTools } from "@/lib/useLocalTools";
import { tools, type Tool } from "@/lib/tools";

const categoryIcons: Record<string, string> = {
  dev: "🛠️", seo: "🔍", text: "📝", student: "🎓",
  creator: "🎬", image: "🖼️", utility: "🧮",
};

function SmallToolCard({ tool, isFav, onToggleFav }: { tool: Tool; isFav: boolean; onToggleFav: () => void }) {
  return (
    <div className="group relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/85 p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-indigo-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/40">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg transition-transform duration-300 group-hover:scale-110 dark:bg-slate-700">{categoryIcons[tool.category] || "⚡"}</span>
      <div className="min-w-0 flex-1">
        <Link href={`/tools/${tool.slug}`} className="block text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 truncate">
          {tool.name}
        </Link>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
      </div>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onToggleFav(); }}
        className={`shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
          isFav
            ? "text-amber-500 hover:text-amber-600 scale-110"
            : "text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400"
        }`}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        title={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>
  );
}

export default function RecentFavorites() {
  const { recentSlugs } = useRecentTools();
  const { favoriteSlugs, toggleFavorite, isFavorite } = useFavoriteTools();

  const recentTools = recentSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  const favoriteTools = favoriteSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  if (recentTools.length === 0 && favoriteTools.length === 0) return null;

  return (
    <section className="reveal-up space-y-4">
      {/* Favorites */}
      {favoriteTools.length > 0 && (
        <div className="rounded-3xl border border-amber-200/40 bg-gradient-to-br from-amber-50/60 via-white/70 to-orange-50/40 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(217,119,6,0.07)] sm:p-6 dark:border-amber-500/20 dark:from-slate-900/60 dark:via-slate-900/70 dark:to-amber-950/30">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg shadow-[0_2px_8px_rgba(217,119,6,0.12)] dark:bg-amber-900/50">⭐</div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Your Favorites</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{favoriteTools.length} saved tool{favoriteTools.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <SmallToolCard
                key={tool.slug}
                tool={tool}
                isFav={true}
                onToggleFav={() => toggleFavorite(tool.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      {recentTools.length > 0 && (
        <div className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-indigo-50/40 via-white/70 to-violet-50/30 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_32px_rgba(99,102,241,0.06)] sm:p-6 dark:border-slate-700/50 dark:from-slate-900/60 dark:via-slate-900/70 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.12)] dark:bg-indigo-900/50">🕐</div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Recently Used</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pick up where you left off</p>
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <SmallToolCard
                key={tool.slug}
                tool={tool}
                isFav={isFavorite(tool.slug)}
                onToggleFav={() => toggleFavorite(tool.slug)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
