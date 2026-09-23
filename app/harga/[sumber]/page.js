import Link from "next/link";
import { notFound } from "next/navigation";
import PriceHero from "@/components/PriceHero";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { formatIDR, formatUpdatedAt } from "@/lib/format";
import { fetchSourcePrices, pickOneGramPrice } from "@/lib/prices";
import { getSourceBySlug, SOURCES } from "@/lib/sources";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 600;

export function generateStaticParams() {
  return SOURCES.map((s) => ({ sumber: s.slug }));
}

export async function generateMetadata({ params }) {
  const source = getSourceBySlug(params.sumber);
  if (!source) return {};
  const title = source.seoTitle;
  const description = `${source.description} Cek harga jual dan buyback 1 gram di ${SITE_NAME}.`;
  return {
    title,
    description,
    alternates: { canonical: `/harga/${source.slug}` },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/harga/${source.slug}`,
    },
  };
}

export default async function SumberPage({ params }) {
  const source = getSourceBySlug(params.sumber);
  if (!source) notFound();

  const data = await fetchSourcePrices(source.id);
  const oneGram = data.oneGram || pickOneGramPrice(data.items);
  const goldItems = (data.items || []).filter((i) => i.material === "gold");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: source.seoTitle,
    description: source.description,
    url: `${SITE_URL}/harga/${source.slug}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PriceHero
        brandAsH1={false}
        headline={source.seoTitle}
        price={oneGram?.sellPrice ?? null}
        sourceName={source.name}
        updatedAt={data.timestamp}
        stale={data.stale}
        compareHref="/#bandingkan"
        calculatorHref={`/kalkulator?sumber=${source.slug}`}
      />

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <AdSlot label="Iklan konten" className="mb-10" />

        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {source.description} Data dari API publik; konfirmasi harga di{" "}
          <a
            href={source.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            situs resmi {source.name}
          </a>{" "}
          sebelum bertransaksi.
        </p>

        <section className="mt-10 scroll-mt-24" id="gramasi">
          <h2 className="font-display text-2xl text-ink">Daftar gramasi</h2>
          <div className="panel mt-4 overflow-hidden rounded-xl">
            <div className="-mx-0 overflow-x-auto overscroll-x-contain touch-pan-x">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Tipe
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Gram
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Jual
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      Buyback
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {goldItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-muted">
                        Data tidak tersedia saat ini.
                      </td>
                    </tr>
                  )}
                  {goldItems.map((item, idx) => (
                    <tr key={`${item.materialType}-${item.weight}-${idx}`}>
                      <td className="max-w-[14rem] px-4 py-3 text-ink sm:max-w-none">
                        <span className="line-clamp-2 sm:line-clamp-none">
                          {item.materialType || "Emas"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {item.weight} g
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        {formatIDR(item.sellPrice)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {formatIDR(item.buybackPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted sm:hidden">
            Geser tabel ke samping untuk melihat semua kolom.
          </p>
          <p className="mt-3 text-xs text-muted">
            Diperbarui{" "}
            <time dateTime={data.timestamp || undefined}>
              {formatUpdatedAt(data.timestamp)}
            </time>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="kalkulator-cta-heading">
          <h2
            id="kalkulator-cta-heading"
            className="font-display text-xl text-ink"
          >
            Hitung estimasi
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Ubah rupiah ke gram (atau sebaliknya) memakai harga 1 gram{" "}
            {source.name} hari ini.
          </p>
          <Link
            href={`/kalkulator?sumber=${source.slug}`}
            className="mt-4 inline-flex items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            Buka kalkulator {source.name}
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">Sumber lain</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SOURCES.filter((s) => s.id !== source.id).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/harga/${s.slug}`}
                  className="rounded-md bg-surface px-3 py-1.5 text-sm ring-1 ring-line hover:bg-accent-soft/40"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                className="rounded-md bg-ink px-3 py-1.5 text-sm text-paper"
              >
                Semua harga
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
