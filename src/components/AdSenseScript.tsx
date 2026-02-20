"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "toolnest-consent";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSenseScript() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    setConsented(stored === "accepted");

    // Listen for consent changes from ConsentBanner
    const handleStorage = () => {
      const val = window.localStorage.getItem(CONSENT_KEY);
      setConsented(val === "accepted");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!adsenseClient || !consented) return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}
