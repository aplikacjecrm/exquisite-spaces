"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useLanguage, LANG_META, type Lang } from "../context/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const navLinks = [
    { href: "#o-firmie", label: t.nav.about },
    { href: "#uslugi", label: t.nav.services },
    { href: "#sprzet", label: t.nav.equipment },
    { href: "#realizacje", label: t.nav.portfolio },
    { href: "#kontakt", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (open) setOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        (scrolled || open)
          ? "bg-white/98 backdrop-blur-md shadow-md border-b border-slate-200/80"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 transition-opacity duration-500 ${(scrolled || open) ? "opacity-100" : "opacity-0"}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
                src="/images/Logo.png"
                alt="Exquisite Spaces"
                className="h-10 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className={`font-black text-sm lg:text-base tracking-tight transition-colors duration-500 ${(scrolled || open) ? "text-zinc-900" : "text-white"}`}>EXQUISITE SPACES</span>
              <span className={`font-mono text-[9px] lg:text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${(scrolled || open) ? "text-zinc-400" : "text-white/60"}`}>Żywiec · Sp. z o.o.</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors text-sm relative group ${(scrolled || open) ? "text-slate-600 hover:text-zinc-900" : "text-white/80 hover:text-white"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${(scrolled || open) ? "bg-zinc-900" : "bg-white"}`} />
              </a>
            ))}
          </div>

          {/* Language switcher — desktop */}
          <div className={`hidden lg:flex items-center gap-1 border rounded-lg p-0.5 transition-colors duration-500 ${(scrolled || open) ? "border-slate-200" : "border-white/20"}`}>
            {(Object.keys(LANG_META) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                title={LANG_META[l].label}
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
                  lang === l
                    ? ((scrolled || open) ? "bg-zinc-900 text-white shadow-sm" : "bg-white/20 text-white shadow-sm")
                    : ((scrolled || open) ? "text-slate-500 hover:text-zinc-900" : "text-white/60 hover:text-white")
                }`}
              >
                {LANG_META[l].flag}
              </button>
            ))}
          </div>

          {/* CTA + mobile */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+48600390073"
              className={`hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-500 ${(scrolled || open) ? "text-slate-600 hover:text-zinc-900" : "text-white/80 hover:text-white"}`}
            >
              <Phone size={15} />
              +48 600 390 073
            </a>
            <a
              href="#kontakt"
              className="hidden lg:inline-flex items-center bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-black transition-all shadow-md shadow-zinc-900/20 text-sm"
            >
              {t.nav.cta}
            </a>
            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-500 ${(scrolled || open) ? "text-slate-600 hover:text-zinc-900 hover:bg-slate-100" : "text-white hover:text-white/80"}`}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile + tablet menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center text-slate-700 hover:text-zinc-900 hover:bg-zinc-50 font-medium py-3 px-4 rounded-xl text-base transition-colors"
              >
                {link.label}
              </a>
            ))}
            {/* Language switcher — mobile */}
            <div className="flex items-center gap-1 px-4 py-2">
              {(Object.keys(LANG_META) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    lang === l ? "bg-zinc-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {LANG_META[l].flag} {LANG_META[l].label}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100">
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center bg-zinc-900 text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-black transition-colors"
              >
                {t.nav.ctaMobile}
              </a>
              <a
                href="tel:+48600390073"
                className="flex items-center justify-center gap-2 text-slate-600 mt-3 py-2 text-sm"
              >
                <Phone size={15} /> +48 600 390 073
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
