import { ImageResponse } from "next/og";
import { tools } from "@/lib/tools";
import { getCategoryMeta, getCategorySlugs } from "@/lib/categories";

export const alt = "ToolNest Category";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getCategorySlugs().map((slug) => ({ category: slug }));
}

const categoryColors: Record<string, string> = {
  dev: "#4F46E5",
  seo: "#059669",
  text: "#D97706",
  student: "#7C3AED",
  creator: "#EC4899",
  image: "#0891B2",
  utility: "#EA580C",
};

export default async function OGImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  const count = tools.filter((t) => t.category === category).length;
  const accentColor = categoryColors[category] ?? "#4F46E5";
  const label = meta?.name ?? category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #ECFEFF 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 32,
            padding: "48px 64px",
            maxWidth: 900,
            boxShadow: "0 8px 40px rgba(99,102,241,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: `${accentColor}12`,
              borderRadius: 50,
              padding: "8px 20px",
              fontSize: 15,
              fontWeight: 700,
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: accentColor, display: "flex" }} />
            <span>{count} Free Tools</span>
          </div>
          <div style={{ fontSize: 50, fontWeight: 800, color: "#0F172A", textAlign: "center", letterSpacing: -1, display: "flex" }}>
            {label} Tools
          </div>
          <div style={{ fontSize: 22, color: "#64748B", textAlign: "center", marginTop: 14, maxWidth: 650, lineHeight: 1.5, display: "flex" }}>
            {meta?.description?.slice(0, 120) ?? `Free online ${label.toLowerCase()} tools — browser-based, private, and fast.`}
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 14, color: "#94A3B8", fontWeight: 600, marginTop: 24 }}>
            <span>ToolNest</span>
            <span>•</span>
            <span>tool-nest.tech</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
