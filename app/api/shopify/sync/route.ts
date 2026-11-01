import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const REQUETE = `
  query {
    abandonedCheckouts(first: 50, reverse: true) {
      nodes {
        id
        abandonedCheckoutUrl
        createdAt
        completedAt
        totalPriceSet { shopMoney { amount } }
        customer { firstName email }
        lineItems(first: 3) { nodes { title } }
      }
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parEntete =
    request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  const parAdresse = searchParams.get("cle") === process.env.CRON_SECRET;

  if (!parEntete && !parAdresse) {
    return NextResponse.json({ erreur: "non autorise" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: boutiques, error } = await supabase
    .from("boutiques")
    .select("id, domaine_shopify, jeton_acces")
    .not("jeton_acces", "is", null);

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  let ajoutes = 0;
  const messages: string[] = [];

  for (const boutique of boutiques ?? []) {
    const reponse = await fetch(
      `https://${boutique.domaine_shopify}/admin/api/2026-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": boutique.jeton_acces,
        },
        body: JSON.stringify({ query: REQUETE }),
      }
    );

    const corps = await reponse.json();

    if (corps.errors) {
      messages.push(JSON.stringify(corps.errors).slice(0, 300));
      continue;
    }

    const paniers = corps.data?.abandonedCheckouts?.nodes ?? [];
    messages.push(`${paniers.length} panier(s) lus chez Shopify`);

    for (const p of paniers) {
      if (p.completedAt || !p.customer?.email) continue;

      const { data: existe } = await supabase
        .from("paniers")
        .select("id")
        .eq("boutique_id", boutique.id)
        .eq("shopify_checkout_id", p.id)
        .limit(1);

      if (existe && existe.length > 0) continue;

      const montant = Math.round(
        parseFloat(p.totalPriceSet?.shopMoney?.amount ?? "0") * 100
      );
      const produits = (p.lineItems?.nodes ?? [])
        .map((l: any) => l.title)
        .join(", ");

      const { error: erreurAjout } = await supabase.from("paniers").insert({
        boutique_id: boutique.id,
        shopify_checkout_id: p.id,
        email_client: p.customer.email,
        prenom: p.customer.firstName ?? null,
        produits: produits || null,
        montant_cents: montant,
        url_reprise: p.abandonedCheckoutUrl,
        abandonne_le: p.createdAt,
      });

      if (erreurAjout) {
        messages.push(erreurAjout.message);
        continue;
      }
      ajoutes++;
    }
  }

  return NextResponse.json({ ajoutes, messages });
}