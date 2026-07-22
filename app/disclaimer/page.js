import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Disclaimer",
  description: `Disclaimer dan batasan tanggung jawab ${SITE_NAME}.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Disclaimer</h1>
      <div className="prose-cek mt-6">
        <p>
          Informasi harga emas di {SITE_NAME} bersumber dari API publik pihak
          ketiga dan dapat tertunda, tidak lengkap, atau berbeda dari harga
          transaksi aktual.
        </p>
        <p>
          Konten di situs ini bersifat edukasi dan referensi umum. Bukan saran
          keuangan, investasi, pajak, atau hukum. Anda bertanggung jawab penuh
          atas keputusan membeli, menjual, atau menyimpan emas.
        </p>
        <p>
          {SITE_NAME} tidak menjamin keakuratan, ketersediaan, atau kesesuaian
          data untuk tujuan tertentu, dan tidak bertanggung jawab atas kerugian
          yang timbul dari penggunaan informasi di situs ini.
        </p>
        <p>
          Selalu verifikasi harga dan ketentuan di sumber resmi sebelum
          bertransaksi.
        </p>
      </div>
    </div>
  );
}
