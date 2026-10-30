import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Espace() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) redirect("/connexion");

  const admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: boutique } = await admin
    .from("boutiques")
    .select("*")
    .eq("email_contact", user.email.toLowerCase())
    .maybeSingle();

  const fond = "#f6f1e7";
  const encre = "#1d1b16";
  const brique = "#b4361b";

  if (!boutique || boutique.statut_abonnement !== "actif") {
    return (
      <main
        style={{ background: fond, color: encre, minHeight: "100vh" }}
        className="flex items-center justify-center px-6"
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl mb-3" style={{ fontFamily: "Fraunces, serif" }}>
            Pas d'accès actif
          </h1>
          <p className="opacity-80">
            Nous ne trouvons pas d'abonnement actif pour {user.email}. Utilisez
            l'email du paiement pour vous connecter.
          </p>
        </div>
      </main>
    );
  }

  if (!boutique.user_id) {
    await admin
      .from("boutiques")
      .update({ user_id: user.id })
      .eq("id", boutique.id);
  }

  const { data: paniers } = await admin
    .from("paniers")
    .select("montant")
    .eq("boutique_id", boutique.id)
    .eq("recupere", true);

  const total = (paniers ?? []).reduce(
    (somme, p) => somme + Number(p.montant ?? 0),
    0
  );
  const montantAffiche = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  return (
    <main
      style={{ background: fond, color: encre, minHeight: "100vh" }}
      className="px-6 py-16"
    >
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-4xl mb-10" style={{ fontFamily: "Fraunces, serif" }}>
          Votre espace
        </h1>

        <section className="p-6 rounded border mb-6" style={{ borderColor: encre }}>
          <p className="opacity-70 mb-2">Chiffre d'affaires récupéré</p>
          <p className="text-5xl" style={{ fontFamily: "Fraunces, serif", color: brique }}>
            {montantAffiche}
          </p>
        </section>

        <section className="p-6 rounded border" style={{ borderColor: encre }}>
          <p className="opacity-70 mb-2">Connexion boutique</p>
          {boutique.domaine_shopify ? (
            <p>Connectée : {boutique.domaine_shopify}</p>
          ) : (
            <p>
              Pas encore connectée. Nous branchons votre boutique Shopify avec
              vous dans les prochaines semaines.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}