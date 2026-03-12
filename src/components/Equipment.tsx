"use client";
import { useState, useEffect, useRef } from "react";
import { HardHat, Truck, Settings, Drill, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const TEAM_ICONS = [HardHat, HardHat, Settings, Drill, Settings];

const gallery = [
  { src: "/images/2.png", alt: "Scania ES – flota transportowa" },
  { src: "/images/a.png", alt: "Exquisite Spaces – początki" },
  { src: "/images/7.png", alt: "Koparka gąsienicowa – park maszynowy" },
  { src: "/images/b.png", alt: "Baza sprzętowa ES – Żywiec" },
  { src: "/images/e.png", alt: "Flota Exquisite Spaces – pełny park maszynowy" },
];

export default function Equipment() {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();
  const teamRoles = t.equipment.teamRoles.map((r, i) => ({ ...r, icon: TEAM_ICONS[i] }));
  const machineList = t.equipment.machines;
  const touchStartX = useRef<number | null>(null);
  const prev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActive((i) => (i + 1) % gallery.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section id="sprzet" className="py-10 sm:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            {t.equipment.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            {t.equipment.heading}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t.equipment.subtitle}
          </p>
        </div>

        {/* Two columns */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Kadra */}
          <div className="relative bg-zinc-600 rounded-3xl p-8 lg:p-10 text-white overflow-hidden">
            <div className="white-grid absolute inset-0 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-700 rounded-xl flex items-center justify-center">
                <HardHat size={20} />
              </div>
              <h3 className="text-2xl font-bold">{t.equipment.teamHeading}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-8">
              {t.equipment.teamDesc}
            </p>
            <div className="space-y-3">
              {teamRoles.map((role) => (
                <div key={role.label} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <role.icon size={16} className="text-zinc-400" />
                    <span className="font-semibold">{role.label}</span>
                  </div>
                  <span className="text-slate-400 text-sm">{role.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sprzęt */}
          <div className="relative bg-zinc-950 rounded-3xl p-8 lg:p-10 text-white overflow-hidden">
            <div className="white-grid absolute inset-0 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck size={20} />
              </div>
              <h3 className="text-2xl font-bold">{t.equipment.machineHeading}</h3>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-8">
              {t.equipment.machineDesc}
            </p>
            <ul className="space-y-3">
              {machineList.map((item) => (
                <li key={item} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                  <span className="w-2 h-2 bg-zinc-400 rounded-full flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main slide */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl h-[280px] sm:h-[380px] lg:h-[520px]"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
              touchStartX.current = null;
            }}
          >
            {gallery.map((img, i) => (
              <div
                key={img.src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === active ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
            ))}

            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Poprzednie"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
              aria-label="Następne"
            >
              <ChevronRight size={22} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              {active + 1} / {gallery.length}
            </div>
          </div>

          {/* Thumbnail strip — hidden on mobile, visible sm+ */}
          <div className="hidden sm:flex gap-3 mt-4 justify-center">
            {gallery.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setActive(i)}
                className={`relative flex-1 max-w-[140px] h-16 sm:h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  i === active
                    ? "ring-2 ring-zinc-900 ring-offset-2 opacity-100 scale-105"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Dot indicators — mobile only */}
          <div className="flex sm:hidden gap-2 mt-4 justify-center">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"
                }`}
                aria-label={`Zdjęcie ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
