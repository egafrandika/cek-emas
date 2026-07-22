import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { getAllArticles } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Artikel Harga Emas",
  description:
    "Artikel edukasi seputar harga emas, buyback, gramasi, dan tips membeli emas batangan di Indonesia.",
  alternates: { canonical: "/artikel" },
  openGraph: {
    title: `Artikel · ${SITE_NAME}`,
    description: "Panduan dan edukasi harga emas untuk pembaca Indonesia.",
    url: `${SITE_URL}/artikel`,
  },
};

export default function ArtikelIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="bg-atmosphere">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-display text-4xl text-ink">{SITE_NAME}</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Artikel
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Panduan singkat agar lebih mudah memahami harga emas dan cara
          menghitungnya.
        </p>

        <AdSlot label="Iklan konten" className="my-8" />

        <ul className="divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/artikel/${article.slug}`}
                className="block py-5 transition hover:bg-accent-soft/20"
              >
                <time
                  dateTime={article.publishedAt}
                  className="text-xs uppercase tracking-wide text-muted"
                >
                  {article.publishedAt}
                </time>
                <p className="mt-1 font-display text-xl text-ink">
                  {article.title}
                </p>
                <p className="mt-1 text-sm text-muted">{article.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
