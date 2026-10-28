export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-5">
      <p className="text-sm font-semibold uppercase tracking-widest text-brique">
        Erreur 404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-4 text-lg">
        Le lien est peut-être erroné, ou la page a été déplacée.
      </p>
      <a
        href="/"
        className="mt-8 flex min-h-14 items-center justify-center rounded-md bg-brique px-6 text-lg font-semibold text-creme"
      >
        Retour à l&apos;accueil
      </a>
    </main>
  );
}
