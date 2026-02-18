import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";
import { getCategorySlugs } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/contact", "/terms-of-service", "/privacy-policy", "/disclaimer"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date("2026-02-18"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const categoryRoutes = getCategorySlugs().map((slug) => ({
    url: `${siteConfig.url}/tools/category/${slug}`,
    lastModified: new Date("2026-02-18"),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date("2026-02-18"),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
