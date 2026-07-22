import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Kebijakan Privasi",
  description: `Kebijakan privasi ${SITE_NAME}.`,
  alternates: { canonical: "/privasi" },
};

export default function PrivasiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Kebijakan Privasi
      </h1>
      <div className="prose-cek mt-6">
        <p>
          Kebijakan ini menjelaskan bagaimana {SITE_NAME} ({SITE_URL})
          memperlakukan informasi saat Anda mengunjungi situs.
        </p>
        <p>
          <strong>Data yang dikumpulkan.</strong> Kami dapat menggunakan
          layanan analitik (misalnya Google Analytics) dan jaringan iklan
          (misalnya Google AdSense) yang menempatkan cookie atau pengenal
          serupa untuk mengukur kunjungan dan menayangkan iklan.
        </p>
        <p>
          <strong>Cookie.</strong> Cookie digunakan untuk fungsi situs,
          analitik, dan iklan. Anda dapat mengatur preferensi cookie melalui
          browser.
        </p>
        <p>
          <strong>Iklan pihak ketiga.</strong> Mitra iklan dapat menggunakan
          data kunjungan untuk menampilkan iklan yang lebih relevan sesuai
          kebijakan mereka.
        </p>
        <p>
          <strong>Kontak.</strong> Pertanyaan terkait privasi dapat dikirim
          melalui halaman Kontak.
        </p>
      </div>
    </div>
  );
}
