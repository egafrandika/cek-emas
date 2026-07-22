import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { articles, getArticleBySlug } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      title: `${article.title} · ${SITE_NAME}`,
      description: article.description,
      type: "article",
      url: `${SITE_URL}/artikel/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default function ArtikelDetailPage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/artikel/${article.slug}`,
    inLanguage: "id-ID",
  };

  return (
    <article className="bg-atmosphere">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link href="/artikel" className="text-sm text-accent hover:underline">
          ← Semua artikel
        </Link>
        <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          Diperbarui{" "}
          <time dateTime={article.updatedAt}>{article.updatedAt}</time>
        </p>

        <AdSlot label="Iklan dalam artikel" className="my-8" />

        <div className="prose-cek mt-2">
          {article.content.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        <AdSlot label="Iklan bawah artikel" className="my-10" />

        <p className="text-sm text-muted">
          Cek juga{" "}
          <Link href="/" className="text-accent hover:underline">
            harga emas hari ini
          </Link>{" "}
          atau pakai{" "}
          <Link href="/kalkulator" className="text-accent hover:underline">
            kalkulator emas
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
