import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clean(v: string | undefined): string {
  return (v ?? "").replace(/[^\x20-\x7E]/g, "").trim();
}

export async function GET() {
  const cle = clean(process.env.RESEND_API_KEY);

  if (!cle.startsWith("re_")) {
    return NextResponse.json(
      { ok: false, erreur: "RESEND_API_KEY absente ou invalide", longueur: cle.length },
      { status: 500 }
    );
  }

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1d1b16">
    <h2 style="font-family:Georgia,serif">Vous avez oublié quelque chose</h2>
    <p>Bonjour, votre panier vous attend toujours.</p>
    <p>Il reste 2 articles pour un total de 89,00 EUR.</p>
    <p>
      <a href="https://panier-perdu-yltd.vercel.app"
         style="background:#b4361b;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:4px;display:inline-block">
        Reprendre mon panier
      </a>
    </p>
    <p style="color:#777;font-size:12px">Email de test envoyé par Panier Perdu.</p>
  </div>`;

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Panier Perdu <onboarding@resend.dev>",
      to: ["samirabdou716@gmail.com"],
      subject: "Test relance 1 : vous avez oublié quelque chose",
      html,
    }),
  });

  const resultat = await reponse.json();
  return NextResponse.json({ ok: reponse.ok, statut: reponse.status, resultat });
}
