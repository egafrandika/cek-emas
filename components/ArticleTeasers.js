import Link from "next/link";

export default function ArticleTeasers({ articles, title = "Artikel terbaru" }) {
  if (!articles?.length) return null;

  return (
    <section className="mt-14" aria-labelledby="artikel-heading">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="artikel-heading"
          className="font-display text-2xl text-ink sm:text-3xl"
        >
          {title}
        </h2>
        <Link href="/artikel" className="text-sm text-accent hover:underline">
          Semua artikel
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/artikel/${article.slug}`}
              className="block py-4 transition hover:bg-accent-soft/20"
            >
              <p className="font-medium text-ink">{article.title}</p>
              <p className="mt-1 text-sm text-muted">{article.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
