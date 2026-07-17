"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquareText, Phone, Send, TerminalSquare } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import { WhatsAppGlyph } from "./WhatsAppFloat";
import { useReadyInView } from "@/lib/useReadyInView";
import { formatDisplayPhone, telHref, whatsAppChatUrl } from "@/lib/phone";
import { usePortfolio } from "./PortfolioProvider";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const { site } = usePortfolio();
  const ref = useRef(null);
  const inView = useReadyInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputBase =
    "w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-300"
    + " bg-[rgba(31,18,12,0.72)] border";

  const phoneDisplay = formatDisplayPhone(site.phone);
  const CONTACTS = [
    { icon:<Mail size={17} />,                      label:"Email",    value:site.email,              href:`mailto:${site.email}`, color:"#d49a57" },
    { icon:<Phone size={17} />,                     label:"Phone",    value:phoneDisplay,            href:telHref(site.phone),   color:"#e6bd82" },
    { icon:<WhatsAppGlyph size={17} />,             label:"WhatsApp", value:phoneDisplay,            href:whatsAppChatUrl(site.phone), color:"#25d366" },
    { icon:<MapPin size={17} />,                    label:"Location", value:site.location,           href:null,                  color:"#c47d45" },
    { icon:<GithubIcon width={17} height={17} />,   label:"GitHub",   value:`github.com/${site.githubHandle}`, href:site.github, color:"#a96f45" },
    { icon:<LinkedinIcon width={17} height={17} />, label:"LinkedIn", value:site.linkedinHandle,     href:site.linkedin,         color:"#d49a57" },
  ];

  return (
    <section id="contact" className="relative py-20 px-4 overflow-hidden sm:py-24 sm:px-6 lg:py-28">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg,transparent,rgba(40,22,14,.45)),radial-gradient(circle at 18% 18%,rgba(212,154,87,.18),transparent 25%),radial-gradient(circle at 82% 62%,rgba(92,56,35,.42),transparent 30%)",
        }}
        aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage:"linear-gradient(rgba(230,189,130,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(230,189,130,.9) 1px,transparent 1px)", backgroundSize:"48px 48px" }}
        aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10" ref={ref}>
        <motion.div initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:.7 }} className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.24em]"
            style={{ color:"#e6bd82", background:"rgba(92,56,35,.36)", border:"1px solid rgba(230,189,130,.22)" }}>
            <MessageSquareText size={12} />
            Let&apos;s Connect
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 leading-tight" style={{ color:"#fff2df" }}>
            Get in <span style={{ color:"#d49a57" }}>Touch</span>
          </h2>
          <motion.div className="ice-divider mt-4 mx-auto" style={{ width:0 }}
            animate={inView?{width:"120px"}:{}} transition={{ duration:.8, delay:.3 }} />
          <p className="mt-5 max-w-md mx-auto text-sm leading-relaxed" style={{ color:"rgba(239,222,201,0.72)" }}>
            Open to new opportunities, collaborations, or just a friendly chat about tech.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-7 lg:gap-8 items-stretch">
          {/* Contact info */}
          <motion.div initial={{ opacity:0, x:-50 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:.8, delay:.2 }} className="h-full">
            <div className="relative h-full min-h-[520px] overflow-hidden rounded-[1.35rem] p-5 sm:p-6 flex flex-col"
              style={{
                background:"linear-gradient(145deg,rgba(70,43,27,.92),rgba(24,14,10,.86))",
                border:"1px solid rgba(230,189,130,.16)",
                boxShadow:"0 24px 80px rgba(20,9,4,.42), inset 0 1px 0 rgba(255,225,180,.08)",
              }}>
              <div className="relative mb-7">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ color:"#1d1009", background:"linear-gradient(135deg,#e6bd82,#c47d45)", boxShadow:"0 18px 36px rgba(196,125,69,.25)" }}>
                  <TerminalSquare size={21} />
                </div>
                <h3 className="text-xl font-bold" style={{ color:"#fff2df" }}>Start a project conversation</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color:"rgba(239,222,201,.7)" }}>
                  Send the idea, timeline, or rough problem. I&apos;ll reply with the next practical step.
                </p>
              </div>

              <div className="relative space-y-3 flex-1">
                {CONTACTS.map(({ icon, label, value, href, color }, i) => (
                  <motion.div key={label}
                    initial={{ opacity:0, x:-20 }} animate={inView?{opacity:1,x:0}:{}}
                    transition={{ delay:.3+i*.1 }}
                    className="group flex items-start gap-4 rounded-2xl p-3 transition-all duration-300"
                    style={{ background:"rgba(255,236,207,.04)", border:"1px solid rgba(230,189,130,.09)" }}>
                    <motion.div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background:`${color}14`, border:`1px solid ${color}33`, color }}
                      whileHover={{ scale:1.12, boxShadow:`0 0 18px ${color}44` }}>
                      {icon}
                    </motion.div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color:"rgba(230,189,130,0.68)" }}>{label}</p>
                      {href ? (
                        <a href={href}
                          target={href.startsWith("mailto") || href.startsWith("tel:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="text-sm break-all transition-colors duration-200"
                          style={{ color:"rgba(255,242,223,0.9)" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = color}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,242,223,0.9)"}>
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm" style={{ color:"rgba(255,242,223,0.9)" }}>{value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity:0, x:50 }} animate={inView?{opacity:1,x:0}:{}}
            transition={{ duration:.8, delay:.3 }} className="h-full">
            <form onSubmit={handleSubmit} className="relative h-full min-h-[520px] overflow-hidden rounded-[1.35rem] p-5 sm:p-6 flex flex-col"
              style={{
                background:"linear-gradient(145deg,rgba(58,34,22,.92),rgba(17,10,7,.88))",
                border:"1px solid rgba(230,189,130,.16)",
                boxShadow:"0 24px 80px rgba(20,9,4,.4), inset 0 1px 0 rgba(255,225,180,.08)",
              }}>
              <div className="mb-5 border-b pb-5" style={{ borderColor:"rgba(230,189,130,.1)" }}>
                <h3 className="text-xl font-bold" style={{ color:"#fff2df" }}>Tell me about your project</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color:"rgba(239,222,201,.68)" }}>
                  Share a few details and I&apos;ll respond with a practical next step.
                </p>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { id:"name",  label:"Name",  type:"text",  placeholder:"Your name" },
                  { id:"email", label:"Email", type:"email", placeholder:"your@email.com" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="text-xs mb-1.5 block" style={{ color:"rgba(230,189,130,0.82)" }}>
                      {label}
                    </label>
                    <input id={id} name={id} type={type} required placeholder={placeholder}
                      value={form[id as keyof typeof form]}
                      onChange={handleChange}
                      onFocus={() => setFocused(id)}
                      onBlur={() => setFocused(null)}
                      disabled={status === "sending"}
                      style={{ color:"#fff2df" }}
                      className={`${inputBase} placeholder:text-[rgba(196,125,69,0.48)] ${
                        focused === id
                          ? "border-[rgba(230,189,130,0.55)] shadow-[0_0_20px_rgba(212,154,87,0.16)]"
                          : "border-[rgba(230,189,130,0.14)]"
                      } disabled:opacity-50`}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="text-xs mb-1.5 block" style={{ color:"rgba(230,189,130,0.82)" }}>
                    Message
                  </label>
                  <textarea id="message" name="message" required rows={6}
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    disabled={status === "sending"}
                    style={{ color:"#fff2df" }}
                    className={`${inputBase} resize-none placeholder:text-[rgba(196,125,69,0.48)] ${
                      focused === "message"
                        ? "border-[rgba(230,189,130,0.55)] shadow-[0_0_20px_rgba(212,154,87,0.16)]"
                        : "border-[rgba(230,189,130,0.14)]"
                    } disabled:opacity-50`}
                  />
                </div>
              </div>

              {status === "success" && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ color:"#e6bd82", background:"rgba(92,56,35,0.35)", border:"1px solid rgba(230,189,130,0.2)" }}>
                  <CheckCircle size={16} />
                  Message sent! I&apos;ll get back to you soon.
                </motion.div>
              )}

              {status === "error" && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{ color:"#f87171", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)" }}>
                  <AlertCircle size={16} />
                  {errorMsg}
                </motion.div>
              )}

              <motion.button type="submit"
                disabled={status === "sending" || status === "success"}
                whileHover={status === "idle" ? { scale:1.02, y:-1 } : {}}
                whileTap={status === "idle" ? { scale:.97 } : {}}
                className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background:"linear-gradient(135deg,#e6bd82,#c47d45)", color:"#1d1009",
                  boxShadow:"0 18px 36px rgba(196,125,69,0.28)" }}>
                {status === "idle" && (
                  <motion.span className="absolute inset-0"
                    animate={{ opacity:[0,.25,0] }} transition={{ duration:2, repeat:Infinity }}
                    style={{ background:"linear-gradient(135deg,#fff2df,#d49a57)" }} />
                )}
                <span className="relative flex items-center gap-2">
                  {status === "sending" && (
                    <>
                      <motion.span className="w-4 h-4 border-2 border-[#1d1009] border-t-transparent rounded-full"
                        animate={{ rotate:360 }} transition={{ duration:.8, repeat:Infinity, ease:"linear" }} />
                      Sending...
                    </>
                  )}
                  {status === "success" && <><CheckCircle size={15} />Sent!</>}
                  {(status === "idle" || status === "error") && <><Send size={15} />Send Message</>}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
