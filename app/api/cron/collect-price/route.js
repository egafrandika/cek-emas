import { NextResponse } from "next/server";
import { collectTodayPrice, HISTORY_SOURCE } from "@/lib/history";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;

  // Vercel Cron sends this header when CRON_SECRET is set in project
  const cronHeader = request.headers.get("x-vercel-cron-secret");
  if (cronHeader && cronHeader === secret) return true;

  const url = new URL(request.url);
  if (url.searchParams.get("secret") === secret) return true;

  return false;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await collectTodayPrice(HISTORY_SOURCE);
    const status = result.ok ? 200 : result.configured === false ? 503 : 502;
    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message || "Collect failed" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}
