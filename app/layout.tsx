import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Panier Perdu : récupérez les paniers abandonnés de votre boutique";
const description =
  "Deux relances écrites, un code de réduction facultatif et un compteur en euros. 29 € par mois, relances illimitées.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Panier Perdu",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${instrument.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
