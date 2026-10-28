import type { Metadata } from "next";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Paiement non finalisé | Panier Perdu",
  robots: { index: false },
};

export default async function PaiementAnnule({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  return (
    <>
      <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col justify-center px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-brique">
          Paiement non finalisé
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
          {erreur ? "Le paiement n'a pas pu démarrer." : "Votre paiement n'a pas abouti."}
        </h1>
        <p className="mt-5 text-lg leading-snug">
          Vous n&apos;avez pas été débité. Vous pouvez réessayer, avec la même carte
          ou une autre.
        </p>
        <a
          href="/api/checkout"
          className="mt-8 flex min-h-14 items-center justify-center rounded-md bg-brique px-6 text-lg font-semibold text-creme"
        >
          Réessayer le paiement
        </a>
        <a href="/" className="mt-4 text-center underline">
          Retour à l&apos;accueil
        </a>
      </main>
      <Footer />
    </>
  );
}
