"use client";

import { useState } from "react";
import GoldCalculator from "./GoldCalculator";

export default function HomeTabs({ children, priceMap, defaultSourceId }) {
  const [tab, setTab] = useState("harga");

  return (
    <div>
      <div
        className="mb-6 flex rounded-lg bg-surface p-1 ring-1 ring-line sm:hidden"
        role="tablist"
        aria-label="Tampilan beranda"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "harga"}
          onClick={() => setTab("harga")}
          className={`flex-1 rounded-md py-2 text-sm font-medium ${
            tab === "harga" ? "bg-ink text-paper" : "text-muted"
          }`}
        >
          Harga
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "kalkulator"}
          onClick={() => setTab("kalkulator")}
          className={`flex-1 rounded-md py-2 text-sm font-medium ${
            tab === "kalkulator" ? "bg-ink text-paper" : "text-muted"
          }`}
        >
          Kalkulator
        </button>
      </div>

      <div className={tab === "harga" ? "block" : "hidden sm:block"}>
        {children}
      </div>

      <div
        id="kalkulator"
        className={`scroll-mt-24 ${
          tab === "kalkulator" ? "mt-0 block" : "mt-10 hidden sm:block"
        }`}
      >
        <GoldCalculator
          priceMap={priceMap}
          defaultSourceId={defaultSourceId}
        />
      </div>
    </div>
  );
}
