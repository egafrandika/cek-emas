import PriceHero from "@/components/PriceHero";
import CompareTable from "@/components/CompareTable";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import FaqSection, { getFaqItems } from "@/components/FaqSection";
import ArticleTeasers from "@/components/ArticleTeasers";
import StickyPriceBar from "@/components/StickyPriceBar";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";
import { getLatestArticles } from "@/lib/articles";
import { formatUpdatedAt } from "@/lib/format";
import {
  getHistoryPayload,
  HISTORY_SOURCE,
  pickDefaultRange,
} from "@/lib/history";
import {
  buildCompareRows,
  fetchAllSources,
} from "@/lib/prices";
import { DEFAULT_SOURCE, getSourceBySlug } from "@/lib/sources";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 600;

export default async function HomePage() {
  const [{ bySource, primary, updatedAt, anyStale }, historySeed] =
    await Promise.all([
      fetchAllSources(),
      getHistoryPayload({ source: HISTORY_SOURCE, range: "7d" }),
    ]);

  const defaultRange = historySeed.demo
    ? "30d"
    : pickDefaultRange(historySeed.count || 0);

  const history =
    defaultRange === historySeed.range
      ? historySeed
      : await getHistoryPayload({
          source: HISTORY_SOURCE,
          range: defaultRange,
        });

  const rows = buildCompareRows(bySource);
  const primarySource =
    bySource[DEFAULT_SOURCE]?.oneGram != null
      ? DEFAULT_SOURCE
      : rows.find((r) => r.success)?.source.id || DEFAULT_SOURCE;

  const primaryName =
    rows.find((r) => r.source.id === primarySource)?.source.name || "Logam Mulia";
  const historySourceName =
    getSourceBySlug(HISTORY_SOURCE)?.name || "Logam Mulia";

  const articles = getLatestArticles(3);
  const faqItems = getFaqItems();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      inLanguage: "id-ID",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <StickyPriceBar
        price={primary?.sellPrice ?? null}
        sourceName={primaryName}
        updatedLabel={formatUpdatedAt(updatedAt)}
      />
      <PriceHero
        price={primary?.sellPrice ?? null}
        sourceName={primaryName}
        updatedAt={updatedAt}
        stale={anyStale}
      />

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <AdSlot label="Iklan konten" className="mb-10" />

        <CompareTable rows={rows} />
        <PriceHistoryChart
          initialHistory={history}
          sourceId={HISTORY_SOURCE}
          sourceName={historySourceName}
        />

        <FaqSection />
        <ArticleTeasers articles={articles} />
      </div>
    </>
  );
}
