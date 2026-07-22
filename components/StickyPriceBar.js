"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatIDR } from "@/lib/format";

export default function StickyPriceBar({ price, sourceName, updatedLabel }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (price == null) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/95 backdrop-blur transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">
            Harga 1g hari ini · {sourceName}
          </p>
          <p className="font-display text-lg leading-tight text-ink">
            {formatIDR(price)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs text-muted sm:inline">
            {updatedLabel}
          </span>
          <Link
            href="#bandingkan"
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-paper"
          >
            Bandingkan
          </Link>
        </div>
      </div>
    </div>
  );
}
