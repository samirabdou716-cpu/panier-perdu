import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Panier Perdu : récupérez vos paniers abandonnés",
  description:
    "Deux relances automatiques pour récupérer les paniers abandonnés de votre boutique. Bientôt disponible.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          background: "#f6f1e7",
          color: "#1d1b16",
          fontFamily:
            'Georgia, "Times New Roman", serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
