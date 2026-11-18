import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hzn-bg-base">
      <header className="border-b border-hzn-border-subtle bg-hzn-bg-muted">
        <div className="container-h flex items-center justify-between gap-4 py-5">
          <Link href="/" className="font-semibold text-hzn-text-primary hover:text-hzn-brand-300">
            Horizon Consultoria
          </Link>
          <Link href="/" className="text-sm text-hzn-text-secondary hover:text-hzn-brand-300">
            Voltar ao site
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-hzn-border-subtle bg-hzn-bg-muted">
        <div className="container-h flex flex-col gap-3 py-8 text-sm text-hzn-text-secondary md:flex-row md:items-center md:justify-between">
          <span>© 2026 Horizon Consultoria.</span>
          <nav aria-label="Documentos legais" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal/privacidade" className="hover:text-hzn-brand-300">
              Privacidade
            </Link>
            <Link href="/legal/termos-de-uso" className="hover:text-hzn-brand-300">
              Termos de uso
            </Link>
            <Link href="/legal/exclusao-de-dados" className="hover:text-hzn-brand-300">
              Exclusão de dados
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
