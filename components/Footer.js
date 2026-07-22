import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { SOURCES } from "@/lib/sources";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{SITE_NAME}</p>
          <p className="mt-3 text-sm leading-relaxed text-paper/70">
            Cek harga emas hari ini, bandingkan sumber, dan hitung gram ke
            rupiah. Data untuk edukasi — bukan saran investasi.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-paper/50">
            Harga
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {SOURCES.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/harga/${s.slug}`}
                  className="text-paper/80 hover:text-accent-soft"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/kalkulator"
                className="text-paper/80 hover:text-accent-soft"
              >
                Kalkulator emas
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-paper/50">
            Informasi
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/artikel" className="text-paper/80 hover:text-accent-soft">
                Artikel
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="text-paper/80 hover:text-accent-soft">
                Tentang
              </Link>
            </li>
            <li>
              <Link href="/privasi" className="text-paper/80 hover:text-accent-soft">
                Privasi
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="text-paper/80 hover:text-accent-soft">
                Kontak
              </Link>
            </li>
            <li>
              <Link
                href="/disclaimer"
                className="text-paper/80 hover:text-accent-soft"
              >
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-5xl px-4 py-4 text-xs text-paper/45 sm:px-6">
          © {new Date().getFullYear()} {SITE_NAME}. Harga diambil dari API
          publik pihak ketiga dan dapat tertunda.
        </p>
      </div>
    </footer>
  );
}
