"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FolderOpen, Maximize2, Eye } from "lucide-react";
import { useLanguage, type Lang } from "../context/LanguageContext";

const PdfModal = dynamic(() => import("./PdfModal"), { ssr: false });

const PROJECT_IMGS = [
  { img: "/images/3.png", objectPos: "center 40%" },
  { img: "/images/5.png", objectPos: "center 50%" },
  { img: "/images/6.png", objectPos: "center 50%" },
  { img: "/images/1.png", objectPos: "center 35%" },
  { img: "/images/4.png", objectPos: "center 60%" },
];

const BROCHURES: { lang: Lang; flag: string; label: string; title: string; file: string }[] = [
  { lang: "pl", flag: "🇵🇱", label: "PL", title: "Exquisite Spaces – Infrastruktura (PL)", file: "/images/Exquisite_Infrastructure PL.pdf" },
  { lang: "de", flag: "🇩🇪", label: "DE", title: "Exquisite Spaces – Infrastruktur (DE)", file: "/images/Exquisite_Spaces_Infrastructure_Solutions_DE.pdf" },
  { lang: "fr", flag: "🇫🇷", label: "FR", title: "Exquisite Spaces – Infrastructure (FR)", file: "/images/Exquisite_Spaces_Infrastructure_Engineering_FR.pdf" },
  { lang: "en", flag: "🇬🇧", label: "EN", title: "Exquisite Spaces – Infrastructure (EN)", file: "/images/Infrastructure_Powerhouse_EN.pdf" },
  { lang: "nl", flag: "🇳🇱", label: "NL", title: "Exquisite Spaces – Infrastructuur (NL)", file: "/images/Exquisite_Spaces_Infrastructure_NL.pdf" },
];

type Project = { num: string; title: string; category: string; desc: string; img: string; objectPos: string };

function ProjectCard({ project, tall }: { project: Project; tall?: boolean }) {
  return (
    <div className={`group relative ${tall ? "h-72 sm:h-96" : "h-64 sm:h-80"} rounded-2xl cursor-pointer transition-[transform,box-shadow] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_28px_72px_rgba(0,0,0,0.8),0_0_0_1.5px_rgba(200,210,220,0.25)]`}>
      {/* Inner wrapper: transform-gpu forces GPU compositing, fixing overflow-hidden + border-radius on parent transform */}
      {/* Image wrapper — overflow-hidden clips the photo */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden transform-gpu"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        {/* Full-bleed image */}
        <img
          src={project.img}
          alt={project.title}
          style={{ objectPosition: project.objectPos }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-70 group-hover:opacity-90"
        />

        {/* Permanent gradient — always dark at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Noise texture */}
        <div className="noise-overlay absolute inset-0 opacity-[0.03] mix-blend-overlay" />

        {/* Top row: category + number */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-5">
          <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/10">
            {project.category}
          </span>
          <span className="text-white/20 font-black text-5xl leading-none select-none group-hover:text-white/30 transition-colors duration-300">
            {project.num}
          </span>
        </div>

        {/* Bottom content — always in place, desc fades in */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="w-8 h-0.5 bg-white/40 mb-3 group-hover:w-16 group-hover:bg-white/70 transition-all duration-700 ease-out" />
          <h3 className="text-white font-black text-lg leading-tight mb-2 drop-shadow-lg">
            {project.title}
          </h3>
          <p className="text-zinc-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 ease-in-out line-clamp-2">
            {project.desc}
          </p>
        </div>
      </div>

      {/* Chrome border overlay — sits on top of the image, not clipped */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none border border-zinc-600/40 group-hover:border-zinc-300/70 transition-[border-color,box-shadow] duration-700 ease-out shadow-[inset_0_1.5px_1px_-0.5px_rgba(255,255,255,0.25),inset_0_-1.5px_1px_-0.5px_rgba(0,0,0,0.45)] group-hover:shadow-[inset_0_3px_2px_-1px_rgba(255,255,255,0.65),inset_0_-3px_2px_-1px_rgba(0,0,0,0.65),inset_3px_0_2px_-1px_rgba(220,225,235,0.30),inset_-3px_0_2px_-1px_rgba(20,20,30,0.40)]"
      />
    </div>
  );
}


export default function Portfolio() {
  const [pdfOpen, setPdfOpen] = useState<string | null>(null);
  const { lang, t } = useLanguage();
  const projects = t.portfolio.projects.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0"), ...PROJECT_IMGS[i] }));

  useEffect(() => {
    document.body.style.overflow = pdfOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [pdfOpen]);

  const defaultBrochure = BROCHURES.find((b) => b.lang === lang) ?? BROCHURES[0];
  const [activeBrochure, setActiveBrochure] = useState(defaultBrochure);

  useEffect(() => {
    const match = BROCHURES.find((b) => b.lang === lang);
    if (match) setActiveBrochure(match);
  }, [lang]);

  return (
    <section id="realizacje" className="py-14 sm:py-20 lg:py-32 bg-zinc-950 text-white overflow-x-hidden relative">
      {/* Scanline grid */}
      <div className="white-grid absolute inset-0 pointer-events-none" />
      {/* Fade edges */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-zinc-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              {t.portfolio.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t.portfolio.heading} <span className="text-zinc-300">{t.portfolio.headingSub}</span>
            </h2>
          </div>

          <a
            href="#kontakt"
            className="inline-flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:bg-white/5 text-sm flex-shrink-0"
          >
            <FolderOpen size={18} />
            {t.portfolio.btnAsk}
          </a>
        </div>

        {/* First row — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pb-2">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.num} project={project} />
          ))}
        </div>

        {/* Second row — 2 cards, full width, taller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
          {projects.slice(3).map((project) => (
            <ProjectCard key={project.num} project={project} tall />
          ))}
        </div>

        {/* Brochures section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">// {t.portfolio.docLabel}</span>
            <span className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="mb-5">
            <h3 className="text-white font-bold text-xl mb-1">{t.portfolio.brochuresHeading}</h3>
            <p className="text-zinc-500 text-sm">{t.portfolio.brochuresSubtitle}</p>
          </div>

          {/* Language tab strip */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {BROCHURES.map((b) => (
              <button
                key={b.file}
                onClick={() => setActiveBrochure(b)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeBrochure.file === b.file
                    ? "bg-white text-zinc-900 border-white shadow-[0_0_16px_rgba(255,255,255,0.15)]"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200"
                }`}
              >
                <span className="text-base">{b.flag}</span>
                <span className="font-mono text-xs">{b.label}</span>
                {b.lang === lang && (
                  <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full uppercase ${
                    activeBrochure.file === b.file ? "bg-zinc-900 text-white" : "bg-white/10 text-zinc-400"
                  }`}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Featured brochure card — thumbnail + meta */}
          <div className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.04)]">

            {/* Mobile: PDF not supported in iframe on Android → styled card */}
            <div className="sm:hidden flex flex-col items-center justify-center gap-5 py-10 px-6 bg-zinc-900/60">
              <span className="text-6xl">{activeBrochure.flag}</span>
              <div className="text-center">
                <div className="text-zinc-500 font-mono text-[9px] tracking-[0.4em] uppercase mb-1">{activeBrochure.label}</div>
                <div className="text-white font-bold text-base leading-snug">{activeBrochure.title}</div>
              </div>
              <button
                onClick={() => setPdfOpen(activeBrochure.file)}
                className="flex items-center gap-2 bg-white text-zinc-900 hover:bg-zinc-100 px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg"
              >
                <Eye size={16} />
                {t.portfolio.btnPreview}
              </button>
            </div>

            {/* Desktop: iframe PDF preview */}
            <div className="relative hidden sm:block overflow-hidden" style={{ height: "600px" }}>
              <iframe
                key={activeBrochure.file}
                src={`${activeBrochure.file}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=75`}
                className="absolute inset-0 h-full"
                title="PDF miniatura"
                style={{ width: "calc(100% + 20px)" }}
              />
              {/* Floating expand button */}
              <button
                onClick={() => setPdfOpen(activeBrochure.file)}
                className="absolute top-3 right-6 z-10 flex items-center gap-2 bg-black/70 hover:bg-black text-white backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-xs shadow-xl transition-all border border-white/10 hover:border-white/30"
              >
                <Maximize2 size={13} />
                {t.portfolio.btnPreview}
              </button>
            </div>
            {/* Meta bar */}
            <div className="flex items-center gap-4 px-5 py-4 border-t border-white/10">
              <span className="text-3xl flex-shrink-0">{activeBrochure.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-zinc-500 font-mono text-[9px] tracking-[0.4em] uppercase mb-0.5">{activeBrochure.label}</div>
                <div className="text-white font-bold text-sm truncate">{activeBrochure.title}</div>
              </div>
              <button
                onClick={() => setPdfOpen(activeBrochure.file)}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-zinc-700/60 flex-shrink-0"
              >
                <Eye size={13} />
                {t.portfolio.btnPreview}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mt-6 gap-3 text-zinc-700 font-mono text-[9px] tracking-[0.4em] uppercase select-none">
            <span className="w-6 h-px bg-zinc-800" />
            {t.portfolio.confidential}
            <span className="w-6 h-px bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* PDF modal */}
      {pdfOpen && <PdfModal path={pdfOpen} onClose={() => setPdfOpen(null)} />}
    </section>
  );
}
