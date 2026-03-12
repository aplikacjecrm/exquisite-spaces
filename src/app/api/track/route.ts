import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://yinnyzflmywiplluyyhl.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/* Rate limit tracking calls — separate from contact form limit */
const TRACK_RATE = new Map<string, number>();
function checkTrackRate(ip: string): boolean {
  const now = Date.now();
  const last = TRACK_RATE.get(ip) ?? 0;
  if (now - last < 1000) return false; // max 1 event/s per IP
  TRACK_RATE.set(ip, now);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkTrackRate(ip)) return NextResponse.json({ ok: true }); // silent drop

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: true }); }

  const event = String(body.event ?? "pageview").slice(0, 32);
  const path  = String(body.path  ?? "/").slice(0, 256);
  const referrer = String(body.referrer ?? "").slice(0, 256);
  const ua = req.headers.get("user-agent")?.slice(0, 256) ?? "";
  const data = body.data ?? null;

  // Skip if Supabase not configured
  if (!SUPABASE_KEY) {
    return NextResponse.json({ ok: true });
  }

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/site_analytics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ event, path, referrer, ua, ip, data }),
    });
  } catch {
    // Silent fail — analytics are non-critical
  }

  return NextResponse.json({ ok: true });
}
