"use client";

import { Phone, Mail, MapPin, Send, Clock, Globe, HardHat, Building2, Users, ArrowLeft, CheckCircle2, ChevronRight, Paperclip, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type Mode = "client" | "b2b" | "career" | null;

type QuizQuestion = { q: string; opts: { label: string; score: number }[] };

function getCareerQuiz(lang: string): QuizQuestion[] {
  const q: Record<string, QuizQuestion[]> = {
    pl: [
      { q: "Jakie masz doświadczenie w budownictwie lub instalacjach?", opts: [{ label: "Brak – chcę zacząć od podstaw", score: 1 }, { label: "1–2 lata, znam podstawy pracy w terenie", score: 2 }, { label: "3–5 lat, pracuję samodzielnie", score: 3 }, { label: "5+ lat, zarządzam ludźmi lub projektami", score: 4 }] },
      { q: "Czy posiadasz uprawnienia lub certyfikaty zawodowe?", opts: [{ label: "Nie, ale chętnie je zdobędę", score: 1 }, { label: "W trakcie uzyskiwania", score: 2 }, { label: "Tak – certyfikaty branżowe (gaz, SEP, budowlane)", score: 3 }, { label: "Tak – uprawnienia budowlane lub kierownik budowy", score: 4 }] },
      { q: "Jak reagujesz na zmienne warunki i presję czasu w terenie?", opts: [{ label: "Wolę stały harmonogram i przewidywalne zadania", score: 1 }, { label: "Daję radę, choć wolę spokojniejsze tempo", score: 2 }, { label: "Lubię wyzwania, szybko się adaptuję", score: 3 }, { label: "Zmienność mnie napędza – to mój żywioł", score: 4 }] },
      { q: "Kiedy możesz zacząć współpracę?", opts: [{ label: "Za 3 miesiące lub więcej", score: 1 }, { label: "Za 1–2 miesiące", score: 2 }, { label: "W ciągu 2–4 tygodni", score: 3 }, { label: "Jestem gotów/a natychmiast", score: 4 }] },
      { q: "Co najbardziej przyciąga Cię do Exquisite Spaces?", opts: [{ label: "Stabilne zatrudnienie i pewna wypłata", score: 2 }, { label: "Nowoczesny sprzęt i technologie", score: 3 }, { label: "Możliwość awansu i zdobywania uprawnień", score: 3 }, { label: "Budowanie czegoś trwałego – widoczne efekty pracy", score: 4 }] },
    ],
    de: [
      { q: "Welche Erfahrung haben Sie im Bau- oder Installationsbereich?", opts: [{ label: "Keine – ich möchte von Grund auf anfangen", score: 1 }, { label: "1–2 Jahre, Grundkenntnisse im Außendienst", score: 2 }, { label: "3–5 Jahre, selbstständige Arbeit", score: 3 }, { label: "5+ Jahre, ich leite Menschen oder Projekte", score: 4 }] },
      { q: "Besitzen Sie berufliche Lizenzen oder Zertifikate?", opts: [{ label: "Nein, aber ich möchte sie erwerben", score: 1 }, { label: "Im Erwerb", score: 2 }, { label: "Ja – Branchenzertifikate (Gas, SEP, Bau)", score: 3 }, { label: "Ja – Baugenehmigungen oder Bauleiter", score: 4 }] },
      { q: "Wie reagieren Sie auf wechselnde Bedingungen und Zeitdruck im Außendienst?", opts: [{ label: "Ich bevorzuge feste Zeitpläne und vorhersehbare Aufgaben", score: 1 }, { label: "Ich komme zurecht, bevorzuge aber ein ruhigeres Tempo", score: 2 }, { label: "Ich mag Herausforderungen und passe mich schnell an", score: 3 }, { label: "Veränderlichkeit treibt mich an – das ist mein Element", score: 4 }] },
      { q: "Wann können Sie die Zusammenarbeit beginnen?", opts: [{ label: "In 3 Monaten oder später", score: 1 }, { label: "In 1–2 Monaten", score: 2 }, { label: "In 2–4 Wochen", score: 3 }, { label: "Ich bin sofort bereit", score: 4 }] },
      { q: "Was zieht Sie am meisten zu Exquisite Spaces?", opts: [{ label: "Stabiler Arbeitsplatz und sicheres Gehalt", score: 2 }, { label: "Moderne Ausrüstung und Technologien", score: 3 }, { label: "Aufstiegsmöglichkeiten und Qualifikationserwerb", score: 3 }, { label: "Etwas Dauerhaftes bauen – sichtbare Ergebnisse", score: 4 }] },
    ],
    en: [
      { q: "What experience do you have in construction or installations?", opts: [{ label: "None – I want to start from scratch", score: 1 }, { label: "1–2 years, I know the basics of fieldwork", score: 2 }, { label: "3–5 years, I work independently", score: 3 }, { label: "5+ years, I manage people or projects", score: 4 }] },
      { q: "Do you hold any professional licenses or certifications?", opts: [{ label: "No, but I'm eager to obtain them", score: 1 }, { label: "In the process of obtaining", score: 2 }, { label: "Yes – industry certificates (gas, electrical, construction)", score: 3 }, { label: "Yes – building permits or site manager", score: 4 }] },
      { q: "How do you handle changing conditions and time pressure in the field?", opts: [{ label: "I prefer a steady schedule and predictable tasks", score: 1 }, { label: "I manage, though I prefer a calmer pace", score: 2 }, { label: "I like challenges and adapt quickly", score: 3 }, { label: "Change drives me – it's my element", score: 4 }] },
      { q: "When can you start working with us?", opts: [{ label: "In 3 months or more", score: 1 }, { label: "In 1–2 months", score: 2 }, { label: "Within 2–4 weeks", score: 3 }, { label: "I'm ready immediately", score: 4 }] },
      { q: "What attracts you most to Exquisite Spaces?", opts: [{ label: "Stable employment and a secure salary", score: 2 }, { label: "Modern equipment and technologies", score: 3 }, { label: "Career advancement and license opportunities", score: 3 }, { label: "Building something lasting – visible results", score: 4 }] },
    ],
    fr: [
      { q: "Quelle expérience avez-vous dans la construction ou les installations?", opts: [{ label: "Aucune – je veux commencer de zéro", score: 1 }, { label: "1–2 ans, je connais les bases du travail terrain", score: 2 }, { label: "3–5 ans, je travaille de manière autonome", score: 3 }, { label: "5+ ans, je gère des personnes ou des projets", score: 4 }] },
      { q: "Possédez-vous des licences ou certifications professionnelles?", opts: [{ label: "Non, mais je suis prêt(e) à les obtenir", score: 1 }, { label: "En cours d'obtention", score: 2 }, { label: "Oui – certifications sectorielles (gaz, électrique, bâtiment)", score: 3 }, { label: "Oui – permis de construire ou chef de chantier", score: 4 }] },
      { q: "Comment réagissez-vous aux conditions changeantes et à la pression temporelle sur le terrain?", opts: [{ label: "Je préfère un calendrier fixe et des tâches prévisibles", score: 1 }, { label: "Je m'en sors, bien que je préfère un rythme plus calme", score: 2 }, { label: "J'aime les défis et je m'adapte rapidement", score: 3 }, { label: "Le changement me motive – c'est mon élément", score: 4 }] },
      { q: "Quand pouvez-vous commencer à collaborer?", opts: [{ label: "Dans 3 mois ou plus", score: 1 }, { label: "Dans 1–2 mois", score: 2 }, { label: "Dans 2–4 semaines", score: 3 }, { label: "Je suis prêt(e) immédiatement", score: 4 }] },
      { q: "Qu'est-ce qui vous attire le plus chez Exquisite Spaces?", opts: [{ label: "Un emploi stable et un salaire sécurisé", score: 2 }, { label: "Un équipement et des technologies modernes", score: 3 }, { label: "Des opportunités de carrière et de licences", score: 3 }, { label: "Construire quelque chose de durable – des résultats visibles", score: 4 }] },
    ],
    nl: [
      { q: "Welke ervaring heeft u in de bouw of installaties?", opts: [{ label: "Geen – ik wil van de grond af beginnen", score: 1 }, { label: "1–2 jaar, ik ken de basisprincipes van veldwerk", score: 2 }, { label: "3–5 jaar, ik werk zelfstandig", score: 3 }, { label: "5+ jaar, ik beheer mensen of projecten", score: 4 }] },
      { q: "Heeft u professionele licenties of certificaten?", opts: [{ label: "Nee, maar ik wil ze graag behalen", score: 1 }, { label: "Bezig met behalen", score: 2 }, { label: "Ja – branchecertificaten (gas, elektrisch, bouw)", score: 3 }, { label: "Ja – bouwvergunningen of uitvoerder", score: 4 }] },
      { q: "Hoe reageert u op wisselende omstandigheden en tijdsdruk in het veld?", opts: [{ label: "Ik geef de voorkeur aan een vast schema en voorspelbare taken", score: 1 }, { label: "Ik red het, maar geef de voorkeur aan een rustiger tempo", score: 2 }, { label: "Ik hou van uitdagingen en pas mij snel aan", score: 3 }, { label: "Verandering drijft mij – het is mijn element", score: 4 }] },
      { q: "Wanneer kunt u beginnen met samenwerken?", opts: [{ label: "Over 3 maanden of later", score: 1 }, { label: "Over 1–2 maanden", score: 2 }, { label: "Binnen 2–4 weken", score: 3 }, { label: "Ik ben onmiddellijk beschikbaar", score: 4 }] },
      { q: "Wat trekt u het meest aan bij Exquisite Spaces?", opts: [{ label: "Stabiele werkgelegenheid en een zeker salaris", score: 2 }, { label: "Moderne apparatuur en technologieën", score: 3 }, { label: "Doorgroeimogelijkheden en het behalen van licenties", score: 3 }, { label: "Iets duurzaams bouwen – zichtbare resultaten", score: 4 }] },
    ],
  };
  return q[lang] ?? q.pl;
}

const COUNTRY_CODES = [
  { flag: "🇵🇱", code: "+48", name: "PL", placeholder: "600-000-000",  maxDigits: 9  },
  { flag: "🇩🇪", code: "+49", name: "DE", placeholder: "151-000-0000", maxDigits: 11 },
  { flag: "🇬🇧", code: "+44", name: "GB", placeholder: "7700-900-000", maxDigits: 10 },
  { flag: "🇨🇿", code: "+420", name: "CZ", placeholder: "601-000-000",  maxDigits: 9  },
  { flag: "🇸🇰", code: "+421", name: "SK", placeholder: "900-000-000",  maxDigits: 9  },
  { flag: "🇦🇹", code: "+43", name: "AT", placeholder: "650-000-0000", maxDigits: 10 },
  { flag: "🇫🇷", code: "+33", name: "FR", placeholder: "6-00-00-00-00",maxDigits: 9  },
  { flag: "🇳🇱", code: "+31", name: "NL", placeholder: "6-0000-0000",  maxDigits: 9  },
  { flag: "🇧🇪", code: "+32", name: "BE", placeholder: "470-00-00-00", maxDigits: 9  },
  { flag: "🇮🇹", code: "+39", name: "IT", placeholder: "320-000-0000", maxDigits: 10 },
  { flag: "🇪🇸", code: "+34", name: "ES", placeholder: "600-000-000",  maxDigits: 9  },
  { flag: "🇺🇦", code: "+380", name: "UA", placeholder: "50-000-0000",  maxDigits: 9  },
  { flag: "🇳🇴", code: "+47", name: "NO", placeholder: "400-00-000",   maxDigits: 8  },
  { flag: "🇸🇪", code: "+46", name: "SE", placeholder: "70-000-0000",  maxDigits: 9  },
  { flag: "🇩🇰", code: "+45", name: "DK", placeholder: "20-00-00-00",  maxDigits: 8  },
  { flag: "🇺🇸", code: "+1",  name: "US", placeholder: "555-000-0000", maxDigits: 10 },
];

function formatLocal(raw: string, maxDigits = 9): string {
  const digits = raw.replace(/\D/g, "").slice(0, maxDigits);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function PhoneInput({ value, onChange, className }: { value: string; onChange: (v: string) => void; className: string }) {
  const [countryCode, setCountryCode] = useState("+48");
  const [local, setLocal] = useState("");

  const currentCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  const handleCountry = (code: string) => {
    setCountryCode(code);
    onChange(local ? `${code} ${local}` : "");
  };

  const handleLocal = (raw: string) => {
    const formatted = formatLocal(raw, currentCountry.maxDigits);
    setLocal(formatted);
    onChange(formatted ? `${countryCode} ${formatted}` : "");
  };

  const borderClass = className.includes("focus:ring") ? "border-slate-200 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-zinc-900" : "";

  return (
    <div className={`flex rounded-xl border bg-slate-50 overflow-hidden transition-all ${borderClass}`}>
      <select
        value={countryCode}
        onChange={e => handleCountry(e.target.value)}
        title="Kierunkowy kraju"
        className="bg-slate-100 border-r border-slate-200 text-slate-700 text-sm font-semibold px-2 py-3.5 outline-none cursor-pointer hover:bg-slate-200 transition-colors flex-shrink-0"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.flag}</option>
        ))}
      </select>
      <input
        type="tel"
        value={local}
        placeholder={currentCountry.placeholder}
        className="flex-1 px-3 py-3.5 bg-transparent outline-none text-slate-800 text-sm min-w-0"
        onChange={e => handleLocal(e.target.value)}
      />
    </div>
  );
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const CAREER_QUIZ = getCareerQuiz(lang);
  const [mode, setMode] = useState<Mode>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", company: "", nip: "", service: "", location: "", coopType: "", message: "", position: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fitPercent = Math.round((quizScore / (CAREER_QUIZ.length * 4)) * 100);

  const getFit = (score: number) => {
    if (score >= 15) return { label: t.contact.fitHigh, emoji: "🎯", color: "high", desc: t.contact.fitHigh };
    if (score >= 10) return { label: t.contact.fitMed, emoji: "💪", color: "med", desc: t.contact.fitMed };
    return { label: t.contact.fitLow, emoji: "🌱", color: "low", desc: t.contact.fitLow };
  };

  const handleQuizAnswer = (score: number) => {
    const updated = [...quizAnswers, score];
    setQuizAnswers(updated);
    if (quizStep < CAREER_QUIZ.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizScore(updated.reduce((a, b) => a + b, 0));
      setQuizDone(true);
    }
  };

  const resetMode = () => {
    setMode(null); setQuizStep(0); setQuizAnswers([]); setQuizDone(false);
    setQuizScore(0); setSubmitted(false); setError(""); setFiles([]);
    setFormData({ name: "", phone: "", email: "", company: "", nip: "", service: "", location: "", coopType: "", message: "", position: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      let res: Response;
      const extra = mode === "career" ? { quizScore: String(quizScore), fitPercent: fitPercent + "%" } : {};
      if (files.length > 0) {
        const fd = new FormData();
        fd.append("mode", mode ?? "");
        Object.entries({ ...formData, ...extra }).forEach(([k, v]) => { if (v) fd.append(k, v); });
        files.forEach(f => fd.append("attachment", f));
        res = await fetch("/api/contact", {
          method: "POST",
          body: fd,
        });
      } else {
        res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, ...formData, ...extra }),
        });
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = (data as { error?: string }).error ?? t.contact.serverError;
        throw new Error(msg);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.contact.genericError);
    } finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white text-sm";
  const lbl = "block text-sm font-semibold text-slate-700 mb-1.5";
  const fit = getFit(quizScore);

  return (
    <section id="kontakt" className="py-14 sm:py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      {/* Fade edges */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            {t.contact.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            {t.contact.heading} <span className="text-zinc-900">{t.contact.headingSub}</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Contact sidebar — shown below form on mobile, left col on desktop */}
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <a href="tel:+48600390073" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors"><Phone size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelPhone}</div><div className="text-slate-800 font-bold text-lg">+48 600 390 073</div></div>
            </a>
            <a href="mailto:info@exquisitespaces.pl" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors"><Mail size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelEmailClients}</div><div className="text-slate-800 font-bold text-sm">info@exquisitespaces.pl</div></div>
            </a>
            <a href="mailto:biuro@exquisitespaces.pl" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors"><Mail size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelEmailB2B}</div><div className="text-slate-700 font-bold text-sm">biuro@exquisitespaces.pl</div></div>
            </a>
            <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelAddress}</div><div className="text-slate-800 font-bold">ul. Kopernika 132</div><div className="text-slate-600 text-sm">34-300 Żywiec</div></div>
            </div>
            <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelHours}</div><div className="text-slate-800 font-bold">{t.contact.hours1}</div><div className="text-slate-500 text-sm">{t.contact.hours2}</div></div>
            </div>
            <a href="https://www.exquisitespaces.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors"><Globe size={20} /></div>
              <div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{t.contact.labelWeb}</div><div className="text-slate-800 font-bold text-sm">www.exquisitespaces.pl</div></div>
            </a>
          </div>

          {/* Main form panel — shown first on mobile */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden order-1 lg:order-2">

            {/* ── MODE SELECTION ── */}
            {!mode && (
              <div className="p-6 sm:p-10">
                <div className="mb-8">
                  <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">{t.contact.modeTitle}</p>
                  <h3 className="text-2xl font-black text-slate-900">{t.contact.modeQuestion}</h3>
                </div>
                <div className="space-y-3">
                  <button onClick={() => setMode("client")} className="w-full group flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-200 text-left">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 text-zinc-600 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all"><HardHat size={22} /></div>
                    <div className="flex-1"><div className="font-bold text-slate-900 text-base">{t.contact.modeClient}</div><div className="text-slate-500 text-sm mt-0.5">{t.contact.modeClientSub}</div></div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-zinc-900 transition-colors" />
                  </button>
                  <button onClick={() => setMode("b2b")} className="w-full group flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-200 text-left">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 text-zinc-600 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all"><Building2 size={22} /></div>
                    <div className="flex-1"><div className="font-bold text-slate-900 text-base">{t.contact.modeB2B}</div><div className="text-slate-500 text-sm mt-0.5">{t.contact.modeB2BSub}</div></div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-zinc-900 transition-colors" />
                  </button>
                  <button onClick={() => setMode("career")} className="w-full group flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-200 text-left">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 group-hover:bg-zinc-900 text-zinc-600 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all"><Users size={22} /></div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-base">{t.contact.modeCareer}</div>
                      <div className="text-slate-500 text-sm mt-0.5">{t.contact.modeCareerSub}</div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-zinc-900 transition-colors" />
                  </button>
                </div>
                <p className="text-center text-slate-400 text-xs mt-6">
                  {t.contact.orCall} <a href="tel:+48600390073" className="text-zinc-700 font-semibold hover:underline">+48 600 390 073</a>
                </p>
              </div>
            )}

            {/* ── CAREER QUIZ ── */}
            {mode === "career" && !quizDone && (
              <div className="flex flex-col h-full">
                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100">
                  <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${((quizStep) / CAREER_QUIZ.length) * 100}%` }} />
                </div>
                <div className="p-6 sm:p-10 flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={resetMode} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors">
                      <ArrowLeft size={15} /> {t.contact.back}
                    </button>
                    <span className="text-zinc-500 font-mono text-xs tracking-widest">{quizStep + 1} / {CAREER_QUIZ.length}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase">{t.contact.quizLabel}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 leading-snug">{CAREER_QUIZ[quizStep].q}</h3>
                  <div className="space-y-3">
                    {CAREER_QUIZ[quizStep].opts.map((opt, i) => (
                      <button key={i} onClick={() => handleQuizAnswer(opt.score)}
                        className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-100 hover:border-zinc-900 hover:bg-zinc-50 text-slate-700 hover:text-slate-900 font-medium text-sm transition-all duration-150 flex items-center gap-3 group">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-500 flex items-center justify-center text-xs font-black flex-shrink-0 transition-all">
                          {["A","B","C","D"][i]}
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── QUIZ RESULT + CAREER FORM ── */}
            {mode === "career" && quizDone && !submitted && (
              <div className="p-6 sm:p-10">
                <button onClick={resetMode} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors mb-6">
                  <ArrowLeft size={15} /> {t.contact.back}
                </button>
                {/* Result card */}
                <div className={`rounded-2xl border-2 p-5 mb-8 ${fit.color === "high" ? "bg-zinc-900 border-zinc-700" : fit.color === "med" ? "bg-zinc-100 border-zinc-300" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{fit.emoji}</div>
                    <div className="flex-1">
                      <div className={`font-black text-lg ${fit.color === "high" ? "text-white" : fit.color === "med" ? "text-zinc-900" : "text-slate-600"}`}>{fit.label}</div>
                      <div className={`text-sm mt-0.5 ${fit.color === "high" ? "text-zinc-300" : "text-slate-500"}`}>{fit.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-3xl font-black ${fit.color === "high" ? "text-white" : fit.color === "med" ? "text-zinc-900" : "text-slate-500"}`}>{fitPercent}%</div>
                      <div className={`text-xs ${fit.color === "high" ? "text-zinc-400" : "text-slate-400"}`}>{t.contact.fitLabel}</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${fit.color === "high" ? "bg-white" : fit.color === "med" ? "bg-zinc-800" : "bg-slate-300"}`} style={{ width: `${fitPercent}%` }} />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 text-lg mb-6">{t.contact.submitCareer}</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={lbl}>{t.contact.nameLabel}</label><input required type="text" className={inp} placeholder={t.contact.phName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className={lbl}>{t.contact.phoneLabel}</label><PhoneInput className={inp} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} /></div>
                  </div>
                  <div><label className={lbl}>{t.contact.emailLabel}</label><input required type="email" className={inp} placeholder="jan@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div><label className={lbl}>{t.contact.positionLabel}</label>
                    <select className={inp} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}>
                      <option value="">{t.contact.selectDefaultPosition}</option>
                      {t.contact.positionOpts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div><label className={lbl}>{t.contact.messageLabel}</label><textarea rows={3} className={`${inp} resize-none`} placeholder={t.contact.phMsgCareer} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
                  <div>
                    <label className={lbl}>{t.contact.attachLabel}</label>
                    <label className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-zinc-400 bg-slate-50 hover:bg-white cursor-pointer transition-all text-sm text-slate-500 hover:text-slate-700">
                      <Paperclip size={16} className="flex-shrink-0" />
                      <span className="truncate">{t.contact.attachHint}</span>
                      <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => { const sel = Array.from(e.target.files ?? []); setFiles(prev => [...prev, ...sel].slice(0, 10)); e.target.value = ""; }} />
                    </label>
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((f, i) => (
                          <div key={`${f.name}-${i}`} className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-700 max-w-[220px]">
                            <Paperclip size={11} className="flex-shrink-0 text-zinc-400" />
                            <span className="truncate font-medium">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="flex-shrink-0 ml-0.5 text-zinc-400 hover:text-red-500 transition-colors"
                              aria-label="Usuń plik"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
                  <p className="text-zinc-400 text-[10px] leading-relaxed border-t border-zinc-100 pt-3">
                    Administratorem danych jest <strong className="text-zinc-500">Exquisite Spaces Sp. z o.o.</strong>, ul. Kopernika 132, 34-300 Żywiec. Dane przetwarzamy w celu przeprowadzenia rekrutacji (art. 6 ust. 1 lit. f RODO). Przysługuje Ci prawo dostępu, sprostowania, usunięcia danych oraz wniesienia skargi do UODO.{" "}
                    <a href="/polityka-prywatnosci" className="underline hover:text-zinc-600" target="_blank" rel="noopener">Polityka prywatności</a>.
                  </p>
                  <button type="submit" disabled={loading} className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Send size={16} className={loading ? "animate-pulse" : ""} />
                    {loading ? t.contact.sending : t.contact.submitCareer}
                  </button>
                </form>
              </div>
            )}

            {/* ── CLIENT FORM ── */}
            {mode === "client" && !submitted && (
              <div className="p-6 sm:p-10">
                <button onClick={resetMode} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors mb-6"><ArrowLeft size={15} /> {t.contact.back}</button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center"><HardHat size={18} /></div>
                  <div><p className="text-zinc-500 font-mono text-[9px] tracking-[0.4em] uppercase">{t.contact.modeClientSub}</p><h3 className="font-black text-slate-900 text-lg leading-none">{t.contact.modeClient}</h3></div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={lbl}>{t.contact.nameLabel}</label><input required type="text" className={inp} placeholder={t.contact.phName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className={lbl}>{t.contact.phoneLabel}</label><PhoneInput className={inp} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} /></div>
                  </div>
                  <div><label className={lbl}>{t.contact.emailLabel}</label><input required type="email" className={inp} placeholder="jan@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div><label className={lbl}>{t.contact.serviceLabel}</label>
                    <select className={inp} value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                      <option value="">{t.contact.selectDefaultService}</option>
                      {t.contact.serviceOpts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div><label className={lbl}>{t.contact.locationLabel}</label><input type="text" className={inp} placeholder={t.contact.phLocation} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                  <div><label className={lbl}>{t.contact.messageLabel}</label><textarea required rows={4} className={`${inp} resize-none`} placeholder={t.contact.phMsgClient} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
                  <div>
                    <label className={lbl}>{t.contact.attachLabel}</label>
                    <label className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-zinc-400 bg-slate-50 hover:bg-white cursor-pointer transition-all text-sm text-slate-500 hover:text-slate-700">
                      <Paperclip size={16} className="flex-shrink-0" />
                      <span className="truncate">{t.contact.attachHint}</span>
                      <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => { const sel = Array.from(e.target.files ?? []); setFiles(prev => [...prev, ...sel].slice(0, 10)); e.target.value = ""; }} />
                    </label>
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((f, i) => (
                          <div key={`${f.name}-${i}`} className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-700 max-w-[220px]">
                            <Paperclip size={11} className="flex-shrink-0 text-zinc-400" />
                            <span className="truncate font-medium">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="flex-shrink-0 ml-0.5 text-zinc-400 hover:text-red-500 transition-colors"
                              aria-label="Usuń plik"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
                  <p className="text-zinc-400 text-[10px] leading-relaxed border-t border-zinc-100 pt-3">
                    Administratorem danych jest <strong className="text-zinc-500">Exquisite Spaces Sp. z o.o.</strong>, ul. Kopernika 132, 34-300 Żywiec. Dane przetwarzamy w celu odpowiedzi na zapytanie (art. 6 ust. 1 lit. b RODO). Przysługuje Ci prawo dostępu, sprostowania, usunięcia danych oraz wniesienia skargi do UODO.{" "}
                    <a href="/polityka-prywatnosci" className="underline hover:text-zinc-600" target="_blank" rel="noopener">Polityka prywatności</a>.
                  </p>
                  <button type="submit" disabled={loading} className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Send size={16} className={loading ? "animate-pulse" : ""} />
                    {loading ? t.contact.sending : t.contact.btnSend}
                  </button>
                  <p className="text-center text-slate-400 text-xs">{t.contact.orCall} <a href="tel:+48600390073" className="text-zinc-700 font-semibold hover:underline">+48 600 390 073</a></p>
                </form>
              </div>
            )}

            {/* ── B2B FORM ── */}
            {mode === "b2b" && !submitted && (
              <div className="p-6 sm:p-10">
                <button onClick={resetMode} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors mb-6"><ArrowLeft size={15} /> {t.contact.back}</button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center"><Building2 size={18} /></div>
                  <div><p className="text-zinc-500 font-mono text-[9px] tracking-[0.4em] uppercase">{t.contact.modeB2BSub}</p><h3 className="font-black text-slate-900 text-lg leading-none">{t.contact.modeB2B}</h3></div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={lbl}>{t.contact.companyLabel}</label><input required type="text" className={inp} placeholder={t.contact.phCompany} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
                    <div><label className={lbl}>{t.contact.nipLabel}</label><input type="text" className={inp} placeholder="0000000000" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className={lbl}>{t.contact.nameLabel}</label><input required type="text" className={inp} placeholder={t.contact.phName} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className={lbl}>{t.contact.phoneLabel}</label><PhoneInput className={inp} value={formData.phone} onChange={v => setFormData({...formData, phone: v})} /></div>
                  </div>
                  <div><label className={lbl}>{t.contact.emailLabel}</label><input required type="email" className={inp} placeholder="biuro@firma.pl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div><label className={lbl}>{t.contact.coopTypeLabel}</label>
                    <select className={inp} value={formData.coopType} onChange={e => setFormData({...formData, coopType: e.target.value})}>
                      <option value="">{t.contact.selectDefaultCoopType}</option>
                      {t.contact.coopTypeOpts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div><label className={lbl}>{t.contact.messageLabel}</label><textarea required rows={4} className={`${inp} resize-none`} placeholder={t.contact.phMsgB2B} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
                  <div>
                    <label className={lbl}>{t.contact.attachLabel}</label>
                    <label className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-zinc-400 bg-slate-50 hover:bg-white cursor-pointer transition-all text-sm text-slate-500 hover:text-slate-700">
                      <Paperclip size={16} className="flex-shrink-0" />
                      <span className="truncate">{t.contact.attachHint}</span>
                      <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => { const sel = Array.from(e.target.files ?? []); setFiles(prev => [...prev, ...sel].slice(0, 10)); e.target.value = ""; }} />
                    </label>
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((f, i) => (
                          <div key={`${f.name}-${i}`} className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-700 max-w-[220px]">
                            <Paperclip size={11} className="flex-shrink-0 text-zinc-400" />
                            <span className="truncate font-medium">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="flex-shrink-0 ml-0.5 text-zinc-400 hover:text-red-500 transition-colors"
                              aria-label="Usuń plik"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}
                  <p className="text-zinc-400 text-[10px] leading-relaxed border-t border-zinc-100 pt-3">
                    Administratorem danych jest <strong className="text-zinc-500">Exquisite Spaces Sp. z o.o.</strong>, ul. Kopernika 132, 34-300 Żywiec. Dane przetwarzamy w celu nawiązania współpracy B2B (art. 6 ust. 1 lit. b RODO). Przysługuje Ci prawo dostępu, sprostowania, usunięcia danych oraz wniesienia skargi do UODO.{" "}
                    <a href="/polityka-prywatnosci" className="underline hover:text-zinc-600" target="_blank" rel="noopener">Polityka prywatności</a>.
                  </p>
                  <button type="submit" disabled={loading} className="w-full bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    <Send size={16} className={loading ? "animate-pulse" : ""} />
                    {loading ? t.contact.sending : t.contact.btnSend}
                  </button>
                  <p className="text-center text-slate-400 text-xs">{t.contact.labelEmailB2B}: <a href="mailto:biuro@exquisitespaces.pl" className="text-zinc-700 font-semibold hover:underline">biuro@exquisitespaces.pl</a></p>
                </form>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {submitted && (
              <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">
                  {t.contact.successTitle}
                </h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  {t.contact.successText}
                </p>
                <button onClick={resetMode} className="inline-flex items-center gap-2 border border-slate-200 hover:border-zinc-900 text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl text-sm font-semibold transition-all">
                  <ArrowLeft size={14} /> {t.contact.sendAnother}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
