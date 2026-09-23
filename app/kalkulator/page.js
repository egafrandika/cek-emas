import Link from "next/link";
import GoldCalculator from "@/components/GoldCalculator";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildCompareRows, fetchAllSources } from "@/lib/prices";
import { DEFAULT_SOURCE, getSourceBySlug } from "@/lib/sources";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 600;

export const metadata = {
  title: "Kalkulator Harga Emas",
  description:
    "Kalkulator harga emas: ubah rupiah ke gram atau gram ke rupiah berdasarkan harga 1 gram hari ini.",
  alternates: { canonical: "/kalkulator" },
  openGraph: {
    title: `Kalkulator Harga Emas · ${SITE_NAME}`,
    description:
      "Hitung cepat nilai emas berdasarkan harga 1 gram dari Logam Mulia, Aneka Logam, atau Indogold.",
    url: `${SITE_URL}/kalkulator`,
  },
};

export default async function KalkulatorPage({ searchParams }) {
  const { bySource } = await fetchAllSources();
  const rows = buildCompareRows(bySource);
  const priceMap = {};
  for (const row of rows) {
    if (row.sellPrice != null) priceMap[row.source.id] = row.sellPrice;
  }

  const requested = getSourceBySlug(searchParams?.sumber || "");
  const defaultSourceId =
    requested && priceMap[requested.id] != null
      ? requested.id
      : DEFAULT_SOURCE;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Kalkulator Emas ${SITE_NAME}`,
    url: `${SITE_URL}/kalkulator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Kalkulator untuk menghitung gram emas dari rupiah dan sebaliknya.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  };

  return (
    <div className="bg-atmosphere">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {SITE_NAME}
        </p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
          Kalkulator harga emas
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
          Pilih sumber acuan, masukkan uang atau gram, dan dapatkan estimasi
          berdasarkan harga 1 gram hari ini.
        </p>

        <div className="mt-10">
          <GoldCalculator
            key={defaultSourceId}
            priceMap={priceMap}
            defaultSourceId={defaultSourceId}
          />
        </div>

        <p className="mt-6 text-sm text-muted">
          Butuh perbandingan lengkap?{" "}
          <Link href="/" className="text-accent hover:underline">
            Lihat harga emas hari ini
          </Link>
          .
        </p>

        <AdSlot label="Iklan konten" className="mt-10" />
      </div>
    </div>
  );
}
