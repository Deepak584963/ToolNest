import { ImageResponse } from "next/og";
import { getToolBySlug, tools } from "@/lib/tools";
import { getCategoryMeta } from "@/lib/categories";

export const alt = "ToolNest Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
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

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF2FF", fontSize: 40, fontWeight: 700, color: "#1E293B", fontFamily: "Arial" }}>
        Tool Not Found — ToolNest
      </div>,
      { ...size }
    );
  }

  const catMeta = getCategoryMeta(tool.category);
  const catLabel = catMeta?.name ?? tool.category;
  const accentColor = categoryColors[tool.category] ?? "#4F46E5";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #ECFEFF 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "56px 64px",
        }}
      >
        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.85)",
              borderRadius: 50,
              padding: "8px 20px",
              fontSize: 15,
              fontWeight: 700,
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              border: `1px solid ${accentColor}30`,
              alignSelf: "flex-start",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: accentColor, display: "flex" }} />
            <span>{catLabel} Tool • Free</span>
          </div>

          {/* Tool name */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#0F172A",
              marginTop: 28,
              lineHeight: 1.15,
              letterSpacing: -1,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {tool.name}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              color: "#64748B",
              marginTop: 16,
              lineHeight: 1.5,
              maxWidth: 800,
              display: "flex",
            }}
          >
            {tool.shortDescription}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo square */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              T
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1E293B" }}>ToolNest</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 15, color: "#94A3B8", fontWeight: 600 }}>
            <span>No Sign-up</span>
            <span>•</span>
            <span>Browser-based</span>
            <span>•</span>
            <span>tool-nest.tech</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
