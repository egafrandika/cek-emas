export const DEMO_SOURCE = "logammulia";

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

function shiftJakartaDate(daysBack, from = new Date()) {
  const today = getJakartaDateString(from);
  const [y, m, d] = today.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, 5, 0, 0));
  utc.setUTCDate(utc.getUTCDate() - daysBack);
  return getJakartaDateString(utc);
}

/**
 * Deterministic fake 1g price for a day index (0 = oldest in series).
 */
function priceForIndex(i) {
  const base = 2_350_000;
  const trend = i * 650;
  const wave = Math.sin(i / 9) * 45_000;
  const weekly = Math.cos(i / 3.2) * 18_000;
  return Math.round(base + trend + wave + weekly);
}

/**
 * Build ~400 days of dummy history ending today (covers prior year + current).
 */
export function buildFullDemoSeries(totalDays = 400) {
  const points = [];
  for (let daysBack = totalDays - 1; daysBack >= 0; daysBack -= 1) {
    const index = totalDays - 1 - daysBack;
    const date = shiftJakartaDate(daysBack);
    const sell1g = priceForIndex(index);
    points.push({
      date,
      source: DEMO_SOURCE,
      sell1g,
      buyback1g: Math.round(sell1g * 0.96),
      createdAt: `${date}T02:00:00.000Z`,
    });
  }
  return points;
}

let cachedSeries = null;

export function getFullDemoSeries() {
  if (!cachedSeries) cachedSeries = buildFullDemoSeries(400);
  return cachedSeries;
}

export function getDemoAvailableYears() {
  const years = new Set(getFullDemoSeries().map((p) => p.date.slice(0, 4)));
  return Array.from(years).sort();
}

export function filterDemoPoints(range = "30d", year = null) {
  const all = getFullDemoSeries();
  const today = getJakartaDateString();
  const [ty, tm] = today.split("-");

  if (range === "7d") {
    return all.slice(-7);
  }
  if (range === "30d") {
    return all.slice(-30);
  }
  if (range === "1m") {
    const prefix = `${ty}-${tm}`;
    return all.filter((p) => p.date.startsWith(prefix));
  }
  if (range === "year") {
    const y = String(year || ty);
    return all.filter((p) => p.date.startsWith(`${y}-`));
  }
  return all.slice(-30);
}

export function getDemoHistoryPayload(range = "30d", year = null) {
  const points = filterDemoPoints(range, year);
  const years = getDemoAvailableYears();
  const currentYear = getJakartaDateString().slice(0, 4);
  const count = getFullDemoSeries().length;

  return {
    configured: true,
    source: DEMO_SOURCE,
    range,
    year: range === "year" ? String(year || currentYear) : null,
    years,
    count,
    rangeCount: points.length,
    ready: points.length >= 2,
    required: range === "7d" ? 7 : range === "30d" ? 30 : 2,
    unlocked: {
      "7d": true,
      "30d": true,
      "1m": true,
      year: true,
    },
    defaultRange: "30d",
    points,
    demo: true,
  };
}

export function isDemoHistoryEnabled() {
  return process.env.DEMO_HISTORY === "1" || process.env.DEMO_HISTORY === "true";
}
