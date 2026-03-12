"use client";
import { CheckCircle2 } from "lucide-react";
import AboutModal from "./AboutModal";
import VideoModal from "./VideoModal";
import { useLanguage } from "../context/LanguageContext";

const evolutionImgs = ["/images/aa.png", "/images/c.png", "/images/d.png"];

export default function About() {
  const { t } = useLanguage();
  const highlights = t.about.highlights;
  const evolution = t.about.evolution.map((e, i) => ({ ...e, img: evolutionImgs[i] }));
  return (
    <section id="o-firmie" className="py-14 sm:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image column */}
          <div className="relative group/card">
            <div className="hidden sm:block absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-zinc-200 z-0 transition-all duration-500 group-hover/card:border-slate-300/90 group-hover/card:shadow-[0_0_32px_6px_rgba(180,190,200,0.35)]" />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover/card:shadow-[0_0_48px_8px_rgba(180,190,200,0.30)]">
              <img
                src="/images/d.png"
                alt="Exquisite Spaces – siedziba firmy, Żywiec"
                className="w-full h-80 lg:h-[500px] object-cover object-top transition-all duration-500 group-hover/card:brightness-[0.82]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
                <div className="text-white font-bold text-xl">{t.about.locationTitle}</div>
                <div className="text-slate-300 text-sm">{t.about.locationSub}</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 lg:-right-8 bg-zinc-900 text-white px-5 py-4 sm:px-6 sm:py-5 rounded-2xl shadow-xl shadow-zinc-900/30 z-20">
              <div className="text-4xl font-black">5</div>
              <div className="text-zinc-300 text-sm font-medium">{t.about.specializations}</div>
            </div>
          </div>

          {/* Text column */}
          <div className="lg:pl-4">
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              {t.about.badge}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-2 leading-tight">
              {t.about.heading1}
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 mb-8 leading-tight">
              {t.about.heading2}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 border-l-4 border-zinc-300 pl-5">
              {t.about.description}
            </p>

            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-zinc-700 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3 mt-10">
              <a
                href="#kontakt"
                className="inline-flex items-center bg-zinc-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5"
              >
                {t.about.btnContact}
              </a>
            </div>
          </div>
        </div>

        {/* ── Video gallery ── */}
        <div className="mt-20 sm:mt-24">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold border border-zinc-200 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              {t.about.videoBadge}
            </div>
            <p className="text-slate-500 text-sm">{t.about.videoSubtitle}</p>
          </div>
          <VideoModal
            bottomCta={
              <div className="relative flex w-full">
                <span className="absolute inset-[-4px] rounded-full border border-zinc-400/50 animate-[cta-ring_2.8s_ease-out_infinite] pointer-events-none" />
                <AboutModal label={t.about.videoCtaBtn} fullWidth />
              </div>
            }
          />
        </div>

        {/* Company evolution timeline */}
        <div className="mt-14 sm:mt-20 lg:mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              {t.about.historyBadge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-4">{t.about.historyHeading}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {evolution.map((step, i) => (
              <div key={step.label} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img
                  src={step.img}
                  alt={step.label}
                  className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/20 to-transparent" />
                <div className="absolute top-3 left-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                  <span className="text-zinc-900 font-black text-xs">{i + 1}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white font-bold text-base leading-tight">{step.label}</div>
                  <div className="text-zinc-300 text-xs mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
