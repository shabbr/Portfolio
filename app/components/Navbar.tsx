"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Shield, X } from "lucide-react";
import { useOrderedNav, usePortfolio } from "./PortfolioProvider";

export default function Navbar() {
  const { site } = usePortfolio();
  const navLinks = useOrderedNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { threshold: 0.35 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [navLinks]);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "mx-3 mt-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(230,189,130,0.14)] sm:mx-4"
            : "mx-0 mt-0 rounded-none shadow-none"
        }`}
        style={{
          background: scrolled
            ? "rgba(22,13,9,0.88)"
            : "rgba(18,11,8,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "none" : "1px solid rgba(230,189,130,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <button onClick={() => go("#home")} className="flex items-center gap-2.5 shrink-0 group">
            <motion.span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-[#020810] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
              whileHover={{ scale:1.1 }}>
              <span className="relative z-10">{site.initials}</span>
              <motion.span className="absolute inset-0"
                style={{ background:"linear-gradient(135deg,#d49a57,#8b5a3c)" }}
                animate={{ opacity:[0,1,0] }} transition={{ duration:3, repeat:Infinity }} />
            </motion.span>
            <span className="text-xs font-semibold hidden sm:block tracking-widest uppercase"
              style={{ color:"rgba(239,222,201,0.76)" }}>
              {site.firstName}
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const id = href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={href}>
                  <button
                    onClick={() => go(href)}
                    className={`relative px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#e6bd82]"
                        : "text-[rgba(239,222,201,0.72)] hover:text-[#fff2df]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "rgba(92,56,35,0.38)",
                          border: "1px solid rgba(230,189,130,0.28)",
                          boxShadow: "0 0 18px rgba(196,125,69,0.18)",
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <a
                href="/admin"
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-[#1d1009] transition hover:brightness-110"
                style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
              >
                <Shield size={13} />
                Admin
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2 md:hidden">
            <a
              href="/admin"
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#1d1009]"
              style={{ background: "linear-gradient(135deg,#e6bd82,#c47d45)" }}
              aria-label="Admin dashboard"
            >
              <Shield size={12} />
              Admin
            </a>
            <button
              className="text-[#d7b990] hover:text-[#fff2df] transition-colors p-1"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-1 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(22,13,9,0.94)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(230,189,130,0.16)",
            }}
          >
            <ul className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => go(href)}
                    className="w-full text-left px-4 py-2 rounded-lg text-[#d7b990] hover:text-[#fff2df] hover:bg-[rgba(92,56,35,0.32)] transition-all text-xs sm:text-sm font-medium"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/admin"
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[#e6bd82] hover:bg-[rgba(92,56,35,0.32)] transition-all text-xs sm:text-sm font-medium"
                >
                  <Shield size={14} />
                  Admin dashboard
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
