"use client";

import { motion } from "framer-motion";

interface FloatingCodeProps {
  className?: string;
}

const CODE_ELEMENTS = [
  { symbol: "{", x: "8%", y: "20%", delay: 0, dur: 8 },
  { symbol: "}", x: "92%", y: "35%", delay: 1, dur: 9 },
  { symbol: "=>", x: "15%", y: "65%", delay: 2, dur: 10 },
  { symbol: "</>", x: "85%", y: "72%", delay: 0.5, dur: 11 },
  { symbol: "( )", x: "50%", y: "28%", delay: 1.5, dur: 12 },
  { symbol: "const", x: "12%", y: "80%", delay: 2.5, dur: 13 },
  { symbol: "async", x: "88%", y: "55%", delay: 0.8, dur: 14 },
];

export default function FloatingCode({ className = "" }: FloatingCodeProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {CODE_ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-xs font-mono font-bold opacity-0"
          style={{ color: "#e6bd82" }}
          initial={{ x: el.x, y: el.y, opacity: 0 }}
          animate={{
            y: [el.y, `${parseFloat(el.y) - 40}%`, `${parseFloat(el.y) - 80}%`],
            opacity: [0, 0.4, 0],
            x: [el.x, `${parseFloat(el.x) + Math.sin(i) * 20}%`],
          }}
          transition={{
            duration: el.dur,
            delay: el.delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}>
          {el.symbol}
        </motion.div>
      ))}
      
    </div>
  );
}
