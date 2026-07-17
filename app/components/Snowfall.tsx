"use client";

import { useEffect, useRef } from "react";

interface Flake {
  x: number; y: number; r: number;
  speed: number; drift: number;
  opacity: number; wobble: number; wobbleSpeed: number;
  type: 0 | 1 | 2; // 0=dot, 1=crystal, 2=hex
  rot: number; rotSpeed: number;
}

function hexPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    if (i === 0) {
      ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    } else {
      ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
  }
  ctx.closePath();
}

function crystalPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number, opacity: number) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot);
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = `rgba(230,189,130,${opacity})`;
  ctx.lineWidth = 0.55;
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -r);
    ctx.moveTo(0, -r * 0.45); ctx.lineTo(r * 0.28, -r * 0.65);
    ctx.moveTo(0, -r * 0.45); ctx.lineTo(-r * 0.28, -r * 0.65);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export default function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); if (!ctx) return;
    let raf = 0;
    let windGust = 0, windTarget = 0, windTimer = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const count = isMobile ? 55 : 100;

    const flakes: Flake[] = Array.from({ length: count }, () => {
      const t = Math.random();
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: t < 0.2 ? Math.random() * 5 + 3 : t < 0.4 ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
        speed: Math.random() * 0.65 + 0.15,
        drift: (Math.random() - 0.5) * 0.45,
        opacity: Math.random() * 0.5 + 0.15,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.018 + 0.004,
        type: (t < 0.2 ? 1 : t < 0.38 ? 2 : 0) as 0|1|2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.018,
      };
    });

    let scrolling = false;
    let scrollTimer = 0;
    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrolling = false; }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      if (!running) return;
      if (document.hidden || scrolling) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      windTimer--;
      if (windTimer <= 0) { windTarget = (Math.random() - 0.5) * 1.1; windTimer = 200 + Math.random() * 280; }
      windGust += (windTarget - windGust) * 0.004;

      for (const f of flakes) {
        f.wobble += f.wobbleSpeed; f.rot += f.rotSpeed;
        f.y += f.speed; f.x += f.drift + Math.sin(f.wobble) * 0.35 + windGust;
        if (f.y > height + 8) { f.y = -8; f.x = Math.random() * width; }
        if (f.x > width + 8) f.x = -8;
        if (f.x < -8) f.x = width + 8;

        if (f.type === 1) {
          crystalPath(ctx, f.x, f.y, f.r, f.rot, f.opacity * 0.75);
        } else if (f.type === 2) {
          ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
          hexPath(ctx, 0, 0, f.r);
          ctx.strokeStyle = `rgba(212,154,87,${f.opacity * 0.6})`;
          ctx.lineWidth = 0.6; ctx.stroke(); ctx.restore();
        } else {
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.2);
          g.addColorStop(0, `rgba(230,189,130,${f.opacity})`);
          g.addColorStop(0.5, `rgba(196,125,69,${f.opacity * 0.45})`);
          g.addColorStop(1, "transparent");
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true" />;
}
