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
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const relatedTools = getRelatedTools(slug);
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
      />
      {workflow.length > 0 && (
        <HowToSchema
          name={tool.name}
          description={tool.shortDescription}
          steps={workflow}
        />
      )}

      <nav aria-label="Breadcrumb" className="reveal-up text-sm text-slate-500">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="hover:text-indigo-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/tools/category/${tool.category}`} className="hover:text-indigo-700">{categoryLabel} Tools</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700">{tool.name}</li>
        </ol>
      </nav>

      <header className="reveal-up reveal-delay-1 relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_12px_34px_rgba(79,70,229,0.1)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-indigo-100/35 via-sky-100/20 to-cyan-100/35" />
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="relative">
            <Link
              href={`/tools/category/${tool.category}`}
              className="mb-2 inline-flex rounded-full border border-cyan-100 bg-cyan-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800 hover:bg-cyan-200 transition"
            >
              {tool.category} tool
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{tool.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{tool.longDescription}</p>
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

      <section className="reveal-up reveal-delay-2 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">How to use {tool.name}</h2>
        <div className="mt-5 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
          {sections.map((section) => (
            <section key={section.heading} className="rounded-xl border border-slate-100 bg-white/75 p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-slate-900">{section.heading}</h3>
              <p className="mt-2">{section.content}</p>
            </section>
          ))}
        </div>
      </section>

      <AdPlaceholder label="After content section" slot="2222222222" />

      {faqs.length > 0 ? (
        <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4">
            <FAQAccordion items={faqs} />
          </div>
        </section>
      ) : null}

      <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Related tools you might like</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((relatedTool) => (
            <Link
              key={relatedTool.slug}
              href={`/tools/${relatedTool.slug}`}
              className="flex flex-col rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-sm font-semibold text-indigo-700">{relatedTool.name}</span>
              <span className="mt-1 text-xs text-slate-500 line-clamp-2">{relatedTool.shortDescription}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Category CTA */}
      <section className="reveal-up reveal-delay-3 rounded-2xl border border-white/70 bg-linear-to-r from-indigo-50 to-cyan-50 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Explore all {categoryLabel} tools</h2>
        <p className="mt-2 text-sm text-slate-600">Discover more free {categoryLabel.toLowerCase()} tools on ToolNest.</p>
        <Link
          href={`/tools/category/${tool.category}`}
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          View all {categoryLabel} tools →
        </Link>
      </section>
    </article>
  );
}
