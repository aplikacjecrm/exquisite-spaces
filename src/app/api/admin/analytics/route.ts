import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://yinnyzflmywiplluyyhl.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session")?.value;
  const expected = Buffer.from(`admin:${process.env.ADMIN_PASSWORD ?? ""}`).toString("base64");
  return !!session && session === expected && !!process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SUPABASE_KEY) {
    return NextResponse.json({ error: "Analytics not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 500), 2000);

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_analytics?order=ts.desc&limit=${limit}`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Supabase error:", err);
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
