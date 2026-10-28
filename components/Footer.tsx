export default function Footer() {
  return (
    <footer className="mx-auto max-w-xl border-t border-encre/15 px-5 py-8 text-sm">
      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        <a href="/mentions-legales" className="underline">
          Mentions légales
        </a>
        <a href="/cgv" className="underline">
          Conditions générales de vente
        </a>
        <a href="/confidentialite" className="underline">
          Politique de confidentialité
        </a>
      </nav>
      <p className="mt-4 opacity-70">© 2026 Panier Perdu</p>
    </footer>
  );
}
