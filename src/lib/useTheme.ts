"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/* ── Keys ── */
const THEME_KEY = "tn-theme";
type Theme = "light" | "dark" | "system";

/* ── External store for cross-component sync ── */
const listeners = new Set<() => void>();

function getSnapshot(): string {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem(THEME_KEY) || "system";
}

function getServerSnapshot(): string {
  return "system";
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const handler = (e: StorageEvent) => {
    if (e.key === THEME_KEY) cb();
  };
  window.addEventListener("storage", handler);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", handler);
  };
}

function emit() {
  listeners.forEach((cb) => cb());
}

/* ── Apply theme to <html> ── */
function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  // Update meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isDark ? "#0f172a" : "#6366f1");
}

/* ── Hook ── */
export function useTheme() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const theme = (raw === "dark" || raw === "light" ? raw : "system") as Theme;

  // Apply on mount and changes
  useEffect(() => {
    applyTheme(theme);

    // Listen for system preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
    emit();
  }, []);

  const isDark =
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false;

  const cycleTheme = useCallback(() => {
    let currentTheme: Theme = "system";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") {
        currentTheme = stored;
      }
    }
    const order: Theme[] = ["light", "dark", "system"];
    const idx = order.indexOf(currentTheme);
    setTheme(order[(idx + 1) % order.length]);
  }, [setTheme]);

  return { theme, setTheme, isDark, cycleTheme };
}
