cat > app/layout.tsx <<'EOF'
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
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
EOF
cat > app/page.tsx <<'EOF'
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#b4361b",
          margin: "0 0 16px",
        }}
      >
        Panier Perdu
      </p>
      <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: "0 0 16px" }}>
        Récupérez les paniers abandonnés de votre boutique.
      </h1>
      <p
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 18,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        Bientôt disponible.
      </p>
    </main>
  );
}
EOF
ls -la app
git add -A
git commit -m "Page bientôt"
git push
