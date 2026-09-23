"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatIDR } from "@/lib/format";
import { HISTORY_RANGES } from "@/lib/ranges";

function formatShortDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

function formatFullDate(isoDate) {
  if (!isoDate) return "—";
  const date = new Date(`${isoDate}T12:00:00+07:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatAxisPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}jt`;
  }
  return formatIDR(n);
}

function niceTicks(min, max, count = 4) {
  if (max === min) {
    return [min - 1, min, min + 1];
  }
  const span = max - min;
  const step = span / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

function rangeTitle(range, year) {
  if (range === "7d") return "Grafik harga 7 hari";
  if (range === "30d") return "Grafik harga 30 hari";
  if (range === "year") return `Grafik harga tahun ${year || ""}`.trim();
  return "Grafik harga emas";
}

export default function PriceHistoryChart({
  initialHistory,
  sourceId = "logammulia",
  sourceName = "Logam Mulia",
}) {
  const [range, setRange] = useState(initialHistory?.range || "30d");
  const [year, setYear] = useState(
    initialHistory?.year ||
      initialHistory?.years?.[initialHistory.years.length - 1] ||
      String(new Date().getFullYear())
  );
  const [payload, setPayload] = useState(initialHistory);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const svgRef = useRef(null);

  const denseMode = range === "year" || (payload?.points?.length || 0) > 60;
  const unlocked = payload?.unlocked || {};

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setActiveIndex(null);

      // Only wipe the series when the visible payload belongs to another filter.
      setPayload((prev) => {
        const sameRange =
          prev?.range === range &&
          (range !== "year" || String(prev?.year || "") === String(year || ""));
        if (sameRange) return prev;
        return {
          ...(prev || {}),
          range,
          year: range === "year" ? year : null,
          ready: false,
          points: [],
          rangeCount: 0,
        };
      });

      try {
        const params = new URLSearchParams({
          source: sourceId,
          range,
        });
        if (range === "year" && year) params.set("year", year);
        const res = await fetch(`/api/history?${params.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) setPayload(data);
      } catch {
        if (!cancelled) {
          setPayload((prev) => ({
            ...(prev || {}),
            ready: false,
            points: [],
            error: "Gagal memuat grafik",
          }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [range, year, sourceId]);

  const points = payload?.points || [];
  const ready = Boolean(payload?.ready);
  const configured = payload?.configured !== false;
  const demo = Boolean(payload?.demo);
  const count = payload?.count || 0;
  const required = payload?.required || 30;
  const years = payload?.years || [];
  const rangeCount = payload?.rangeCount || points.length;

  const chart = useMemo(() => {
    if (!ready || points.length < 2) return null;

    const width = 640;
    const height = 260;
    const pad = { top: 16, right: 16, bottom: 36, left: 58 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const values = points.map((p) => p.sell1g);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const padValue = Math.max((dataMax - dataMin) * 0.08, 5000);
    const min = dataMin - padValue;
    const max = dataMax + padValue;
    const valueRange = Math.max(max - min, 1);

    const yTicks = niceTicks(min, max, 5);
    const xTickIndexes = [
      0,
      Math.round((points.length - 1) / 3),
      Math.round(((points.length - 1) * 2) / 3),
      points.length - 1,
    ].filter((v, i, arr) => arr.indexOf(v) === i);

    const coords = points.map((p, i) => {
      const x = pad.left + (i / Math.max(points.length - 1, 1)) * plotW;
      const y = pad.top + plotH - ((p.sell1g - min) / valueRange) * plotH;
      return { x, y, index: i, ...p };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");

    const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${(
      pad.top + plotH
    ).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(pad.top + plotH).toFixed(
      1
    )} Z`;

    return {
      width,
      height,
      pad,
      plotW,
      plotH,
      coords,
      line,
      area,
      min,
      max,
      yTicks,
      xTickIndexes,
    };
  }, [points, ready]);

  if (!configured && !demo) {
    return null;
  }

  const active =
    chart && activeIndex != null ? chart.coords[activeIndex] : null;

  const tooltipStyle = (() => {
    if (!active || !chart) return null;
    const leftPct = (active.x / chart.width) * 100;
    const topPct = (active.y / chart.height) * 100;
    const preferLeft = leftPct > 72;
    return {
      left: `${leftPct}%`,
      top: `${topPct}%`,
      transform: preferLeft
        ? "translate(-108%, -120%)"
        : "translate(8%, -120%)",
    };
  })();

  return (
    <section className="mt-12 scroll-mt-24" id="grafik" aria-labelledby="grafik-heading">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="grafik-heading"
              className="font-display text-2xl text-ink sm:text-3xl"
            >
              {rangeTitle(range, year)}
            </h2>
            {demo && (
              <span className="rounded-md bg-accent-soft/60 px-2 py-0.5 text-xs font-medium text-ink">
                Simulasi
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            Tren harga jual 1 gram · {sourceName}
            {demo ? " (data contoh)" : ""}
            {" · "}
            {denseMode
              ? "Geser di garis untuk detail harga"
              : "Arahkan ke titik untuk detail"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex rounded-lg bg-surface p-1 ring-1 ring-line"
            role="tablist"
            aria-label="Rentang grafik"
          >
            {HISTORY_RANGES.map((item) => {
              const activeRange = range === item.id;
              const isUnlocked =
                payload?.demo || unlocked[item.id] === true;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeRange}
                  disabled={!isUnlocked}
                  title={
                    isUnlocked
                      ? item.label
                      : `Terkunci — butuh ${item.required} hari data`
                  }
                  onClick={() => {
                    if (!isUnlocked || item.id === range) return;
                    setRange(item.id);
                  }}
                  className={`rounded-md px-3 py-1.5 text-sm transition disabled:cursor-not-allowed ${
                    activeRange
                      ? "bg-ink text-paper"
                      : isUnlocked
                        ? "text-muted hover:text-ink"
                        : "text-muted/45"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {range === "year" && (
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only">Pilih tahun</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-md border border-line bg-paper px-2.5 py-1.5 text-ink outline-none ring-accent focus:ring-2"
              >
                {(years.length ? years : [year]).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="panel rounded-xl p-5 sm:p-6">
        {loading && !ready ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-muted">
            Memuat grafik…
          </div>
        ) : !ready ? (
          <div>
            <p className="text-sm leading-relaxed text-ink">
              {range === "7d"
                ? `Grafik 7D aktif setelah ${required} hari data terkumpul (${count}/${required}).`
                : range === "30d"
                  ? `Grafik 30D aktif setelah ${required} hari data terkumpul (${count}/${required}).`
                  : `Rentang ini aktif setelah cukup data (${count}/${required}).`}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper ring-1 ring-line">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{
                  width: `${Math.min(100, (count / Math.max(required, 1)) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Filter tidak dihapus. 7D bisa dibuka lebih dulu; 30D menyusul saat
              data mencapai 30 hari. Harga hari ini tetap bisa dicek di atas.
            </p>
          </div>
        ) : (
          <div>
            <div
              className="relative"
              onMouseLeave={() => setActiveIndex(null)}
            >
              <svg
                key={`${range}-${rangeCount}-${points[0]?.date || ""}-${points[points.length - 1]?.date || ""}`}
                ref={svgRef}
                viewBox={`0 0 ${chart.width} ${chart.height}`}
                className="h-auto w-full animate-priceIn touch-pan-y"
                role="img"
                aria-label={`${rangeTitle(range, year)} ${sourceName}`}
                onMouseMove={(e) => {
                  if (!chart || !denseMode) return;
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const x =
                    ((e.clientX - rect.left) / rect.width) * chart.width;
                  let nearest = 0;
                  let best = Infinity;
                  for (let i = 0; i < chart.coords.length; i += 1) {
                    const dist = Math.abs(chart.coords[i].x - x);
                    if (dist < best) {
                      best = dist;
                      nearest = i;
                    }
                  }
                  setActiveIndex(nearest);
                }}
                onClick={(e) => {
                  if (!chart || !denseMode) return;
                  const svg = svgRef.current;
                  if (!svg) return;
                  const rect = svg.getBoundingClientRect();
                  const x =
                    ((e.clientX - rect.left) / rect.width) * chart.width;
                  let nearest = 0;
                  let best = Infinity;
                  for (let i = 0; i < chart.coords.length; i += 1) {
                    const dist = Math.abs(chart.coords[i].x - x);
                    if (dist < best) {
                      best = dist;
                      nearest = i;
                    }
                  }
                  setActiveIndex(nearest);
                }}
              >
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B0892F" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#B0892F" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                <rect
                  x={chart.pad.left}
                  y={chart.pad.top}
                  width={chart.plotW}
                  height={chart.plotH}
                  fill="#FFFCFA"
                  stroke="rgba(26,28,30,0.12)"
                  strokeWidth="1"
                />

                {chart.yTicks.map((tick) => {
                  const y =
                    chart.pad.top +
                    chart.plotH -
                    ((tick - chart.min) / (chart.max - chart.min)) *
                      chart.plotH;
                  return (
                    <g key={`y-${tick}`}>
                      <line
                        x1={chart.pad.left}
                        x2={chart.pad.left + chart.plotW}
                        y1={y}
                        y2={y}
                        stroke="rgba(26,28,30,0.1)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chart.pad.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="10"
                        fill="#5C6166"
                      >
                        {formatAxisPrice(tick)}
                      </text>
                    </g>
                  );
                })}

                {chart.xTickIndexes.map((idx) => {
                  const c = chart.coords[idx];
                  if (!c) return null;
                  return (
                    <g key={`x-${c.date}`}>
                      <line
                        x1={c.x}
                        x2={c.x}
                        y1={chart.pad.top}
                        y2={chart.pad.top + chart.plotH}
                        stroke="rgba(26,28,30,0.08)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={c.x}
                        y={chart.pad.top + chart.plotH + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#5C6166"
                      >
                        {formatShortDate(c.date)}
                      </text>
                    </g>
                  );
                })}

                <path d={chart.area} fill="url(#goldArea)" />
                <path
                  d={chart.line}
                  fill="none"
                  stroke="#B0892F"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={denseMode ? "pointer-events-none" : undefined}
                />

                {active && (
                  <>
                    <line
                      x1={active.x}
                      x2={active.x}
                      y1={chart.pad.top}
                      y2={chart.pad.top + chart.plotH}
                      stroke="#B0892F"
                      strokeWidth="1.25"
                      strokeOpacity="0.55"
                      className="pointer-events-none"
                    />
                    <circle
                      cx={active.x}
                      cy={active.y}
                      r="5.5"
                      fill="#B0892F"
                      stroke="#F7F4EF"
                      strokeWidth="2"
                      className="pointer-events-none"
                    />
                  </>
                )}

                {!denseMode &&
                  chart.coords.map((c) => {
                    const isActive = activeIndex === c.index;
                    return (
                      <g key={c.date}>
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="14"
                          fill="transparent"
                          className="cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
                          style={{ outline: "none" }}
                          onMouseEnter={() => setActiveIndex(c.index)}
                          onFocus={() => setActiveIndex(c.index)}
                          onClick={(e) => {
                            e.currentTarget.blur();
                            setActiveIndex((prev) =>
                              prev === c.index ? null : c.index
                            );
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`${formatFullDate(c.date)}: ${formatIDR(c.sell1g)}`}
                        />
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={isActive ? 5.5 : 3}
                          fill={isActive ? "#B0892F" : "#F7F4EF"}
                          stroke="#B0892F"
                          strokeWidth="1.5"
                          className="pointer-events-none transition-all"
                        />
                      </g>
                    );
                  })}

                {denseMode && (
                  <rect
                    x={chart.pad.left}
                    y={chart.pad.top}
                    width={chart.plotW}
                    height={chart.plotH}
                    fill="transparent"
                    className="cursor-crosshair"
                  />
                )}
              </svg>

              {active && tooltipStyle && (
                <div
                  className="pointer-events-none absolute z-10 min-w-[10.5rem] rounded-md border border-line bg-ink px-3 py-2 text-paper shadow-panel"
                  style={tooltipStyle}
                  role="tooltip"
                >
                  <p className="text-[11px] uppercase tracking-wide text-paper/60">
                    {formatFullDate(active.date)}
                  </p>
                  <p className="mt-1 font-display text-lg leading-tight text-paper">
                    {formatIDR(active.sell1g)}
                  </p>
                  {active.buyback1g != null && (
                    <p className="mt-1 text-xs text-paper/70">
                      Buyback {formatIDR(active.buyback1g)}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-accent-soft">
                    1 gram · {sourceName}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
              <p className="font-display text-lg text-ink">
                Terakhir: {formatIDR(points[points.length - 1]?.sell1g)}
              </p>
              <p className="text-xs text-muted">{rangeCount} titik data</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
