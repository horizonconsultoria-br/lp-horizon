import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artigos, buscarArtigo, slugs } from "@/content/blog";
import { corpos } from "@/content/blog/corpos";

const SITE = "https://consultoriahorizon.com.br";

// Mesma imagem e mesmo locale do layout raiz. Repetidos aqui de propósito:
// o Next mescla `metadata` de forma RASA, então declarar `openGraph` no filho
// SUBSTITUI o do pai inteiro. Sem estas três linhas o artigo perde og:image,
// og:site_name e og:locale — o que a comparação com /blog (que não declara
// openGraph nenhum e por isso herda tudo) mostra no HTML gerado.
const OG_IMAGEM = "/og-image.png";
const OG_SITE = "HorizonConsultoria";
const OG_LOCALE = "pt_BR";

export function generateStaticParams() {
  return slugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = buscarArtigo(slug);
  if (!artigo) return {};
  return {
    title: artigo.titulo,
    description: artigo.resumo,
    alternates: { canonical: `/blog/${artigo.slug}` },
    openGraph: {
      title: artigo.titulo,
      description: artigo.resumo,
      url: `${SITE}/blog/${artigo.slug}`,
      siteName: OG_SITE,
      locale: OG_LOCALE,
      type: "article",
      publishedTime: artigo.publicadoEm,
      modifiedTime: artigo.atualizadoEm,
      images: [
        { url: OG_IMAGEM, width: 1200, height: 630, alt: artigo.titulo },
      ],
    },
    // Sem este bloco o artigo herda o `twitter` da raiz, e todo artigo
    // compartilhado sai anunciando a manchete da landing em vez da própria.
    twitter: {
      card: "summary_large_image",
      title: artigo.titulo,
      description: artigo.resumo,
      images: [OG_IMAGEM],
    },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = buscarArtigo(slug);
  if (!artigo) notFound();

  const carregar = corpos[slug];
  if (!carregar) notFound();
  const { default: Corpo } = await carregar();

  // BlogPosting aponta o publisher para a mesma Organization declarada no
  // layout raiz: o artigo REFORÇA a entidade que já existe em vez de criar
  // outra. É o objetivo da decisão de publicar em subpasta, não subdomínio.
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: artigo.titulo,
    description: artigo.resumo,
    datePublished: artigo.publicadoEm,
    dateModified: artigo.atualizadoEm,
    inLanguage: "pt-BR",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${artigo.slug}` },
    author: { "@type": "Organization", name: "HorizonConsultoria", url: SITE },
    publisher: { "@type": "Organization", name: "HorizonConsultoria", url: SITE },
  };

  // FAQPage só existe quando há perguntas. Emitir um FAQPage vazio é sinal
  // estruturado mentindo, e mecanismo de resposta pune isso.
  const faqPage =
    artigo.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: artigo.faq.map((f) => ({
            "@type": "Question",
            name: f.pergunta,
            acceptedAnswer: { "@type": "Answer", text: f.resposta },
          })),
        }
      : null;

  // Spokes do mesmo cluster, menos o próprio artigo.
  const relacionados = artigos.filter(
    (a) => a.cluster === artigo.cluster && a.slug !== artigo.slug,
  );

  return (
    <article>
      <script
        type="application/ld+json"
        id="ld-blogposting"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          id="ld-faqpage"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}

      <h1>{artigo.titulo}</h1>

      {/* Resposta direta no topo: mecanismo de resposta levanta trecho curto
          e extraível. Enterrar a resposta na conclusão é o erro clássico. */}
      <div className="artigo-resposta">{artigo.resumo}</div>

      <div className="artigo-corpo">
        <Corpo />
      </div>

      {artigo.faq.length > 0 && (
        <section className="artigo-faq">
          <h2>Perguntas frequentes</h2>
          {artigo.faq.map((f) => (
            <details key={f.pergunta} className="artigo-faq-item">
              <summary>{f.pergunta}</summary>
              <p>{f.resposta}</p>
            </details>
          ))}
        </section>
      )}

      {/* Links internos do cluster. É o que materializa o método hub-spoke do
          discovery: artigos do mesmo cluster se apontam, formando um bloco
          temático em vez de páginas soltas. Com um artigo só a lista fica
          vazia e a seção não é renderizada — ela cresce sozinha a cada
          artigo novo, sem mudança de código. */}
      {relacionados.length > 0 && (
        <nav className="artigo-relacionados">
          <h2>Também neste tema</h2>
          <ul>
            {relacionados.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`}>{r.titulo}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
