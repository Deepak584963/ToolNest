import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";
import { categoryMeta } from "@/lib/categories";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const buildDate = new Date().toUTCString();

  const toolItems = tools
    .map((tool) => {
      const catMeta = categoryMeta.find((c) => c.slug === tool.category);
      const categoryName = catMeta?.name ?? tool.category;
      return `    <item>
      <title>${escapeXml(tool.name)}</title>
      <link>${siteConfig.url}/tools/${tool.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/tools/${tool.slug}</guid>
      <description>${escapeXml(tool.shortDescription)}</description>
      <category>${escapeXml(categoryName)}</category>
      <pubDate>${new Date("2025-01-01T00:00:00Z").toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Free Online Tools</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
    <webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
    <ttl>1440</ttl>
${toolItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
