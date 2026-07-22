import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Kontak",
  description: `Hubungi tim ${SITE_NAME}.`,
  alternates: { canonical: "/kontak" },
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Kontak</h1>
      <div className="prose-cek mt-6">
        <p>
          Ada masukan, laporan data yang keliru, atau pertanyaan kerja sama?
          Silakan hubungi kami melalui email:
        </p>
        <p>
          <a
            href="mailto:halo@cekemas.com"
            className="text-accent hover:underline"
          >
            halo@cekemas.com
          </a>
        </p>
        <p>
          Kami berusaha membalas dalam waktu yang wajar pada hari kerja.
        </p>
      </div>
    </div>
  );
}
