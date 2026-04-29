import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-hzn-bg-muted border-t border-hzn-border-subtle">
      <div className="container-h py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Coluna 1 — brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-hzn-brand-500 flex items-center justify-center text-hzn-text-inverse font-extrabold text-xl">
                H
              </div>
              <div>
                <div className="font-bold text-hzn-text-primary">HorizonConsultoria</div>
                <div className="text-xs text-hzn-text-muted tracking-wider">SOFTWARE HOUSE IA-NATIVE</div>
              </div>
            </div>
            <p className="mt-5 text-sm text-hzn-text-secondary leading-relaxed">
              A camada de IA dentro do seu produto.
            </p>
            <p className="mt-6 text-xs text-hzn-text-muted leading-relaxed">
              CNPJ 37.111.839/0001-07
              <br />
              {/* TODO founder fornecer razão social */}
              {/* TODO founder fornecer endereço fiscal */}
            </p>
          </div>

          {/* Coluna 2 — empresa */}
          <div>
            <div className="text-xs font-semibold text-hzn-text-muted tracking-wider mb-4">
              EMPRESA
            </div>
            <ul className="space-y-2 text-sm text-hzn-text-secondary">
              <li>
                <Link href="#diferencial" className="hover:text-hzn-brand-400">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="#cases" className="hover:text-hzn-brand-400">
                  Cases
                </Link>
              </li>
              <li className="text-hzn-text-muted">Blog (em breve)</li>
              <li>
                <Link href="/legal/privacidade" className="hover:text-hzn-brand-400">
                  Política de privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 — contato */}
          <div>
            <div className="text-xs font-semibold text-hzn-text-muted tracking-wider mb-4">
              CONTATO
            </div>
            <ul className="space-y-2 text-sm text-hzn-text-secondary">
              <li>
                <a
                  href="mailto:contato@consultoriahorizon.com.br"
                  className="hover:text-hzn-brand-400"
                >
                  contato@consultoriahorizon.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/rodrigo-almeida-gustavo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-hzn-brand-400"
                >
                  LinkedIn — Rodrigo
                </a>
              </li>
              <li>
                <Link href="#como" className="hover:text-hzn-brand-400">
                  Agendar call
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hzn-border-subtle flex flex-col md:flex-row justify-between gap-3 text-xs text-hzn-text-muted">
          <span>© 2026 HorizonConsultoria.</span>
          <span>Construindo IA dentro do produto, não em volta dele.</span>
        </div>
      </div>
    </footer>
  );
}
