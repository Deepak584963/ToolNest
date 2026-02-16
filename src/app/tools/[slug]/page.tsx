import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQAccordion from "@/components/FAQAccordion";
import { BreadcrumbSchema, FAQSchema, SoftwareAppSchema } from "@/components/JsonLd";
import ToolUIWrapper from "@/components/ToolUIWrapper";
import { siteConfig } from "@/lib/site";
import {
  getRelatedTools,
  getToolArticleSections,
  getToolBySlug,
  getToolFaqs,
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

  const title = `${tool.name}`.slice(0, 58);
  const description = tool.shortDescription.slice(0, 155);

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

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const sections = getToolArticleSections(slug);
  const faqs = getToolFaqs(slug);
  const relatedTools = getRelatedTools(slug);

  const categoryMap: Record<string, string> = {
    dev: "DeveloperApplication",
    seo: "BrowserApplication",
    text: "BrowserApplication",
  };

  return (
    <article className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: tool.name, url: `${siteConfig.url}/tools/${tool.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />
      <SoftwareAppSchema
        name={tool.name}
        description={tool.shortDescription}
        url={`${siteConfig.url}/tools/${tool.slug}`}
        category={categoryMap[tool.category] ?? "BrowserApplication"}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-indigo-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/#tools" className="hover:text-indigo-700">Tools</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700">{tool.name}</li>
        </ol>
      </nav>

      <header className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <p className="mb-2 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800">
          {tool.category} tool
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{tool.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{tool.shortDescription}</p>
      </header>

      <section aria-label={`${tool.name} interface`}>
        <ToolUIWrapper slug={slug} />
      </section>

      <AdPlaceholder label="Below tool UI" slot="1111111111" />

      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">How to use {tool.name}</h2>
        <div className="mt-5 space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
          {sections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-lg font-semibold text-slate-900">{section.heading}</h3>
              <p className="mt-2">{section.content}</p>
            </section>
          ))}
        </div>
      </section>

      <AdPlaceholder label="After content section" slot="2222222222" />

      {faqs.length > 0 ? (
        <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4">
            <FAQAccordion items={faqs} />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Related tools</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {relatedTools.map((relatedTool) => (
            <Link
              key={relatedTool.slug}
              href={`/tools/${relatedTool.slug}`}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              {relatedTool.name}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
