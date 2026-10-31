import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const uneHeure = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: paniers, error } = await supabase
    .from("paniers")
    .select("id, email_client, prenom, produits, url_reprise, boutique_id, boutiques(nom_boutique)")
    .eq("recupere", false)
    .lt("abandonne_le", uneHeure);

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  let envoyes = 0;

  for (const panier of paniers ?? []) {
    const { data: deja } = await supabase
      .from("relances")
      .select("id")
      .eq("panier_id", panier.id)
      .eq("numero", 1)
      .limit(1);

    if (deja && deja.length > 0) continue;

    const boutique: any = panier.boutiques;
    const nomBoutique = boutique?.nom_boutique ?? "Votre boutique";
    const prenom = panier.prenom ?? "";
    const produits = (panier.produits ?? "des articles").toLowerCase();

    const { error: erreurNote } = await supabase
      .from("relances")
      .insert({ panier_id: panier.id, numero: 1 });

    if (erreurNote) {
      return NextResponse.json({ erreur: erreurNote.message }, { status: 500 });
    }

    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${nomBoutique} <onboarding@resend.dev>`,
        to: panier.email_client,
        subject: "Vous avez oublié quelque chose",
        html: `<p>Bonjour ${prenom},</p><p>Vous avez laissé ${produits} dans votre panier.</p><p><a href="${panier.url_reprise}">Reprendre mon panier</a></p><p>${nomBoutique}</p>`,
      }),
    });

    if (!reponse.ok) {
      await supabase
        .from("relances")
        .delete()
        .eq("panier_id", panier.id)
        .eq("numero", 1);
      continue;
    }

    envoyes++;
  }

  return NextResponse.json({ envoyes });
}
