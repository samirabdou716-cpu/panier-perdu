import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!secretKey || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Configuration manquante" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("PAIEMENT CONFIRME", {
        session: session.id,
        email: session.customer_details?.email,
        montant: session.amount_total,
        statut: session.payment_status,
      });
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("PAIEMENT ECHOUE", { facture: invoice.id, email: invoice.customer_email });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log("ABONNEMENT RESILIE", { abonnement: sub.id });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
