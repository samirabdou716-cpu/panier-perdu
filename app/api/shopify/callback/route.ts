import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");

  if (!shop || !code || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.json({ erreur: "requete invalide" }, { status: 400 });
  }

  const reponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!reponse.ok) {
    return NextResponse.json({ erreur: "echange refuse" }, { status: 400 });
  }

  const { access_token } = await reponse.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("boutiques")
    .update({ domaine_shopify: shop, jeton_acces: access_token })
    .eq("email_contact", "samirabdou716@gmail.com");

  if (error) {
    return NextResponse.json({ erreur: error.message }, { status: 500 });
  }

  return NextResponse.redirect(`${origin}/espace`);
}
