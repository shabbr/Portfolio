"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Snowfall = dynamic(() => import("./Snowfall"), { ssr: false });
const CursorGlow = dynamic(() => import("./CursorGlow"), { ssr: false });

/** Mount decorative canvases after idle so Hero/section entrances stay smooth. */
export default function DeferredEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("./Snowfall");
    void import("./CursorGlow");

    const mount = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(mount, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(mount, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <Snowfall />
      <CursorGlow />
    </>
  );
}
