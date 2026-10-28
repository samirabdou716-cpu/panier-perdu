import type { Metadata } from "next";
import LegalLayout, { Champ } from "../../components/LegalLayout";

export const metadata: Metadata = { title: "Mentions légales | Panier Perdu" };

export default function Page() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Panier Perdu est édité par <Champ>nom ou raison sociale</Champ>,{" "}
        <Champ>forme juridique, par exemple micro-entreprise</Champ>, immatriculée
        sous le numéro SIRET <Champ>numéro SIRET</Champ>.
      </p>
      <p>
        Adresse : <Champ>adresse postale</Champ>
        <br />
        Email : <Champ>adresse email de contact</Champ>
        <br />
        Directeur de la publication : <Champ>nom et prénom</Champ>
      </p>
      <p>
        TVA : <Champ>mention « TVA non applicable, art. 293 B du CGI » si vous êtes en franchise en base, sinon numéro de TVA</Champ>
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA
        91723, États-Unis (vercel.com).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la mise en page et le nom Panier Perdu sont protégés. Toute
        reproduction sans autorisation écrite est interdite.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question, écrivez à <Champ>adresse email de contact</Champ>.
      </p>
    </LegalLayout>
  );
}
