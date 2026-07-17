"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Shield } from "lucide-react";
import GithubIcon from "./icons/GithubIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import { WhatsAppGlyph } from "./WhatsAppFloat";
import { formatDisplayPhone, telHref, whatsAppChatUrl } from "@/lib/phone";
import { usePortfolio } from "./PortfolioProvider";

export default function Footer() {
  const { site } = usePortfolio();
  const phoneDisplay = formatDisplayPhone(site.phone);

  return (
    <footer className="relative py-10 px-6 overflow-hidden">
      <div className="ice-divider mb-8" />

      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none" aria-hidden="true">
        {[10,18,8,14,22,9,16,12,20,7].map((h, i) => (
          <motion.div key={i}
            style={{ width:"1.5px", height:`${h}px`,
              background:"linear-gradient(180deg,rgba(230,189,130,0.28),transparent)",
              borderRadius:"0 0 2px 2px" }}
            animate={{ opacity:[.25,.75,.25], scaleY:[.85,1.1,.85] }}
            transition={{ duration:2.2+i*.28, repeat:Infinity, delay:i*.18 }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <motion.p className="text-xs"
            style={{ color:"rgba(215,185,144,0.88)" }}
            animate={{ opacity:[.78,.95,.78] }} transition={{ duration:5, repeat:Infinity }}>
            (c) {new Date().getFullYear()} {site.fullName} - Built with Next.js &amp; Tailwind CSS
          </motion.p>
          {site.phone?.trim() && (
            <a
              href={telHref(site.phone)}
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#e6bd82] hover:text-[#fff2df] transition-colors"
            >
              <Phone size={12} />
              {phoneDisplay}
            </a>
          )}
        </div>

        <div className="flex items-center gap-4">
          {[
            { href:site.github,            icon:<GithubIcon width={16} height={16} />,   label:"GitHub",   color:"#e6bd82" },
            { href:site.linkedin,          icon:<LinkedinIcon width={16} height={16} />, label:"LinkedIn", color:"#d49a57" },
            { href:`mailto:${site.email}`, icon:<Mail size={16} />,                      label:"Email",    color:"#c47d45" },
            { href:whatsAppChatUrl(site.phone), icon:<WhatsAppGlyph size={16} />,        label:"WhatsApp", color:"#25d366" },
          ].map(({ href, icon, label, color }) => (
            <motion.a key={label} href={href}
              target={href.startsWith("mailto") || href.startsWith("tel:") ? undefined : "_blank"}
              rel="noopener noreferrer" aria-label={label}
              whileHover={{ scale:1.25, y:-3 }}
              style={{ color:"rgba(215,185,144,0.88)" }}
              className="transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = color}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(215,185,144,0.88)"}>
              {icon}
            </motion.a>
          ))}
          <a
            href="/admin"
            aria-label="Admin dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e6bd82] hover:text-[#fff2df] transition-colors"
          >
            <Shield size={14} />
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
