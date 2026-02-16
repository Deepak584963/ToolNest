"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools";

type Category = "all" | "text" | "seo" | "dev";

const categories: Category[] = ["all", "text", "seo", "dev"];

export default function HomeToolsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return tools;
    return tools.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="space-y-6" aria-labelledby="tools-grid-title">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              activeCategory === category
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 id="tools-grid-title" className="sr-only">
        Online tech tools list
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
