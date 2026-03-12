import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MODELAB: Record<string, string> = {
  client: "Zapytanie klienta",
  b2b: "Propozycja B2B",
  career: "Zgłoszenie rekrutacyjne",
};

function row(label: string, value: string, bg = false) {
  return `<tr${bg ? ' style="background:#f4f4f5"' : ""}>
    <td style="padding:10px;font-weight:bold;color:#52525b;width:160px;">${label}</td>
    <td style="padding:10px;color:#18181b;">${value || "—"}</td>
  </tr>`;
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  let fields: Record<string, string> = {};
  let attachment: { filename: string; content: Buffer } | undefined;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      if (typeof value === "string") fields[key] = value;
    });
    const file = formData.get("attachment") as File | null;
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      attachment = { filename: file.name, content: buf };
    }
  } else {
    fields = await req.json();
  }

  const { name, email, phone, mode, company, nip, service, location, coopType, message, position, quizScore, fitPercent } = fields;

  if (!email) return NextResponse.json({ error: "Brak adresu email" }, { status: 400 });

  const modeLabel = MODELAB[mode] ?? mode ?? "Formularz kontaktowy";

  const rows = [
    row("Tryb", modeLabel),
    row("Imię i nazwisko", name, true),
    row("Email", email ? `<a href="mailto:${email}">${email}</a>` : ""),
    row("Telefon", phone, true),
    ...(company ? [row("Firma", company)] : []),
    ...(nip ? [row("NIP", nip, true)] : []),
    ...(service ? [row("Rodzaj prac", service)] : []),
    ...(location ? [row("Lokalizacja", location, true)] : []),
    ...(coopType ? [row("Rodzaj współpracy", coopType)] : []),
    ...(position ? [row("Stanowisko", position, true)] : []),
    ...(quizScore ? [row("Wynik quizu", `${quizScore} pkt (${fitPercent ?? ""})`)] : []),
    ...(message ? [row("Wiadomość", `<span style="white-space:pre-wrap">${message}</span>`, true)] : []),
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
        ...(attachment ? { attachments: [{ filename: attachment.filename, content: attachment.content }] } : {}),
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
