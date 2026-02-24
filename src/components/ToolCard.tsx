"use client";

import Link from "next/link";
import type { Tool } from "@/lib/tools";
import { useFavoriteTools } from "@/lib/useLocalTools";

const categoryColors: Record<Tool["category"], string> = {
  dev: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50",
  seo: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50",
  text: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50",
  student: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50",
  creator: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/50 dark:text-pink-400 dark:border-pink-800/50",
  image: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50",
  utility: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50",
  pdf: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50",
};

const categoryAccents: Record<Tool["category"], string> = {
  dev: "from-blue-500 to-indigo-500",
  seo: "from-purple-500 to-violet-500",
  text: "from-slate-500 to-gray-500",
  student: "from-emerald-500 to-teal-500",
  creator: "from-pink-500 to-rose-500",
  image: "from-orange-500 to-amber-500",
  utility: "from-teal-500 to-cyan-500",
  pdf: "from-red-500 to-rose-500",
};

const categoryIcons: Record<Tool["category"], string> = {
  dev: "🛠️",
  seo: "🔍",
  text: "📝",
  student: "🎓",
  creator: "🎬",
  image: "🖼️",
  utility: "🧮",
  pdf: "📄",
};

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavoriteTools();
  const fav = isFavorite(tool.slug);

  return (
    <article className="card-hover-glow group micro-lift reveal-up flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/85 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(99,102,241,0.06)] transition-all duration-300 hover:border-indigo-200/50 hover:shadow-[0_4px_12px_rgba(99,102,241,0.1),0_20px_40px_rgba(99,102,241,0.1)] dark:border-slate-700/60 dark:bg-slate-800/60 dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_8px_24px_rgba(99,102,241,0.05)] dark:hover:border-indigo-500/40 dark:hover:shadow-[0_4px_12px_rgba(99,102,241,0.15),0_20px_40px_rgba(99,102,241,0.1)]">
      {/* Top accent stripe */}
      <div className={`h-1 w-full bg-gradient-to-r ${categoryAccents[tool.category]} opacity-60 transition-opacity group-hover:opacity-100`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:bg-slate-700">{categoryIcons[tool.category]}</span>
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[tool.category]}`}>
            {tool.category}
          </span>
          {/* ⭐ Favorite Button */}
          <button
            type="button"
            onClick={() => toggleFavorite(tool.slug)}
            className={`ml-auto shrink-0 rounded-lg p-1.5 transition-all duration-200 ${
              fav
                ? "text-amber-500 hover:text-amber-600 scale-110"
                : "text-slate-300 hover:text-amber-400 opacity-0 group-hover:opacity-100 dark:text-slate-600 dark:hover:text-amber-400"
            }`}
            aria-label={fav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="h-4 w-4 transition-transform duration-200 hover:scale-125">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        </div>
        <h3 className="text-base font-bold text-slate-900 leading-snug transition-colors group-hover:text-indigo-700 sm:text-lg dark:text-slate-100 dark:group-hover:text-indigo-400">{tool.name}</h3>
        <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
        <div className="mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-700/60">
          <Link
            href={`/tools/${tool.slug}`}
            className="pressable inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl btn-primary px-4 py-2.5 text-sm shadow-[0_4px_12px_rgba(99,102,241,0.2)] sm:w-auto sm:justify-start"
          >
            Use this tool
            <span aria-hidden className="inline-flex transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
