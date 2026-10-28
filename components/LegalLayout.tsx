import type { ReactNode } from "react";
import Footer from "./Footer";

export function Champ({ children }: { children: ReactNode }) {
  return (
    <mark className="bg-yellow-200 px-1 text-encre">[À COMPLÉTER : {children}]</mark>
  );
}

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="mx-auto max-w-2xl px-5 pt-6">
        <a href="/" className="font-display text-lg font-bold">
          Panier Perdu
        </a>
      </header>
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-8">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm opacity-70">Dernière mise à jour : 28 octobre 2026</p>
        <div className="mt-8 space-y-4 leading-relaxed [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
