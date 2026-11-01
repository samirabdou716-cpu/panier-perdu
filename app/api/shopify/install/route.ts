import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (!shop || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.json({ erreur: "boutique invalide" }, { status: 400 });
  }

  const adresse =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_API_KEY}` +
    `&scope=read_checkouts,read_customers` +
    `&redirect_uri=${origin}/api/shopify/callback`;

  return NextResponse.redirect(adresse);
}
