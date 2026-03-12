"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, Globe, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ContactVideo() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  const contactCards = [
    { icon: Phone, label: t.contactVideo.labelPhone, line1: "+48 600 390 073", line2: t.contactVideo.hours, href: "tel:+48600390073" },
    { icon: Globe, label: t.contactVideo.labelWeb, line1: "www.exquisitespaces.pl", line2: "", href: "https://www.exquisitespaces.pl" },
    { icon: Mail, label: t.contactVideo.labelClients, line1: "info@exquisitespaces.pl", line2: "", href: "mailto:info@exquisitespaces.pl" },
    { icon: Mail, label: t.contactVideo.labelB2B, line1: "biuro@exquisitespaces.pl", line2: "", href: "mailto:biuro@exquisitespaces.pl" },
  ];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-zinc-950 py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle scanline grid */}
      <div className="contact-video-grid absolute inset-0 opacity-[0.03]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-zinc-600 font-mono text-[11px] tracking-[0.5em] uppercase">// {t.contactVideo.sectionLabel}</span>
            <span className="flex-1 h-px bg-zinc-800" />
          </div>
          <h2 className="text-white font-black text-3xl lg:text-4xl tracking-tight">
            {t.contactVideo.heading} <span className="text-zinc-500">{t.contactVideo.headingSub}</span>
          </h2>
          <p className="text-zinc-500 font-mono text-sm mt-2 tracking-wide">
            {t.contactVideo.subtitle}
          </p>
        </div>

        {/* Video container */}
        <div ref={ref} className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <video
            className="contact-video-height w-full object-cover"
            src="/images/kontakt video.mp4"
            poster="/images/a1.png"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/40" />

          {/* Top-left brand stamp */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-xs">ES</span>
            </div>
            <span className="text-white/60 font-mono text-[10px] tracking-widest uppercase">Exquisite Spaces</span>
          </div>

          {/* Bottom contact cards — sm+ only, overlaid on video */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-5 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {contactCards.map((card, i) => (
                <a
                  key={card.label}
                  href={card.href}
                  className={`
                    group flex flex-col gap-1 p-3 sm:p-4 rounded-xl border transition-all duration-500 cursor-pointer
                    bg-black/50 backdrop-blur-md border-white/10 hover:border-white/30 hover:bg-black/70
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                  `}
                  style={{ transitionDelay: `${i * 120}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <card.icon size={13} className="text-zinc-400 flex-shrink-0" />
                    <span className="text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase">{card.label}</span>
                  </div>
                  <div className="text-white font-bold text-sm leading-tight group-hover:text-zinc-100 break-all">
                    {card.line1}
                  </div>
                  {card.line2 && <div className="text-zinc-400 text-xs font-mono">{card.line2}</div>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile contact cards — below the video */}
        <div className="sm:hidden grid grid-cols-2 gap-3 mt-4">
          {contactCards.map((card, i) => (
            <a
              key={card.label}
              href={card.href}
              className={`
                group flex flex-col gap-1 p-4 rounded-2xl border transition-all duration-500
                bg-zinc-900 border-zinc-800 hover:border-zinc-600
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
              style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}
            >
              <div className="flex items-center gap-2 mb-1">
                <card.icon size={13} className="text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase">{card.label}</span>
              </div>
              <div className="text-white font-bold text-sm leading-tight group-hover:text-zinc-100 break-all">
                {card.line1}
              </div>
              {card.line2 && <div className="text-zinc-400 text-xs font-mono">{card.line2}</div>}
            </a>
          ))}
        </div>

        {/* Bottom info row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono">
            <MapPin size={12} />
            <span>{t.contactVideo.address}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono">
            <Clock size={12} />
            <span>{t.contactVideo.hoursLong}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
