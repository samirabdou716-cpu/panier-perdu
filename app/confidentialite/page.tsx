import type { Metadata } from "next";
import LegalLayout, { Champ } from "../../components/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Panier Perdu",
};

export default function Page() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>
        <Champ>nom ou raison sociale</Champ>, <Champ>adresse postale</Champ>.
        Contact : <Champ>adresse email de contact</Champ>.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          Votre adresse email et le nom de votre boutique, pour créer votre
          compte et vous donner accès au service.
        </li>
        <li>
          Les données de paiement, traitées directement par Stripe. Panier Perdu
          ne voit ni ne conserve votre numéro de carte.
        </li>
        <li>
          Pour le compte de votre boutique : l&apos;email, le prénom et le
          contenu du panier des clients ayant abandonné un panier, uniquement pour
          envoyer les relances. Pour ces données, Panier Perdu agit comme
          sous-traitant et la boutique reste responsable du traitement.
        </li>
        <li>
          Des statistiques de visite anonymes (Vercel Web Analytics), sans cookie
          et sans suivi individuel.
        </li>
      </ul>

      <h2>Finalités et durée</h2>
      <p>
        Les données servent à fournir le service, à facturer et à répondre à vos
        demandes. Elles sont conservées pendant la durée de l&apos;abonnement,
        puis supprimées au plus tard 12 mois après sa fin, sauf obligation
        légale de conservation (factures : 10 ans).
      </p>

      <h2>Prestataires</h2>
      <p>
        Vercel (hébergement), Supabase (base de données), Stripe (paiement) et un
        service d&apos;envoi d&apos;emails. Certains sont situés hors de
        l&apos;Union européenne ; les transferts sont encadrés par des clauses
        contractuelles types.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification, l&apos;effacement ou
        la portabilité de vos données, et vous opposer à leur traitement, en
        écrivant à <Champ>adresse email de contact</Champ>. Vous pouvez aussi
        saisir la CNIL (cnil.fr).
      </p>
    </LegalLayout>
  );
}
