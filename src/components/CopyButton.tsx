"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
};

export default function CopyButton({ value, label = "Copy output" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 1800);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!value}
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        aria-live="polite"
      >
        {failed ? "Copy failed" : copied ? "Copied" : label}
      </button>
      <span className="sr-only" aria-live="polite">{failed ? "Copy failed" : copied ? "Copied to clipboard" : ""}</span>
    </>
  );
}
