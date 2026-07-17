"use client";

import { useEffect, useRef } from "react";

interface P {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; opacity: number;
  hue: number; phase: number;
}

export default function HeroCrystal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0, mx = 0.5, my = 0.5;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; });

    const COUNT = 100;
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(),
      vx: (Math.random() - .5) * .0003, vy: (Math.random() - .5) * .0003, vz: (Math.random() - .5) * .0005,
      size: Math.random() * 3.5 + .8,
      opacity: Math.random() * .55 + .2,
      hue: [31, 25, 38, 18][Math.floor(Math.random() * 4)],
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const px = (mx - .5) * 40, py = (my - .5) * 28;

      const proj = pts.map((p) => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (Math.abs(p.x) > 1.3) p.vx *= -1;
        if (Math.abs(p.y) > 1.3) p.vy *= -1;
        if (p.z > 1 || p.z < 0)  p.vz *= -1;
        const persp = 1 / (1.6 - p.z * .55);
        return {
          sx: cx + (p.x * W * .44 + px) * persp,
          sy: cy + (p.y * H * .44 + py) * persp,
          ss: p.size * persp,
          p, persp,
        };
      });

      // Connections
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i], b = proj[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 130) {
            const alpha = (1 - d/130) * .15 * Math.min(a.persp, b.persp);
            const mid = (a.p.hue + b.p.hue) / 2;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `hsla(${mid},100%,70%,${alpha})`;
            ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }

      // Particles
      for (const { sx, sy, ss, p } of proj) {
        const pulse = .82 + Math.sin(t * .0009 + p.phase) * .18;
        const a = p.opacity * pulse;

        // Outer halo
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, ss * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,72%,${a * .45})`);
        g.addColorStop(.5, `hsla(${p.hue},100%,60%,${a * .12})`);
        g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(sx, sy, ss * 5, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();

        // Core
        ctx.beginPath(); ctx.arc(sx, sy, ss, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},100%,82%,${a})`;
        ctx.fill();

        // Diamond for bigger ones
        if (ss > 2.8) {
          ctx.save(); ctx.translate(sx, sy);
          ctx.rotate(t * .00025 + p.phase);
          ctx.beginPath();
          ctx.moveTo(0, -ss*2.4); ctx.lineTo(ss*1.4, 0);
          ctx.lineTo(0, ss*2.4);  ctx.lineTo(-ss*1.4, 0);
          ctx.closePath();
          ctx.strokeStyle = `hsla(${p.hue},100%,78%,${a * .55})`;
          ctx.lineWidth = .8; ctx.stroke();
          // inner cross
          ctx.beginPath();
          ctx.moveTo(-ss*.8, 0); ctx.lineTo(ss*.8, 0);
          ctx.moveTo(0, -ss*.8); ctx.lineTo(0, ss*.8);
          ctx.strokeStyle = `hsla(${p.hue},100%,90%,${a * .3})`;
          ctx.lineWidth = .4; ctx.stroke();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
