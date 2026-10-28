import Footer from "../components/Footer";

const CTA_HREF = "/api/checkout";
const btn =
  "flex min-h-14 w-full items-center justify-center rounded-md bg-brique px-6 text-lg font-semibold text-creme active:opacity-90";

const benefits = [
  {
    n: "01",
    titre: "Deux relances, déjà écrites.",
    texte:
      "Un premier rappel, puis un second, espacés dans le temps. Chaque email reprend le prénom du client et les produits laissés dans son panier.",
  },
  {
    n: "02",
    titre: "Un code de réduction, si vous le voulez.",
    texte:
      "Il n'apparaît que sur la seconde relance, et il n'est jamais obligatoire.",
  },
  {
    n: "03",
    titre: "Un compteur en euros.",
    texte:
      "Un seul chiffre à l'écran : le chiffre d'affaires récupéré grâce aux relances.",
  },
];

export default function Home() {
  return (
    <>
      <header className="mx-auto max-w-xl px-5 pt-6">
        <span className="font-display text-lg font-bold">Panier Perdu</span>
      </header>

      <main className="mx-auto max-w-xl px-5 pb-10">
        <section className="pt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-brique">
            Pour les boutiques Shopify
          </p>
          <h1 className="mt-4 font-display text-[2.4rem] font-bold leading-[1.05]">
            Récupérez les paniers abandonnés de votre boutique.
          </h1>
          <p className="mt-5 text-lg leading-snug">
            7 paniers sur 10 sont abandonnés avant le paiement.
            <sup className="text-xs">
              <a href="#source">1</a>
            </sup>{" "}
            Panier Perdu envoie deux relances à chaque client concerné et vous
            affiche, en euros, ce qui revient.
          </p>
          <a href={CTA_HREF} className={`${btn} mt-8`}>
            Réserver mon accès fondateur
          </a>
          <p className="mt-3 text-sm">
            29 € par mois et par boutique · relances illimitées · résiliable à
            tout moment
          </p>
          <p className="mt-6 border-l-4 border-brique pl-4 text-sm leading-snug">
            <strong>Accès fondateur.</strong> Le produit est en finition. Vous
            réservez aujourd&apos;hui, l&apos;accès vous est livré sous 3
            semaines, et vous êtes remboursé sur simple demande si ce délai
            n&apos;est pas tenu.
          </p>
        </section>

        <section className="mt-14 rounded-md bg-creme-fonce p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brique">
            Exemple chiffré
          </p>
          <p className="mt-3 leading-snug">
            Une boutique à 40 commandes par mois, avec un panier moyen de 60 €.
          </p>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm">Paniers abandonnés chaque mois</dt>
              <dd className="font-display text-3xl font-bold">≈ 93</dd>
            </div>
            <div>
              <dt className="text-sm">Chiffre d&apos;affaires resté dans les paniers</dt>
              <dd className="font-display text-3xl font-bold">≈ 5 600 €</dd>
            </div>
            <div>
              <dt className="text-sm">Si 1 panier sur 10 revient</dt>
              <dd className="font-display text-3xl font-bold">
                ≈ 560 €, soit près de 20 fois l&apos;abonnement
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs opacity-70">
            Calcul illustratif à partir du taux moyen d&apos;abandon de 70 %. Ce
            n&apos;est pas une promesse de résultat.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Ce que vous obtenez</h2>
          <ul className="mt-6 space-y-8">
            {benefits.map((b) => (
              <li key={b.n} className="flex gap-4">
                <span className="font-display text-2xl font-bold text-brique">
                  {b.n}
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug">{b.titre}</h3>
                  <p className="mt-1 leading-snug">{b.texte}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">29 € par mois, c&apos;est tout.</h2>
          <p className="mt-3 leading-snug">
            Une boutique, des relances illimitées, aucun palier de volume.
          </p>
          <a href={CTA_HREF} className={`${btn} mt-6`}>
            Réserver mon accès fondateur
          </a>
        </section>

        <p id="source" className="mt-12 text-xs opacity-70">
          1. Source : Baymard Institute, taux moyen d&apos;abandon de panier
          documenté (environ 70 %).{" "}
          <a
            href="https://baymard.com/lists/cart-abandonment-rate"
            className="underline"
          >
            Voir l&apos;étude
          </a>
          .
        </p>
      </main>

      <div className="pb-24 md:pb-0">
        <Footer />
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-encre/15 bg-creme p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <a href={CTA_HREF} className={btn}>
          Réserver mon accès · 29 €/mois
        </a>
      </div>
    </>
  );
}
