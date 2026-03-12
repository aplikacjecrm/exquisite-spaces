"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LANG_IDX: Record<string, number> = { pl: 0, de: 1, fr: 2, en: 3, nl: 4 };

const SUPABASE = "https://yinnyzflmywiplluyyhl.supabase.co/storage/v1/object/public/Film";

const VIDEOS = [
  { lang: "PL", flag: "🇵🇱", src: `${SUPABASE}/Video%20Project%20PL%20hq.mp4`, title: "Profesjonalizm od podstaw",           subtitle: "Polski" },
  { lang: "DE", flag: "🇩🇪", src: `${SUPABASE}/Video%20Project%20DE%20hq.mp4`,   title: "Professionalismus von Grund auf",     subtitle: "Deutsch" },
  { lang: "FR", flag: "🇫🇷", src: `${SUPABASE}/Video%20Project%20FR%20hq.mp4`,   title: "Professionnalisme depuis les bases",  subtitle: "Français" },
  { lang: "EN", flag: "🇬🇧", src: `${SUPABASE}/Video%20Project%20EN%20hq.mp4`,   title: "Professionalism from the Ground Up",  subtitle: "English" },
  { lang: "NL", flag: "🇳🇱", src: `${SUPABASE}/Video%20Project%20NL%20hq.mp4`,   title: "Professionalisme van de basis af",    subtitle: "Nederlands" },
];

export default function VideoModal({ bottomCta }: { bottomCta?: import("react").ReactNode } = {}) {
  const { lang, t } = useLanguage();
  const featuredIdx = LANG_IDX[lang] ?? 0;
  const [heroIdx, setHeroIdx]     = useState(featuredIdx);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const heroRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setHeroIdx(featuredIdx); }, [featuredIdx]);
  const [muted, setMuted]         = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [volume, setVolume]       = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]   = useState(0);
  const [showVolSlider, setShowVolSlider] = useState(false);
  const modalRef    = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const open = activeIdx !== null;
  const current = activeIdx !== null ? VIDEOS[activeIdx] : null;

  const close = () => { setActiveIdx(null); setCurrentTime(0); setDuration(0); };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.currentTime = 0;
          modalRef.current.muted = false;
          modalRef.current.play().catch(() => {});
          setPlaying(true);
        }
      }, 80);
    } else {
      modalRef.current?.pause();
      setPlaying(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, activeIdx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && open) setActiveIdx((i) => i !== null ? Math.min(i + 1, VIDEOS.length - 1) : null);
      if (e.key === "ArrowLeft"  && open) setActiveIdx((i) => i !== null ? Math.max(i - 1, 0) : null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const toggleMute = () => {
    if (modalRef.current) { modalRef.current.muted = !muted; setMuted(!muted); }
  };
  const handleVolume = (v: number) => {
    if (modalRef.current) { modalRef.current.volume = v; modalRef.current.muted = v === 0; }
    setVolume(v); setMuted(v === 0);
  };
  const handleSeek = (v: number) => {
    if (modalRef.current) modalRef.current.currentTime = v;
    setCurrentTime(v);
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <>
      {/* ── Video gallery grid ── */}
      <div className="w-full">
        {/* Mobile: horizontal scroll — featured card last */}
        <div className="flex sm:hidden gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {VIDEOS.filter((_, i) => i !== featuredIdx).map((v) => {
            const idx = VIDEOS.indexOf(v);
            return <MiniCard key={v.lang} video={v} onClick={() => setActiveIdx(idx)} />;
          })}
          <MiniCard
            video={VIDEOS[featuredIdx]}
            onClick={() => setActiveIdx(featuredIdx)}
            isFeatured
          />
        </div>
        {/* Mobile: CTA below scroll */}
        {bottomCta && (
          <div className="flex sm:hidden justify-center mt-3">
            {bottomCta}
          </div>
        )}

        {/* Desktop: sidebar playlist layout */}
        <div className="hidden sm:grid gap-4 grid-cols-[1fr_1fr_260px] items-start">

          {/* ── Hero player (left 2 cols) ── */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden bg-zinc-950 shadow-[0_8px_48px_rgba(0,0,0,0.6)] group cursor-pointer"
            onClick={() => setActiveIdx(heroIdx)}
          >
            <video
              key={VIDEOS[heroIdx].src}
              ref={heroRef}
              src={VIDEOS[heroIdx].src}
              className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              autoPlay muted loop playsInline
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

            {/* Language badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
              <span className="text-xl">{VIDEOS[heroIdx].flag}</span>
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase">{VIDEOS[heroIdx].lang}</span>
              <span className="text-white/40 text-[10px] font-mono">·</span>
              <span className="text-white/60 text-[10px] font-mono">{VIDEOS[heroIdx].subtitle}</span>
            </div>

            {/* Center play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-28 h-28 rounded-full bg-white/8 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <Play size={30} className="fill-white ml-1.5" />
                </div>
              </div>
            </div>

            {/* Bottom: title only */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
              <div className="text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase mb-1.5">Exquisite Spaces</div>
              <div className="text-white font-black text-xl leading-tight">{VIDEOS[heroIdx].title}</div>
            </div>
          </div>

          {/* ── Sidebar playlist (right col) ── */}
          <div className="flex flex-col gap-2.5 items-stretch">
            <div className="text-zinc-400 font-mono text-[9px] tracking-[0.4em] uppercase mb-1 px-1">{t.about.videoSelectLang}</div>
            {VIDEOS.map((v, i) => {
              const isActive = i === heroIdx;
              return (
                <button
                  key={v.lang}
                  onClick={() => setHeroIdx(i)}
                  className={`group relative w-full rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-white/60 shadow-[0_0_20px_rgba(255,255,255,0.12)] scale-[1.02]"
                      : "opacity-60 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <div className="w-full h-[72px]">
                    <video
                      src={v.src}
                      className="w-full h-full object-cover"
                      autoPlay muted loop playsInline
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="text-xs leading-none">{v.flag}</span>
                    <span className="text-white font-black text-[8px] tracking-widest">{v.lang}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                    <div className="text-white text-[10px] font-semibold leading-snug line-clamp-1">{v.title}</div>
                  </div>
                </button>
              );
            })}
            {/* CTA below sidebar thumbnails */}
            {bottomCta && (
              <div className="pt-2 w-full">
                {bottomCta}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Full modal ── */}
      {open && current && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="relative w-full max-w-5xl flex flex-col gap-4">

            {/* Top bar: title + close */}
            <div className="flex items-start justify-between px-1">
              <div>
                <div className="text-zinc-600 font-mono text-[9px] tracking-[0.45em] uppercase mb-1">
                  Exquisite Spaces · Film firmowy
                </div>
                <div className="text-white font-black text-xl sm:text-2xl tracking-tight leading-tight">
                  {current.title}
                </div>
                <div className="text-zinc-500 text-sm mt-0.5">{current.flag} {current.subtitle}</div>
              </div>
              <button
                onClick={close}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors ml-4 mt-1"
                aria-label="Zamknij"
              >
                <X size={18} />
              </button>
            </div>

            {/* Language selector — big cards */}
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-0.5">
              {VIDEOS.map((v, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={v.lang}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border transition-all duration-200 select-none ${
                      active
                        ? "bg-white border-white text-zinc-900 shadow-[0_0_24px_rgba(255,255,255,0.18)] scale-105"
                        : "bg-zinc-800/50 border-zinc-700/60 text-zinc-500 hover:bg-zinc-700/70 hover:text-white hover:border-zinc-500 hover:scale-[1.02]"
                    }`}
                  >
                    <span className="text-3xl leading-none">{v.flag}</span>
                    <span className={`font-black text-[11px] tracking-[0.2em] mt-1 ${active ? "text-zinc-900" : "text-zinc-300"}`}>{v.lang}</span>
                    <span className={`text-[10px] font-medium ${active ? "text-zinc-500" : "text-zinc-600"}`}>{v.subtitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Video + controls */}
            <div
              ref={containerRef}
              className={`rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-300 ${
                activeIdx !== null ? "shadow-[0_0_60px_rgba(255,255,255,0.07)] border-zinc-700/80" : "border-zinc-800/50"
              }`}
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="relative cursor-pointer"
                onClick={() => { modalRef.current?.paused ? modalRef.current.play() : modalRef.current?.pause(); }}
                onDoubleClick={() => { if (document.fullscreenElement) document.exitFullscreen(); }}
              >
                <video
                  key={current.src}
                  ref={modalRef}
                  src={current.src}
                  className="w-full aspect-video object-cover block"
                  playsInline
                  loop
                  onContextMenu={(e) => e.preventDefault()}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onTimeUpdate={() => setCurrentTime(modalRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setDuration(modalRef.current?.duration ?? 0)}
                />
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/25 flex items-center justify-center">
                      <Play size={22} className="fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="bg-zinc-950/95 px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[10px] w-9 text-right flex-shrink-0">{fmt(currentTime)}</span>
                  <input type="range" min={0} max={duration || 100} step={0.1} value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full accent-white cursor-pointer" aria-label="Postęp" />
                  <span className="text-zinc-500 font-mono text-[10px] w-9 flex-shrink-0">{fmt(duration)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { modalRef.current?.paused ? modalRef.current.play() : modalRef.current?.pause(); }}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                      {playing ? <Pause size={16} className="fill-white" /> : <Play size={16} className="fill-white ml-0.5" />}
                    </button>
                    <div className="relative flex items-center"
                      onMouseEnter={() => setShowVolSlider(true)}
                      onMouseLeave={() => setShowVolSlider(false)}>
                      <button onClick={toggleMute}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                        {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <div className={`transition-all duration-200 overflow-hidden ${showVolSlider ? "w-24 opacity-100 ml-2" : "w-0 opacity-0 sm:hidden"} sm:block sm:w-24 sm:ml-2 sm:opacity-100`}>
                        <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume}
                          onChange={(e) => handleVolume(Number(e.target.value))}
                          className="w-full h-1.5 rounded-full accent-white cursor-pointer" />
                      </div>
                      <span className="hidden sm:block text-zinc-500 font-mono text-[10px] ml-2 w-7">
                        {muted ? "0" : Math.round(volume * 100)}%
                      </span>
                    </div>
                  </div>
                  <span className="hidden sm:block text-zinc-600 font-mono text-[9px] tracking-[0.3em] uppercase">Exquisite Spaces</span>
                  <button onClick={() => containerRef.current?.requestFullscreen()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MiniCard({ video, onClick, isFeatured = false }: { video: typeof VIDEOS[number]; onClick: () => void; isFeatured?: boolean }) {
  return (
    <div
      onClick={onClick}
      className="group relative w-44 sm:w-auto flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_36px_rgba(0,0,0,0.6)]
        hover:-translate-y-1 transition-all duration-300"
    >
      {/* 16:9 aspect */}
      <div className="aspect-video w-full">
        <video
          src={video.src}
          className="w-full h-full object-cover"
          autoPlay muted loop playsInline
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/75 transition-all duration-300" />

      {/* Top: badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/55 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1">
        <span className="text-sm leading-none">{video.flag}</span>
        <span className="text-white font-black text-[9px] tracking-[0.15em] uppercase">{video.lang}</span>
      </div>

      {/* Center: play */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-14 h-14 rounded-full bg-white/10 animate-ping" />
          <div className="relative w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/45 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <Play size={18} className="fill-white ml-1" />
          </div>
        </div>
      </div>

      {/* Bottom: title */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
        <div className="text-white font-bold text-xs leading-snug line-clamp-2">{video.title}</div>
      </div>
    </div>
  );
}
