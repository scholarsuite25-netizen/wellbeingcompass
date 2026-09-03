"use client";
import { useEffect } from "react";
import { env } from "@/lib/env";

// Cookie-light analytics + visit/read tracking.
// GA (when NEXT_PUBLIC_GA_ID is set) via gtag; Plausible via env;
// plus a lightweight self-hosted counter sent to /api/track for the stats pages.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function Analytics() {
  const gaId = env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Self-hosted visit tracking
    try {
      const payload = { path: window.location.pathname, ref: document.referrer.slice(0, 200) };
      navigator.sendBeacon("/api/track", JSON.stringify(payload));
    } catch { /* non-fatal */ }
  }, []);

  if (!gaId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`,
        }}
      />
    </>
  );
}
