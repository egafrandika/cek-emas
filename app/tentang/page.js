import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Tentang Kami",
  description: `Tentang ${SITE_NAME}: situs untuk mengecek dan membandingkan harga emas di Indonesia.`,
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Tentang {SITE_NAME}</h1>
      <div className="prose-cek mt-6">
        <p>
          {SITE_NAME} adalah situs utilitas untuk membantu masyarakat Indonesia
          mengecek harga emas hari ini, membandingkan beberapa sumber, dan
          menghitung estimasi gram ke rupiah.
        </p>
        <p>
          Kami menampilkan data dari API publik pihak ketiga agar informasi
          lebih cepat diakses. Fokus kami adalah kejelasan, kecepatan, dan
          kemudahan di perangkat mobile.
        </p>
        <p>
          {SITE_NAME} tidak menjual emas dan tidak memberikan saran investasi.
          Keputusan transaksi sepenuhnya ada pada pengguna.
        </p>
      </div>
    </div>
  );
}
