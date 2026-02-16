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
        return (
          <article key={item.question} className="rounded-xl border border-slate-200 bg-white/80">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-slate-900">{item.question}</span>
              <span className="text-lg text-slate-500" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? <p className="px-4 pb-4 text-sm leading-6 text-slate-600">{item.answer}</p> : null}
          </article>
        );
      })}
    </section>
  );
}
