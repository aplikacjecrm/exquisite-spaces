"use client";
import { Flame, Droplets, Radio, Wifi, Zap, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const SERVICE_ICONS = [Flame, Droplets, Radio, Wifi, Zap];
const SERVICE_COLORS = [
  "from-zinc-600 to-zinc-900",
  "from-zinc-400 to-zinc-700",
  "from-zinc-500 to-zinc-800",
  "from-zinc-700 to-zinc-950",
  "from-zinc-300 to-zinc-600",
];
const SERVICE_NUMS = ["01", "02", "03", "04", "05"];

export default function Services() {
  const { t } = useLanguage();
  const services = t.services.items.map((item, i) => ({
    icon: SERVICE_ICONS[i],
    num: SERVICE_NUMS[i],
    color: SERVICE_COLORS[i],
    ...item,
  }));
  return (
    <section id="uslugi" className="py-14 sm:py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Grid background */}
      <div className="footer-grid absolute inset-0 pointer-events-none" />
      {/* Fade edges */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              {t.services.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
              {t.services.heading}
            </h2>
          </div>
          <p className="text-lg text-slate-600 max-w-md lg:text-right">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-xl hover:border-zinc-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-md`}>
                  <service.icon size={22} className="text-white" />
                </div>
                <span className="text-3xl font-black text-zinc-200 group-hover:text-zinc-300 transition-colors">
                  {service.num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm flex-1">{service.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-zinc-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {t.services.learnMore} <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
