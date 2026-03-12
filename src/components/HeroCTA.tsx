"use client";
import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import AboutModal from "./AboutModal";
import { useLanguage } from "../context/LanguageContext";

export default function HeroCTA() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const { t } = useLanguage();
  const stats = t.heroCta.stats;

  return (
    <>
    <AboutModal externalOpen={aboutOpen} onExternalClose={() => setAboutOpen(false)} />
    <section id="akcja" className="relative bg-zinc-950 overflow-hidden">
      {/* Scanline grid background */}
      <div className="hero-cta-grid absolute inset-0 opacity-[0.04]" />
      {/* Fade edges */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />

      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Brand block */}
          <div className="shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-zinc-600 font-mono text-[11px] tracking-[0.5em] uppercase">// ES-001</span>
              <span className="w-12 h-px bg-zinc-700" />
              <span className="text-zinc-600 font-mono text-[11px] tracking-widest">ŻYWIEC · PL</span>
            </div>
            <h2 className="text-white font-black text-3xl lg:text-4xl tracking-tight leading-none">
              EXQUISITE<br />
              <span className="text-zinc-500">SPACES</span>
              <span className="text-zinc-700 text-xl font-normal"> Sp. z o.o.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3">
              {t.heroCta.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[10px] tracking-[0.25em]">{tag}</span>
                  {i < 2 && <span className="text-zinc-700 text-xs">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-0 divide-x divide-zinc-800">
            {stats.map((s) => (
              <div key={s.label} className="px-4 sm:px-6 lg:px-10 text-center first:pl-0 last:pr-0">
                <div className="text-white font-black text-3xl tabular-nums">{s.value}</div>
                <div className="text-zinc-600 font-mono text-[10px] tracking-[0.2em] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setAboutOpen(true)}
              className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-400 text-zinc-400 hover:text-white font-mono text-sm px-8 py-4 rounded-lg transition-all duration-300 tracking-widest hover:-translate-y-0.5"
            >
              {t.heroCta.btnAbout}
              <ChevronRight size={14} />
            </button>
            <a
              href="#kontakt"
              className="group relative inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-bold px-8 py-4 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
            >
              <span className="relative z-10 tracking-wide">{t.heroCta.btnQuote}</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 font-mono text-xs tracking-[0.3em] uppercase">
            {t.heroCta.tagline}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
    </section>
    </>  );
}
