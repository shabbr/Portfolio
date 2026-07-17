"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useReadyInView } from "@/lib/useReadyInView";
import { useOrderedSkillCategories, useOrderedSkillLevels } from "./PortfolioProvider";

const BAR_COLORS = [
  "linear-gradient(90deg,#8b5a3c,#c47d45,#e6bd82)",
  "linear-gradient(90deg,#5c3823,#a96f45,#d49a57)",
  "linear-gradient(90deg,#6f4328,#c47d45,#f0d0a0)",
  "linear-gradient(90deg,#3a2115,#8b5a3c,#d49a57)",
];

const CAT_COLORS = [
  { color:"#e6bd82", bg:"rgba(230,189,130,0.1)" },
  { color:"#d49a57", bg:"rgba(212,154,87,0.11)" },
  { color:"#c47d45", bg:"rgba(196,125,69,0.12)" },
  { color:"#a96f45", bg:"rgba(169,111,69,0.14)" },
];

export default function Skills() {
  const skillLevels = useOrderedSkillLevels();
  const skillCategories = useOrderedSkillCategories();
  const ref = useRef(null);
  const inView = useReadyInView(ref, { once:true, margin:"-80px" });

  return (
    <section id="skills" className="relative py-20 px-4 overflow-hidden sm:py-24 sm:px-6 lg:py-28">
      <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width:"900px", height:"450px",
          background:"radial-gradient(ellipse at top,rgba(212,154,87,0.16) 0%,rgba(92,56,35,0.12) 45%,transparent 70%)",
          filter:"blur(30px)" }}
        animate={inView ? { opacity:[.4,.85,.4] } : { opacity: .5 }}
        transition={{ duration:6, repeat:Infinity }}
        aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10" ref={ref}>
        <motion.div initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.7 }} className="text-center mb-10 sm:mb-14">
          <span className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.24em]"
            style={{ color:"#e6bd82", background:"rgba(92,56,35,.36)", border:"1px solid rgba(230,189,130,.22)" }}>
            Technical Arsenal
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 leading-tight" style={{ color:"#fff2df" }}>
            My <span style={{ color:"#d49a57" }}>Skills</span>
          </h2>
          <motion.div className="ice-divider mt-4 mx-auto" style={{ width:0 }}
            animate={inView?{width:"120px"}:{}} transition={{ duration:.8, delay:.3 }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          <motion.div initial={{ opacity:0, x:-36 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:.7, delay:.2 }} className="space-y-5">
            <h3 className="text-xs tracking-[.25em] uppercase mb-6" style={{ color:"rgba(230,189,130,0.72)" }}>
              Proficiency
            </h3>
            {skillLevels.map(({ id, name, level }, i) => (
              <div key={id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color:"rgba(255,242,223,0.9)" }}>{name}</span>
                  <motion.span className="text-xs font-mono font-bold"
                    style={{ color:i%2===0?"#e6bd82":"#d49a57" }}
                    initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
                    transition={{ delay:.5+i*.08 }}>
                    {level}%
                  </motion.span>
                </div>
                <div className="h-2 rounded-full overflow-hidden"
                  style={{ background:"rgba(92,56,35,0.34)", border:"1px solid rgba(230,189,130,0.11)" }}>
                  <motion.div className="h-full rounded-full relative overflow-hidden"
                    initial={{ width:0 }}
                    animate={inView?{width:`${level}%`}:{}}
                    transition={{ duration:1.4, delay:.3+i*.09, ease:[.16,1,.3,1] }}
                    style={{ background:BAR_COLORS[i%4], boxShadow:"0 0 14px rgba(196,125,69,.32)" }}>
                    <motion.span className="absolute inset-0 block"
                      style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", width:"55%" }}
                      animate={inView ? { left:["-55%","155%"] } : { left: "-55%" }}
                      transition={{ duration:2.5, repeat:Infinity, delay:1.3+i*.12, ease:"linear" }} />
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0, x:36 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:.7, delay:.3 }} className="space-y-4">
            <h3 className="text-xs tracking-[.25em] uppercase mb-6" style={{ color:"rgba(230,189,130,0.72)" }}>
              Categories
            </h3>
            {skillCategories.map((cat, ci) => {
              const c = CAT_COLORS[ci % CAT_COLORS.length];
              return (
                <motion.div key={cat.id}
                  initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}}
                  transition={{ duration:.5, delay:.4+ci*.12 }}
                  className="p-5 relative overflow-hidden rounded-[1.2rem]"
                  style={{
                    background:"linear-gradient(145deg,rgba(70,43,27,.86),rgba(24,14,10,.82))",
                    border:"1px solid rgba(230,189,130,.14)",
                    boxShadow:"0 18px 50px rgba(20,9,4,.3), inset 0 1px 0 rgba(255,225,180,.07)",
                  }}>
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                    style={{ background:`linear-gradient(180deg,transparent,${c.color},transparent)` }} />
                  <div className="flex items-center gap-2 mb-3 pl-2">
                    <motion.div className="w-2 h-2 rounded-full"
                      style={{ background:c.color }}
                      animate={inView ? { scale:[1,1.8,1], opacity:[.5,1,.5] } : { scale: 1, opacity: .75 }}
                      transition={{ duration:2.2, repeat:Infinity, delay:ci*.3 }} />
                    <span className="text-[10px] font-bold tracking-[.22em] uppercase" style={{ color:c.color }}>{cat.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-2">
                    {cat.items.map((skill, si) => (
                      <motion.span key={skill}
                        initial={{ opacity:0, scale:.8 }} animate={inView?{opacity:1,scale:1}:{}}
                        transition={{ delay:.5+ci*.12+si*.06 }}
                        whileHover={{ scale:1.1, y:-2 }}
                        className="px-3 py-1.5 rounded-xl text-xs cursor-default transition-all duration-200"
                        style={{
                          color:"rgba(239,222,201,0.78)",
                          border:`1px solid ${c.color}22`,
                          background:c.bg,
                        }}>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
