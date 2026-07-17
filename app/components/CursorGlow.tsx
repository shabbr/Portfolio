"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    // Skip on touch / coarse pointers — no cursor to follow
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
      el.style.display = "none";
      return;
    }

    let x = 0;
    let y = 0;
    let raf = 0;
    let dirty = false;
    let running = true;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dirty = true;
    };

    const tick = () => {
      if (!running) return;
      if (dirty && !document.hidden) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
