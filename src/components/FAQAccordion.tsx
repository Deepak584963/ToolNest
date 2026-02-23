"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-label="Frequently asked questions" className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <article key={item.question} className={`rounded-2xl border transition-all duration-200 hover:shadow-[0_2px_8px_rgba(99,102,241,0.06)] ${isOpen ? "border-indigo-200/50 bg-white/95 shadow-[0_2px_12px_rgba(99,102,241,0.08)] dark:border-indigo-500/30 dark:bg-slate-800/80" : "border-slate-200/60 bg-white/85 hover:border-indigo-200/60 dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/40"}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              id={buttonId}
            >
              <span className="faq-number">{index + 1}</span>
              <span className={`flex-1 text-sm font-bold transition-colors ${isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>{item.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 shrink-0 transition-all duration-300 ${isOpen ? "rotate-180 text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isOpen ? <p id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5 pl-14 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.answer}</p> : null}
          </article>
        );
      })}
    </section>
  );
}
