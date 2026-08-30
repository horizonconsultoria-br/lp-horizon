import "./blog.css";

// Herda o root layout (fontes, metadata base, JSON-LD da Organization).
// Aqui entra só o container de leitura.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-shell">{children}</div>;
}
