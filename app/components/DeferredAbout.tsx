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
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    void import("./About");

    const mount = () => {
      if (!cancelled) setReady(true);
    };

    const onScroll = () => {
      if (window.scrollY > 80) mount();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(mount, 200);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) {
    return <div className="min-h-[720px] sm:min-h-[800px]" aria-hidden="true" />;
  }

  return <About />;
}
