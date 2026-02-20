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

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(6,182,212,0.18)]">
      <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryColors[tool.category]}`}>
        {tool.category}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 text-balance">{tool.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
      <Link
        href={`/tools/${tool.slug}`}
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-700"
      >
        Open tool
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
