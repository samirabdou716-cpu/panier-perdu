import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function envoyerEmail(
  to: string,
  from: string,
  subject: string,
  html: string
) {
  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  return reponse.ok;
}

export async function GET(request: Request) {
  const autorisation = request.headers.get("authorization");
  if (autorisation !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ erreur: "non autorise" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const maintenant = Date.now();
  const uneHeure = new Date(maintenant - 60 * 60 * 1000).toISOString();
  const vingtQuatreHeures = new Date(maintenant - 24 * 60 * 60 * 1000).toISOString();

  const { data: paniers, error } = await supabase
    .from("paniers")
    .select("id, email_client, prenom, produits, url_reprise, abandonne_le, boutiques(nom_boutique, code_promo)")
    .eq("recupere", false)
    .lt("abandonne_le", uneHeure);

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  let premieres = 0;
  let secondes = 0;

  for (const panier of paniers ?? []) {
    const { data: faites } = await supabase
      .from("relances")
      .select("numero, envoyee_le")
      .eq("panier_id", panier.id);

    const premiere = (faites ?? []).find((r: any) => r.numero === 1);
    const seconde = (faites ?? []).find((r: any) => r.numero === 2);

    const boutique: any = panier.boutiques;
    const nomBoutique = boutique?.nom_boutique ?? "Votre boutique";
    const codePromo = boutique?.code_promo ?? null;
    const prenom = panier.prenom ?? "";
    const produits = (panier.produits ?? "des articles").toLowerCase();
    const expediteur = `${nomBoutique} <onboarding@resend.dev>`;

    if (!premiere) {
      const { error: erreurNote } = await supabase
        .from("relances")
        .insert({ panier_id: panier.id, numero: 1 });
      if (erreurNote) {
        return NextResponse.json({ erreur: erreurNote.message }, { status: 500 });
      }

      const ok = await envoyerEmail(
        panier.email_client,
        expediteur,
        "Vous avez oublié quelque chose",
        `<p>Bonjour ${prenom},</p><p>Vous avez laissé ${produits} dans votre panier.</p><p><a href="${panier.url_reprise}">Reprendre mon panier</a></p><p>${nomBoutique}</p>`
      );

      if (!ok) {
        await supabase
          .from("relances")
          .delete()
          .eq("panier_id", panier.id)
          .eq("numero", 1);
        continue;
      }
      premieres++;
      continue;
    }

    if (!seconde && premiere.envoyee_le < vingtQuatreHeures) {
      const { error: erreurNote } = await supabase
        .from("relances")
        .insert({ panier_id: panier.id, numero: 2 });
      if (erreurNote) {
        return NextResponse.json({ erreur: erreurNote.message }, { status: 500 });
      }

      const bloc = codePromo
        ? `<p>Pour vous remercier, voici un code : <strong>${codePromo}</strong></p>`
        : "";

      const ok = await envoyerEmail(
        panier.email_client,
        expediteur,
        "Dernier rappel pour votre panier",
        `<p>Bonjour ${prenom},</p><p>Votre panier avec ${produits} vous attend toujours.</p>${bloc}<p><a href="${panier.url_reprise}">Finaliser ma commande</a></p><p>${nomBoutique}</p>`
      );

      if (!ok) {
        await supabase
          .from("relances")
          .delete()
          .eq("panier_id", panier.id)
          .eq("numero", 2);
        continue;
      }
      secondes++;
    }
  }

  return NextResponse.json({ premieres, secondes });
}