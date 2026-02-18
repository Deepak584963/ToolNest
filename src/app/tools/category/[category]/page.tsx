import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { categoryMeta, getCategoryMeta, getCategorySlugs } from "@/lib/categories";
import { tools } from "@/lib/tools";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) {
    return { title: "Category Not Found" };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/tools/category/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/tools/category/${meta.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    keywords: meta.keywords,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const meta = getCategoryMeta(category);

  if (!meta) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === meta.slug);
  const otherCategories = categoryMeta.filter((c) => c.slug !== meta.slug);

  // Generate FAQ items for this category
  const faqs = [
    {
      question: `How many ${meta.name.toLowerCase()} tools are available on ToolNest?`,
      answer: `ToolNest offers ${categoryTools.length} free ${meta.name.toLowerCase()} tools that you can use directly in your browser without signing up.`,
    },
    {
      question: `Are these ${meta.name.toLowerCase()} tools free to use?`,
      answer: `Yes, all ${meta.name.toLowerCase()} tools on ToolNest are completely free. There are no hidden fees, sign-ups, or usage limits.`,
    },
    {
      question: `Do these tools send my data to a server?`,
      answer: `No, all ToolNest tools run entirely in your browser. Your data stays on your device and is never transmitted to any server.`,
    },
    {
      question: `Can I use these tools on mobile devices?`,
      answer: `Yes, every tool is designed with a mobile-first approach and works smoothly on phones, tablets, and desktops.`,
    },
  ];

  return (
    <article className="space-y-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/#tools` },
          { name: `${meta.name} Tools`, url: `${siteConfig.url}/tools/category/${meta.slug}` },
        ]}
      />
      <FAQSchema items={faqs} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-indigo-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/#tools" className="hover:text-indigo-700">Tools</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700">{meta.name} Tools</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <p className="mb-2 text-4xl">{meta.icon}</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Free Online {meta.name} Tools
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {meta.description}
        </p>
        <p className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {categoryTools.length} free tools available
        </p>
      </header>

      {/* Tools Grid */}
      <section aria-label={`${meta.name} tools list`}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Long description / SEO content */}
      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">About our {meta.name.toLowerCase()} tools</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
          <p>{meta.longDescription}</p>
          <p>
            Every tool in this category runs entirely in your browser — your data never leaves your device. There is no account to create, no download to install, and no usage limit. Just open the tool, enter your data, and get instant results. This privacy-first approach makes ToolNest trusted by thousands of professionals, students, and hobbyists worldwide.
          </p>
          <p>
            Each tool includes detailed instructions, real-world examples, frequently asked questions, and links to related utilities. Whether you are a beginner or an experienced professional, you will find the guidance you need to use each tool effectively. Bookmark this page to return quickly whenever you need a {meta.name.toLowerCase()} tool.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white/60 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 group-open:text-indigo-700">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Explore other categories */}
      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Explore other tool categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/category/${cat.slug}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{cat.name} Tools</p>
                <p className="text-xs text-slate-500">{tools.filter((t) => t.category === cat.slug).length} tools</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
