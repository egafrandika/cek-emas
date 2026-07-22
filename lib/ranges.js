export const HISTORY_RANGES = [
  { id: "7d", label: "7D", required: 7 },
  { id: "30d", label: "30D", required: 30 },
  { id: "1m", label: "1 Bln", required: 2 },
  { id: "year", label: "Tahun", required: 2 },
];

export function normalizeRange(range) {
  const allowed = new Set(HISTORY_RANGES.map((r) => r.id));
  return allowed.has(range) ? range : "30d";
}

export function rangeRequired(range) {
  return HISTORY_RANGES.find((r) => r.id === range)?.required || 30;
}

/**
 * Unlock rules (filters are never removed):
 * - 7D: total collected days >= 7
 * - 30D: total collected days >= 30
 * - 1 Bln / Tahun: at least 2 points in that filtered range
 */
export function isRangeReady(range, { count = 0, pointsLength = 0 } = {}) {
  if (range === "7d") return count >= 7 && pointsLength >= 2;
  if (range === "30d") return count >= 30 && pointsLength >= 2;
  if (range === "1m" || range === "year") return pointsLength >= 2;
  return pointsLength >= 2;
}

/** Prefer an already-unlocked range for first paint. */
export function pickDefaultRange(count = 0) {
  if (count >= 30) return "30d";
  if (count >= 7) return "7d";
  return "7d";
}

export function buildUnlockedMap(count, pointsByRangeLengths = {}) {
  return {
    "7d": isRangeReady("7d", {
      count,
      pointsLength: pointsByRangeLengths["7d"] ?? count,
    }),
    "30d": isRangeReady("30d", {
      count,
      pointsLength: pointsByRangeLengths["30d"] ?? count,
    }),
    "1m": isRangeReady("1m", {
      count,
      pointsLength: pointsByRangeLengths["1m"] ?? 0,
    }),
    year: isRangeReady("year", {
      count,
      pointsLength: pointsByRangeLengths.year ?? 0,
    }),
  };
}
