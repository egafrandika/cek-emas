import {
  getAvailableYears,
  getHistory,
  getHistoryCount,
  getHistoryForMonth,
  getHistoryForYear,
  isTursoConfigured,
  upsertTodayPrice,
} from "./db";
import { getDemoHistoryPayload, isDemoHistoryEnabled } from "./demo-history";
import { fetchSourcePrices, pickOneGramPrice } from "./prices";
import {
  buildUnlockedMap,
  isRangeReady,
  normalizeRange,
  pickDefaultRange,
  rangeRequired,
} from "./ranges";

export const HISTORY_SOURCE = "logammulia";
export const HISTORY_READY_DAYS = 30;
export { pickDefaultRange };

/**
 * Calendar date in Asia/Jakarta as YYYY-MM-DD.
 */
export function getJakartaDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function collectTodayPrice(source = HISTORY_SOURCE) {
  if (!isTursoConfigured()) {
    return {
      ok: false,
      configured: false,
      error: "Turso env is not configured",
    };
  }

  const data = await fetchSourcePrices(source);
  const oneGram = data.oneGram || pickOneGramPrice(data.items);

  if (!oneGram || oneGram.sellPrice == null) {
    return {
      ok: false,
      configured: true,
      error: "No 1g sell price available from upstream",
      source,
    };
  }

  const date = getJakartaDateString();
  await upsertTodayPrice({
    date,
    source,
    sell1g: Math.round(Number(oneGram.sellPrice)),
    buyback1g:
      oneGram.buybackPrice == null
        ? null
        : Math.round(Number(oneGram.buybackPrice)),
  });

  const count = await getHistoryCount(source);

  return {
    ok: true,
    configured: true,
    date,
    source,
    sell_1g: Math.round(Number(oneGram.sellPrice)),
    buyback_1g:
      oneGram.buybackPrice == null
        ? null
        : Math.round(Number(oneGram.buybackPrice)),
    count,
    ready: count >= HISTORY_READY_DAYS,
  };
}

async function getPointsForRange(source, range, year) {
  const today = getJakartaDateString();
  const currentYear = today.slice(0, 4);
  const currentMonth = today.slice(0, 7);

  if (range === "7d") return getHistory(source, 7);
  if (range === "30d") return getHistory(source, 30);
  if (range === "1m") return getHistoryForMonth(source, currentMonth);
  if (range === "year") {
    return getHistoryForYear(source, String(year || currentYear));
  }
  return getHistory(source, 30);
}

export async function getHistoryPayload({
  source = HISTORY_SOURCE,
  range = "30d",
  year = null,
} = {}) {
  const normalizedRange = normalizeRange(range);
  const today = getJakartaDateString();
  const currentYear = today.slice(0, 4);
  const selectedYear =
    normalizedRange === "year" ? String(year || currentYear) : null;

  if (isDemoHistoryEnabled()) {
    return getDemoHistoryPayload(normalizedRange, selectedYear);
  }

  if (!isTursoConfigured()) {
    return {
      configured: false,
      source,
      range: normalizedRange,
      year: selectedYear,
      years: [],
      count: 0,
      rangeCount: 0,
      ready: false,
      required: rangeRequired(normalizedRange),
      unlocked: buildUnlockedMap(0),
      defaultRange: pickDefaultRange(0),
      points: [],
      demo: false,
    };
  }

  try {
    const [count, years, points] = await Promise.all([
      getHistoryCount(source),
      getAvailableYears(source),
      getPointsForRange(source, normalizedRange, selectedYear),
    ]);

    const required = rangeRequired(normalizedRange);
    const ready = isRangeReady(normalizedRange, {
      count,
      pointsLength: points.length,
    });

    // Approximate unlock map for UI badges (1m/year need their own queries;
    // use current points length when that range is selected).
    const unlocked = buildUnlockedMap(count, {
      "7d": Math.min(count, 7),
      "30d": Math.min(count, 30),
      "1m": normalizedRange === "1m" ? points.length : 0,
      year: normalizedRange === "year" ? points.length : 0,
    });
    // 7D / 30D unlock from total count alone for tab hints
    unlocked["7d"] = count >= 7;
    unlocked["30d"] = count >= 30;
    if (normalizedRange === "1m") unlocked["1m"] = points.length >= 2;
    if (normalizedRange === "year") unlocked.year = points.length >= 2;

    return {
      configured: true,
      source,
      range: normalizedRange,
      year: selectedYear,
      years: years.length ? years : count > 0 ? [currentYear] : [],
      count,
      rangeCount: points.length,
      ready,
      required,
      unlocked,
      defaultRange: pickDefaultRange(count),
      points,
      demo: false,
    };
  } catch (error) {
    return {
      configured: false,
      source,
      range: normalizedRange,
      year: selectedYear,
      years: [],
      count: 0,
      rangeCount: 0,
      ready: false,
      required: rangeRequired(normalizedRange),
      unlocked: buildUnlockedMap(0),
      defaultRange: pickDefaultRange(0),
      points: [],
      demo: false,
      error: error.message || "History unavailable",
    };
  }
}
