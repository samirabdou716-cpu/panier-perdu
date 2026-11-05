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

function echapper(texte: string) {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function mettreEnPage(contenu: string, boutique: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#f6f1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
          <tr>
            <td style="font-family:Georgia,serif;font-size:22px;color:#1d1b16;padding-bottom:20px;">${boutique}</td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e6dfd0;border-radius:8px;padding:32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1d1b16;">
              ${contenu}
            </td>
          </tr>
          <tr>
            <td style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#7a746a;padding-top:20px;text-align:center;">
              Vous recevez cet email car vous avez commencé une commande chez ${boutique}.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function bouton(lien: string, texte: string) {
  return `<p style="margin:28px 0;"><a href="${lien}" style="background:#b4361b;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;display:inline-block;">${texte}</a></p>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parEntete =
    request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
  const parAdresse = false;

  if (!parEntete && !parAdresse) {
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
    .not("email_client", "is", null)
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
    const nomBoutique = echapper(boutique?.nom_boutique ?? "Votre boutique");
    const codePromo = boutique?.code_promo ? echapper(boutique.code_promo) : null;
    const prenom = panier.prenom ? ` ${echapper(panier.prenom)}` : "";
    const produits = echapper(panier.produits ?? "vos articles");
    const lien = echapper(panier.url_reprise ?? "");
    const expediteur = `${boutique?.nom_boutique ?? "Votre boutique"} <relance@panierperdu.org>`;

    if (!premiere) {
      const { error: erreurNote } = await supabase
        .from("relances")
        .insert({ panier_id: panier.id, numero: 1 });
      if (erreurNote) {
        return NextResponse.json({ erreur: erreurNote.message }, { status: 500 });
      }

      const contenu = `
        <p style="margin:0 0 16px;">Bonjour${prenom},</p>
        <p style="margin:0 0 16px;">Vous avez laissé quelque chose de côté : <strong>${produits}</strong> vous attend toujours dans votre panier.</p>
        <p style="margin:0;">Un imprévu, un doute, un coup de téléphone ? Votre sélection est gardée au chaud, vous pouvez la retrouver en un clic.</p>
        ${bouton(lien, "Reprendre mon panier")}
        <p style="margin:0;">À très vite,<br>${nomBoutique}</p>`;

      const ok = await envoyerEmail(
        panier.email_client,
        expediteur,
        "Vous avez oublié quelque chose",
        mettreEnPage(contenu, nomBoutique)
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
        ? `<p style="margin:20px 0 0;padding:14px;background:#f6f1e7;border-radius:6px;text-align:center;">Pour vous remercier de votre patience, voici un petit cadeau :<br><strong style="font-size:20px;letter-spacing:1px;color:#b4361b;">${codePromo}</strong></p>`
        : "";

      const contenu = `
        <p style="margin:0 0 16px;">Bonjour${prenom},</p>
        <p style="margin:0 0 16px;">Votre panier avec <strong>${produits}</strong> est toujours là, mais nous ne pouvons pas le garder indéfiniment.</p>
        <p style="margin:0;">Si vous hésitez encore, c'est le bon moment pour finaliser votre commande.</p>
        ${bloc}
        ${bouton(lien, "Finaliser ma commande")}
        <p style="margin:0;">Bien cordialement,<br>${nomBoutique}</p>`;

      const ok = await envoyerEmail(
        panier.email_client,
        expediteur,
        "Dernier rappel pour votre panier",
        mettreEnPage(contenu, nomBoutique)
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