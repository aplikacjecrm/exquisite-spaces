import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Polityka Prywatności & RODO – Exquisite Spaces",
  description: "Polityka prywatności i informacja o przetwarzaniu danych osobowych zgodna z RODO.",
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

export default function PrivacyPage() {
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
              <Shield size={18} className="text-zinc-300" />
            </div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl tracking-tight">Polityka Prywatności</h1>
              <p className="text-zinc-400 text-sm mt-1">Ostatnia aktualizacja: {UPDATED}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10 shadow-sm">

          <Section title="1. Administrator danych osobowych">
            <p>
              Administratorem Twoich danych osobowych jest <strong>Exquisite Spaces Spółka z ograniczoną odpowiedzialnością</strong> z siedzibą w Żywcu, ul. Kopernika 132, 34-300 Żywiec, wpisana do Rejestru Przedsiębiorców KRS pod numerem <strong>0001057222</strong>, NIP: <strong>5361973293</strong>, REGON: <strong>526355977</strong>.
            </p>
            <p>
              Kontakt z Administratorem: <a href="mailto:biuro@exquisitespaces.pl" className="text-zinc-900 font-semibold underline">biuro@exquisitespaces.pl</a> lub telefonicznie: <a href="tel:+48600390073" className="text-zinc-900 font-semibold underline">+48 600 390 073</a>.
            </p>
          </Section>

          <Section title="2. Jakie dane zbieramy i w jakim celu">
            <p>Przetwarzamy dane osobowe w następujących celach:</p>
            <ul className="list-none space-y-3 mt-2">
              {[
                ["Formularz kontaktowy (zapytania klientów, B2B)", "Imię i nazwisko, adres e-mail, numer telefonu, treść wiadomości, opcjonalnie: firma, NIP, lokalizacja, pliki załączników.", "Wykonanie umowy lub podjęcie działań na żądanie osoby przed zawarciem umowy (art. 6 ust. 1 lit. b RODO)."],
                ["Formularz rekrutacyjny", "Imię i nazwisko, adres e-mail, numer telefonu, stanowisko, dokumenty aplikacyjne (CV, portfolio).", "Uzasadniony interes Administratora w prowadzeniu rekrutacji (art. 6 ust. 1 lit. f RODO)."],
                ["Analityka strony internetowej", "Anonimowy adres IP, ścieżka odwiedzonej strony, czas spędzony na stronie, użyty system/przeglądarka.", "Uzasadniony interes Administratora w analizie ruchu na stronie (art. 6 ust. 1 lit. f RODO)."],
                ["Potwierdzenia e-mail", "Adres e-mail podany w formularzu.", "Wykonanie usługi (wysłanie potwierdzenia zgłoszenia) (art. 6 ust. 1 lit. b RODO)."],
              ].map(([cel, dane, podstawa]) => (
                <li key={cel} className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <div className="font-bold text-zinc-800 mb-1">{cel}</div>
                  <div className="mb-1"><span className="font-semibold text-zinc-700">Zakres danych:</span> {dane}</div>
                  <div><span className="font-semibold text-zinc-700">Podstawa prawna:</span> {podstawa}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. Okres przechowywania danych">
            <ul className="space-y-2">
              <li>• Dane z formularzy kontaktowych — do czasu zakończenia współpracy lub do upływu okresu przedawnienia roszczeń (max. 3 lata).</li>
              <li>• Dane rekrutacyjne — 12 miesięcy od zakończenia procesu rekrutacji, chyba że wyrazisz zgodę na dłuższe przechowywanie.</li>
              <li>• Dane analityczne — 24 miesiące od momentu zebrania.</li>
            </ul>
          </Section>

          <Section title="4. Odbiorcy danych osobowych">
            <p>Twoje dane mogą być przekazywane następującym podmiotom:</p>
            <ul className="space-y-2 mt-2">
              <li>• <strong>Resend Inc.</strong> (USA) – dostawca usług e-mail (przetwarzanie na podstawie standardowych klauzul umownych UE).</li>
              <li>• <strong>Supabase Inc.</strong> (USA) – infrastruktura techniczna (CDN wideo, analityka) – klauzule umowne UE.</li>
              <li>• <strong>Netlify Inc.</strong> (USA) – hosting strony internetowej – klauzule umowne UE.</li>
              <li>• Organy publiczne, gdy wymagają tego przepisy prawa.</li>
            </ul>
            <p className="mt-3">Administrator nie sprzedaje danych osobowych podmiotom trzecim.</p>
          </Section>

          <Section title="5. Twoje prawa (RODO)">
            <p>Na podstawie RODO (Rozporządzenie UE 2016/679) przysługują Ci następujące prawa:</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {[
                ["Prawo dostępu", "Możesz zażądać informacji o tym, jakie dane przechowujemy."],
                ["Prawo do sprostowania", "Możesz poprosić o korektę nieprawidłowych danych."],
                ["Prawo do usunięcia", "\"Prawo do bycia zapomnianym\" – możesz zażądać usunięcia danych."],
                ["Prawo do ograniczenia", "Możesz ograniczyć przetwarzanie swoich danych."],
                ["Prawo do przenoszenia", "Możesz otrzymać dane w formacie nadającym się do odczytu maszynowego."],
                ["Prawo do sprzeciwu", "Możesz sprzeciwić się przetwarzaniu opartemu na uzasadnionym interesie."],
                ["Prawo do skargi", "Możesz złożyć skargę do Prezesa UODO (uodo.gov.pl)."],
                ["Prawo do cofnięcia zgody", "W każdej chwili możesz cofnąć udzieloną zgodę."],
              ].map(([prawo, opis]) => (
                <div key={prawo} className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
                  <div className="font-bold text-zinc-800 text-xs mb-1">{prawo}</div>
                  <div className="text-zinc-500 text-xs">{opis}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">Aby skorzystać z powyższych praw, skontaktuj się z nami: <a href="mailto:biuro@exquisitespaces.pl" className="text-zinc-900 font-semibold underline">biuro@exquisitespaces.pl</a></p>
          </Section>

          <Section title="6. Bezpieczeństwo danych">
            <p>Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych przed nieuprawnionym dostępem, utratą lub zniszczeniem:</p>
            <ul className="space-y-2 mt-2">
              <li>• Szyfrowanie połączeń (HTTPS / TLS).</li>
              <li>• Rate limiting zapytań do formularzy.</li>
              <li>• Filtrowanie i walidacja przesyłanych plików.</li>
              <li>• Nagłówki bezpieczeństwa HTTP (HSTS, CSP, X-Frame-Options).</li>
              <li>• Dostęp do panelu administracyjnego chroniony hasłem i ciasteczkiem HTTP-only.</li>
            </ul>
          </Section>

          <Section title="7. Pliki cookie">
            <p>Strona wykorzystuje pliki cookie. Szczegółowe informacje znajdują się w odrębnym dokumencie:</p>
            <Link href="/polityka-cookies" className="inline-flex items-center gap-2 mt-2 text-zinc-900 font-bold underline hover:text-zinc-600 transition-colors text-sm">
              → Polityka Cookies
            </Link>
          </Section>

          <Section title="8. Inspektor Ochrony Danych (IOD)">
            <p>
              Administrator nie wyznaczył Inspektora Ochrony Danych, ponieważ nie jest do tego zobowiązany na podstawie art. 37 RODO (przetwarzanie danych nie jest główną działalnością oraz nie jest prowadzone na dużą skalę).
            </p>
            <p>
              W sprawach dotyczących ochrony danych osobowych kontaktuj się bezpośrednio z Administratorem: <a href="mailto:biuro@exquisitespaces.pl" className="text-zinc-900 font-semibold underline">biuro@exquisitespaces.pl</a>
            </p>
          </Section>

          <Section title="9. Dobrowolność podania danych">
            <p>Podanie danych osobowych jest dobrowolne, jednak konieczne do realizacji określonych celów:</p>
            <ul className="space-y-2 mt-2">
              <li>• <strong>Formularz kontaktowy (klient/B2B):</strong> podanie imienia, adresu e-mail oraz treści wiadomości jest niezbędne do udzielenia odpowiedzi. Niepodanie tych danych uniemożliwia kontakt.</li>
              <li>• <strong>Formularz rekrutacyjny:</strong> podanie imienia, adresu e-mail i stanowiska jest niezbędne do rozpatrzenia aplikacji. Niepodanie tych danych uniemożliwia udział w rekrutacji. CV i portfolio są opcjonalne.</li>
              <li>• <strong>Dane analityczne:</strong> zbierane automatycznie podczas korzystania ze strony. Możesz je ograniczyć wybierając „Tylko niezbędne" w banerze cookie lub wyłączając cookies w przeglądarce.</li>
            </ul>
          </Section>

          <Section title="10. Zautomatyzowane podejmowanie decyzji i profilowanie">
            <p>
              Administrator <strong>nie stosuje</strong> zautomatyzowanego podejmowania decyzji, w tym profilowania, o którym mowa w art. 22 ust. 1 i 4 RODO. Dane osobowe przetwarzane są wyłącznie przez osoby uprawnione po stronie Administratora.
            </p>
          </Section>

          <Section title="11. Przetwarzanie danych rekrutacyjnych">
            <p>Dane osobowe kandydatów do pracy przetwarzane są zgodnie z art. 22¹ Kodeksu pracy oraz RODO:</p>
            <ul className="space-y-2 mt-2">
              <li>• <strong>Zakres danych wymaganych przez prawo (art. 22¹ KP):</strong> imię i nazwisko, data urodzenia, dane kontaktowe, wykształcenie, przebieg dotychczasowego zatrudnienia.</li>
              <li>• <strong>Dane wykraczające poza art. 22¹ KP</strong> (np. zdjęcie, zainteresowania) przetwarzamy wyłącznie za Twoją zgodą — wysyłając CV zawierające takie dane, wyrażasz zgodę na ich przetwarzanie.</li>
              <li>• <strong>Okres przechowywania:</strong> 12 miesięcy po zakończeniu rekrutacji, chyba że wyrazisz zgodę na dłuższe przechowywanie w celu przyszłych rekrutacji.</li>
              <li>• Dane rekrutacyjne nie są przekazywane podmiotom zewnętrznym bez Twojej zgody.</li>
            </ul>
          </Section>

          <Section title="12. Zmiany polityki prywatności">
            <p>Administrator zastrzega sobie prawo do zmiany niniejszej Polityki Prywatności. O istotnych zmianach poinformujemy poprzez aktualizację daty modyfikacji na tej stronie. Korzystanie ze strony po zmianach oznacza ich akceptację.</p>
          </Section>

          <div className="mt-10 pt-6 border-t border-zinc-100 text-center">
            <p className="text-zinc-400 font-mono text-xs">Exquisite Spaces Sp. z o.o. · ul. Kopernika 132, 34-300 Żywiec · KRS 0001057222</p>
          </div>
        </div>
      </div>
    </div>
  );
}
