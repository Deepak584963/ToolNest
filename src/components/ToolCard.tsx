import Link from "next/link";
import type { Tool } from "@/lib/tools";

const categoryColors: Record<Tool["category"], string> = {
  dev: "bg-blue-50 text-blue-700",
  seo: "bg-purple-50 text-purple-700",
  text: "bg-slate-100 text-slate-700",
  student: "bg-emerald-50 text-emerald-700",
  creator: "bg-pink-50 text-pink-700",
  image: "bg-orange-50 text-orange-700",
  utility: "bg-teal-50 text-teal-700",
};

const categoryIcons: Record<Tool["category"], string> = {
  dev: "🛠️",
  seo: "🔍",
  text: "📝",
  student: "🎓",
  creator: "🎬",
  image: "🖼️",
  utility: "🧮",
};

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group micro-lift reveal-up flex h-full flex-col rounded-2xl border border-slate-200/60 bg-white/82 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(99,102,241,0.06)] transition hover:border-indigo-200/60 hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_16px_32px_rgba(99,102,241,0.1)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{categoryIcons[tool.category]}</span>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[tool.category]}`}>
          {tool.category}
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900 leading-snug sm:text-lg">{tool.name}</h3>
      <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-500">{tool.shortDescription}</p>
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href={`/tools/${tool.slug}`}
          className="pressable inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl btn-primary px-4 py-2 text-sm shadow-[0_4px_12px_rgba(99,102,241,0.2)] sm:w-auto sm:justify-start"
        >
          Open tool
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}
