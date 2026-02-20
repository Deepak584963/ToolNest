"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "toolnest-consent";

type ConsentValue = "accepted" | "rejected";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const setConsent = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <p className="text-sm leading-6 text-slate-700">
        ToolNest uses cookies for site analytics and to serve personalized
        advertisements through Google AdSense. Read our{" "}
        <a href="/privacy-policy" className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900">
          Privacy Policy
        </a>{" "}
        to learn more. You can accept or decline non-essential consent.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setConsent("accepted")}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => setConsent("rejected")}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          Decline
        </button>
      </div>
    </aside>
  );
}
