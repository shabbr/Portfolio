"use client";

import { useEffect, useState } from "react";

/** True while the user is actively scrolling — used to pause heavy canvases. */
export function useIsScrolling(idleMs = 140): boolean {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setScrolling(false), idleMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [idleMs]);

  return scrolling;
}
