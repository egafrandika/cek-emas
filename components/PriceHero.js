import Link from "next/link";
import { formatIDR, formatUpdatedAt } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";

export default function PriceHero({
  brandAsH1 = true,
  headline = "Cek harga emas hari ini",
  price,
  sourceName,
  updatedAt,
  stale = false,
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-atmosphere" />
      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
        {brandAsH1 ? (
          <h1 className="font-display text-5xl leading-none tracking-tight text-ink sm:text-6xl md:text-7xl">
            {SITE_NAME}
          </h1>
        ) : (
          <p className="font-display text-4xl leading-none tracking-tight text-ink sm:text-5xl">
            {SITE_NAME}
          </p>
        )}

        <p className="mt-4 max-w-xl text-lg text-ink/80 sm:text-xl">
          {headline}
        </p>

        <div className="mt-8 max-w-lg">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Harga 1 gram · {sourceName || "—"}
          </p>
          <p
            className="mt-2 font-display text-4xl text-ink animate-priceIn sm:text-5xl md:text-6xl"
            aria-live="polite"
          >
            {price != null ? formatIDR(price) : "Data belum tersedia"}
          </p>
          <p className="mt-3 text-sm text-muted">
            Diperbarui{" "}
            <time dateTime={updatedAt || undefined}>
              {formatUpdatedAt(updatedAt)}
            </time>
            {stale ? " (menampilkan data cache)" : ""}
            {" · "}
            WIB
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#bandingkan"
            className="inline-flex items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            Lihat perbandingan
          </a>
          <Link
            href="/kalkulator"
            className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-line transition hover:bg-accent-soft/40"
          >
            Buka kalkulator
          </Link>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
          Data berasal dari API publik pihak ketiga. Informasi ini untuk
          edukasi dan referensi, bukan saran investasi atau ajakan transaksi.
        </p>
      </div>
    </section>
  );
}
