"use client";

import { motion, type Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, Code2, Database, Mail, MapPin, Server, Sparkles } from "lucide-react";
import LinkedinIcon from "./icons/LinkedinIcon";
import GithubIcon from "./icons/GithubIcon";
import { WhatsAppGlyph } from "./WhatsAppFloat";
import HeroCrystal from "./HeroCrystal";
import { whatsAppChatUrl } from "@/lib/phone";
import { usePortfolio } from "./PortfolioProvider";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: .12, delayChildren: .2 } },
};
const up: Variants = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0,
    transition: { duration: .9, ease: [.16,1,.3,1] } },
};

const CODE_SNIPPETS = [
  { code: "const build = await compile();", color: "#e6bd82", delay: 0 },
  { code: "await db.migrate();", color: "#d49a57", delay: 1.5 },
  { code: "return response.json();", color: "#c47d45", delay: 3 },
  { code: "deploy();", color: "#8b5a3c", delay: 4.5 },
];

export default function Hero() {
  const { site } = usePortfolio();
  const FIRST = site.firstName.split("");
  const LAST = site.lastName.split("");
  const titleParts = site.title.split("&");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start","end start"] });
  const contentY  = useTransform(scrollYProgress, [0,1], [0, -100]);
  const contentOp = useTransform(scrollYProgress, [0,.65], [1, 0]);

  return (
    <section ref={sectionRef} id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:pt-20">

      <HeroCrystal />

      {/* Floating code snippets */}
      {CODE_SNIPPETS.map((snippet, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{
            left: `${20 + i * 18}%`,
            top: `${15 + i * 12}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            y: [20, -60, -120],
            x: [0, Math.sin(i) * 30, Math.sin(i) * 40],
          }}
          transition={{
            duration: 6 + i * 0.5,
            delay: snippet.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}>
          <div className="px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap"
            style={{
              background: `rgba(0,0,0,0.4)`,
              border: `1px solid ${snippet.color}88`,
              color: snippet.color,
              textShadow: `0 0 8px ${snippet.color}66`,
              boxShadow: `0 0 12px ${snippet.color}22`,
            }}>
            {snippet.code}
          </div>
        </motion.div>
      ))}

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 80% 80% at 50% 48%, transparent 18%, rgba(9,5,3,.84) 100%)" }}
        aria-hidden="true" />

      {/* Animated corner accents */}
      {[
        { cls:"top-8 left-8",  rot:0   },
        { cls:"top-8 right-8", rot:90  },
        { cls:"bottom-8 left-8",  rot:270 },
        { cls:"bottom-8 right-8", rot:180 },
      ].map(({ cls, rot }, i) => (
        <motion.div key={i} className={`absolute ${cls} pointer-events-none`}
          initial={{ opacity:0, scale:0 }}
          animate={{ opacity:.35, scale:1 }}
          transition={{ delay:2+i*.15, duration:.6 }}
          aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform:`rotate(${rot}deg)` }}>
            <path d="M2 30 L2 2 L30 2" stroke="rgba(230,189,130,0.45)" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
      ))}

      {/* Scan line */}
      <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-[3]"
        style={{ background:"linear-gradient(90deg,transparent,rgba(230,189,130,.34),rgba(196,125,69,.28),transparent)" }}
        animate={{ top:["-2px","102%"] }}
        transition={{ duration:6, repeat:Infinity, ease:"linear", repeatDelay:3 }}
        aria-hidden="true" />

      {/* Terminal cursor effect */}
      <motion.div className="absolute pointer-events-none"
        style={{
          width: "2px",
          height: "20px",
          top: "50%",
          right: "8%",
          background: "#e6bd82",
        }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        aria-hidden="true" />

      <motion.div style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 w-full max-w-6xl mx-auto">

        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid items-center gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-12">

          <div className="text-center lg:text-left">
          <motion.div variants={up} className="flex justify-center lg:justify-start mb-7">
            <motion.span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] tracking-[.25em] uppercase"
              style={{
                color:"#e6bd82",
                background:"rgba(92,56,35,0.32)",
                border:"1px solid rgba(230,189,130,0.26)",
                backdropFilter:"blur(12px)",
              }}
              animate={{ boxShadow:["0 0 0 rgba(196,125,69,0)","0 0 24px rgba(196,125,69,.35)","0 0 0 rgba(196,125,69,0)"] }}
              transition={{ duration:3, repeat:Infinity }}>
              <motion.span
                className="w-2 h-2 rounded-full bg-[#d49a57]"
                animate={{ scale:[1,1.5,1], opacity:[1,.5,1] }}
                transition={{ duration:1.5, repeat:Infinity }} />
              <Sparkles size={10} />
              Available for opportunities
            </motion.span>
          </motion.div>

          <motion.h1 variants={up}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold leading-none tracking-tight mb-6"
            style={{ perspective:"700px" }}>
            <span className="inline-block lg:block lg:mr-0 mr-4">
              {FIRST.map((ch, i) => (
                <motion.span key={i} className="inline-block"
                  style={{ color:"#fff2df", textShadow:"0 0 30px rgba(212,154,87,.22), 0 2px 0 rgba(0,0,0,.5)" }}
                  initial={{ opacity:0, rotateX:-90, y:30 }}
                  animate={{ opacity:1, rotateX:0, y:0 }}
                  transition={{ delay:.3+i*.07, duration:.6, ease:[.16,1,.3,1] }}>
                  {ch}
                </motion.span>
              ))}
            </span>
            <span className="inline-block lg:block">
              {LAST.map((ch, i) => (
                <motion.span key={i} className="inline-block"
                  style={{ color:"#d49a57", textShadow:"0 0 26px rgba(196,125,69,.28)" }}
                  initial={{ opacity:0, rotateX:-90, y:30 }}
                  animate={{ opacity:1, rotateX:0, y:0 }}
                  transition={{ delay:.55+i*.07, duration:.6, ease:[.16,1,.3,1] }}>
                  {ch}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p variants={up} className="text-xl sm:text-2xl font-light mb-2"
            style={{ color:"rgba(239,222,201,0.82)" }}>
            {titleParts[0]?.trim() || site.title}
            {titleParts[1] ? (
              <>
                {" "}&amp;{" "}
                <motion.span className="font-bold"
                  style={{ color:"#fff2df" }}
                  animate={{ textShadow:["0 0 8px rgba(196,125,69,.35)","0 0 28px rgba(212,154,87,.7)","0 0 8px rgba(196,125,69,.35)"] }}
                  transition={{ duration:3.5, repeat:Infinity }}>
                  {titleParts[1].trim()}
                </motion.span>
              </>
            ) : null}
          </motion.p>

          <motion.div variants={up}
            className="flex items-center justify-center lg:justify-start gap-1.5 text-xs mb-7"
            style={{ color:"rgba(215,185,144,0.7)" }}>
            <MapPin size={11} />
            <span>{site.location}</span>
          </motion.div>

          <motion.p variants={up}
            className="max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed text-sm sm:text-base"
            style={{ color:"rgba(239,222,201,0.72)" }}>
            {site.tagline}
          </motion.p>

          <motion.div variants={up} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
            <MagneticBtn href="#projects" primary>View Projects</MagneticBtn>
            <MagneticBtn href="#contact">Get in Touch</MagneticBtn>
          </motion.div>

          <motion.div variants={up} className="flex justify-center lg:justify-start gap-3">
            {[
              { href:site.github,              icon:<GithubIcon width={18} height={18} />,   label:"GitHub",   color:"rgba(230,189,130,0.9)" },
              { href:site.linkedin,            icon:<LinkedinIcon width={18} height={18} />, label:"LinkedIn", color:"rgba(212,154,87,0.9)" },
              { href:`mailto:${site.email}`,   icon:<Mail size={18} />,                      label:"Email",    color:"rgba(196,125,69,0.9)" },
              { href:whatsAppChatUrl(site.phone), icon:<WhatsAppGlyph size={18} />,          label:"WhatsApp", color:"rgba(37,211,102,0.95)" },
            ].map(({ href, icon, label, color }, i) => (
              <motion.a key={label} href={href}
                target={href.startsWith("mailto")?undefined:"_blank"}
                rel="noopener noreferrer" aria-label={label}
                initial={{ opacity:0, scale:0, rotate:-180 }}
                animate={{ opacity:1, scale:1, rotate:0 }}
                transition={{ delay:1.8+i*.12, type:"spring", stiffness:200 }}
                whileHover={{ scale:1.25, y:-5 }}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background:"rgba(31,18,12,0.62)",
                  border:"1px solid rgba(230,189,130,0.16)",
                  color:"rgba(215,185,144,0.7)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = color; (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(215,185,144,0.7)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(230,189,130,0.16)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {icon}
              </motion.a>
            ))}
          </motion.div>
          </div>

          <motion.div variants={up} className="relative hidden sm:block">
            <HeroWorkstation />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior:"smooth" })}
        initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ delay:2.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        style={{ color:"rgba(215,185,144,0.62)" }}
        aria-label="Scroll down">
        <span className="text-[9px] tracking-[.3em] uppercase">Scroll</span>
        <motion.div animate={{ y:[0,6,0] }} transition={{ duration:1.5, repeat:Infinity }}>
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}

function HeroWorkstation() {
  const workflow = [
    { icon:<Server size={16} />, label:"Laravel", value:"API backend", delay:0 },
    { icon:<Code2 size={16} />, label:"Nuxt", value:"Full-stack UI", delay:.15 },
    { icon:<Database size={16} />, label:"Docker", value:"Deploy ready", delay:.3 },
  ];

  return (
    <div className="relative mx-auto max-w-[520px]">
      <motion.div className="absolute -inset-6 rounded-[2rem] opacity-70"
        style={{ background:"radial-gradient(circle at 50% 35%,rgba(212,154,87,.22),transparent 62%)", filter:"blur(20px)" }}
        animate={{ scale:[1,1.05,1], opacity:[.5,.85,.5] }}
        transition={{ duration:5, repeat:Infinity }} />

      <div className="relative overflow-hidden rounded-[1.6rem] p-5"
        style={{
          background:"linear-gradient(145deg,rgba(70,43,27,.9),rgba(17,10,7,.86))",
          border:"1px solid rgba(230,189,130,.17)",
          boxShadow:"0 28px 90px rgba(20,9,4,.46), inset 0 1px 0 rgba(255,225,180,.08)",
        }}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.24em]" style={{ color:"rgba(230,189,130,.72)" }}>
              Backend Workflow
            </p>
          
          </div>
          <motion.div className="h-11 w-11 rounded-2xl flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#e6bd82,#c47d45)", color:"#1d1009" }}
            animate={{ rotate:[0,4,-4,0] }}
            transition={{ duration:4, repeat:Infinity }}>
            <Code2 size={22} />
          </motion.div>
        </div>

        <div className="rounded-[1.2rem] p-4"
          style={{ background:"rgba(17,10,7,.66)", border:"1px solid rgba(230,189,130,.1)" }}>
          <div className="space-y-3">
            {[
              { w:"78%", color:"#e6bd82" },
              { w:"58%", color:"#d49a57" },
              { w:"86%", color:"#c47d45" },
              { w:"44%", color:"#8b5a3c" },
            ].map((line, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 text-right text-[10px] font-mono" style={{ color:"rgba(215,185,144,.45)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <motion.span className="h-2 rounded-full"
                  style={{ background:line.color, boxShadow:`0 0 18px ${line.color}44` }}
                  initial={{ width:0 }}
                  animate={{ width:line.w }}
                  transition={{ duration:1.1, delay:.4 + i * .12, ease:[.16,1,.3,1] }} />
              </div>
            ))}
          </div>

          <motion.div className="mt-5 h-10 rounded-2xl flex items-center px-4 font-mono text-xs"
            style={{ background:"rgba(92,56,35,.34)", color:"#e6bd82", border:"1px solid rgba(230,189,130,.1)" }}
            animate={{ boxShadow:["0 0 0 rgba(212,154,87,0)","0 0 24px rgba(212,154,87,.16)","0 0 0 rgba(212,154,87,0)"] }}
            transition={{ duration:2.6, repeat:Infinity }}>
            <span>php artisan route:list</span>
            <motion.span className="ml-1 inline-block h-4 w-1 rounded-sm bg-[#e6bd82]"
              animate={{ opacity:[0,1,0] }}
              transition={{ duration:.9, repeat:Infinity }} />
          </motion.div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {workflow.map((item) => (
            <motion.div key={item.label}
              className="rounded-2xl p-3"
              style={{ background:"rgba(255,236,207,.04)", border:"1px solid rgba(230,189,130,.09)" }}
              animate={{ y:[0,-5,0] }}
              transition={{ duration:3, repeat:Infinity, delay:item.delay }}>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ color:"#e6bd82", background:"rgba(212,154,87,.13)" }}>
                {item.icon}
              </div>
              <p className="text-xs font-bold" style={{ color:"#fff2df" }}>{item.label}</p>
              <p className="mt-1 text-[10px] leading-snug" style={{ color:"rgba(239,222,201,.56)" }}>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MagneticBtn({ href, children, primary }: { href:string; children:React.ReactNode; primary?:boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior:"smooth" });
  };
  return (
    <motion.a href={href} onClick={handleClick}
      whileHover={{ scale:1.07, y:-2 }} whileTap={{ scale:.95 }}
      className={`relative px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300 ${
        primary ? "text-[#1d1009]" : "text-[#e6bd82]"
      }`}
      style={primary ? {
        background:"linear-gradient(135deg,#e6bd82,#c47d45)",
        boxShadow:"0 18px 42px rgba(196,125,69,.3)",
      } : {
        background:"rgba(31,18,12,0.6)",
        border:"1px solid rgba(230,189,130,0.28)",
        boxShadow:"0 0 0 rgba(196,125,69,0)",
      }}>
      {primary && (
        <motion.span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <motion.span className="absolute top-0 bottom-0 w-1/3"
            style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)" }}
            animate={{ left:["-40%","140%"] }}
            transition={{ duration:2.5, repeat:Infinity, repeatDelay:1 }} />
        </motion.span>
      )}
      <span className="relative">{children}</span>
    </motion.a>
  );
}
