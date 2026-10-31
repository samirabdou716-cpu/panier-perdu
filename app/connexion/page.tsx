"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"repos" | "envoi" | "envoye" | "erreur">("repos");

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    if (error)alert(error.message);
    setEtat(error ? "erreur" : "envoye");
  }

  return (
    <main style={{ background: "#f6f1e7", color: "#1d1b16", minHeight: "100vh" }}
      className="flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl mb-2" style={{ fontFamily: "Fraunces, serif" }}>
          Accéder à votre espace
        </h1>
        <p className="mb-8 opacity-80">
          Entrez l'email utilisé lors du paiement. Nous vous envoyons un lien de connexion, sans mot de passe.
        </p>

        {etat === "envoye" ? (
          <p className="p-4 rounded border" style={{ borderColor: "#b4361b" }}>
            C'est parti. Regardez votre boîte mail (et les spams) : cliquez sur le lien pour entrer.
          </p>
        ) : (
          <form onSubmit={envoyer} className="flex flex-col gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@boutique.com"
              className="p-3 rounded border bg-white"
              style={{ borderColor: "#1d1b16" }}
            />
            <button
              type="submit"
              disabled={etat === "envoi"}
              className="p-3 rounded text-white"
              style={{ background: "#b4361b" }}
            >
              {etat === "envoi" ? "Envoi..." : "Recevoir mon lien de connexion"}
            </button>
            {etat === "erreur" && (
              <p style={{ color: "#b4361b" }}>
                Impossible d'envoyer le lien. Réessayez dans une minute.
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
