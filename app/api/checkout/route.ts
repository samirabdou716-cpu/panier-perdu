import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    console.error("Variables Stripe manquantes");
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
    console.error("Création de la session Stripe impossible", err);
    return NextResponse.redirect(`${origin}/paiement-annule?erreur=1`, 303);
  }
}
