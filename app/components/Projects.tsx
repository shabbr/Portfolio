"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import { useTilt } from "@/lib/useTilt";
import { useReadyInView } from "@/lib/useReadyInView";
import { usePortfolio, useVisibleProjects } from "./PortfolioProvider";
import type { ProjectItem } from "@/lib/portfolio-types";

const ACCENTS = [
  { color:"var(--accent-2)", bg:"rgba(var(--accent-2-rgb),0.11)", glow:"rgba(var(--accent-2-rgb),0.22)" },
  { color:"var(--accent)", bg:"rgba(var(--accent-rgb),0.12)",  glow:"rgba(var(--accent-rgb),0.24)"  },
  { color:"var(--accent-3)", bg:"rgba(var(--accent-3-rgb),0.12)",  glow:"rgba(var(--accent-3-rgb),0.24)"  },
  { color:"var(--accent-4)", bg:"rgba(var(--accent-4-rgb),0.14)",  glow:"rgba(var(--accent-4-rgb),0.24)"  },
  { color:"var(--accent-2)", bg:"rgba(var(--accent-2-rgb),0.1)",  glow:"rgba(var(--accent-2-rgb),0.2)"  },
  { color:"var(--accent)", bg:"rgba(var(--accent-rgb),0.18)",   glow:"rgba(var(--accent-rgb),0.25)"   },
];

function ProjectCard({ project, i, inView }: { project: ProjectItem; i: number; inView: boolean }) {
  const { site } = usePortfolio();
  const { ref, onMove, onLeave } = useTilt(10);
  const accent = ACCENTS[i % ACCENTS.length];
  const codeHref = project.githubUrl || project.liveUrl || site.github;

  return (
    <motion.div
      initial={{ opacity:0, y:60 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.7, delay:i*.12, ease:[.16,1,.3,1] }}
      className="perspective-1000">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="p-5 sm:p-6 flex flex-col gap-4 h-full cursor-default relative overflow-hidden group rounded-[1.2rem]"
        style={{
          transition:"transform .25s cubic-bezier(.4,0,.2,1)",
          background:"linear-gradient(145deg,rgba(var(--card-from-rgb),.88),rgba(var(--card-to-rgb),.84))",
          border:"1px solid rgba(var(--accent-2-rgb),.14)",
          boxShadow:"0 20px 60px rgba(var(--shadow-rgb),.34), inset 0 1px 0 rgba(var(--accent-2-rgb),.07)",
        }}>

        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[1.25rem]"
          style={{ background:`linear-gradient(90deg,transparent,${accent.color}88,transparent)` }} />

        <div className="absolute inset-0 rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background:`radial-gradient(circle at 20% 20%, ${accent.bg} 0%, transparent 60%)` }} />

        <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
          <motion.div className="absolute left-0 right-0 h-px"
            style={{ background:`linear-gradient(90deg,transparent,${accent.color}44,transparent)` }}
            animate={inView ? { top:["-2px","102%"] } : { top: "-2px" }}
            transition={{ duration:3.5, repeat:Infinity, ease:"linear", repeatDelay:2.5, delay:i*.5 }} />
        </div>

        <motion.div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold tracking-wider relative z-10"
          style={{ background:accent.bg, border:`1px solid ${accent.color}33` }}
          whileHover={{ rotateY:180, scale:1.1 }}
          transition={{ duration:.6 }}>
          <span className="absolute">{project.icon}</span>
          <motion.div className="absolute inset-0 rounded-2xl"
            animate={inView ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.5 }}
            transition={{ duration:2.5, repeat:Infinity, delay:i*.3 }}
            style={{ boxShadow: `0 0 20px ${accent.glow}` }} />
        </motion.div>

        <div className="relative z-10 flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-snug" style={{ color:"var(--fg)" }}>
            {project.title}
          </h3>
          {project.featured && (
            <span className="shrink-0 text-[9px] uppercase tracking-[.16em] px-2 py-1 rounded-full"
              style={{ color:accent.color, background:accent.bg, border:`1px solid ${accent.color}44` }}>
              Latest
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed flex-1 relative z-10" style={{ color:"rgba(var(--fg-rgb),0.72)" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 relative z-10">
          {project.tech.map((t) => (
            <span key={t}
              className="px-2.5 py-0.5 rounded-full text-[11px] transition-all duration-200"
              style={{ border:`1px solid ${accent.color}33`, color:accent.color, background:accent.bg }}>
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t flex items-center justify-between relative z-10"
          style={{ borderColor:"rgba(var(--accent-2-rgb),0.12)" }}>
          <a href={codeHref} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-colors duration-200"
            style={{ color:"rgba(var(--muted-rgb),0.66)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = accent.color}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(var(--muted-rgb),0.66)"}
            aria-label={`Open ${project.title}`}>
            <GithubIcon width={13} height={13} />
            <span>{project.liveUrl && !project.githubUrl ? "View Live" : "View Code"}</span>
          </a>
          <motion.div animate={inView ? { rotate:[0,360] } : { rotate: 0 }} transition={{ duration:9, repeat:Infinity, ease:"linear" }}
            style={{ opacity:0.3 }}>
            <svg width="13" height="13" viewBox="0 0 13 13">
              <path d="M6.5 1v11M1 6.5h11M3 3l7 7M10 3l-7 7" stroke={accent.color} strokeWidth="1"/>
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const projects = useVisibleProjects();
  const { site } = usePortfolio();
  const ref = useRef(null);
  const inView = useReadyInView(ref, { once:true, margin:"-80px" });

  return (
    <section id="projects" className="relative py-20 px-4 overflow-hidden sm:py-24 sm:px-6 lg:py-28">
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width:"800px", height:"600px",
          background:"radial-gradient(ellipse,rgba(var(--accent-rgb),0.12) 0%,rgba(var(--tint-rgb),0.12) 48%,transparent 70%)" }}
        animate={inView ? { scale:[1,1.15,1], rotate:[0,5,0] } : { scale: 1, rotate: 0 }}
        transition={{ duration:10, repeat:Infinity }}
        aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.7 }} className="text-center mb-10 sm:mb-14">
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.24em]"
            style={{ color:"var(--accent-2)", background:"rgba(var(--tint-rgb),.36)", border:"1px solid rgba(var(--accent-2-rgb),.22)" }}>
            What I&apos;ve Built
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 leading-tight" style={{ color:"var(--fg)" }}>
            Featured <span style={{ color:"var(--accent)" }}>Projects</span>
          </h2>
          <motion.div className="ice-divider mt-4 mx-auto" style={{ width:0 }}
            animate={inView?{width:"120px"}:{}} transition={{ duration:.8, delay:.3 }} />
          <motion.p className="mt-4 text-sm max-w-md mx-auto"
            style={{ color:"rgba(var(--fg-rgb),0.7)" }}
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
            transition={{ delay:.5 }}>
            A selection of systems and applications I&apos;ve designed and shipped.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} i={i} inView={inView} />
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
          transition={{ delay:1 }} className="text-center mt-12 flex flex-wrap items-center justify-center gap-3">
          <motion.a href={site.github} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm transition-all duration-300"
            style={{
              background:"rgba(var(--panel-rgb),0.62)",
              border:"1px solid rgba(var(--accent-2-rgb),0.25)",
              color:"var(--accent-2)",
            }}>
            <GithubIcon width={15} height={15} />
            More on GitHub
          </motion.a>
          <motion.a href={site.linkedin} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm transition-all duration-300"
            style={{
              background:"rgba(var(--panel-rgb),0.62)",
              border:"1px solid rgba(var(--accent-2-rgb),0.25)",
              color:"var(--accent-2)",
            }}>
            <LinkedinIcon width={15} height={15} />
            LinkedIn
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
