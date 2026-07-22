export const SOURCES = [
  {
    id: "logammulia",
    slug: "logammulia",
    name: "Logam Mulia",
    shortName: "LM",
    description:
      "Harga resmi emas batangan dari situs Logam Mulia (Antam).",
    seoTitle: "Harga Emas Logam Mulia Hari Ini",
    homepage: "https://www.logammulia.com",
  },
  {
    id: "anekalogam",
    slug: "anekalogam",
    name: "Aneka Logam",
    shortName: "Aneka",
    description:
      "Harga jual dan buyback emas Antam dari Aneka Logam.",
    seoTitle: "Harga Emas Aneka Logam (Antam) Hari Ini",
    homepage: "https://www.anekalogam.co.id",
  },
  {
    id: "indogold",
    slug: "indogold",
    name: "Indogold",
    shortName: "Indogold",
    description:
      "Harga emas Antam, UBS, dan IndoGold dari Indogold.",
    seoTitle: "Harga Emas Indogold Hari Ini",
    homepage: "https://www.indogold.id",
  },
];

export const DEFAULT_SOURCE = "logammulia";

export function getSourceBySlug(slug) {
  return SOURCES.find((s) => s.slug === slug || s.id === slug) || null;
}
