import type { Metadata } from "next";
import Link from "next/link";
import { artigos } from "@/content/blog";
import { CLUSTERS } from "@/content/blog/schema";

const ROTULOS: Record<(typeof CLUSTERS)[number], string> = {
  "vertical-sistema": "Sistemas por vertical",
  "ia-juridica": "IA no jurídico",
  servico: "Serviço em campo aberto",
  ferramentas: "Ferramentas e CRM",
};

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Análises de ferramentas de IA, automação e gestão para pequenas e médias empresas, por vertical.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndice() {
  // Agrupa por cluster e esconde cluster vazio: a lista cresce por onda, e
  // seção vazia anunciaria conteúdo que não existe.
  const porCluster = CLUSTERS.map((c) => ({
    cluster: c,
    itens: artigos.filter((a) => a.cluster === c),
  })).filter((g) => g.itens.length > 0);

  return (
    <div>
      <h1>Blog</h1>
      {porCluster.map((g) => (
        <section key={g.cluster}>
          <h2>{ROTULOS[g.cluster]}</h2>
          <ul className="blog-indice-lista">
            {g.itens.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`}>{a.titulo}</Link>
                <p>{a.resumo}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
