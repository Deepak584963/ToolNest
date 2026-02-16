import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 20,
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
