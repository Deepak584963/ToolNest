import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQAccordion from "@/components/FAQAccordion";
import { BreadcrumbSchema, FAQSchema, HowToSchema, SoftwareAppSchema } from "@/components/JsonLd";
import ShareTool from "@/components/ShareTool";
import ToolUIWrapper from "@/components/ToolUIWrapper";
import { siteConfig } from "@/lib/site";
import { getCategoryMeta } from "@/lib/categories";
import {
  getRelatedTools,
  getToolSearchIntents,
  getToolArticleSections,
  getToolBySlug,
  getToolFaqs,
  getToolWorkflow,
  tools,
} from "@/lib/tools";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "Requested tool is unavailable.",
    };
  }

  const title = `${tool.name} — Free Online Tool`;
  const description = `${tool.shortDescription} Use this free ${tool.category} tool online — no sign-up, runs in your browser.`.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${tool.slug}`,
      siteName: "ToolNest",
      locale: "en_US",
      type: "article",
      publishedTime: "2025-01-01T00:00:00Z",
      modifiedTime: "2025-06-01T00:00:00Z",
      authors: ["ToolNest Team"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@toolnest",
    },
    keywords: tool.keywords,
  };
}

const categoryAppMap: Record<string, string> = {
  dev: "DeveloperApplication",
  seo: "BrowserApplication",
  text: "BrowserApplication",
  student: "EducationalApplication",
  creator: "MultimediaApplication",
  image: "MultimediaApplication",
  utility: "FinanceApplication",
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const sections = getToolArticleSections(slug);
  const faqs = getToolFaqs(slug);
  const relatedTools = getRelatedTools(slug, 6);
  const searchIntents = getToolSearchIntents(slug, 12);
  const categoryTools = tools.filter((entry) => entry.category === tool.category && entry.slug !== tool.slug).slice(0, 6);
  const workflow = getToolWorkflow(slug);
  const catMeta = getCategoryMeta(tool.category);
  const categoryLabel = catMeta?.name ?? tool.category;

  return (
    <article className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: `${categoryLabel} Tools`, url: `${siteConfig.url}/tools/category/${tool.category}` },
          { name: tool.name, url: `${siteConfig.url}/tools/${tool.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />
      <SoftwareAppSchema
        name={tool.name}
        description={tool.shortDescription}
        url={`${siteConfig.url}/tools/${tool.slug}`}
        category={categoryAppMap[tool.category] ?? "BrowserApplication"}
        keywords={tool.keywords}
        datePublished="2025-01-01T00:00:00Z"
        dateModified="2025-06-01T00:00:00Z"
      />
      {workflow.length > 0 && (
        <HowToSchema
          name={tool.name}
          description={tool.shortDescription}
          steps={workflow}
        />
      )}

      <nav aria-label="Breadcrumb" className="reveal-up text-sm text-slate-400">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="font-medium text-slate-500 hover:text-indigo-600 transition">Home</Link></li>
          <li aria-hidden className="text-slate-300">/</li>
          <li><Link href={`/tools/category/${tool.category}`} className="font-medium text-slate-500 hover:text-indigo-600 transition">{categoryLabel} Tools</Link></li>
          <li aria-hidden className="text-slate-300">/</li>
          <li className="font-semibold text-indigo-600">{tool.name}</li>
        </ol>
      </nav>

      <header className="reveal-up reveal-delay-1 relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_34px_rgba(99,102,241,0.08)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-indigo-100/30 via-purple-50/20 to-cyan-100/30" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-indigo-200/15 to-violet-200/15 blur-3xl" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="relative">
            <Link
              href={`/tools/category/${tool.category}`}
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200/50 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:bg-indigo-100 transition"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {tool.category} tool
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{tool.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">{tool.longDescription}</p>
            <time dateTime="2025-06-01T00:00:00Z" className="mt-3 inline-block text-xs text-slate-400">Last updated: June 2025</time>
          </div>
          <div className="relative">
            <ShareTool title={tool.name} slug={tool.slug} />
          </div>
        </div>
      </header>

      <section aria-label={`${tool.name} interface`} className="tool-mobile-shell reveal-up reveal-delay-2">
        <ToolUIWrapper slug={slug} />
      </section>

      <AdPlaceholder label="Below tool UI" slot="1111111111" />

      <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_28px_rgba(99,102,241,0.06)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">📖</div>
          <h2 className="text-2xl font-extrabold text-slate-900">How to use {tool.name}</h2>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {sections.map((section) => (
            <section key={section.heading} className="section-accent rounded-xl border border-slate-100/80 bg-white/70 p-4 pl-5 sm:p-5 sm:pl-6">
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">{section.heading}</h3>
              <p className="mt-2">{section.content}</p>
            </section>
          ))}
        </div>
      </section>

      {searchIntents.length > 0 ? (
        <section className="reveal-up reveal-delay-2 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_28px_rgba(99,102,241,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">🔍</div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular use-case searches</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Users typically discover {tool.name} through these high-intent search patterns.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {searchIntents.map((intent) => (
              <Link key={intent} href={`/tools/${tool.slug}`} className="chip" title={intent}>
                {intent}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <AdPlaceholder label="After content section" slot="2222222222" />

      {faqs.length > 0 ? (
        <section className="reveal-up reveal-delay-3 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_28px_rgba(99,102,241,0.06)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">❓</div>
            <h2 className="text-2xl font-extrabold text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="gradient-divider mt-4" />
          <div className="mt-5">
            <FAQAccordion items={faqs} />
          </div>
        </section>
      ) : null}

      <section className="reveal-up reveal-delay-3 rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_28px_rgba(99,102,241,0.06)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">🧩</div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Related tools you might like</h2>
            <p className="mt-0.5 text-sm text-slate-500">Continue your workflow with tools matched by category, intent, and practical next steps.</p>
          </div>
        </div>
        <div className="gradient-divider mt-4" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((relatedTool) => (
            <Link
              key={relatedTool.slug}
              href={`/tools/${relatedTool.slug}`}
              className="pressable micro-lift group flex flex-col rounded-2xl border border-slate-200/60 bg-white/85 p-4 transition hover:border-indigo-200/60 hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_12px_24px_rgba(99,102,241,0.08)]"
            >
              <span className="mb-2 inline-flex w-fit rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">{relatedTool.category}</span>
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">{relatedTool.name}</span>
              <span className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{relatedTool.shortDescription}</span>
            </Link>
          ))}
        </div>
        {categoryTools.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">More in {categoryLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryTools.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/tools/${entry.slug}`}
                  className="pressable micro-lift rounded-full border border-slate-200/60 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  {entry.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* Category CTA */}
      <section className="reveal-up reveal-delay-3 relative overflow-hidden rounded-3xl border border-white/50 bg-linear-to-br from-indigo-50/80 via-purple-50/50 to-cyan-50/80 p-8 text-center sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br from-indigo-200/20 to-violet-200/20 blur-3xl" />
        <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Explore all {categoryLabel} tools</h2>
        <p className="mt-2 text-sm text-slate-500">Discover more free {categoryLabel.toLowerCase()} tools on ToolNest.</p>
        <Link
          href={`/tools/category/${tool.category}`}
          className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full btn-primary px-7 py-3 text-sm shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
        >
          View all {categoryLabel} tools
          <span aria-hidden>→</span>
        </Link>
      </section>
    </article>
  );
}
