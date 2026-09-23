import { NextResponse } from "next/server";
import {
  getHistoryPayload,
  HISTORY_READY_DAYS,
  HISTORY_SOURCE,
} from "@/lib/history";
import { normalizeRange } from "@/lib/ranges";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || HISTORY_SOURCE;
  const range = normalizeRange(searchParams.get("range") || "30d");
  const year = searchParams.get("year");

  try {
    const payload = await getHistoryPayload({ source, range, year });
    return NextResponse.json(payload, {
      headers: {
        // Avoid serving a previous range body when the filter changes.
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        source,
        range,
        year: null,
        years: [],
        count: 0,
        rangeCount: 0,
        ready: false,
        required: HISTORY_READY_DAYS,
        points: [],
        error: error.message || "History unavailable",
      },
      { status: 500 }
    );
  }
}
