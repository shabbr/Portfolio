"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Snowfall = dynamic(() => import("./Snowfall"), { ssr: false });
const CursorGlow = dynamic(() => import("./CursorGlow"), { ssr: false });

/** Mount decorative canvases after idle so Hero/section entrances stay smooth. */
export default function DeferredEffects() {
  const [ready, setReady] = useState(false);
  // The full-screen Snowfall canvas repaints the whole viewport every frame —
  // too heavy for phones and pointless for reduced-motion users. Desktop only.
  const [allowSnow, setAllowSnow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const snowOk = !window.matchMedia(
      "(max-width: 768px), (prefers-reduced-motion: reduce)",
    ).matches;
    setAllowSnow(snowOk);

    if (snowOk) void import("./Snowfall");
    void import("./CursorGlow");

    const mount = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(mount, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(mount, 400);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      {allowSnow && <Snowfall />}
      <CursorGlow />
    </>
  );
}
