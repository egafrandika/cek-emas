import Link from "next/link";
import { formatIDR, formatUpdatedAt } from "@/lib/format";

export default function CompareTable({ rows }) {
  return (
    <section id="bandingkan" className="scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Bandingkan harga 1 gram
          </h2>
          <p className="mt-1 text-sm text-muted">
            Ketuk sumber untuk lihat detail harga jual dan buyback.
          </p>
        </div>
      </div>

      <div className="panel overflow-hidden rounded-xl">
        <div className="hidden grid-cols-12 gap-2 border-b border-line bg-paper/60 px-4 py-3 text-xs uppercase tracking-wide text-muted sm:grid">
          <div className="col-span-3">Sumber</div>
          <div className="col-span-3">Jual</div>
          <div className="col-span-3">Buyback</div>
          <div className="col-span-2">Diperbarui</div>
          <div className="col-span-1 text-right">Detail</div>
        </div>

        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.source.id}>
              <Link
                href={`/harga/${row.source.slug}`}
                className="group grid grid-cols-1 gap-2 px-4 py-4 transition hover:bg-accent-soft/25 focus-visible:bg-accent-soft/25 focus-visible:outline-none sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-3">
                  <p className="font-medium text-ink transition group-hover:text-accent">
                    {row.source.name}
                  </p>
                  <p className="text-xs text-muted">
                    {row.materialType || "Emas 1 gram"}
                  </p>
                </div>
                <div className="flex justify-between sm:col-span-3 sm:block">
                  <span className="text-xs text-muted sm:hidden">Jual</span>
                  <span className="font-display text-lg text-ink">
                    {formatIDR(row.sellPrice)}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-3 sm:block">
                  <span className="text-xs text-muted sm:hidden">Buyback</span>
                  <span className="text-ink">
                    {formatIDR(row.buybackPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted sm:col-span-2 sm:block">
                  <span className="text-xs sm:hidden">Update</span>
                  <time dateTime={row.timestamp || undefined}>
                    {formatUpdatedAt(row.timestamp)}
                    {row.stale ? " · cache" : ""}
                  </time>
                </div>
                <div className="mt-1 flex items-center justify-between sm:col-span-1 sm:mt-0 sm:justify-end">
                  <span className="text-xs font-medium text-accent sm:hidden">
                    Lihat detail
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-base leading-none text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
