import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/* ── Rate limiting (in-memory, per IP) ── */
const RATE_MAP = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 5;      // max requests
const RATE_WINDOW = 60_000; // per 60 s

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_MAP.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW) {
    RATE_MAP.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/* ── Allowed file types ── */
const ALLOWED_EXTS = new Set([".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);
const ALLOWED_MIME = new Set(["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg", "image/png"]);
const MAX_FILE_BYTES  = 5 * 1024 * 1024;  // 5 MB per file
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB total
const MAX_FIELD_LEN   = 5000;

/* ── HTML escaping ── */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

/* ── Email validation ── */
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const MODELAB: Record<string, string> = {
  client: "Zapytanie klienta",
  b2b: "Propozycja B2B",
  career: "Zgłoszenie rekrutacyjne",
};

function row(label: string, value: string, bg = false, raw = false) {
  return `<tr${bg ? ' style="background:#f4f4f5"' : ""}>
    <td style="padding:10px;font-weight:bold;color:#52525b;width:160px;">${esc(label)}</td>
    <td style="padding:10px;color:#18181b;">${raw ? value : esc(value) || "—"}</td>
  </tr>`;
}

export async function POST(req: NextRequest) {
  /* Rate limiting */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "Zbyt wiele żądań. Poczekaj chwilę." }, { status: 429 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Konfiguracja serwera niekompletna." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let fields: Record<string, string> = {};
  let attachments: { filename: string; content: Buffer }[] = [];

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      if (typeof value === "string") fields[key] = String(value).slice(0, MAX_FIELD_LEN);
    });
    const fileEntries = formData.getAll("attachment") as File[];
    let totalBytes = 0;
    for (const f of fileEntries) {
      if (!(f instanceof File) || f.size === 0) continue;
      /* Extension check */
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) {
        return NextResponse.json({ error: `Niedozwolony typ pliku: ${ext}` }, { status: 400 });
      }
      /* MIME check */
      if (f.type && !ALLOWED_MIME.has(f.type)) {
        return NextResponse.json({ error: `Niedozwolony format pliku.` }, { status: 400 });
      }
      /* Size checks */
      if (f.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `Plik ${f.name} przekracza limit 5 MB.` }, { status: 400 });
      }
      totalBytes += f.size;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return NextResponse.json({ error: "Łączny rozmiar plików przekracza 20 MB." }, { status: 400 });
      }
      /* Sanitize filename */
      const safeFilename = f.name.replace(/[^a-zA-Z0-9._\- ]/g, "_");
      attachments.push({ filename: safeFilename, content: Buffer.from(await f.arrayBuffer()) });
    }
  } else {
    try {
      const body = await req.json();
      Object.entries(body).forEach(([k, v]) => {
        if (typeof v === "string") fields[k] = v.slice(0, MAX_FIELD_LEN);
      });
    } catch {
      return NextResponse.json({ error: "Nieprawidłowe dane." }, { status: 400 });
    }
  }

  const { name, email, phone, mode, company, nip, service, location, coopType, message, position, quizScore, fitPercent } = fields;

  if (!email) return NextResponse.json({ error: "Brak adresu email" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Nieprawidłowy format adresu email." }, { status: 400 });

  const modeLabel = MODELAB[mode] ?? mode ?? "Formularz kontaktowy";

  const rows = [
    row("Tryb", modeLabel),
    row("Imię i nazwisko", name, true),
    row("Email", email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : "", false, true),
    row("Telefon", phone, true),
    ...(company ? [row("Firma", company)] : []),
    ...(nip ? [row("NIP", nip, true)] : []),
    ...(service ? [row("Rodzaj prac", service)] : []),
    ...(location ? [row("Lokalizacja", location, true)] : []),
    ...(coopType ? [row("Rodzaj współpracy", coopType)] : []),
    ...(position ? [row("Stanowisko", position, true)] : []),
    ...(quizScore ? [row("Wynik quizu", `${esc(quizScore)} pkt (${esc(fitPercent ?? "")})`)] : []),
    ...(message ? [row("Wiadomość", `<span style="white-space:pre-wrap">${esc(message)}</span>`, true, true)] : []),
  ].join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">
      <div style="background:#18181b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:20px;">Exquisite Spaces — ${modeLabel}</h1>
      </div>
      <div style="border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        <p style="padding:16px 20px;color:#a1a1aa;font-size:12px;margin:0;border-top:1px solid #f4f4f5;">
          Wiadomość ze strony <strong>exquisitespaces.pl</strong>
        </p>
      </div>
    </div>`;

  const confirmHtml = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;">
      <div style="background:#18181b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:20px;">Exquisite Spaces — potwierdzenie</h1>
      </div>
      <div style="border:1px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="color:#18181b;font-size:15px;margin:0 0 16px;">Cześć <strong>${name || ""}!</strong></p>
        <p style="color:#52525b;font-size:14px;margin:0 0 24px;">Dziękujemy za kontakt. Otrzymaliśmy Twoje zgłoszenie (<strong>${modeLabel}</strong>) i odezwiemy się najszybciej jak to możliwe.</p>
        <div style="background:#f4f4f5;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
          <p style="font-size:12px;color:#71717a;margin:0 0 12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">Twoje zgłoszenie</p>
          <table style="width:100%;border-collapse:collapse;">${rows}</table>
        </div>
        <p style="color:#52525b;font-size:13px;margin:0 0 4px;">Kontakt: <a href="tel:+48600390073" style="color:#18181b;font-weight:bold;">600 390 073</a></p>
        <p style="color:#52525b;font-size:13px;margin:0;">Email: <a href="mailto:biuro@exquisitespaces.pl" style="color:#18181b;">biuro@exquisitespaces.pl</a></p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
        <p style="color:#a1a1aa;font-size:11px;margin:0;">Exquisite Spaces Sp. z o.o. · ul. Kopernika 132, 34-300 Żywiec · exquisitespaces.pl</p>
      </div>
    </div>`;

  try {
    const [main] = await Promise.allSettled([
      resend.emails.send({
        from: "Formularz ES <noreply@exquisitespaces.pl>",
        to: [process.env.RESEND_TO_EMAIL ?? "info@exquisitespaces.pl"],
        replyTo: email,
        subject: `[${modeLabel}] ${name || email}`,
        html,
        ...(attachments.length > 0 ? { attachments } : {}),
      }),
      resend.emails.send({
        from: "Exquisite Spaces <noreply@exquisitespaces.pl>",
        to: [email],
        subject: `Potwierdzenie zgłoszenia — ${modeLabel}`,
        html: confirmHtml,
      }),
    ]);
    if (main.status === "rejected") throw main.reason;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Błąd wysyłki. Spróbuj ponownie." }, { status: 500 });
  }
}
