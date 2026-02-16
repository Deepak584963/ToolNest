import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 52%, #06B6D4 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 112,
            height: 112,
            borderRadius: 28,
            background: "rgba(255,255,255,0.16)",
            border: "4px solid rgba(255,255,255,0.28)",
            color: "white",
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          T
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
