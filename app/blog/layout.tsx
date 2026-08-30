import Link from "next/link";
import "./blog.css";

// Herda o root layout (fontes, metadata base, JSON-LD da Organization).
// Aqui entra o container de leitura e a navegação.
//
// A navegação vive AQUI, e não em cada página, porque cobre todo artigo
// presente e futuro sem trabalho por artigo. Sem ela o artigo é um beco:
// quem chega de um mecanismo de resposta lê a página e não tem caminho de
// volta nem para o índice do blog nem para o site — que é justamente o
// caminho pelo qual a citação vira visita e a visita vira conversa.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-shell">
      <nav className="blog-nav" aria-label="Navegação do blog">
        <Link href="/">Horizon</Link>
        <Link href="/blog">Blog</Link>
      </nav>
      {children}
    </div>
  );
}
