import type { Metadata } from "next";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Merci | Panier Perdu",
  robots: { index: false },
};

export default function Merci() {
  return (
    <>
      <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col justify-center px-5 py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-brique">
          Réservation reçue
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
          Merci, votre accès fondateur est réservé.
        </h1>
        <p className="mt-5 text-lg leading-snug">
          Stripe vous envoie un reçu par email. Panier Perdu vous écrit à la même
          adresse dès que votre accès est prêt, au plus tard dans 3 semaines.
        </p>
        <p className="mt-4 leading-snug">
          Si ce délai n&apos;est pas tenu, vous êtes remboursé sur simple demande.
        </p>
        <a
          href="/"
          className="mt-8 flex min-h-14 items-center justify-center rounded-md border-2 border-encre px-6 text-lg font-semibold"
        >
          Retour à l&apos;accueil
        </a>
      </main>
      <Footer />
    </>
  );
}
