import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header className="relative z-20 border-b border-line/80 bg-paper/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <span className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
            {SITE_NAME}
          </span>
          <span className="mt-0.5 block text-xs text-muted group-hover:text-accent">
            Harga emas Indonesia
          </span>
        </Link>
        <nav aria-label="Utama" className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-ink/80 transition hover:bg-accent-soft/40 hover:text-ink sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
