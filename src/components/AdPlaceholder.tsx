"use client";

import { useEffect } from "react";

type AdPlaceholderProps = {
  label?: string;
  slot?: string;
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdPlaceholder({ label = "Ad Placement", slot }: AdPlaceholderProps) {
  const enableAds = Boolean(adsenseClient && slot);

  useEffect(() => {
    if (!enableAds) return;
    try {
      // @ts-expect-error adsbygoogle injected by script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // no-op for local/dev rendering
    }
  }, [enableAds, slot]);

  if (enableAds) {
    return (
      <div className="my-8 rounded-2xl border border-slate-200 bg-white/90 p-3 text-center">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Advertisement</p>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Advertisement</p>
      <p className="mt-2 text-sm text-slate-600">{label} (AdSense-ready placeholder)</p>
    </div>
  );
}
