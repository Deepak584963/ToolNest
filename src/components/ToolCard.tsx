import Link from "next/link";
import type { Tool } from "@/lib/tools";

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(6,182,212,0.18)]">
      <div className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
        {tool.category}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
      <Link
        href={`/tools/${tool.slug}`}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition group-hover:text-indigo-700"
      >
        Open tool
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
