"use client";

import { useEffect } from "react";

/**
 * Initializes the dark mode class on <html> before first paint.
 * This runs as a client component in the layout body.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("tn-theme") || "system";
    const isDark =
      stored === "dark" ||
      (stored === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, []);

  return <>{children}</>;
}
