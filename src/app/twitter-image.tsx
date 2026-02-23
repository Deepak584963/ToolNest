import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ToolNest — 110+ Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
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
          background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 30%, #F5F3FF 60%, #ECFEFF 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 32,
            padding: "48px 64px",
            maxWidth: 1000,
            boxShadow: "0 8px 40px rgba(99,102,241,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(238,242,255,0.9)",
              borderRadius: 50,
              padding: "8px 20px",
              fontSize: 16,
              fontWeight: 700,
              color: "#4F46E5",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: "#6366F1", display: "flex" }} />
            <span>110+ Free Tools</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#0F172A", letterSpacing: -1, display: "flex" }}>
            ToolNest
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginTop: 12,
              background: "linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            Free Online Tools for Everyone
          </div>
          <div style={{ fontSize: 18, color: "#64748B", textAlign: "center", marginTop: 14, maxWidth: 600, display: "flex" }}>
            Developer, SEO, Student, Creator, Image &amp; Utility tools — browser-based and free.
          </div>
          <div style={{ display: "flex", fontSize: 14, color: "#94A3B8", fontWeight: 600, marginTop: 20 }}>
            tool-nest.tech
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
