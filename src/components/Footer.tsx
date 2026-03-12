"use client";
import { Phone, Mail, MapPin, ArrowRight, Globe, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const navLinks = t.footer.navLinks;
  const services = t.footer.services;
  return (
    <footer className="bg-white text-zinc-900 relative overflow-hidden">
      {/* Scanline grid — black lines on white */}
      <div className="footer-grid absolute inset-0 pointer-events-none" />

      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />

      {/* CTA bar */}
      <div className="relative bg-gradient-to-b from-zinc-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <span className="text-zinc-400 font-mono text-[11px] tracking-[0.5em] uppercase mb-2 block">
                {t.footer.ctaTag}
              </span>
              <h3 className="text-zinc-900 font-black text-2xl lg:text-3xl tracking-tight leading-tight">
                {t.footer.ctaHeading1}<br />
                <span className="text-zinc-500">{t.footer.ctaHeading2}</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="tel:+48600390073"
                className="group inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-lg font-bold hover:bg-zinc-800 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Phone size={16} />
                +48 600 390 073
              </a>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 border border-zinc-400 hover:border-zinc-800 text-zinc-600 hover:text-zinc-900 px-7 py-3.5 rounded-lg font-mono text-sm tracking-widest transition-all hover:-translate-y-0.5"
              >
                {t.footer.formButton}
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/images/Logo.png"
                alt="Exquisite Spaces"
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
              {t.footer.description}
            </p>

            {/* Contact details */}
            <div className="space-y-2.5">
              <a href="tel:+48600390073" className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors text-sm group">
                <span className="w-6 h-6 rounded border border-zinc-300 group-hover:border-zinc-500 flex items-center justify-center transition-colors flex-shrink-0">
                  <Phone size={11} />
                </span>
                +48 600 390 073
              </a>
              <a href="https://www.exquisitespaces.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors text-sm group">
                <span className="w-6 h-6 rounded border border-zinc-300 group-hover:border-zinc-500 flex items-center justify-center transition-colors flex-shrink-0">
                  <Globe size={11} />
                </span>
                www.exquisitespaces.pl
              </a>
              <a href="mailto:info@exquisitespaces.pl" className="flex items-center gap-3 text-zinc-500 hover:text-zinc-900 transition-colors text-sm group">
                <span className="w-6 h-6 rounded border border-zinc-300 group-hover:border-zinc-500 flex items-center justify-center transition-colors flex-shrink-0">
                  <Mail size={11} />
                </span>
                info@exquisitespaces.pl
              </a>
              <div className="flex items-center gap-3 text-zinc-400 text-sm">
                <span className="w-6 h-6 rounded border border-zinc-200 flex items-center justify-center flex-shrink-0">
                  <MapPin size={11} />
                </span>
                ul. Kopernika 132, 34-300 Żywiec
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-zinc-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-5">
              {t.footer.navLabel}
            </div>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm group"
                  >
                    <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-zinc-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-5">
              {t.footer.servicesLabel}
            </div>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s} className="flex items-start gap-2 text-zinc-500 text-sm">
                  <span className="w-1 h-1 rounded-full bg-zinc-400 mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="mt-14 pt-6 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <p className="text-zinc-400 text-xs font-mono">
              &copy; {new Date().getFullYear()} Exquisite Spaces Sp. z o.o. {t.footer.copyright}
            </p>
            <div className="flex items-center gap-4">
              <a href="/polityka-prywatnosci" className="text-zinc-400 hover:text-zinc-600 text-xs transition-colors">
                Polityka prywatności
              </a>
              <a href="/polityka-cookies" className="text-zinc-400 hover:text-zinc-600 text-xs transition-colors">
                Polityka cookies
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span className="text-zinc-300 text-[11px] font-mono w-full">
              EXQUISITE SPACES SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
            </span>
            <span className="text-zinc-300 text-[11px] font-mono">KRS: 0001057222</span>
            <span className="text-zinc-300 text-[11px]">·</span>
            <span className="text-zinc-300 text-[11px] font-mono">NIP: 5361973293</span>
            <span className="text-zinc-300 text-[11px]">·</span>
            <span className="text-zinc-300 text-[11px] font-mono">REGON: 526355977</span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
    </footer>
  );
}
