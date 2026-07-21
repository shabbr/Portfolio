"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useOrderedNav, usePortfolio } from "./PortfolioProvider";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { site } = usePortfolio();
  const navLinks = useOrderedNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  /** Ignore scroll-spy briefly after a nav click so Home doesn't steal active. */
  const clickLockUntil = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateActiveFromScroll = () => {
      if (Date.now() < clickLockUntil.current) return;

      // Pick the last section whose top has crossed below the sticky nav.
      const marker = 96;
      let current = "home";
      for (const { href } of navLinks) {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Hysteresis: enter scrolled at 40px, leave only below 10px —
        // stops the top gap/fill from flickering during fast flings.
        const y = window.scrollY;
        setScrolled((prev) => (prev ? y > 10 : y > 40));
        updateActiveFromScroll();
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [navLinks]);

  const go = (href: string) => {
    const id = href.replace("#", "");
    setActive(id);
    setOpen(false);
    clickLockUntil.current = Date.now() + 1200;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Solid dark fill under the floating pill so the mt-3 gap never
          flashes browser-white during fast scroll / overscroll. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-bg transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`nav-surface relative transition-[margin,border-radius,box-shadow,background-color] duration-500 ${
          scrolled
            ? "mx-3 mt-3 rounded-2xl sm:mx-4"
            : "mx-0 mt-0 rounded-none shadow-none"
        }`}
        style={{
          background: scrolled ? "var(--bg-nav-scrolled)" : "var(--bg-nav)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "none",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--border-subtle)"
            : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <button onClick={() => go("#home")} className="flex items-center gap-2.5 shrink-0 group">
            <motion.span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-[var(--ink)] relative overflow-hidden"
              style={{ background: "var(--btn-bg)" }}
              whileHover={{ scale:1.1 }}>
              <span className="relative z-10">{site.initials}</span>
              <motion.span className="absolute inset-0"
                style={{ background:"linear-gradient(135deg,var(--accent),var(--accent-4))" }}
                animate={{ opacity:[0,1,0] }} transition={{ duration:3, repeat:Infinity }} />
            </motion.span>
            <span className="text-xs font-semibold hidden sm:block tracking-widest uppercase text-muted/80">
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
                        ? "text-accent-2"
                        : "text-fg/70 hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "color-mix(in srgb, var(--accent-4) 38%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--accent-2) 28%, transparent)",
                          boxShadow: "0 0 18px rgba(var(--accent-3-rgb),0.18)",
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <button
              className="md:hidden text-muted hover:text-fg transition-colors p-1"
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
            className="nav-surface mx-4 mt-1 rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-nav-scrolled)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid var(--border)",
            }}
          >
            <ul className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ label, href }) => {
                const id = href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={href}>
                    <button
                      onClick={() => go(href)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                        isActive
                          ? "text-accent-2"
                          : "text-muted hover:text-fg"
                      }`}
                      style={
                        isActive
                          ? { background: "color-mix(in srgb, var(--accent-4) 32%, transparent)" }
                          : undefined
                      }
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
