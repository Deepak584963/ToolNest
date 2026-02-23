import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ToolNest — 110+ Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
            <span>110+ Free Tools • No Sign-up</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, textAlign: "center", letterSpacing: -1, color: "#0F172A", display: "flex" }}>
            ToolNest
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              textAlign: "center",
              marginTop: 12,
              background: "linear-gradient(135deg, #4F46E5, #7C3AED, #06B6D4)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            Free Online Tools for Everyone
          </div>
          <div style={{ fontSize: 20, color: "#64748B", textAlign: "center", marginTop: 16, maxWidth: 700, lineHeight: 1.5, display: "flex" }}>
            Developer, SEO, Student, Creator, Image &amp; Utility tools — all browser-based, private, and free.
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
            {[
              { val: "110+", label: "Tools" },
              { val: "7", label: "Categories" },
              { val: "100%", label: "Browser-based" },
              { val: "0", label: "Data Collected" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "12px 20px",
                  background: "rgba(238,242,255,0.8)",
                  borderRadius: 16,
                  minWidth: 100,
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", display: "flex" }}>{s.val}</span>
                <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, marginTop: 2, display: "flex" }}>{s.label}</span>
              </div>
            ))}
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
