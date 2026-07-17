"use client";

import { useEffect, useState } from "react";

/** True while the user is actively scrolling — used to pause heavy canvases. */
export function useIsScrolling(idleMs = 140): boolean {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setScrolling(true);
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), idleMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [idleMs]);

  return scrolling;
}
