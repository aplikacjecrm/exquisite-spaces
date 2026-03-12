"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Shield, LogOut, RefreshCw, Users, Clock, MousePointerClick,
  Globe, Code2, Server, GitBranch, Database, FileText, Eye,
  TrendingUp, Smartphone, Monitor, Tablet, Activity, AlertTriangle,
  Wifi, Filter, Calendar, ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

type Period = "1d" | "7d" | "30d" | "all";

const PERIOD_LABELS: Record<Period, string> = { "1d": "Dziś", "7d": "7 dni", "30d": "30 dni", "all": "Wszystko" };

const STACK = [
  { label: "Framework",    value: "Next.js 14 (App Router)",    icon: Code2 },
  { label: "Styling",      value: "Tailwind CSS 3.4",            icon: FileText },
  { label: "Email",        value: "Resend API",                  icon: Server },
  { label: "Video CDN",    value: "Supabase Storage",            icon: Database },
  { label: "Analytics DB", value: "Supabase (site_analytics)",   icon: Database },
  { label: "Deploy",       value: "Netlify (auto z GitHub)",     icon: GitBranch },
  { label: "Języki i18n",  value: "PL / DE / FR / EN / NL",      icon: Globe },
  { label: "Icons",        value: "Lucide React",                icon: Eye },
];

const SECTIONS = [
  "Hero (video crossfade 2 pliki)",
  "HeroCTA (statystyki + CTA)",
  "About (zdjęcie + tekst + modal)",
  "AboutModal (5 sekcji – poznaj nas)",
  "Services (5 kart usług)",
  "Equipment (sprzęt + team + karuzela)",
  "Portfolio (realizacje + PDF broszury 5 języków)",
  "VideoModal (filmy z 5 języków + fullscreen)",
  "ContactVideo (wideo kontakt + karty)",
  "Contact (3 formularze: Klient / B2B / Kariera + quiz)",
  "Footer (4 kolumny + linki prawne)",
  "Navbar (transparent→biały przy scrollu)",
  "PdfModal (fullscreen PDF viewer)",
  "CookieBanner (RODO baner zgody)",
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
  "RODO: 12 sekcji polityki + klauzule przy każdym formularzu",
];

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const u = ua.toLowerCase();
  if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(u)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(u)) return "mobile";
  return "desktop";
}

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`border rounded-2xl p-5 ${accent ? "bg-white/5 border-white/20" : "bg-zinc-900 border-zinc-800"}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-zinc-500" />
        <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">{label}</span>
      </div>
      <div className="text-white font-black text-3xl tabular-nums mb-0.5">{value}</div>
      {sub && <div className="text-zinc-500 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [allRows, setAllRows] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [tab, setTab] = useState<"overview" | "events" | "site">("overview");
  const [period, setPeriod] = useState<Period>("7d");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics?limit=2000");
      if (res.status === 503) { setConfigured(false); setLoading(false); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAllRows(data);
      setConfigured(true);
      setLastRefresh(new Date());
    } catch {
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 60_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  /* --- Time filter --- */
  const rows = allRows.filter(r => {
    if (period === "all") return true;
    const hours = period === "1d" ? 24 : period === "7d" ? 168 : 720;
    return new Date(r.ts) > new Date(Date.now() - hours * 3_600_000);
  });

  /* --- Derived stats --- */
  const pageviews  = rows.filter(r => r.event === "pageview");
  const durations  = rows.filter(r => r.event === "duration");
  const clicks     = rows.filter(r => r.event === "click");
  const uniqueIPs  = new Set(rows.map(r => r.ip)).size;
  const avgSeconds = durations.length
    ? Math.round(durations.reduce((s, r) => s + ((r.data?.seconds as number) ?? 0), 0) / durations.length)
    : 0;

  const active30min = new Set(
    allRows.filter(r => new Date(r.ts) > new Date(Date.now() - 30 * 60_000)).map(r => r.ip)
  ).size;

  const topPages = Object.entries(
    pageviews.reduce<Record<string, number>>((acc, r) => { acc[r.path || "/"] = (acc[r.path || "/"] ?? 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const topClicks = Object.entries(
    clicks.reduce<Record<string, number>>((acc, r) => {
      const lbl = String(r.data?.label ?? "?");
      acc[lbl] = (acc[lbl] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const devices = rows.reduce<Record<string, number>>((acc, r) => {
    const d = detectDevice(r.ua ?? "");
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});
  const mobileCount  = devices["mobile"]  ?? 0;
  const tabletCount  = devices["tablet"]  ?? 0;
  const desktopCount = devices["desktop"] ?? 0;
  const total = rows.length || 1;

  const referrers = Object.entries(
    rows.filter(r => r.referrer && r.referrer !== "direct").reduce<Record<string, number>>((acc, r) => {
      try {
        const host = new URL(r.referrer).hostname.replace("www.", "");
        acc[host] = (acc[host] ?? 0) + 1;
      } catch { acc[r.referrer] = (acc[r.referrer] ?? 0) + 1; }
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const filteredEvents = eventFilter === "all" ? rows : rows.filter(r => r.event === eventFilter);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Shield size={20} className="text-zinc-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-black text-sm tracking-tight truncate">PANEL ADMINA</div>
              <div className="text-zinc-500 font-mono text-[9px] tracking-widest">exquisitespaces.pl</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {lastRefresh && (
              <span className="hidden sm:block text-zinc-600 font-mono text-[9px]">
                {lastRefresh.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            {active30min > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-900/60 rounded-full px-2.5 py-1">
                <Wifi size={10} className="text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono text-[10px] font-bold">{active30min} online</span>
              </div>
            )}
            <button onClick={load} disabled={loading} aria-label="Odśwież dane"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={logout}
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              <LogOut size={14} />
              <span className="hidden sm:block">Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Tabs + period filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
            {(["overview", "events", "site"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${tab === t ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"}`}>
                {t === "overview" ? "Statystyki" : t === "events" ? "Zdarzenia" : "O stronie"}
              </button>
            ))}
          </div>
          {tab !== "site" && (
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <Calendar size={12} className="text-zinc-600 ml-2" />
              {(["1d", "7d", "30d", "all"] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* === OVERVIEW === */}
        {tab === "overview" && (
          <div className="space-y-5">
            {!configured && (
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-5 flex gap-3">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-amber-400 font-bold text-sm mb-1">Analytics nie skonfigurowane</div>
                  <div className="text-amber-500/80 text-xs leading-relaxed">
                    Dodaj <code className="bg-amber-950 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> do zmiennych środowiskowych Netlify.<br />
                    SQL do uruchomienia w Supabase:{" "}
                    <code className="bg-amber-950 px-1 rounded text-[10px] break-all">
                      CREATE TABLE site_analytics (id bigint generated always as identity primary key, event text, path text, referrer text, ua text, ip text, data jsonb, ts timestamptz default now());
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <StatCard icon={Eye}               label="Odsłony"      value={pageviews.length}   sub="pageview events" />
              <StatCard icon={Users}             label="Unikalne IP"  value={uniqueIPs}           sub="przybliż. użytkownicy" />
              <StatCard icon={Clock}             label="Śr. czas"     value={avgSeconds > 0 ? `${avgSeconds}s` : "—"} sub="na stronie" />
              <StatCard icon={MousePointerClick} label="Kliknięcia"   value={clicks.length}       sub="zarejestrowane" />
              <StatCard icon={Wifi}              label="Aktywni"      value={active30min}         sub="ostatnie 30 min" accent />
            </div>

            {/* Devices + Top pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Devices */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Activity size={12} /> Urządzenia
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Smartphone, label: "Mobile",  count: mobileCount,  color: "bg-blue-500" },
                    { icon: Tablet,     label: "Tablet",  count: tabletCount,  color: "bg-violet-500" },
                    { icon: Monitor,    label: "Desktop", count: desktopCount, color: "bg-emerald-500" },
                  ].map(({ icon: Icon, label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon size={14} className="text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm w-16">{label}</span>
                      <Bar pct={Math.round((count / total) * 100)} color={color} />
                      <span className="text-zinc-400 text-xs font-mono w-8 text-right">{count}</span>
                      <span className="text-zinc-600 text-xs font-mono w-8">{total > 1 ? `${Math.round((count / total) * 100)}%` : "—"}</span>
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
                  ? <p className="text-zinc-600 text-sm">Brak danych dla wybranego okresu</p>
                  : <div className="space-y-1.5">
                    {topPages.map(([path, count]) => (
                      <div key={path} className="flex items-center gap-3">
                        <span className="text-zinc-300 text-xs font-mono truncate flex-1">{path}</span>
                        <Bar pct={Math.round((count / (topPages[0][1] || 1)) * 100)} color="bg-zinc-500" />
                        <span className="text-zinc-400 text-xs font-mono w-8 text-right flex-shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>

            {/* Referrers + Top clicks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Referrers */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <ExternalLink size={12} /> Źródła ruchu
                </div>
                {referrers.length === 0
                  ? <p className="text-zinc-600 text-sm">Głównie ruch bezpośredni (direct)</p>
                  : <div className="space-y-2">
                    {referrers.map(([host, count]) => (
                      <div key={host} className="flex items-center gap-3">
                        <span className="text-zinc-300 text-xs font-mono truncate flex-1">{host}</span>
                        <Bar pct={Math.round((count / (referrers[0][1] || 1)) * 100)} color="bg-blue-700" />
                        <span className="text-zinc-400 text-xs font-mono w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                }
              </div>

              {/* Top clicks */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
                  <MousePointerClick size={12} /> Najczęściej klikane
                </div>
                {topClicks.length === 0
                  ? <p className="text-zinc-600 text-sm">Brak danych</p>
                  : <div className="space-y-1.5">
                    {topClicks.map(([label, count]) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-zinc-300 text-xs truncate flex-1">{label}</span>
                        <Bar pct={Math.round((count / (topClicks[0][1] || 1)) * 100)} color="bg-emerald-700" />
                        <span className="text-zinc-400 text-xs font-mono w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* === EVENTS TABLE === */}
        {tab === "events" && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={13} className="text-zinc-500" />
              {["all", "pageview", "click", "duration"].map(f => (
                <button key={f} onClick={() => setEventFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    eventFilter === f ? "bg-zinc-700 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}>
                  {f === "all" ? `Wszystkie (${rows.length})` : f}
                </button>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                  {filteredEvents.length} zdarzeń · {PERIOD_LABELS[period]}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["Czas", "Zdarzenie", "Ścieżka", "IP", "Dane / UA"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length === 0
                      ? <tr><td colSpan={5} className="px-4 py-10 text-zinc-600 text-center text-sm">Brak zdarzeń dla wybranego filtra</td></tr>
                      : filteredEvents.slice(0, 300).map(r => (
                        <tr key={r.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs whitespace-nowrap">
                            {new Date(r.ts).toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                              r.event === "pageview"  ? "bg-blue-950 text-blue-400"     :
                              r.event === "click"     ? "bg-emerald-950 text-emerald-400" :
                              r.event === "duration"  ? "bg-amber-950 text-amber-400"  :
                              "bg-zinc-800 text-zinc-400"
                            }`}>{r.event}</span>
                          </td>
                          <td className="px-4 py-2.5 text-zinc-300 font-mono text-xs max-w-[180px] truncate">{r.path || "/"}</td>
                          <td className="px-4 py-2.5 text-zinc-500 font-mono text-xs whitespace-nowrap">{r.ip}</td>
                          <td className="px-4 py-2.5 text-zinc-600 text-xs max-w-[220px] truncate">
                            {r.event === "click" ? String(r.data?.label ?? "") :
                             r.event === "duration" ? `${r.data?.seconds ?? "?"}s` :
                             r.ua}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === SITE INFO === */}
        {tab === "site" && (
          <div className="space-y-5">
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
                    <span className="text-zinc-600 font-mono text-[9px] w-5 text-right flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-zinc-300 text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-black text-base mb-5 flex items-center gap-2">
                <Shield size={16} className="text-zinc-400" /> Zabezpieczenia · audit 2026-03-12
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
                  ["Domena",           "exquisitespaces.pl"],
                  ["Hosting",          "Netlify"],
                  ["Repozytorium",     "GitHub → master → auto-deploy"],
                  ["Build",            "next build (SSG + API Routes)"],
                  ["Ostatni commit",   "bf0cd37 — 2026-03-12"],
                  ["Środowisko",       "Node.js 18+ / Next.js 14.2.35"],
                  ["Legal",            "RODO ✓ · Cookies ✓ · Art.13 ✓"],
                  ["Responsywność",    "Mobile ✓ · Tablet ✓ · Desktop ✓"],
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
