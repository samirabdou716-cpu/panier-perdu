"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-5">
      <p className="text-sm font-semibold uppercase tracking-widest text-brique">
        Erreur
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
        Un problème est survenu.
      </h1>
      <p className="mt-4 text-lg">
        Ce n&apos;est pas de votre faute. Réessayez, ou revenez à l&apos;accueil.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 flex min-h-14 items-center justify-center rounded-md bg-brique px-6 text-lg font-semibold text-creme"
      >
        Réessayer
      </button>
      <a href="/" className="mt-4 text-center underline">
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
