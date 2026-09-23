"use client";

import { useMemo, useState } from "react";
import { formatIDR, formatNumber, parseIDRInput } from "@/lib/format";
import { SOURCES } from "@/lib/sources";

export default function GoldCalculator({
  priceMap,
  defaultSourceId = "logammulia",
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

  const selectedSource =
    SOURCES.find((s) => s.id === sourceId) || SOURCES[0];
  const pricePerGram = priceMap?.[sourceId] || 0;

  const result = useMemo(() => {
    if (!pricePerGram) return null;
    if (mode === "uang-ke-gram") {
      const amount = parseIDRInput(uang);
      if (!amount || amount <= 0) return null;
      return {
        label: "Perkiraan gram",
        value: `${formatNumber(amount / pricePerGram, 4)} gram`,
        hint: `dari ${formatIDR(amount)}`,
      };
    }
    const g = Number(String(gram).replace(",", "."));
    if (!g || g <= 0) return null;
    return {
      label: "Perkiraan nilai",
      value: formatIDR(g * pricePerGram),
      hint: `untuk ${formatNumber(g, 4)} gram`,
    };
  }, [mode, uang, gram, pricePerGram]);

  return (
    <div className="panel overflow-hidden rounded-xl">
      <div className="grid lg:grid-cols-12">
        <div className="space-y-6 p-5 sm:p-7 lg:col-span-7 lg:border-r lg:border-line">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Sumber acuan
            </p>
            <div
              className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-paper p-1 ring-1 ring-line"
              role="tablist"
              aria-label="Sumber harga"
            >
              {SOURCES.map((s) => {
                const disabled = !priceMap?.[s.id];
                const active = sourceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    disabled={disabled}
                    onClick={() => setSourceId(s.id)}
                    className={`rounded-md px-2 py-2.5 text-center text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? "bg-ink text-paper"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <span className="sm:hidden">{s.shortName}</span>
                    <span className="hidden sm:inline">{s.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-muted">
              Harga 1 gram {selectedSource.name}:{" "}
              <span className="font-medium text-ink">
                {pricePerGram ? formatIDR(pricePerGram) : "Tidak tersedia"}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Mode hitung
            </p>
            <div
              className="mt-3 flex gap-1 rounded-lg bg-paper p-1 ring-1 ring-line"
              role="tablist"
              aria-label="Mode kalkulator"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "uang-ke-gram"}
                onClick={() => setMode("uang-ke-gram")}
                className={`flex-1 rounded-md px-3 py-2.5 text-sm transition ${
                  mode === "uang-ke-gram"
                    ? "bg-ink text-paper"
                    : "text-muted hover:text-ink"
                }`}
              >
                Uang → Gram
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "gram-ke-uang"}
                onClick={() => setMode("gram-ke-uang")}
                className={`flex-1 rounded-md px-3 py-2.5 text-sm transition ${
                  mode === "gram-ke-uang"
                    ? "bg-ink text-paper"
                    : "text-muted hover:text-ink"
                }`}
              >
                Gram → Uang
              </button>
            </div>
          </div>

          {mode === "uang-ke-gram" ? (
            <label className="block">
              <span className="text-sm text-muted">Jumlah uang (Rp)</span>
              <input
                inputMode="numeric"
                value={uang}
                onChange={(e) => setUang(e.target.value)}
                placeholder="Contoh: 5.000.000"
                className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3.5 font-display text-2xl text-ink outline-none ring-accent placeholder:font-sans placeholder:text-base placeholder:text-muted/70 focus:ring-2"
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-sm text-muted">Jumlah gram</span>
              <input
                inputMode="decimal"
                value={gram}
                onChange={(e) => setGram(e.target.value)}
                placeholder="Contoh: 5"
                className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3.5 font-display text-2xl text-ink outline-none ring-accent placeholder:font-sans placeholder:text-base placeholder:text-muted/70 focus:ring-2"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col justify-between bg-accent-soft/25 p-5 sm:p-7 lg:col-span-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {result?.label || "Hasil estimasi"}
            </p>
            <p
              className="mt-3 font-display text-3xl leading-tight text-ink animate-priceIn sm:text-4xl lg:text-[2.75rem]"
              aria-live="polite"
            >
              {result?.value || "—"}
            </p>
            {result?.hint ? (
              <p className="mt-3 text-sm text-muted">{result.hint}</p>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Masukkan nilai di sebelah kiri untuk melihat hasil.
              </p>
            )}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted lg:mt-10">
            Estimasi berdasarkan harga jual 1 gram {selectedSource.name}. Harga
            final di kasir atau aplikasi bisa berbeda.
          </p>
        </div>
      </div>
    </div>
  );
}
