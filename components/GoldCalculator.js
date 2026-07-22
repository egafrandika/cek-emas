"use client";

import { useMemo, useState } from "react";
import { formatIDR, formatNumber, parseIDRInput } from "@/lib/format";
import { SOURCES } from "@/lib/sources";

export default function GoldCalculator({
  priceMap,
  defaultSourceId = "logammulia",
  compact = false,
}) {
  const available = useMemo(
    () =>
      SOURCES.filter((s) => priceMap?.[s.id] != null && priceMap[s.id] > 0),
    [priceMap]
  );

  const initialSource =
    available.find((s) => s.id === defaultSourceId)?.id ||
    available[0]?.id ||
    defaultSourceId;

  const [sourceId, setSourceId] = useState(initialSource);
  const [mode, setMode] = useState("uang-ke-gram");
  const [uang, setUang] = useState("");
  const [gram, setGram] = useState("1");

  const pricePerGram = priceMap?.[sourceId] || 0;

  const result = useMemo(() => {
    if (!pricePerGram) return null;
    if (mode === "uang-ke-gram") {
      const amount = parseIDRInput(uang);
      if (!amount || amount <= 0) return null;
      return {
        label: "Perkiraan gram",
        value: `${formatNumber(amount / pricePerGram, 4)} gram`,
      };
    }
    const g = Number(String(gram).replace(",", "."));
    if (!g || g <= 0) return null;
    return {
      label: "Perkiraan nilai",
      value: formatIDR(g * pricePerGram),
    };
  }, [mode, uang, gram, pricePerGram]);

  return (
    <div className={compact ? "" : "panel rounded-xl p-5 sm:p-6"}>
      {!compact && (
        <div className="mb-5">
          <h2 className="font-display text-2xl text-ink">Kalkulator emas</h2>
          <p className="mt-1 text-sm text-muted">
            Hitung cepat berdasarkan harga 1 gram sumber yang dipilih.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {SOURCES.map((s) => {
          const disabled = !priceMap?.[s.id];
          const active = sourceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={disabled}
              onClick={() => setSourceId(s.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-accent text-paper"
                  : "bg-paper text-ink ring-1 ring-line hover:bg-accent-soft/50"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {s.shortName}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("uang-ke-gram")}
          className={`flex-1 rounded-md px-3 py-2 text-sm ${
            mode === "uang-ke-gram"
              ? "bg-ink text-paper"
              : "bg-paper text-muted ring-1 ring-line"
          }`}
        >
          Uang → Gram
        </button>
        <button
          type="button"
          onClick={() => setMode("gram-ke-uang")}
          className={`flex-1 rounded-md px-3 py-2 text-sm ${
            mode === "gram-ke-uang"
              ? "bg-ink text-paper"
              : "bg-paper text-muted ring-1 ring-line"
          }`}
        >
          Gram → Uang
        </button>
      </div>

      <p className="mt-4 text-xs text-muted">
        Acuan 1 gram:{" "}
        <span className="font-medium text-ink">
          {pricePerGram ? formatIDR(pricePerGram) : "Tidak tersedia"}
        </span>
      </p>

      {mode === "uang-ke-gram" ? (
        <label className="mt-4 block">
          <span className="text-sm text-muted">Jumlah uang (Rp)</span>
          <input
            inputMode="numeric"
            value={uang}
            onChange={(e) => setUang(e.target.value)}
            placeholder="Contoh: 5000000"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-ink outline-none ring-accent focus:ring-2"
          />
        </label>
      ) : (
        <label className="mt-4 block">
          <span className="text-sm text-muted">Jumlah gram</span>
          <input
            inputMode="decimal"
            value={gram}
            onChange={(e) => setGram(e.target.value)}
            placeholder="Contoh: 5"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-ink outline-none ring-accent focus:ring-2"
          />
        </label>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {result?.label || "Hasil"}
        </p>
        <p className="mt-1 font-display text-2xl text-ink animate-priceIn">
          {result?.value || "—"}
        </p>
        <p className="mt-2 text-xs text-muted">
          Estimasi saja. Harga final bisa berbeda di tempat transaksi.
        </p>
      </div>
    </div>
  );
}
