import {
  getHistory,
  getHistoryCount,
  isTursoConfigured,
  upsertTodayPrice,
} from "./db";
import { fetchSourcePrices, pickOneGramPrice } from "./prices";

export const HISTORY_SOURCE = "logammulia";
export const HISTORY_READY_DAYS = 30;

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

export async function getHistoryPayload(
  source = HISTORY_SOURCE,
  days = HISTORY_READY_DAYS
) {
  if (!isTursoConfigured()) {
    return {
      configured: false,
      source,
      count: 0,
      ready: false,
      required: HISTORY_READY_DAYS,
      points: [],
    };
  }

  try {
    const [count, points] = await Promise.all([
      getHistoryCount(source),
      getHistory(source, days),
    ]);

    return {
      configured: true,
      source,
      count,
      ready: count >= HISTORY_READY_DAYS,
      required: HISTORY_READY_DAYS,
      points,
    };
  } catch (error) {
    return {
      configured: false,
      source,
      count: 0,
      ready: false,
      required: HISTORY_READY_DAYS,
      points: [],
      error: error.message || "History unavailable",
    };
  }
}
