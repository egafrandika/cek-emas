const FAQ_ITEMS = [
  {
    q: "Berapa harga emas 1 gram hari ini?",
    a: "Harga 1 gram ditampilkan di bagian atas halaman CekEmas dan diperbarui berkala dari beberapa sumber. Angka dapat berbeda antar toko karena biaya dan kebijakan masing-masing.",
  },
  {
    q: "Apa bedanya harga jual dan buyback?",
    a: "Harga jual adalah harga saat Anda membeli. Buyback adalah harga penawaran saat emas dibeli kembali, biasanya lebih rendah. Selisihnya disebut spread.",
  },
  {
    q: "Apakah harga di CekEmas harga final transaksi?",
    a: "Tidak. Harga bersifat referensi. Selalu konfirmasi di sumber resmi atau tempat Anda bertransaksi sebelum membeli atau menjual.",
  },
  {
    q: "Bagaimana cara memakai kalkulator emas?",
    a: "Buka halaman Kalkulator, pilih sumber acuan, lalu masukkan jumlah uang untuk memperkirakan gram, atau masukkan gram untuk memperkirakan nilai rupiah berdasarkan harga 1 gram.",
  },
];

export function getFaqItems() {
  return FAQ_ITEMS;
}

export default function FaqSection() {
  return (
    <section className="mt-14" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-2xl text-ink sm:text-3xl">
        Pertanyaan umum
      </h2>
      <dl className="mt-6 space-y-4">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="border-b border-line pb-4">
            <dt className="font-medium text-ink">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
