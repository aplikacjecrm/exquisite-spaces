"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronRight, Settings, BookOpen, BarChart2, Cog, FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import type { Lang } from "../context/LanguageContext";

const CAT_CONFIG = [
  { icon: Settings, video: true,  imgKey: null as null | "img1" | "img2" | "img3", imgAfterText: false },
  { icon: BookOpen, video: false, imgKey: "img1" as const,  imgAfterText: false },
  { icon: BarChart2,video: false, imgKey: "img2" as const,  imgAfterText: false },
  { icon: Cog,      video: false, imgKey: "img3" as const,  imgAfterText: true  },
  { icon: FileText, video: false, imgKey: null as null | "img1" | "img2" | "img3", imgAfterText: false },
];

const IMG_MAP: Record<Lang, { img1: string; img2: string; img3: string }> = {
  pl: { img1: "/images/z2.png",        img2: "/images/z1.png",        img3: "/images/z3.png" },
  de: { img1: "/images/img DE.png",    img2: "",                      img3: "/images/img DE 2.png" },
  en: { img1: "/images/img EN.png",    img2: "",                      img3: "/images/img EN 2.png" },
  fr: { img1: "/images/img FR.png",    img2: "",                      img3: "/images/img FR 2.png" },
  nl: { img1: "/images/img NL.png",    img2: "",                      img3: "/images/img NL 2.png" },
};

export default function AboutModal({ externalOpen, onExternalClose, label, fullWidth }: { externalOpen?: boolean; onExternalClose?: () => void; label?: string; fullWidth?: boolean } = {}) {
  const { t, lang } = useLanguage();
  const am = t.aboutModal;
  const [internalOpen, setInternalOpen] = useState(false);
  const [active, setActive] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const savedScrollY = useRef(0);

  const open = externalOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    if (externalOpen !== undefined) { if (!v && onExternalClose) onExternalClose(); }
    else setInternalOpen(v);
  };

  useEffect(() => {
    if (open) {
      savedScrollY.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScrollY.current);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [open]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [active]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const catData = am.categories[active];
  const catCfg  = CAT_CONFIG[active];
  const CatIcon = catCfg.icon;
  const imgs    = IMG_MAP[lang];
  const catImg  = catCfg.imgKey ? imgs[catCfg.imgKey] : null;

  const NavBar = () => (
    <div className="hidden mt-10 flex items-center justify-between gap-4 pt-8 border-t border-zinc-100">
      <button
        onClick={() => setActive((i) => Math.max(i - 1, 0))}
        disabled={active === 0}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 text-sm font-semibold transition-colors disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronRight size={14} className="rotate-180" />
        {am.prevLabel}
      </button>
      <div className="flex items-center gap-1.5">
        {am.categories.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-zinc-900" : "w-2 bg-zinc-200 hover:bg-zinc-400"}`}
          />
        ))}
      </div>
      <button
        onClick={() => setActive((i) => Math.min(i + 1, am.categories.length - 1))}
        disabled={active === am.categories.length - 1}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 text-sm font-semibold transition-colors disabled:opacity-0 disabled:pointer-events-none"
      >
        {am.nextLabel}
        <ChevronRight size={14} />
      </button>
    </div>
  );

  return (
    <>
      {externalOpen === undefined && (
        <button
          onClick={() => setOpen(true)}
          className={`${fullWidth ? "w-full justify-center" : "inline-flex"} flex items-center gap-2 border border-zinc-300 hover:border-zinc-700 text-zinc-600 hover:text-zinc-900 px-6 py-3 rounded-full font-semibold transition-all text-sm group`}
        >
          <FileText size={15} className="group-hover:scale-110 transition-transform" />
          {label ?? am.ctaBtn}
          <ChevronRight size={13} />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white w-full h-screen sm:h-[92vh] sm:max-w-[1320px] sm:rounded-3xl overflow-hidden flex flex-col shadow-[0_32px_100px_rgba(0,0,0,0.5)] max-w-full">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-zinc-950 border-b border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <img src="/images/Logo.png" alt="ES" className="h-8 w-auto" />
                <div>
                  <div className="text-white font-black text-sm tracking-tight">EXQUISITE SPACES</div>
                  <div className="text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase">{am.sidebarLabel}</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex w-11 h-11 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                aria-label="Zamknij"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 overflow-hidden">

              {/* Sidebar — desktop */}
              <aside className="hidden lg:flex flex-col w-72 border-r border-zinc-100 bg-zinc-50/80 flex-shrink-0 overflow-y-auto scrollbar-hide">
                <div className="px-5 pt-7 pb-2">
                  <div className="text-zinc-400 font-mono text-[9px] tracking-[0.45em] uppercase">{am.sidebarLabel}</div>
                </div>
                <nav className="px-3 pb-8 space-y-1 mt-2">
                  {am.categories.map((c, i) => {
                    const Icon = CAT_CONFIG[i].icon;
                    const isActive = i === active;
                    return (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`w-full flex items-start gap-3 px-3.5 py-3.5 rounded-2xl text-left transition-all duration-200 ${
                          isActive ? "bg-zinc-900 shadow-lg shadow-zinc-900/20" : "hover:bg-zinc-100"
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0 text-zinc-400">
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[9px] font-mono tracking-[0.25em] uppercase mb-0.5 ${isActive ? "text-zinc-500" : "text-zinc-400"}`}>
                            {c.tag}
                          </div>
                          <div className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : "text-zinc-700"}`}>
                            {c.title}
                          </div>
                        </div>
                        {isActive && <ChevronRight size={12} className="flex-shrink-0 mt-1 text-zinc-500" />}
                      </button>
                    );
                  })}
                </nav>

                {/* Sidebar footer */}
                <div className="mt-auto px-5 py-5 border-t border-zinc-200">
                  <div className="text-zinc-400 font-mono text-[9px] tracking-widest uppercase mb-1">{am.contactLabel}</div>
                  <a href="tel:+48600390073" className="text-zinc-700 font-bold text-sm hover:text-zinc-900 transition-colors">
                    +48 600 390 073
                  </a>
                  <div className="text-zinc-400 text-xs mt-0.5">{am.hoursText}</div>
                </div>
              </aside>

              {/* Main */}
              <main ref={mainRef} className="flex-1 overflow-y-auto bg-white scrollbar-hide">

                {/* Mobile + tablet category pills — top navigation strip */}
                <div className="flex lg:hidden gap-2 overflow-x-auto px-4 py-3 border-b border-zinc-100 bg-zinc-50 scrollbar-hide">
                  {am.categories.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all ${
                        i === active ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-500"
                      }`}
                    >
                      {c.tag.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-28 lg:py-12">

                  {/* Doc header */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-full text-[9px] font-mono tracking-[0.3em] uppercase mb-5">
                      <CatIcon size={10} />
                      {catData.tag}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 leading-tight mb-2">
                      {catData.title}
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">{catData.subtitle}</p>
                  </div>

                  {/* Hero image — before text */}
                  {!catCfg.imgAfterText && catImg && (
                    <div className="mb-8 shadow-lg border border-zinc-100 rounded-2xl overflow-hidden">
                      <img src={catImg} alt={catData.title} className="w-full object-contain" />
                    </div>
                  )}

                  {/* Video section */}
                  {catCfg.video && (
                    <div className="relative rounded-2xl overflow-hidden mb-8 bg-zinc-900 shadow-xl border border-zinc-800">
                      <video
                        src="/images/kontakt video.mp4"
                        className="w-full h-48 sm:h-64 object-cover opacity-60"
                        muted loop playsInline autoPlay
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                      <div className="absolute bottom-4 left-5">
                        <div className="text-white/60 font-mono text-[9px] tracking-widest uppercase">Exquisite Spaces · Żywiec</div>
                      </div>
                    </div>
                  )}

                  {/* Text sections */}
                  <div className="space-y-8">
                    {catData.sections.map((sec, i) => (
                      <div key={i} className="group">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1.5">
                            <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs font-black">
                              {i + 1}
                            </div>
                          </div>
                          <div className="flex-1 pb-8 border-b border-zinc-100 last:border-b-0">
                            <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-3 leading-snug">{sec.heading}</h3>
                            <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">{sec.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation — normal (non-imgAfterText) */}
                  {!catCfg.imgAfterText && <NavBar />}

                  {/* Hero image — after text + navigation */}
                  {catCfg.imgAfterText && (
                    <>
                      {catImg && (
                        <div className="mt-8 shadow-lg border border-zinc-100 rounded-2xl overflow-hidden">
                          <img src={catImg} alt={catData.title} className="w-full object-contain" />
                        </div>
                      )}
                      <NavBar />
                    </>
                  )}

                  {/* CTA */}
                  <div className="mt-8 bg-zinc-950 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-1">{am.ctaTag}</div>
                      <div className="text-white font-bold text-base">{am.ctaHeading}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{am.ctaContact}</div>
                    </div>
                    <a
                      href="#kontakt"
                      onClick={() => setOpen(false)}
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg"
                    >
                      {am.ctaBtn}
                      <ArrowRight size={14} />
                    </a>
                  </div>

                </div>

                {/* Mobile + tablet close button */}
                <div className="lg:hidden sticky bottom-0 bg-white border-t border-zinc-100 px-5 py-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
                  >
                    <X size={16} /> Zamknij
                  </button>
                </div>

              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
