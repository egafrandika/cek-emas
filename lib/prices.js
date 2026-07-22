import { SOURCES, DEFAULT_SOURCE } from "./sources";

const API_BASE =
  "https://logam-mulia-api.iamutaki.workers.dev/api/prices";

const REVALIDATE_SECONDS = 600; // 10 minutes

/** @type {Map<string, { data: object, fetchedAt: string }>} */
const memoryCache = new Map();

/**
 * Pick the best 1g gold row for hero display.
 * Prefer Antam / Emas Batangan style entries at 1 gram.
 */
export function pickOneGramPrice(items = []) {
  const gold = items.filter(
    (item) =>
      item.material === "gold" &&
      Number(item.weight) === 1 &&
      item.sellPrice != null
  );

  if (!gold.length) return null;

  const preferred = gold.find((item) => {
    const type = String(item.materialType || "").toLowerCase();
    return (
      type.includes("antam") ||
      type.includes("emas batangan") ||
      type.includes("logam mulia")
    );
  });

  return preferred || gold[0];
}

export function normalizeItems(payload, sourceId) {
  const items = Array.isArray(payload?.data) ? payload.data : [];
  return items.map((item) => ({
    ...item,
    source: item.source || sourceId,
    sellPrice: item.sellPrice != null ? Number(item.sellPrice) : null,
    buybackPrice:
      item.buybackPrice != null ? Number(item.buybackPrice) : null,
    weight: item.weight != null ? Number(item.weight) : null,
  }));
}

async function fetchSourceRaw(sourceId) {
  const res = await fetch(`${API_BASE}/${sourceId}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Upstream ${sourceId} returned ${res.status}`);
  }

  return res.json();
}

export async function fetchSourcePrices(sourceId) {
  try {
    const payload = await fetchSourceRaw(sourceId);
    const items = normalizeItems(payload, sourceId);
    const result = {
      success: true,
      source: sourceId,
      items,
      count: items.length,
      timestamp: payload.timestamp || new Date().toISOString(),
      cached: Boolean(payload.cached),
      stale: false,
      oneGram: pickOneGramPrice(items),
    };
    memoryCache.set(sourceId, {
      data: result,
      fetchedAt: result.timestamp,
    });
    return result;
  } catch (error) {
    const stale = memoryCache.get(sourceId);
    if (stale?.data) {
      return {
        ...stale.data,
        success: true,
        stale: true,
        error: error.message,
      };
    }
    return {
      success: false,
      source: sourceId,
      items: [],
      count: 0,
      timestamp: null,
      cached: false,
      stale: false,
      oneGram: null,
      error: error.message,
    };
  }
}

export async function fetchAllSources(sourceIds = SOURCES.map((s) => s.id)) {
  const results = await Promise.all(
    sourceIds.map((id) => fetchSourcePrices(id))
  );

  const bySource = {};
  for (const result of results) {
    bySource[result.source] = result;
  }

  const primary =
    bySource[DEFAULT_SOURCE]?.oneGram ||
    results.find((r) => r.oneGram)?.oneGram ||
    null;

  const updatedAt =
    results
      .map((r) => r.timestamp)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null;

  return {
    bySource,
    results,
    primary,
    updatedAt,
    anyStale: results.some((r) => r.stale),
    anySuccess: results.some((r) => r.success && r.items.length),
  };
}

export function buildCompareRows(bySource) {
  return SOURCES.map((source) => {
    const data = bySource[source.id];
    const oneGram = data?.oneGram || null;
    return {
      source,
      oneGram,
      sellPrice: oneGram?.sellPrice ?? null,
      buybackPrice: oneGram?.buybackPrice ?? null,
      materialType: oneGram?.materialType ?? null,
      recordedDate: oneGram?.recordedDate ?? null,
      timestamp: data?.timestamp ?? null,
      stale: Boolean(data?.stale),
      success: Boolean(data?.success && oneGram),
    };
  });
}
