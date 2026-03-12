import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Polityka Cookies – Exquisite Spaces",
  description: "Informacja o plikach cookie stosowanych na stronie exquisitespaces.pl.",
  robots: "noindex",
};

const UPDATED = "12 marca 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-zinc-900 font-black text-lg mb-4 pb-2 border-b border-zinc-200">{title}</h2>
      <div className="text-zinc-600 leading-relaxed space-y-3 text-sm">{children}</div>
    </section>
  );
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-zinc-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Powrót do strony głównej
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
              <Cookie size={18} className="text-zinc-300" />
            </div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl tracking-tight">Polityka Cookies</h1>
              <p className="text-zinc-400 text-sm mt-1">Ostatnia aktualizacja: {UPDATED}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10 shadow-sm">

          <Section title="1. Czym są pliki cookie?">
            <p>
              Pliki cookie (ciasteczka) to małe pliki tekstowe przechowywane na Twoim urządzeniu (komputerze, tablecie, smartfonie) przez przeglądarkę internetową podczas odwiedzania strony. Służą do zapewnienia prawidłowego działania strony, analizy ruchu oraz zapamiętywania preferencji użytkownika.
            </p>
          </Section>

          <Section title="2. Jakie cookies stosujemy">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="text-left px-4 py-3 font-bold text-zinc-700 border border-zinc-200">Nazwa / Typ</th>
                    <th className="text-left px-4 py-3 font-bold text-zinc-700 border border-zinc-200">Cel</th>
                    <th className="text-left px-4 py-3 font-bold text-zinc-700 border border-zinc-200">Czas</th>
                    <th className="text-left px-4 py-3 font-bold text-zinc-700 border border-zinc-200">Typ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["admin_session", "Uwierzytelnienie panelu administracyjnego (tylko dla administratorów)", "7 dni", "Niezbędne"],
                    ["cookie_consent", "Zapamiętanie Twojej decyzji dotyczącej cookies", "365 dni", "Niezbędne"],
                    ["Analityczne (własne)", "Zbieranie anonimowych statystyk: odsłony stron, czas wizyt, kliknięcia. Dane przechowywane w Supabase (EU).", "24 miesiące", "Analityczne"],
                  ].map(([name, cel, czas, typ]) => (
                    <tr key={name} className="border-b border-zinc-100">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-700 border border-zinc-200 whitespace-nowrap">{name}</td>
                      <td className="px-4 py-3 text-zinc-600 border border-zinc-200">{cel}</td>
                      <td className="px-4 py-3 text-zinc-500 border border-zinc-200 whitespace-nowrap">{czas}</td>
                      <td className="px-4 py-3 border border-zinc-200">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          typ === "Niezbędne" ? "bg-zinc-100 text-zinc-600" : "bg-amber-50 text-amber-700"
                        }`}>{typ}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              Strona <strong>nie korzysta</strong> z reklam, Google Analytics, Google Ads, Facebook Pixel ani żadnych zewnętrznych sieci reklamowych.
            </p>
          </Section>

          <Section title="3. Podstawa prawna">
            <p>
              Przechowywanie plików cookie na Twoim urządzeniu i dostęp do nich odbywa się na podstawie:
            </p>
            <ul className="space-y-2 mt-2">
              <li>• <strong>Pliki niezbędne</strong> — uzasadniony interes Administratora (prawidłowe działanie strony), art. 6 ust. 1 lit. f RODO oraz art. 173 Prawa Telekomunikacyjnego — zgoda nie jest wymagana.</li>
              <li>• <strong>Pliki analityczne</strong> — zgoda użytkownika (art. 6 ust. 1 lit. a RODO) wyrażona poprzez kliknięcie „Akceptuję" w banerze cookie.</li>
            </ul>
          </Section>

          <Section title="4. Jak zarządzać plikami cookie">
            <p>Możesz kontrolować pliki cookie na kilka sposobów:</p>
            <div className="space-y-3 mt-3">
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="font-bold text-zinc-800 mb-1">Ustawienia przeglądarki</div>
                <p>Większość przeglądarek pozwala na zarządzanie cookies w ustawieniach. Blokowanie wszystkich cookies może wpłynąć na działanie strony.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    ["Chrome", "chrome://settings/cookies"],
                    ["Firefox", "about:preferences#privacy"],
                    ["Safari", "Preferencje → Prywatność"],
                    ["Edge", "edge://settings/cookies"],
                  ].map(([browser, path]) => (
                    <span key={browser} className="text-xs bg-white border border-zinc-200 rounded-lg px-2 py-1 font-mono">
                      <strong>{browser}:</strong> {path}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="font-bold text-zinc-800 mb-1">Baner zgody na stronie</div>
                <p>Przy pierwszej wizycie na stronie wyświetlamy baner z możliwością wyrażenia zgody lub odmowy. Możesz zmienić decyzję, kasując pliki cookie w przeglądarce i ponownie odwiedzając stronę.</p>
              </div>
            </div>
          </Section>

          <Section title="5. Przekazywanie danych poza EOG">
            <p>
              Dostawcy infrastruktury (Netlify, Supabase) mogą przechowywać dane na serwerach poza Europejskim Obszarem Gospodarczym. Przekazywanie odbywa się w oparciu o standardowe klauzule umowne zatwierdzone przez Komisję Europejską (art. 46 ust. 2 lit. c RODO).
            </p>
          </Section>

          <Section title="6. Kontakt">
            <p>
              Pytania dotyczące polityki cookies kieruj na adres: <a href="mailto:biuro@exquisitespaces.pl" className="text-zinc-900 font-semibold underline">biuro@exquisitespaces.pl</a>
            </p>
            <p>
              Więcej informacji o przetwarzaniu danych osobowych znajdziesz w{" "}
              <Link href="/polityka-prywatnosci" className="text-zinc-900 font-semibold underline">Polityce Prywatności</Link>.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-zinc-100 text-center">
            <p className="text-zinc-400 font-mono text-xs">Exquisite Spaces Sp. z o.o. · ul. Kopernika 132, 34-300 Żywiec · KRS 0001057222</p>
          </div>
        </div>
      </div>
    </div>
  );
}
