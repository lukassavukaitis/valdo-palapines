import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/metadata";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { Analytics } from "@/components/analytics/analytics";
import { ConsentModeInit } from "@/components/analytics/consent-mode";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"], // latin-ext -> lietuviški ą č ę ...
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Valdopalapines.lt — Palapinių ir renginių inventoriaus nuoma",
    template: "%s · Valdopalapines.lt",
  },
  description: SITE.description,
  keywords: [
    "palapinių nuoma",
    "paviljonų nuoma",
    "vestuvių palapinės",
    "renginių inventoriaus nuoma",
    "baldų nuoma šventėms",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <ConsentModeInit />
        <LocalBusinessJsonLd />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
