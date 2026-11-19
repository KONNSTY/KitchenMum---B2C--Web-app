"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function FigmaCaptureScript() {
  const [captureEnabled, setCaptureEnabled] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const syncCaptureState = () =>
      setCaptureEnabled(window.location.hash.includes("figmacapture="));
    syncCaptureState();
    window.addEventListener("hashchange", syncCaptureState);
    return () => window.removeEventListener("hashchange", syncCaptureState);
  }, []);
  return captureEnabled ? (
    <Script
      src="https://mcp.figma.com/mcp/html-to-design/capture.js"
      strategy="afterInteractive"
    />
  ) : null;
}
