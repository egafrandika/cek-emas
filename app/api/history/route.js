import { NextResponse } from "next/server";
import {
  getHistoryPayload,
  HISTORY_READY_DAYS,
  HISTORY_SOURCE,
} from "@/lib/history";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || HISTORY_SOURCE;
  const days = Math.min(
    90,
    Math.max(1, Number(searchParams.get("days")) || HISTORY_READY_DAYS)
  );

  try {
    const payload = await getHistoryPayload(source, days);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        source,
        count: 0,
        ready: false,
        required: HISTORY_READY_DAYS,
        points: [],
        error: error.message || "History unavailable",
      },
      { status: 500 }
    );
  }
}
