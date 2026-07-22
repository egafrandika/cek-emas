import { NextResponse } from "next/server";
import { SOURCES } from "@/lib/sources";
import { fetchAllSources, fetchSourcePrices } from "@/lib/prices";

export const revalidate = 600;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  if (source) {
    const allowed = SOURCES.some((s) => s.id === source);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Sumber tidak dikenali" },
        { status: 400 }
      );
    }

    const data = await fetchSourcePrices(source);
    const status = data.success ? 200 : 502;
    return NextResponse.json(data, {
      status,
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      },
    });
  }

  const all = await fetchAllSources();
  return NextResponse.json(
    {
      success: all.anySuccess,
      updatedAt: all.updatedAt,
      anyStale: all.anyStale,
      sources: all.results,
    },
    {
      status: all.anySuccess ? 200 : 502,
      headers: {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=300",
      },
    }
  );
}
