"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const About = dynamic(() => import("./About"), {
  ssr: false,
  loading: () => <div className="min-h-[720px] sm:min-h-[800px]" aria-hidden="true" />,
});

/**
 * Prefetch Three.js early; mount on idle or as soon as user scrolls —
 * so About is warm before the section entrance animation runs.
 */
export default function DeferredAbout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("./About");

    const mount = () => {
      if (!cancelled) setReady(true);
    };

    // If user scrolls toward About before idle fires, mount immediately
    const onScroll = () => {
      if (window.scrollY > 80) mount();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(mount, 200);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) {
    return <div className="min-h-[720px] sm:min-h-[800px]" aria-hidden="true" />;
  }

  return <About />;
}
