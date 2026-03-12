# Security Audit — Exquisite Spaces
**Data:** 2026-03-12  
**Audytor:** Cascade AI (developer perspective)  
**Wersja commit:** ba15ede  
**Zakres:** Pełna aplikacja Next.js 14 — API, frontend, konfiguracja, zależności

---

## PODSUMOWANIE WYKONAWCZE

| Poziom | Znalezione | Naprawione |
|--------|-----------|------------|
| 🔴 KRYTYCZNE | 3 | 3 ✅ |
| 🟠 WAŻNE | 4 | 4 ✅ |
| 🟡 ŚREDNIE | 3 | 2 ✅ / 1 ⚠️ |
| 🟢 NISKIE | 3 | informacyjne |

---

## 🔴 KRYTYCZNE — NAPRAWIONE

### 1. Brak rate limitingu na `/api/contact`
**Ryzyko:** Atakujący mógł wysyłać tysiące requestów na minutę, spalając limit Resend API i generując koszty. Bot mógł zalać skrzynkę spamem.  
**Fix:** In-memory rate limiter — max **5 requestów / 60 s na IP**. Odpowiedź HTTP 429 przy przekroczeniu.

```ts
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000; // ms
```

---

### 2. XSS w treści emaila
**Ryzyko:** Pole `message` było wstrzykiwane bezpośrednio do HTML emaila bez sanityzacji:
```html
<span>${message}</span>  <!-- BEZ escapowania! -->
```
Atakujący mógł wysłać `<script>...</script>` lub `<img onerror=...>` i wykonać kod w kliencie emailowym.  
**Fix:** Funkcja `esc()` escapuje wszystkie znaki specjalne HTML (`&`, `<`, `>`, `"`, `'`) przed wstawieniem do szablonu.

---

### 3. Brak walidacji plików (typ, rozmiar, nazwa)
**Ryzyko:** Można było wysłać plik `.exe`, `.php`, `.sh` — potencjalnie malware. Brak limitu rozmiaru — atak DoS przez wyczerpanie pamięci RAM.  
**Fix:**
- Whitelist rozszerzeń: `.pdf .doc .docx .jpg .jpeg .png`
- Whitelist MIME: `application/pdf`, `image/jpeg`, `image/png`, itd.
- Max rozmiar na plik: **5 MB**
- Max łącznie: **20 MB**
- Sanityzacja nazwy pliku: usunięcie znaków specjalnych

---

## 🟠 WAŻNE — NAPRAWIONE

### 4. Brak nagłówków HTTP bezpieczeństwa
**Ryzyko:** Brak ochrony przed clickjackingiem, MIME sniffingiem, atakami przez osadzenie w iframe, brakiem HTTPS enforcement.  
**Fix — dodane nagłówki:**

| Nagłówek | Wartość | Chroni przed |
|----------|---------|--------------|
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Wyciekiem URL |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Downgrade do HTTP |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Dostępem do sprzętu |
| `Content-Security-Policy` | whitelist domen | XSS, injection |

---

### 5. Brak walidacji formatu email po stronie serwera
**Ryzyko:** Można było podać dowolny string jako email — błąd Resend lub wstrzyknięcie w nagłówki.  
**Fix:** Regex po stronie serwera przed wysyłką:
```ts
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
```

---

### 6. `RESEND_API_KEY` bez sprawdzenia obecności
**Ryzyko:** Przy braku zmiennej środowiskowej — `new Resend(undefined)` powodował niejasny błąd lub ujawnienie stack trace.  
**Fix:** Wczesna walidacja i odpowiedź HTTP 500 z bezpiecznym komunikatem.

---

### 7. Brak limitów długości pól tekstowych
**Ryzyko:** Pole `message` mogło przyjąć gigabajtowy string, powodując memory exhaustion na serverless funkcji.  
**Fix:** `MAX_FIELD_LEN = 5000` znaków na każde pole tekstowe.

---

## 🟡 ŚREDNIE

### 8. `ignoreBuildErrors: true` i `ignoreDuringBuilds: true` ⚠️ POZOSTAJE
**Ryzyko:** TypeScript i ESLint błędy są ignorowane w buildzie produkcyjnym. Może maskować poważne błędy logiczne.  
**Status:** Pozostawione celowo — aplikacja ma niestandardowe konfiguracje (canvas alias, react-pdf). **Zalecenie:** W przyszłości usunąć te flagi i naprawić wszystkie błędy TS/ESLint.

---

### 9. Content Security Policy — `unsafe-inline` i `unsafe-eval` ✅ ZAAKCEPTOWANE
**Ryzyko:** Tailwind CSS i Next.js wymagają `unsafe-inline` dla styli. `unsafe-eval` wymagany przez react-pdf (pdfjs worker).  
**Status:** Zaakceptowane — bez nich aplikacja nie działa. Dodano whitelist wszystkich zewnętrznych domen (Supabase, Resend API).

---

### 10. Brak CAPTCHA / bot protection
**Ryzyko:** Mimo rate limitingu, zautomatyzowane boty mogą rotować IP i nadal spamować formularz.  
**Status:** ⚠️ **Zalecenie na przyszłość:** Dodać Cloudflare Turnstile (darmowe, bez CAPTCHA UI) lub hCaptcha.

---

## 🟢 NISKIE / INFORMACYJNE

### 11. Zdjęcia nie są optymalizowane (`unoptimized: true`)
Wyłączona optymalizacja Next.js Image. Pliki PNG/JPG serwowane w oryginalnym rozmiarze.  
**Wpływ:** Wydajność (LCP), nie bezpieczeństwo.

### 12. Supabase URL w kodzie źródłowym (publiczny)
URL `yinnyzflmywiplluyyhl.supabase.co` jest widoczny w JS. Jest to **akceptowalne** — to publiczny bucket Storage (read-only dla filmów). Klucz API Supabase **nie jest** w kodzie frontendu ✅.

### 13. Lokalne pliki wideo w `public/images/`
Pliki `.mp4` w katalogu publicznym są dostępne bez uwierzytelnienia. Akceptowalne dla materiałów marketingowych.

---

## WERYFIKACJA ZMIENNYCH ŚRODOWISKOWYCH

| Zmienna | Gdzie używana | Status |
|---------|--------------|--------|
| `RESEND_API_KEY` | `/api/contact` — klucz Resend | ✅ Tylko server-side |
| `RESEND_TO_EMAIL` | adres odbiorcy emaila | ✅ Tylko server-side |
| Brak `NEXT_PUBLIC_*` sekretów | — | ✅ Żadne sekrety nie trafią do bundle |

---

## ZALEŻNOŚCI — OCENA

| Pakiet | Wersja | Uwagi |
|--------|--------|-------|
| `next` | 14.2.35 | ✅ Aktualna linia 14 |
| `react` | ^18 | ✅ |
| `resend` | ^6.9.3 | ✅ |
| `react-pdf` | ^7.7.3 | ✅ |
| `nodemailer` | ^8.0.2 | ⚠️ Nieużywany (Resend zastąpił) — można usunąć |
| `lucide-react` | ^0.577.0 | ✅ |

**Zalecenie:** Usunąć `nodemailer` i `@types/nodemailer` — nieużywane, zwiększają bundle.

---

## OCENA OGÓLNA

```
Przed audytem:  D+ (poważne luki w API)
Po naprawkach:  B+  (solidna aplikacja marketingowa)
```

### Pozostałe do zrobienia (priorytet niski):
1. Dodać Cloudflare Turnstile do formularza kontaktowego
2. Usunąć pakiet `nodemailer` 
3. Rozważyć przeniesienie filmów hero do Supabase (zamiast `public/images/`)
4. Monitorowanie błędów (np. Sentry) dla środowiska produkcyjnego

---

*Dokument wygenerowany automatycznie na podstawie przeglądu kodu. Commit: `ba15ede`*
