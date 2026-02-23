import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolNest — 110+ Free Online Tools",
    short_name: "ToolNest",
    description:
      "110+ free browser-based tools for developers, SEO, students, creators, image processing, and everyday utilities. No sign-up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#EEF2FF",
    theme_color: "#4F46E5",
    orientation: "portrait-primary",
    categories: ["utilities", "developer", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
