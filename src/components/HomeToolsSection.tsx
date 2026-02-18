"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

type Category = "all" | "text" | "seo" | "dev" | "student" | "creator" | "image" | "utility";

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All Tools" },
  { key: "dev", label: "Developer" },
  { key: "seo", label: "SEO" },
  { key: "text", label: "Text" },
  { key: "student", label: "Student" },
  { key: "creator", label: "Creator" },
  { key: "image", label: "Image" },
  { key: "utility", label: "Utility" },
];

export default function HomeToolsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return tools;
    return tools.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="space-y-6" aria-labelledby="tools-grid-title">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 id="tools-grid-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          All free online tools
        </h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {filteredTools.length} tools
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === cat.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
