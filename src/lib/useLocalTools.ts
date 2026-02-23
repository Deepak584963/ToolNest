"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/* ── Keys ── */
const RECENT_KEY = "tn-recent-tools";
const FAV_KEY = "tn-favorite-tools";
const MAX_RECENT = 5;

/* ── Shared external store for cross-component sync ── */
function createStorageStore(key: string) {
  const listeners = new Set<() => void>();

  function getSnapshot(): string {
    if (typeof window === "undefined") return "[]";
    return localStorage.getItem(key) || "[]";
  }

  function getServerSnapshot(): string {
    return "[]";
  }

  function subscribe(cb: () => void): () => void {
    listeners.add(cb);
    // Listen for changes from other tabs
    const handler = (e: StorageEvent) => {
      if (e.key === key) cb();
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

  return { getSnapshot, getServerSnapshot, subscribe, emit };
}

const recentStore = createStorageStore(RECENT_KEY);
const favStore = createStorageStore(FAV_KEY);

/* ── Recent Tools Hook ── */
export function useRecentTools() {
  const raw = useSyncExternalStore(
    recentStore.subscribe,
    recentStore.getSnapshot,
    recentStore.getServerSnapshot
  );

  const recentSlugs: string[] = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  })();

  const addRecent = useCallback((slug: string) => {
    try {
      const current: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const updated = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      recentStore.emit();
    } catch { /* ignore */ }
  }, []);

  return { recentSlugs, addRecent };
}

/* ── Favorite Tools Hook ── */
export function useFavoriteTools() {
  const raw = useSyncExternalStore(
    favStore.subscribe,
    favStore.getSnapshot,
    favStore.getServerSnapshot
  );

  const favoriteSlugs: string[] = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  })();

  const toggleFavorite = useCallback((slug: string) => {
    try {
      const current: string[] = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      localStorage.setItem(FAV_KEY, JSON.stringify(updated));
      favStore.emit();
    } catch { /* ignore */ }
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favoriteSlugs.includes(slug),
    [favoriteSlugs]
  );

  return { favoriteSlugs, toggleFavorite, isFavorite };
}
