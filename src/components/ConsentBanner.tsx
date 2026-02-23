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
    <aside className="slide-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-white/70 bg-white/96 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg shadow-[0_2px_8px_rgba(99,102,241,0.1)]">🍪</div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Cookie Preferences</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            ToolNest uses cookies for site analytics and to serve personalized
            advertisements through Google AdSense. Read our{" "}
            <a href="/privacy-policy" className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900">
              Privacy Policy
            </a>{" "}
            to learn more.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 pl-12">
        <button
          type="button"
          onClick={() => setConsent("accepted")}
          className="btn-primary rounded-full px-5 py-2 text-sm shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => setConsent("rejected")}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300"
        >
          Decline
        </button>
      </div>
    </aside>
  );
}
