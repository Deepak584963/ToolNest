"use client";

import { useEffect } from "react";
import { useRecentTools } from "@/lib/useLocalTools";

/** Drop this component on any tool page to auto-record it as a recent visit. */
export default function TrackRecentTool({ slug }: { slug: string }) {
  const { addRecent } = useRecentTools();
  useEffect(() => {
    addRecent(slug);
  }, [slug, addRecent]);
  return null;
}
