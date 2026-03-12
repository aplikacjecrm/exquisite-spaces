"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Shield, LogOut, RefreshCw, Users, Clock, MousePointerClick,
  Globe, Code2, Server, GitBranch, Database, FileText, Eye,
  TrendingUp, Smartphone, Monitor, Activity, AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SUPABASE_URL = "https://yinnyzflmywiplluyyhl.supabase.co";

interface AnalyticsRow {
  id: number;
  event: string;
  path: string;
  referrer: string;
  ua: string;
  ip: string;
  data: Record<string, unknown> | null;
  ts: string;
}

const STACK = [
  { label: "Framework",    value: "Next.js 14 (App Router)",   icon: Code2 },
  { label: "Styling",      value: "Tailwind CSS 3.4",           icon: FileText },
  { label: "PDF viewer",   value: "react-pdf 7.7 (pdfjs)",      icon: FileText },
  { label: "Email",        value: "Resend API",                 icon: Server },
  { label: "Video CDN",    value: "Supabase Storage",           icon: Database },
  { label: "Deploy",       value: "Netlify (auto from GitHub)", icon: GitBranch },
  { label: "Języki i18n",  value: "PL / DE / FR / EN / NL",     icon: Globe },
  { label: "Icons",        value: "Lucide React",               icon: Eye },
];

const SECTIONS = [
  "Hero (video crossfade)",
  "HeroCTA (statystyki + przyciski)",
  "About (mapa + historia)",
  "AboutModal (poznaj nas – 5 sekcji)",
  "Services (karty usług)",
  "Equipment (sprzęt + zespół)",
  "Portfolio (realizacje + PDF broszury)",
  "VideoModal (filmy z 5 języków)",
  "ContactVideo (kontakt z wideo)",
  "Contact (3 formularze: Klient / B2B / Kariera)",
  "Footer",
  "Navbar (przezroczysty → biały przy scrollu)",
  "PdfModal (fullscreen PDF viewer)",
  "ScrollToTop",
];

const SECURITY = [
  "Rate limiting: 5 req/60s na IP (formularz kontaktowy)",
  "XSS protection: HTML escaping wszystkich pól email",
  "File whitelist: .pdf .doc .docx .jpg .jpeg .png (max 5MB)",
  "HTTP Headers: CSP / HSTS / X-Frame-Options / X-Content-Type",
  "Email validation: server-side regex przed wysyłką",
  "Admin panel: cookie HTTP-only, SameSite=Strict, 7 dni",
  "Analytics rate limit: max 1 event/s na IP",
];

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">{label}</span>
      </div>
      <div className="text-white font-black text-3xl mb-0.5">{value}</div>
      {sub && <div className="text-zinc-500 text-xs">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [rows, setRows] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [tab, setTab] = useState<"overview" | "events" | "site">("overview");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const serviceKey = ""; // fetched via API
      const res = await fetch("/api/admin/analytics");
      if (res.status === 503) { setConfigured(false); setLoading(false); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRows(data);
      setConfigured(true);
    } catch {
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  /* --- Derived stats --- */
  const pageviews  = rows.filter(r => r.event === "pageview");
  const durations  = rows.filter(r => r.event === "duration");
  const clicks     = rows.filter(r => r.event === "click");
  const uniqueIPs  = new Set(rows.map(r => r.ip)).size;
  const avgSeconds = durations.length
    ? Math.round(durations.reduce((s, r) => s + ((r.data?.seconds as number) ?? 0), 0) / durations.length)
    : 0;
  const topPages = Object.entries(
    pageviews.reduce<Record<string, number>>((acc, r) => { acc[r.path] = (acc[r.path] ?? 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topClicks = Object.entries(
    clicks.reduce<Record<string, number>>((acc, r) => {
      const lbl = String(r.data?.label ?? "?");
      acc[lbl] = (acc[lbl] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const mobileCount = rows.filter(r => /mobile|android|iphone/i.test(r.ua ?? "")).length;
  const desktopCount = rows.length - mobileCount;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-zinc-400" />
            <div>
              <div className="font-black text-sm tracking-tight">PANEL ADMINISTRACYJNY</div>
              <div className="text-zinc-500 font-mono text-[9px] tracking-widest">exquisitespaces.pl</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading}
              aria-label="Odśwież dane"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={logout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              <LogOut size={14} /> Wyloguj
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
          {(["overview", "events", "site"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"}`}>
              {t === "overview" ? "Statystyki" : t === "events" ? "Zdarzenia" : "O stronie"}
            </button>
          ))}
        </div>

        {/* === OVERVIEW === */}
        {tab === "overview" && (
          <div className="space-y-6">
            {!configured && (
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-5 flex gap-3">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-amber-400 font-bold text-sm mb-1">Analytics nie skonfigurowane</div>
                  <div className="text-amber-500/80 text-xs leading-relaxed">
                    Aby aktywować statystyki, dodaj <code className="bg-amber-950 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> do
                    zmiennych środowiskowych Netlify i utwórz tabelę <code className="bg-amber-950 px-1 rounded">site_analytics</code> w Supabase.<br />
                    SQL: <code className="bg-amber-950 px-1 rounded text-xs">
                      CREATE TABLE site_analytics (id bigint generated always as identity primary key, event text, path text, referrer text, ua text, ip text, data jsonb, ts timestamptz default now());
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Eye}               label="Odsłony"         value={pageviews.length}  sub="łącznie pageview" />
              <StatCard icon={Users}             label="Unikalne IP"     value={uniqueIPs}          sub="przybliżona liczba użytkowników" />
              <StatCard icon={Clock}             label="Śr. czas"        value={`${avgSeconds}s`}   sub="średni czas na stronie" />
              <StatCard icon={MousePointerClick} label="Kliknięcia"      value={clicks.length}      sub="łącznie zarejestrowanych" />
            </div>

            {/* Device split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Activity size={12} /> Urządzenia
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Smartphone, label: "Mobile", count: mobileCount, color: "bg-blue-500" },
                    { icon: Monitor,    label: "Desktop", count: desktopCount, color: "bg-emerald-500" },
                  ].map(({ icon: Icon, label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon size={14} className="text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm w-20">{label}</span>
                      <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full ${color} rounded-full`}
                          style={{ width: rows.length ? `${(count / rows.length) * 100}%` : "0%" }} />
                      </div>
                      <span className="text-zinc-400 text-xs font-mono w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top pages */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <TrendingUp size={12} /> Top strony
                </div>
                {topPages.length === 0
                  ? <p className="text-zinc-600 text-sm">Brak danych</p>
                  : topPages.map(([path, count]) => (
                    <div key={path} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
                      <span className="text-zinc-300 text-sm font-mono truncate">{path || "/"}</span>
                      <span className="text-zinc-400 text-xs font-mono ml-4 flex-shrink-0">{count}x</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Top clicks */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                <MousePointerClick size={12} /> Najczęściej klikane elementy
              </div>
              {topClicks.length === 0
                ? <p className="text-zinc-600 text-sm">Brak danych</p>
                : <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topClicks.map(([label, count]) => (
                    <div key={label} className="flex items-center justify-between px-3 py-2 bg-zinc-800 rounded-xl">
                      <span className="text-zinc-300 text-sm truncate mr-3">{label}</span>
                      <span className="text-zinc-400 text-xs font-mono flex-shrink-0 bg-zinc-700 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        )}

        {/* === EVENTS TABLE === */}
        {tab === "events" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                Ostatnie {rows.length} zdarzeń
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {["Czas", "Zdarzenie", "Ścieżka", "IP", "UA"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0
                    ? <tr><td colSpan={5} className="px-4 py-8 text-zinc-600 text-center">Brak zdarzeń</td></tr>
                    : rows.slice(0, 200).map(r => (
                      <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs whitespace-nowrap">
                          {new Date(r.ts).toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            r.event === "pageview" ? "bg-blue-950 text-blue-400" :
                            r.event === "click"    ? "bg-emerald-950 text-emerald-400" :
                            "bg-zinc-800 text-zinc-400"
                          }`}>{r.event}</span>
                        </td>
                        <td className="px-4 py-2.5 text-zinc-300 font-mono text-xs">{r.path}</td>
                        <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs">{r.ip}</td>
                        <td className="px-4 py-2.5 text-zinc-600 text-xs max-w-[200px] truncate">{r.ua}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === SITE INFO === */}
        {tab === "site" && (
          <div className="space-y-6">
            {/* Stack */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-black text-base mb-5 flex items-center gap-2">
                <Code2 size={16} className="text-zinc-400" /> Stack technologiczny
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STACK.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-xl">
                    <Icon size={14} className="text-zinc-500 flex-shrink-0" />
                    <div>
                      <div className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">{label}</div>
                      <div className="text-zinc-200 text-sm font-semibold">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-black text-base mb-5 flex items-center gap-2">
                <Globe size={16} className="text-zinc-400" /> Sekcje strony ({SECTIONS.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTIONS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-zinc-800 rounded-lg">
                    <span className="text-zinc-600 font-mono text-[9px] w-4 text-right flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-zinc-300 text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-black text-base mb-5 flex items-center gap-2">
                <Shield size={16} className="text-zinc-400" /> Zabezpieczenia (audit 2026-03-12)
              </h2>
              <div className="space-y-2">
                {SECURITY.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2 bg-zinc-800 rounded-lg">
                    <span className="text-emerald-500 text-sm flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-zinc-300 text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Build info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-black text-base mb-4 flex items-center gap-2">
                <Server size={16} className="text-zinc-400" /> Informacje deploymentu
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ["Domena",      "exquisitespaces.pl"],
                  ["Hosting",     "Netlify"],
                  ["Repozytorium","GitHub (gałąź master → auto-deploy)"],
                  ["Build",       "next build (SSG + API Routes)"],
                  ["Ostatni commit", "17592a1 — 2026-03-12"],
                  ["Środowisko",  "Node.js 18+ / Next.js 14.2.35"],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-3 bg-zinc-800 rounded-xl">
                    <div className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase mb-1">{k}</div>
                    <div className="text-zinc-200 font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
