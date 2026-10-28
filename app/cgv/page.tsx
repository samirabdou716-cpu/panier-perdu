import type { Metadata } from "next";
import LegalLayout, { Champ } from "../../components/LegalLayout";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Panier Perdu",
};

export default function Page() {
  return (
    <LegalLayout title="Conditions générales de vente">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l&apos;abonnement au service Panier
        Perdu, édité par <Champ>nom ou raison sociale</Champ> (SIRET{" "}
        <Champ>numéro SIRET</Champ>), qui permet à une boutique en ligne
        d&apos;envoyer des relances écrites à ses clients ayant abandonné un
        panier.
      </p>

      <h2>2. Clients concernés</h2>
      <p>
        Le service s&apos;adresse exclusivement à des professionnels. Le droit de
        rétractation prévu pour les consommateurs ne s&apos;applique pas.
      </p>

      <h2>3. Le service</h2>
      <p>
        Le service comprend le branchement à une boutique Shopify, la lecture des
        paniers abandonnés, une séquence de deux relances écrites, un code de
        réduction facultatif sur la seconde relance et un compteur du chiffre
        d&apos;affaires récupéré. Un abonnement couvre une boutique.
      </p>

      <h2>4. Accès fondateur et délai de livraison</h2>
      <p>
        Le service est en cours de finalisation. Les abonnements souscrits avant
        son ouverture sont des accès fondateur : l&apos;accès au service est
        fourni dans un délai de 3 semaines à compter du paiement. Si ce délai
        n&apos;est pas tenu, le client peut demander le remboursement intégral
        des sommes versées, sur simple demande écrite.
      </p>

      <h2>5. Prix et paiement</h2>
      <p>
        L&apos;abonnement coûte 29 € <Champ>HT ou TTC selon votre régime de TVA</Champ> par
        mois et par boutique. Le paiement est mensuel, par carte bancaire,
        traité par Stripe. Le prix souscrit reste inchangé tant que
        l&apos;abonnement n&apos;est pas résilié.
      </p>

      <h2>6. Durée et résiliation</h2>
      <p>
        L&apos;abonnement est sans engagement. Le client peut le résilier à tout
        moment ; la résiliation prend effet à la fin de la période mensuelle en
        cours, sans remboursement du mois entamé.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        Panier Perdu met en œuvre les moyens nécessaires au bon fonctionnement du
        service, sans garantir un résultat commercial. Le chiffre d&apos;affaires
        récupéré dépend de la boutique, de ses produits et de ses clients.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Le traitement des données est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        litige, les tribunaux compétents sont ceux du ressort de{" "}
        <Champ>ville de votre domicile ou siège</Champ>.
      </p>
    </LegalLayout>
  );
}
