import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clean = (v: string | undefined) =>
  (v ?? "").replace(/[^\x20-\x7E]/g, "").trim();

export async function POST(request: Request) {
  const secretKey = clean(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = clean(process.env.STRIPE_WEBHOOK_SECRET);
  const supabaseUrl = clean(process.env.SUPABASE_URL);
  const supabaseKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const signature = request.headers.get("stripe-signature");

  if (!secretKey || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Configuration manquante" }, { status: 400 });
  }
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const supabase = createClient(supabaseUrl, supabaseKey);
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Signature webhook invalide", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = (session.customer_details?.email ?? session.customer_email ?? "").toLowerCase();
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      console.log("Paiement reçu", { email, customerId });
      if (customerId) {
        const { error } = await supabase
          .from("boutiques")
          .upsert(
            { stripe_customer_id: customerId, statut_abonnement: "actif", email_contact: email },
            { onConflict: "stripe_customer_id" }
          );
        if (error) console.error("Erreur Supabase (paiement)", error);
      }
    }
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (customerId) {
        const { error } = await supabase
          .from("boutiques")
          .update({ statut_abonnement: "impaye" })
          .eq("stripe_customer_id", customerId);
        if (error) console.error("Erreur Supabase (impayé)", error);
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (customerId) {
        const { error } = await supabase
          .from("boutiques")
          .update({ statut_abonnement: "annule" })
          .eq("stripe_customer_id", customerId);
        if (error) console.error("Erreur Supabase (annulation)", error);
      }
    }
  } catch (err) {
    console.error("Erreur traitement webhook", err);
  }

  return NextResponse.json({ received: true });
}
