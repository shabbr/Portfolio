"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Code2, Database, GitBranch, Server, TerminalSquare } from "lucide-react";
import type { Group } from "three";
import { useTilt } from "@/lib/useTilt";
import { useReadyInView } from "@/lib/useReadyInView";
import AboutBackground from "./AboutBackground";
import { usePortfolio } from "./PortfolioProvider";
import { sortByOrder } from "@/lib/portfolio-types";
import { usePageVisible } from "@/lib/usePageVisible";
import { readThemeColors, type ThemeColors } from "@/lib/theme-colors";
import { THEME_CHANGE_EVENT } from "./ThemeProvider";

const ICON_MAP = {
  Server,
  Code2,
  Database,
  GitBranch,
} as const;

const HIGHLIGHT_COLORS = [
  { color: "var(--accent)", bg: "rgba(var(--accent-rgb),0.14)" },
  { color: "var(--accent-3)", bg: "rgba(var(--accent-3-rgb),0.14)" },
  { color: "var(--accent-4)", bg: "rgba(var(--accent-4-rgb),0.14)" },
  { color: "var(--accent-2)", bg: "rgba(var(--accent-2-rgb),0.14)" },
];

const particleLayout = Array.from({ length: 26 }, (_, i) => {
  const waveA = Math.sin(i * 1.91);
  const waveB = Math.cos(i * 2.37);
  const waveC = Math.sin(i * 3.29 + 0.7);
  return {
    position: [waveA * 2.9, waveB * 1.9, waveC * 1.2] as [number, number, number],
    scale: 0.04 + (i % 5) * 0.012,
    tone: i % 4,
  };
});

function useLiveThemeColors(): ThemeColors {
  const [colors, setColors] = useState(() => readThemeColors());
  useEffect(() => {
    const sync = () => setColors(readThemeColors());
    sync();
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);
  return colors;
}

function AboutScene({ active }: { active: boolean }) {
  const group = useRef<Group>(null);
  const c = useLiveThemeColors();
  const lineColors = [c.accent2, c.accent3, c.accent, c.accent4];
  const particleTones = [c.accent, c.accent3, c.accent4, c.accent2];

  useFrame(({ clock, pointer }) => {
    if (!active || !group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.18 + pointer.x * 0.14;
    group.current.rotation.x = -0.08 + pointer.y * 0.08;
  });

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.3} color={c.fg} />
      <pointLight position={[-4, -2, 3]} intensity={2.1} color={c.accent3} />
      <group ref={group}>
        <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.7}>
          <mesh position={[0, -0.95, 0]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[2.25, 0.12, 1.25]} />
            <meshStandardMaterial color={c.accent4} metalness={0.28} roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.25, -0.35]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[2.05, 1.25, 0.08]} />
            <meshStandardMaterial color={c.bgElevated} metalness={0.18} roughness={0.35} emissive={c.bg} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, -0.25, -0.295]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[1.78, 0.96, 0.02]} />
            <meshStandardMaterial color={c.bg} emissive={c.accent4} emissiveIntensity={0.55} roughness={0.3} />
          </mesh>
          {[-0.48, -0.18, 0.12, 0.42].map((y, i) => (
            <mesh key={y} position={[-0.2 + i * 0.09, y, -0.25]} rotation={[-0.12, 0, 0]}>
              <boxGeometry args={[1.08 - i * 0.12, 0.035, 0.025]} />
              <meshBasicMaterial color={lineColors[i]} transparent opacity={0.85} />
            </mesh>
          ))}
          <mesh position={[0.62, 0.43, -0.24]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.06, 0.34, 0.03]} />
            <meshBasicMaterial color={c.accent2} transparent opacity={0.8} />
          </mesh>
        </Float>

        <Float speed={2.2} rotationIntensity={0.9} floatIntensity={1.15}>
          <group position={[-1.55, 0.55, -0.1]} rotation={[0.1, 0.2, -0.14]}>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.08]} />
              <meshStandardMaterial color={c.accent} emissive={c.accent4} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[-0.17, 0, 0]}>
              <boxGeometry args={[0.08, 0.48, 0.08]} />
              <meshStandardMaterial color={c.accent} emissive={c.accent4} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.08]} />
              <meshStandardMaterial color={c.accent} emissive={c.accent4} emissiveIntensity={0.6} />
            </mesh>
          </group>
        </Float>

        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.05}>
          <group position={[1.55, 0.68, -0.1]} rotation={[0.1, -0.2, 0.14]}>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.08]} />
              <meshStandardMaterial color={c.accent2} emissive={c.accent3} emissiveIntensity={0.55} />
            </mesh>
            <mesh position={[0.17, 0, 0]}>
              <boxGeometry args={[0.08, 0.48, 0.08]} />
              <meshStandardMaterial color={c.accent2} emissive={c.accent3} emissiveIntensity={0.55} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.08]} />
              <meshStandardMaterial color={c.accent2} emissive={c.accent3} emissiveIntensity={0.55} />
            </mesh>
          </group>
        </Float>

        {particleLayout.map((particle, i) => (
          <mesh key={i} position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={particleTones[particle.tone]} transparent opacity={0.55} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function AboutOrbital() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageVisible = usePageVisible();
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mountGl, setMountGl] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mount WebGL after entrance motions start — avoids first-open freeze
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setMountGl(true), 450);
    return () => window.clearTimeout(t);
  }, [inView]);

  const active = inView && pageVisible && mountGl;

  return (
    <div
      ref={wrapRef}
      className="h-[240px] w-full min-w-0 overflow-hidden rounded-[1.35rem] sm:h-[280px] md:h-[320px]"
      style={{
        background:"linear-gradient(145deg,rgba(var(--card-from-rgb),.62),rgba(var(--panel-deep-rgb),.58))",
        border:"1px solid rgba(var(--accent-2-rgb),.14)",
        boxShadow:"0 22px 70px rgba(var(--shadow-rgb),.32)",
      }}
      aria-hidden="true">
      {mountGl ? (
        <Canvas
          frameloop={active ? "always" : "demand"}
          dpr={[1, isMobile ? 1.25 : 1.5]}
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
          className="pointer-events-none"
        >
          <AboutScene active={active} />
        </Canvas>
      ) : null}
    </div>
  );
}

function HighlightCard({ icon, title, desc, color, bg, i, inView }:
  { icon:React.ReactNode; title:string; desc:string; color:string; bg:string; i:number; inView:boolean }) {
  const { ref, onMove, onLeave } = useTilt(14);
  return (
    <motion.div
      initial={{ opacity:0, y:32, scale:.9 }}
      animate={inView?{opacity:1,y:0,scale:1}:{}}
      transition={{ duration:.55, delay:.25+i*.12 }}
      className="perspective-1000 w-full min-w-0">
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="p-4 sm:p-5 cursor-default h-full relative overflow-hidden rounded-[1.2rem] w-full min-w-0"
        style={{
          transition:"transform .25s cubic-bezier(.4,0,.2,1)",
          background:"linear-gradient(145deg,rgba(var(--card-from-rgb),.88),rgba(var(--panel-rgb),.82))",
          border:"1px solid rgba(var(--accent-2-rgb),.16)",
          boxShadow:"0 18px 50px rgba(var(--shadow-rgb),.34), inset 0 1px 0 rgba(var(--accent-2-rgb),.08)",
        }}>

        {/* Background glow */}
        <div className="absolute inset-0 rounded-[1.25rem] opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{ background:`radial-gradient(circle at 30% 30%, ${bg} 0%, transparent 66%)` }} />

        <motion.div className="mb-3 w-10 h-10 rounded-2xl flex items-center justify-center relative z-10"
          style={{ color, background:bg, border:`1px solid ${color}44`, boxShadow:`0 12px 30px ${color}18` }}
          animate={inView ? { rotate:[0,5,-5,0] } : { rotate: 0 }}
          transition={{ duration:4+i, repeat:Infinity, delay:i*.6 }}>
          {icon}
        </motion.div>
        <h3 className="font-semibold text-sm mb-1.5 relative z-10 break-words" style={{ color:"var(--fg)" }}>{title}</h3>
        <p className="text-xs leading-relaxed relative z-10 break-words" style={{ color:"rgba(var(--fg-rgb),0.72)" }}>{desc}</p>

        {/* Bottom accent line */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[1.25rem]"
          style={{ background:`linear-gradient(90deg,transparent,${color}88,transparent)` }}
          animate={inView ? { opacity:[0.3,1,0.3] } : { opacity: 0.3 }}
          transition={{ duration:2.5+i*.4, repeat:Infinity, delay:i*.35 }} />
      </div>
    </motion.div>
  );
}

export default function About() {
  const { about, site } = usePortfolio();
  const ref = useRef(null);
  const inView = useReadyInView(ref, { once:true, margin:"-80px" });
  const stats = sortByOrder(about.stats);
  const highlights = sortByOrder(about.highlights);

  return (
    <section id="about" className="relative py-20 px-4 overflow-hidden sm:py-24 sm:px-6 lg:py-28">
      <AboutBackground />

      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg,rgba(var(--tint-rgb),.35),transparent 34%),radial-gradient(circle at 12% 25%,rgba(var(--accent-rgb),.2),transparent 26%),radial-gradient(circle at 84% 72%,rgba(var(--card-from-rgb),.45),transparent 30%)",
        }}
        aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage:"linear-gradient(rgba(var(--accent-2-rgb),.8) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-2-rgb),.8) 1px,transparent 1px)", backgroundSize:"54px 54px" }}
        aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10 w-full min-w-0" ref={ref}>
        <motion.div initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.7 }} className="text-center mb-10 sm:mb-14 px-1">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.24em]"
            style={{ color:"var(--accent-2)", background:"rgba(var(--accent-2-rgb),.1)", border:"1px solid rgba(var(--accent-2-rgb),.22)" }}>
            <TerminalSquare size={12} />
            Who I Am
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 leading-tight" style={{ color:"var(--fg)" }}>
            About <span style={{ color:"var(--accent)" }}>Me</span>
          </h2>
          <motion.div className="ice-divider mt-4 mx-auto" style={{ width:0 }}
            animate={inView?{width:"120px"}:{}} transition={{ duration:.8, delay:.3 }} />
        </motion.div>

        {/* min-w-0 on grid children is required — CSS Grid defaults to min-width:auto,
            which lets the 3-col stats row force the card wider than the phone. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-7 md:gap-8 items-start w-full min-w-0">
          <motion.div className="lg:col-span-3 w-full min-w-0"
            initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:.8, delay:.15 }}>
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-5 h-full relative overflow-hidden rounded-[1.35rem] w-full max-w-full box-border"
              style={{
                background:"linear-gradient(145deg,rgba(var(--card-from-rgb),.92),rgba(var(--card-to-rgb),.86))",
                border:"1px solid rgba(var(--accent-2-rgb),.16)",
                boxShadow:"0 24px 80px rgba(var(--shadow-rgb),.42), inset 0 1px 0 rgba(var(--accent-2-rgb),.08)",
              }}>
              <div className="absolute top-4 right-4 opacity-20 spin-slow" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <path d="M15 2v26M2 15h26M6 6l18 18M24 6L6 24" stroke="var(--accent)" strokeWidth="1.2"/>
                </svg>
              </div>

              {about.paragraphs.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-sm sm:text-[15px] break-words pr-6 sm:pr-8"
                  style={{ color: i === 0 ? "rgba(var(--fg-rgb),0.9)" : "rgba(var(--fg-rgb),0.76)" }}>
                  {paragraph.includes(site.location) ? (
                    <>
                      {paragraph.split(site.location)[0]}
                      <span style={{ color:"var(--accent)", fontWeight:600 }}>{site.location}</span>
                      {paragraph.split(site.location)[1]}
                    </>
                  ) : paragraph.includes("IconMarvel") ? (
                    <>
                      {paragraph.split("IconMarvel")[0]}
                      <span style={{ color:"var(--accent-2)", fontWeight:600 }}>IconMarvel</span>
                      {paragraph.split("IconMarvel")[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}

              <div className="pt-3 grid grid-cols-3 gap-1.5 sm:gap-4 border-t border-white/10 w-full min-w-0">
                {stats.map(({ id, val, label }, i) => (
                  <motion.div key={id}
                    initial={{ opacity:0, y:12 }} animate={inView?{opacity:1,y:0}:{}}
                    transition={{ delay:.6+i*.1 }}
                    className="text-center rounded-xl sm:rounded-2xl px-1 py-2.5 sm:px-2 sm:py-3 min-w-0"
                    style={{ background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.06)" }}>
                    <div className="text-lg sm:text-2xl font-bold leading-none" style={{ color:["var(--accent)","var(--accent-3)","var(--accent-2)"][i % 3] }}>{val}</div>
                    <div className="text-[8px] sm:text-[10px] tracking-wide mt-1 leading-tight break-words hyphens-auto" style={{ color:"rgba(var(--fg-rgb),0.58)" }}>{label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
                {about.tags.map((tag, i) => (
                  <motion.span key={tag}
                    initial={{ opacity:0, scale:.85 }} animate={inView?{opacity:1,scale:1}:{}}
                    transition={{ delay:.7+i*.07 }} whileHover={{ scale:1.1, y:-2 }}
                    className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs cursor-default transition-all duration-200 max-w-full break-words"
                    style={{ border:"1px solid rgba(var(--accent-rgb),0.28)", color:"var(--accent-2)", background:"rgba(var(--tint-rgb),0.36)" }}>
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-2 space-y-3 sm:space-y-4 w-full min-w-0">
            <AboutOrbital />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              {highlights.map((h, i) => {
                const Icon = ICON_MAP[h.icon as keyof typeof ICON_MAP] ?? Server;
                const colors = HIGHLIGHT_COLORS[i % HIGHLIGHT_COLORS.length];
                return (
                  <HighlightCard
                    key={h.id}
                    icon={<Icon size={21} />}
                    title={h.title}
                    desc={h.desc}
                    color={colors.color}
                    bg={colors.bg}
                    i={i}
                    inView={inView}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
