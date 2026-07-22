import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cek Harga Emas Hari Ini`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Cek Harga Emas Hari Ini`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Cek Harga Emas Hari Ini`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Header />
        <AdSlot label="Iklan header" className="mx-auto max-w-5xl px-4 py-3 sm:px-6" />
        <main>{children}</main>
        <Footer />
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-2 backdrop-blur sm:hidden">
          <AdSlot label="Iklan sticky mobile" minHeight="56px" />
        </div>
        <div className="h-16 sm:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
