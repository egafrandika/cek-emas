"use client";

import { useMemo } from "react";
import { formatIDR } from "@/lib/format";

function formatShortDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

export default function PriceHistoryChart({
  points = [],
  count = 0,
  required = 30,
  ready = false,
  configured = true,
  sourceName = "Logam Mulia",
}) {
  const chart = useMemo(() => {
    if (!ready || points.length < 2) return null;

    const width = 640;
    const height = 220;
    const padX = 16;
    const padY = 20;
    const values = points.map((p) => p.sell1g);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    const coords = points.map((p, i) => {
      const x =
        padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
      const y =
        height - padY - ((p.sell1g - min) / range) * (height - padY * 2);
      return { x, y, ...p };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");

    const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${
      height - padY
    } L ${coords[0].x.toFixed(1)} ${height - padY} Z`;

    return { width, height, coords, line, area, min, max };
  }, [points, ready]);

  if (!configured) {
    return null;
  }

  return (
    <section className="mt-12 scroll-mt-24" id="grafik" aria-labelledby="grafik-heading">
      <div className="mb-4">
        <h2 id="grafik-heading" className="font-display text-2xl text-ink sm:text-3xl">
          Grafik harga 30 hari
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tren harga jual 1 gram · {sourceName}
        </p>
      </div>

      <div className="panel rounded-xl p-5 sm:p-6">
        {!ready ? (
          <div>
            <p className="text-sm leading-relaxed text-ink">
              Grafik 30 hari tersedia setelah data terkumpul ({count}/{required}{" "}
              hari).
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper ring-1 ring-line">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{
                  width: `${Math.min(100, (count / required) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Data dikumpulkan otomatis setiap hari. Harga hari ini tetap bisa
              dicek di atas.
            </p>
          </div>
        ) : (
          <div>
            <svg
              viewBox={`0 0 ${chart.width} ${chart.height}`}
              className="h-auto w-full animate-priceIn"
              role="img"
              aria-label={`Grafik harga emas 1 gram ${sourceName} 30 hari terakhir`}
            >
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B0892F" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#B0892F" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={chart.area} fill="url(#goldArea)" />
              <path
                d={chart.line}
                fill="none"
                stroke="#B0892F"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {chart.coords.map((c) => (
                <circle
                  key={c.date}
                  cx={c.x}
                  cy={c.y}
                  r="3"
                  fill="#F7F4EF"
                  stroke="#B0892F"
                  strokeWidth="1.5"
                >
                  <title>
                    {c.date}: {formatIDR(c.sell1g)}
                  </title>
                </circle>
              ))}
            </svg>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
              <span>{formatShortDate(points[0]?.date)}</span>
              <span>
                {formatIDR(chart.min)} – {formatIDR(chart.max)}
              </span>
              <span>{formatShortDate(points[points.length - 1]?.date)}</span>
            </div>

            <p className="mt-4 text-lg font-display text-ink">
              Terakhir: {formatIDR(points[points.length - 1]?.sell1g)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
