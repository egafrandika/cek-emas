import { articles } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/kalkulator",
    "/artikel",
    "/tentang",
    "/privasi",
    "/kontak",
    "/disclaimer",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "hourly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const sourceRoutes = SOURCES.map((s) => ({
    url: `${SITE_URL}/harga/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/artikel/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...sourceRoutes, ...articleRoutes];
}
