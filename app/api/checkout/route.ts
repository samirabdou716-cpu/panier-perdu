import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

// Ne garde que les caracteres ASCII visibles : retire espaces, retours a la ligne, caracteres invisibles.
const clean = (v: string | undefined) => (v ?? "").replace(/[^\x21-\x7E]/g, "");

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const rawKey = process.env.STRIPE_SECRET_KEY;
  const rawPrice = process.env.STRIPE_PRICE_ID;
  const secretKey = clean(rawKey);
  const priceId = clean(rawPrice);

  console.log("Diagnostic Stripe", {
    cleLongueur: secretKey.length,
    clePrefixe: secretKey.slice(0, 8),
    cleNettoyee: (rawKey ?? "").length !== secretKey.length,
    prixLongueur: priceId.length,
    prixPrefixe: priceId.slice(0, 6),
    prixNettoye: (rawPrice ?? "").length !== priceId.length,
  });

  if (!secretKey || !priceId) {
    console.error("Variables Stripe manquantes");
    return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
  }
  if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
    console.error("STRIPE_SECRET_KEY ne commence pas par sk_test_ ou sk_live_");
    return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
  }
  if (!priceId.startsWith("price_")) {
    console.error("STRIPE_PRICE_ID ne commence pas par price_");
    return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: "fr",
      billing_address_collection: "auto",
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/paiement-annule`,
      custom_text: {
        submit: {
          message:
            "Accès fondateur : livraison sous 3 semaines, remboursement sur simple demande si ce délai n'est pas tenu.",
        },
      },
    });

    if (!session.url) {
      return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
    }
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const e = err as { type?: string; code?: string; message?: string };
    console.error("Création de la session Stripe impossible", {
      type: e.type,
      code: e.code,
      message: e.message,
    });
    return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
  }
}
