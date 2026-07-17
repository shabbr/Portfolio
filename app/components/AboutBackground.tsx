"use client";

import { motion } from "framer-motion";

export default function AboutBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Main computer illustration container */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ width: "600px", height: "600px" }}
      >
        {/* Computer monitor - SVG-based illustration */}
        <svg viewBox="0 0 400 350" className="w-full h-full" fill="none">
          {/* Monitor screen */}
          <rect x="60" y="40" width="280" height="200" rx="20" fill="rgba(30,17,12,0.3)" stroke="rgba(212,154,87,0.4)" strokeWidth="2" />
          
          {/* Screen glow */}
          <defs>
            <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(230,189,130,0.3)" />
              <stop offset="100%" stopColor="rgba(212,154,87,0.1)" />
            </linearGradient>
          </defs>
          <rect x="60" y="40" width="280" height="200" rx="20" fill="url(#screenGlow)" />

          {/* Code lines on screen */}
          <line x1="80" y1="70" x2="200" y2="70" stroke="rgba(230,189,130,0.6)" strokeWidth="3" />
          <line x1="80" y1="95" x2="260" y2="95" stroke="rgba(230,189,130,0.5)" strokeWidth="2" />
          <line x1="80" y1="120" x2="240" y2="120" stroke="rgba(230,189,130,0.5)" strokeWidth="2" />
          <line x1="80" y1="145" x2="250" y2="145" stroke="rgba(212,154,87,0.4)" strokeWidth="2" />
          <line x1="80" y1="170" x2="220" y2="170" stroke="rgba(212,154,87,0.4)" strokeWidth="2" />

          {/* Bracket decorations - left */}
          <path d="M 100 50 L 85 50 L 85 100 L 100 100" stroke="rgba(230,189,130,0.5)" strokeWidth="3" fill="none" />

          {/* Bracket decorations - right */}
          <path d="M 320 50 L 335 50 L 335 100 L 320 100" stroke="rgba(230,189,130,0.5)" strokeWidth="3" fill="none" />

          {/* Monitor stand */}
          <rect x="160" y="240" width="80" height="15" rx="8" fill="rgba(92,56,35,0.4)" />
          
          {/* Stand base */}
          <ellipse cx="200" cy="270" rx="90" ry="12" fill="rgba(70,42,26,0.3)" stroke="rgba(139,90,60,0.3)" strokeWidth="1" />

          {/* Floating code brackets */}
          <g opacity="0.4">
            <text x="320" y="80" fontSize="48" fontWeight="bold" fill="rgba(230,189,130,0.7)" fontFamily="monospace">{'{'}</text>
            <text x="50" y="150" fontSize="48" fontWeight="bold" fill="rgba(212,154,87,0.6)" fontFamily="monospace">{'}'}</text>
            <text x="330" y="210" fontSize="36" fontWeight="bold" fill="rgba(196,125,69,0.5)" fontFamily="monospace">&lt;/&gt;</text>
          </g>

          {/* Decorative particles */}
          <circle cx="120" cy="30" r="4" fill="rgba(230,189,130,0.5)" />
          <circle cx="300" cy="50" r="3" fill="rgba(212,154,87,0.4)" />
          <circle cx="150" cy="280" r="3.5" fill="rgba(196,125,69,0.4)" />
          <circle cx="280" cy="260" r="2.5" fill="rgba(230,189,130,0.3)" />
        </svg>
      </motion.div>

      {/* Animated glow orbs */}
      <motion.div
        className="absolute right-1/3 top-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,154,87,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid background effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(230,189,130,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(230,189,130,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
