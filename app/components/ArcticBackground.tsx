"use client";

import { motion } from "framer-motion";

const ORBS = [
  { w:760, h:760, top:"8%",  left:"68%", c:"rgba(148,88,48,0.24)",   dur:9  },
  { w:620, h:620, top:"58%", left:"8%",  c:"rgba(212,154,87,0.13)",  dur:12 },
  { w:520, h:520, top:"78%", left:"75%", c:"rgba(91,52,31,0.22)",    dur:10 },
  { w:360, h:360, top:"24%", left:"28%", c:"rgba(230,189,130,0.08)", dur:14 },
  { w:320, h:320, top:"42%", left:"50%", c:"rgba(196,125,69,0.08)",  dur:16 },
];

export default function ArcticBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0"
        style={{ background:"radial-gradient(ellipse 110% 90% at 65% 8%, #2a160c 0%, #120b08 42%, #070504 100%)" }} />

      {/* Secondary gradient layer */}
      <div className="absolute inset-0"
        style={{ background:"radial-gradient(ellipse 80% 60% at 20% 80%, rgba(212,154,87,0.08) 0%, transparent 60%)" }} />

      {/* Noise grain */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize:"200px 200px" }} />

      {/* Glowing orbs */}
      {ORBS.map((o, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width:o.w, height:o.h, top:o.top, left:o.left,
            background:`radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
            filter:"blur(70px)", transform:"translate(-50%,-50%)" }}
          animate={{ scale:[1,1.18,1], opacity:[0.55,1,0.55] }}
          transition={{ duration:o.dur, repeat:Infinity, ease:"easeInOut", delay:i*1.2 }} />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage:"linear-gradient(rgba(230,189,130,1) 1px,transparent 1px),linear-gradient(90deg,rgba(230,189,130,1) 1px,transparent 1px)",
          backgroundSize:"80px 80px" }} />

      {/* Horizontal scan line */}
      <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background:"linear-gradient(90deg,transparent,rgba(230,189,130,0.34),rgba(196,125,69,0.26),transparent)" }}
        animate={{ top:["0%","100%"] }}
        transition={{ duration:8, repeat:Infinity, ease:"linear", repeatDelay:3 }} />

      {/* Diagonal accent lines */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage:"repeating-linear-gradient(45deg, rgba(230,189,130,1) 0, transparent 1px, transparent 120px, rgba(230,189,130,1) 121px)",
          backgroundSize:"170px 170px" }} />
    </div>
  );
}
