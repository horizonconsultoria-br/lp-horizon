# Andaime do Blog (F2a) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocar no ar `consultoriahorizon.com.br/blog` com pipeline MDX, metadados tipados validados no build e a camada de dados estruturados que o KPI de citação em IA exige.

**Architecture:** Rota Next dentro do app que já existe (o Traefik já roteia todo o host para `lp-horizon:3000`, então não há mudança de infra). Cada artigo é uma pasta em `content/blog/<slug>/` com `meta.ts` (TypeScript puro, validado por zod) e `corpo.mdx` (o texto). A separação é deliberada: o Vitest roda `environment: node` e só coleta `**/*.test.ts`, então manter `meta` em `.ts` permite testar a validação sem nenhum tooling de MDX. As páginas são estáticas via `generateStaticParams`.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5.7 · Tailwind 3 · zod 3 (já é dependência) · `@next/mdx` (nova) · Vitest 3.

**Spec:** `docs/superpowers/specs/2026-08-29-blog-f2a-andaime-design.md`

## Global Constraints

- **Idioma:** todo conteúdo, comentário de código e mensagem de commit em **português**, seguindo o repo.
- **Imports em teste:** usar caminho **relativo**, nunca o alias `@/`. O alias é resolvido pelo Next; o Vitest roda sem ele e o arquivo nem coleta. (Regra já documentada em `app/(home)/build-output.test.ts`.)
- **Arquivos de teste:** extensão **`.test.ts`** (nunca `.test.tsx`) — `vitest.config.ts` tem `include: ["**/*.test.ts"]`.
- **Não tocar em `infra/traefik/lp-horizon.yml`.** O host inteiro já é roteado; o arquivo tem aviso de incidente de TLS no topo.
- **Não alterar as regras de CSP em `next.config.ts`.** O catch-all `/:path((?!v2(?:$|/)|comercial(?:$|/)).+)` já cobre `/blog` e já permite `script-src 'unsafe-inline'`, que é o que o JSON-LD inline precisa.
- **Sitemap:** `/comercial` e `/lp2` continuam **fora** do sitemap. Racional no código de `app/sitemap.ts`: dois textos da mesma empresa competindo pela mesma busca.
- **Domínio canônico:** `https://consultoriahorizon.com.br` (sem `www`; o `www` redireciona 301 no Traefik).
- **Nenhum artigo pode ser publicado sem `resumo` e `termoAlvo`** — o build deve quebrar, não passar.

---

### Task 1: Schema e registro de artigos (TypeScript puro, sem MDX)

**Files:**
- Create: `content/blog/schema.ts`
- Create: `content/blog/index.ts`
- Create: `content/blog/melhor-sistema-para-clinicas/meta.ts`
- Test: `content/blog/schema.test.ts`

**Interfaces:**
- Consumes: nada (primeira task).
- Produces: `type ArtigoMeta` · `artigoMetaSchema` (zod) · `artigos: ArtigoMeta[]` · `buscarArtigo(slug: string): ArtigoMeta | undefined` · `slugs(): string[]`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `content/blog/schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
// Relativo, não "@/": o alias do tsconfig é resolvido pelo Next, e o Vitest
// roda sem ele; com "@/" o arquivo nem coleta.
import { artigoMetaSchema } from "./schema";
import { artigos, buscarArtigo, slugs } from "./index";

const valido = {
  slug: "exemplo",
  titulo: "Título de exemplo",
  resumo: "Resposta direta e curta, do tamanho que um mecanismo de resposta consegue levantar.",
  cluster: "vertical-sistema",
  termoAlvo: "termo de exemplo",
  publicadoEm: "2026-09-01",
  atualizadoEm: "2026-09-01",
  faq: [],
};

describe("schema do artigo", () => {
  it("aceita um artigo completo", () => {
    expect(artigoMetaSchema.safeParse(valido).success).toBe(true);
  });

  // O resumo é o bloco de resposta direta. Sem ele o artigo publica sem o
  // gancho de AEO, que é o motivo de o blog existir.
  it("rejeita artigo sem resumo", () => {
    const { resumo, ...semResumo } = valido;
    expect(artigoMetaSchema.safeParse(semResumo).success).toBe(false);
  });

  // Sem termoAlvo não há como ligar o artigo ao termo monitorado pelo motor
  // de medição (F1), e a página vira conteúdo órfão.
  it("rejeita artigo sem termoAlvo", () => {
    const { termoAlvo, ...semTermo } = valido;
    expect(artigoMetaSchema.safeParse(semTermo).success).toBe(false);
  });

  it("rejeita resumo curto demais para servir de resposta", () => {
    expect(artigoMetaSchema.safeParse({ ...valido, resumo: "curto" }).success).toBe(false);
  });

  it("rejeita data fora do formato ISO", () => {
    expect(artigoMetaSchema.safeParse({ ...valido, publicadoEm: "01/09/2026" }).success).toBe(false);
  });
});

describe("registro de artigos", () => {
  it("tem ao menos um artigo", () => {
    expect(artigos.length).toBeGreaterThan(0);
  });

  // A validação roda no import do índice, então um meta inválido derruba o
  // build. Este teste confirma que todo mundo que está registrado passa.
  it("todos os artigos registrados são válidos", () => {
    for (const a of artigos) {
      const r = artigoMetaSchema.safeParse(a);
      expect(r.success, `artigo inválido: ${a.slug}`).toBe(true);
    }
  });

  it("não tem slug duplicado", () => {
    expect(new Set(slugs()).size).toBe(slugs().length);
  });

  // O slug é a URL. Se ele divergir do nome da pasta, o corpo não é achado.
  it("o slug do meta bate com a chave do registro", () => {
    for (const a of artigos) {
      expect(buscarArtigo(a.slug)?.slug).toBe(a.slug);
    }
  });

  it("buscarArtigo devolve undefined para slug inexistente", () => {
    expect(buscarArtigo("nao-existe")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run content/blog/schema.test.ts`
Expected: FAIL — `Failed to resolve import "./schema"`.

- [ ] **Step 3: Escrever o schema**

Criar `content/blog/schema.ts`:

```ts
import { z } from "zod";

/** Clusters do discovery F0. Cada artigo pertence a exatamente um. */
export const CLUSTERS = [
  "vertical-sistema",
  "ia-juridica",
  "agencia",
  "ferramentas",
] as const;

const ISO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export const artigoMetaSchema = z.object({
  /** Vira a URL: /blog/<slug>. Precisa bater com o nome da pasta. */
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "slug só aceita minúsculas, números e hífen"),
  titulo: z.string().min(10),
  /** Resposta direta, renderizada no topo do artigo e usada na description.
   *  O piso de 80 caracteres existe porque resumo curto demais não serve de
   *  resposta para mecanismo de resposta — que é o motivo do blog existir. */
  resumo: z.string().min(80).max(320),
  cluster: z.enum(CLUSTERS),
  /** Termo monitorado que este artigo ataca. É a chave que liga conteúdo
   *  publicado a medição de citação no motor do F1. */
  termoAlvo: z.string().min(3),
  publicadoEm: z.string().regex(ISO_DATA, "use AAAA-MM-DD"),
  atualizadoEm: z.string().regex(ISO_DATA, "use AAAA-MM-DD"),
  /** Vira JSON-LD FAQPage quando não estiver vazio. */
  faq: z
    .array(z.object({ pergunta: z.string().min(5), resposta: z.string().min(20) }))
    .default([]),
});

export type ArtigoMeta = z.infer<typeof artigoMetaSchema>;
```

- [ ] **Step 4: Escrever o meta do primeiro artigo**

Criar `content/blog/melhor-sistema-para-clinicas/meta.ts`:

```ts
import type { ArtigoMeta } from "../schema";

export const meta: ArtigoMeta = {
  slug: "melhor-sistema-para-clinicas",
  titulo: "Melhor sistema para clínicas: como escolher sem trocar de novo em um ano",
  resumo:
    "Não existe melhor sistema para clínicas em geral: existe o que cobre agenda, prontuário e cobrança do seu porte sem exigir troca quando você crescer. Este guia compara os critérios que realmente decidem.",
  cluster: "vertical-sistema",
  termoAlvo: "melhor sistema para clinicas",
  publicadoEm: "2026-08-29",
  atualizadoEm: "2026-08-29",
  faq: [
    {
      pergunta: "Qual o melhor sistema para clínicas pequenas?",
      resposta:
        "Para clínica com até três profissionais, o que decide é agenda com confirmação automática e prontuário simples. Módulo fiscal completo costuma ser custo sem uso nesse porte.",
    },
    {
      pergunta: "Vale a pena trocar de sistema de gestão de clínica?",
      resposta:
        "Vale quando a migração de dados é possível e o sistema atual bloqueia algo que você já precisa hoje — não por causa de recurso que talvez seja usado no futuro.",
    },
  ],
};
```

- [ ] **Step 5: Escrever o registro**

Criar `content/blog/index.ts`:

```ts
import { artigoMetaSchema, type ArtigoMeta } from "./schema";
import { meta as melhorSistemaParaClinicas } from "./melhor-sistema-para-clinicas/meta";

// Uma linha por artigo. Publicar = criar a pasta com meta.ts + corpo.mdx e
// acrescentar aqui. Nenhuma outra mudança de código é necessária.
const registrados: ArtigoMeta[] = [melhorSistemaParaClinicas];

// A validação roda no import: um meta inválido derruba o build em vez de
// publicar artigo sem os ganchos que o blog existe para ter.
export const artigos: ArtigoMeta[] = registrados.map((a) => artigoMetaSchema.parse(a));

export function slugs(): string[] {
  return artigos.map((a) => a.slug);
}

export function buscarArtigo(slug: string): ArtigoMeta | undefined {
  return artigos.find((a) => a.slug === slug);
}
```

- [ ] **Step 6: Rodar o teste e confirmar que passa**

Run: `npx vitest run content/blog/schema.test.ts`
Expected: PASS — 11 testes verdes.

- [ ] **Step 7: Commit**

```bash
git add content/blog/schema.ts content/blog/index.ts content/blog/melhor-sistema-para-clinicas/meta.ts content/blog/schema.test.ts
git commit -m "feat(blog): schema tipado do artigo e registro validado por zod"
```

---

### Task 2: Pipeline MDX e mapa de corpos

**Files:**
- Modify: `package.json` (dependências)
- Modify: `next.config.ts` (envolver com `createMDX`)
- Create: `mdx.d.ts`
- Create: `content/blog/corpos.ts`
- Create: `content/blog/melhor-sistema-para-clinicas/corpo.mdx`
- Test: `content/blog/corpos.test.ts`

**Interfaces:**
- Consumes: `slugs()` de `content/blog/index.ts`.
- Produces: `corpos: Record<string, () => Promise<{ default: React.ComponentType }>>`.

- [ ] **Step 1: Instalar as dependências**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

- [ ] **Step 2: Escrever o teste que falha**

Criar `content/blog/corpos.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { corpos } from "./corpos";
import { slugs } from "./index";

// O registro (index.ts) e o mapa de corpos (corpos.ts) são duas listas
// mantidas à mão. Este teste é a guarda contra a única falha que essa
// duplicação permite: registrar o artigo e esquecer o corpo, ou o contrário.
// A página serviria 404 ou sumiria do índice sem ninguém notar.
describe("mapa de corpos", () => {
  it("tem exatamente uma entrada por artigo registrado", () => {
    expect(Object.keys(corpos).sort()).toEqual(slugs().sort());
  });

  it("cada entrada é uma função de import", () => {
    for (const [slug, carregar] of Object.entries(corpos)) {
      expect(typeof carregar, `corpo de ${slug} não é função`).toBe("function");
    }
  });
});
```

- [ ] **Step 3: Rodar o teste e confirmar que falha**

Run: `npx vitest run content/blog/corpos.test.ts`
Expected: FAIL — `Failed to resolve import "./corpos"`.

- [ ] **Step 4: Declarar o tipo dos módulos MDX**

Criar `mdx.d.ts` na raiz:

```ts
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const componente: ComponentType<Record<string, unknown>>;
  export default componente;
}
```

- [ ] **Step 5: Escrever o corpo do primeiro artigo**

Criar `content/blog/melhor-sistema-para-clinicas/corpo.mdx`:

```mdx
## O que realmente decide a escolha

A pergunta "qual o melhor sistema para clínicas" quase nunca tem resposta
única, porque três clínicas do mesmo tamanho operam de formas diferentes.
O que muda o resultado é o encaixe entre o que o sistema cobra caro para
fazer e o que a clínica faz todo dia.

| Critério | Por que decide |
| --- | --- |
| Agenda com confirmação automática | É onde a falta de paciente vira prejuízo direto |
| Prontuário eletrônico | Exigência prática e requisito de continuidade do atendimento |
| Cobrança e conciliação | Onde a operação pequena costuma perder dinheiro em silêncio |
| Exportação dos dados | Determina se a próxima troca será possível |

## O critério que quase ninguém checa antes de assinar

Exportação de dados. Um sistema que não deixa você sair transforma qualquer
limitação futura em obra. Antes de assinar, peça um export de teste — não a
promessa de que existe.

## Quando trocar não vale a pena

Trocar por recurso que talvez seja usado custa migração, retreinamento e
semanas de operação instável. Trocar por bloqueio que já existe hoje se paga.
```

- [ ] **Step 6: Escrever o mapa de corpos**

Criar `content/blog/corpos.ts`:

```ts
import type { ComponentType } from "react";

// Uma linha por artigo, com caminho literal de propósito: import com caminho
// montado em variável faz o bundler incluir a pasta inteira ou não achar nada.
// A guarda em corpos.test.ts garante que esta lista e o registro não divirjam.
export const corpos: Record<string, () => Promise<{ default: ComponentType }>> = {
  "melhor-sistema-para-clinicas": () =>
    import("./melhor-sistema-para-clinicas/corpo.mdx"),
};
```

- [ ] **Step 7: Envolver a config do Next com o MDX**

Em `next.config.ts`, adicionar o import no topo (depois do `import type { NextConfig }`):

```ts
import createMDX from "@next/mdx";
```

E trocar a última linha `export default nextConfig;` por:

```ts
// Só habilita o loader de .mdx para import. Os artigos NÃO são rotas (vivem
// em content/), então `pageExtensions` continua intocado de propósito.
const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 8: Rodar o teste e confirmar que passa**

Run: `npx vitest run content/blog/corpos.test.ts`
Expected: PASS — 2 testes verdes.

- [ ] **Step 9: Confirmar que o build ainda funciona com a dependência nova**

Run: `npm run build`
Expected: build conclui sem erro. Se falhar por Turbopack não reconhecer o loader, rodar `npm run build -- --no-turbopack` e registrar o achado no PR — é a variação conhecida do `@next/mdx` em Next 15.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json next.config.ts mdx.d.ts content/blog/corpos.ts content/blog/corpos.test.ts content/blog/melhor-sistema-para-clinicas/corpo.mdx
git commit -m "feat(blog): pipeline MDX e mapa de corpos com guarda de paridade"
```

---

### Task 3: Página do artigo com dados estruturados

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/layout.tsx`
- Create: `app/blog/blog.css`

**Interfaces:**
- Consumes: `artigos`, `buscarArtigo`, `slugs` de `content/blog/index.ts`; `corpos` de `content/blog/corpos.ts`.
- Produces: rota estática `/blog/<slug>`. HTML contém `<script type="application/ld+json">` com `BlogPosting` e, quando houver `faq[]`, `FAQPage`; e um `<div class="artigo-resposta">` com o `resumo`.

- [ ] **Step 1: Escrever o layout do blog**

Criar `app/blog/layout.tsx`:

```tsx
import "./blog.css";

// Herda o root layout (fontes, metadata base, JSON-LD da Organization).
// Aqui entra só o container de leitura.
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-shell">{children}</div>;
}
```

- [ ] **Step 2: Escrever o CSS do blog**

Criar `app/blog/blog.css`:

```css
/* Container de leitura. Sem design system novo: a Onda 1 é experimento de
   entrada, não projeto de marca. Herda tokens e fontes do layout raiz. */
.blog-shell {
  max-width: 46rem;
  margin: 0 auto;
  padding: 4rem 1.25rem 6rem;
}

.artigo-resposta {
  border-left: 3px solid currentColor;
  padding: 0.75rem 0 0.75rem 1rem;
  margin: 1.5rem 0 2.5rem;
  font-size: 1.125rem;
  line-height: 1.6;
}

.artigo-corpo table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.artigo-corpo th,
.artigo-corpo td {
  border: 1px solid rgba(127, 127, 127, 0.35);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.blog-indice-lista {
  list-style: none;
  padding: 0;
}

.artigo-relacionados {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(127, 127, 127, 0.35);
}
```

- [ ] **Step 3: Escrever a página do artigo**

Criar `app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artigos, buscarArtigo, slugs } from "@/content/blog";
import { corpos } from "@/content/blog/corpos";

const SITE = "https://consultoriahorizon.com.br";

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
      type: "article",
      publishedTime: artigo.publicadoEm,
      modifiedTime: artigo.atualizadoEm,
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
```

- [ ] **Step 4: Rodar o build e confirmar que a rota é gerada**

Run: `npm run build`
Expected: build passa e a saída lista `/blog/melhor-sistema-para-clinicas` como rota estática (`●` ou `SSG`).

- [ ] **Step 5: Commit**

```bash
git add app/blog/layout.tsx app/blog/blog.css "app/blog/[slug]/page.tsx"
git commit -m "feat(blog): pagina do artigo com BlogPosting, FAQPage e resposta direta"
```

---

### Task 4: Índice do blog

**Files:**
- Create: `app/blog/page.tsx`

**Interfaces:**
- Consumes: `artigos` de `content/blog/index.ts`.
- Produces: rota estática `/blog` listando todos os artigos agrupados por cluster.

- [ ] **Step 1: Escrever o índice**

Criar `app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { artigos } from "@/content/blog";
import { CLUSTERS } from "@/content/blog/schema";

const ROTULOS: Record<(typeof CLUSTERS)[number], string> = {
  "vertical-sistema": "Sistemas por vertical",
  "ia-juridica": "IA no jurídico",
  agencia: "Agências e serviço",
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
```

- [ ] **Step 2: Rodar o build e confirmar as duas rotas**

Run: `npm run build`
Expected: a saída lista `/blog` e `/blog/melhor-sistema-para-clinicas`.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat(blog): indice agrupado por cluster"
```

---

### Task 5: Sitemap, llms.txt e guardas de regressão

**Files:**
- Modify: `app/sitemap.ts`
- Create: `app/llms.txt/route.ts`
- Test: `app/blog/blog-build-output.test.ts`
- Test: `app/sitemap.test.ts`

**Interfaces:**
- Consumes: `artigos` de `content/blog/index.ts`.
- Produces: sitemap com a raiz e todos os artigos; `/llms.txt` servido como texto.

- [ ] **Step 1: Escrever os testes que falham**

Criar `app/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
// Relativo, não "@/": o Vitest roda sem o alias do tsconfig.
import sitemap from "./sitemap";
import { artigos } from "../content/blog";

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);

  it("anuncia a raiz", () => {
    expect(urls).toContain("https://consultoriahorizon.com.br/");
  });

  it("anuncia todos os artigos do blog", () => {
    for (const a of artigos) {
      expect(urls).toContain(`https://consultoriahorizon.com.br/blog/${a.slug}`);
    }
  });

  it("anuncia o índice do blog", () => {
    expect(urls).toContain("https://consultoriahorizon.com.br/blog");
  });

  // Guarda da regra que já existia antes deste blog: /comercial e /lp2 são
  // outros textos sobre a MESMA empresa. Anunciar os três poria a Horizon
  // competindo consigo mesma pela mesma busca. Se alguém "completar" o
  // sitemap no futuro, este teste fica vermelho.
  it("nunca anuncia /comercial nem /lp2", () => {
    expect(urls.some((u) => u.includes("/comercial"))).toBe(false);
    expect(urls.some((u) => u.includes("/lp2"))).toBe(false);
  });
});
```

Criar `app/blog/blog-build-output.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { artigos } from "../../content/blog";

const artigo = artigos[0];
const HTML = join(
  process.cwd(),
  ".next",
  "server",
  "app",
  "blog",
  artigo.slug + ".html",
);
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("HTML pré-renderizado do artigo", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  it("declara BlogPosting", () => {
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain(artigo.titulo);
  });

  // O publisher precisa ser a MESMA organização do layout raiz. Se alguém
  // trocar por outro nome, o artigo passa a reforçar uma entidade diferente
  // da do site, que é o oposto do objetivo.
  it("credita a publicação à Organization do site", () => {
    expect(html).toContain('"publisher":{"@type":"Organization","name":"HorizonConsultoria"');
  });

  it("declara FAQPage quando o artigo tem perguntas", () => {
    if (artigo.faq.length > 0) {
      expect(html).toContain('"@type":"FAQPage"');
      expect(html).toContain(artigo.faq[0].pergunta);
    }
  });

  // A resposta direta precisa estar no HTML servido, não só no componente.
  it("serve o bloco de resposta direta", () => {
    expect(html).toContain("artigo-resposta");
    expect(html).toContain(artigo.resumo.slice(0, 40));
  });

  it("declara o canonical do artigo", () => {
    expect(html).toMatch(
      new RegExp(`rel="canonical"[^>]*href="https://consultoriahorizon\\.com\\.br/blog/${artigo.slug}"`),
    );
  });

  it("tem exatamente um h1", () => {
    expect(html.match(/<h1[\s>]/gi)?.length ?? 0).toBe(1);
  });

  // Tabela comparativa precisa ser tabela de verdade: imagem não é
  // recuperável por modelo, e conteúdo de decisão vive de comparação.
  it("renderiza tabela como HTML e não como imagem", () => {
    expect(html).toContain("<table");
  });
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npx vitest run app/sitemap.test.ts`
Expected: FAIL — o sitemap não contém as URLs do blog.

- [ ] **Step 3: Atualizar o sitemap**

Substituir o conteúdo de `app/sitemap.ts` por:

```ts
import type { MetadataRoute } from "next";
import { artigos } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://consultoriahorizon.com.br";
  // /comercial existe e responde, mas é a página anterior: anunciar as duas
  // no sitemap poria dois textos sobre a mesma empresa competindo pela mesma
  // busca. /lp2 é a v1 e segue fora daqui pelo mesmo motivo. Os artigos do
  // blog ENTRAM porque são conteúdo próprio, não variação da mesma página.
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...artigos.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.atualizadoEm),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

- [ ] **Step 4: Rodar o teste do sitemap e confirmar que passa**

Run: `npx vitest run app/sitemap.test.ts`
Expected: PASS — 4 testes verdes.

- [ ] **Step 5: Criar o llms.txt**

Criar `app/llms.txt/route.ts`:

```ts
import { artigos } from "@/content/blog";

export const dynamic = "force-static";

// Convenção emergente: um índice em texto do que o site tem, para quem
// consome a página por modelo em vez de navegador.
export function GET() {
  const base = "https://consultoriahorizon.com.br";
  const linhas = [
    "# HorizonConsultoria",
    "",
    "> Avaliação e implementação de ferramentas de IA e automação para pequenas e médias empresas, por vertical.",
    "",
    "## Blog",
    "",
    ...artigos.map((a) => `- [${a.titulo}](${base}/blog/${a.slug}): ${a.resumo}`),
    "",
  ];
  return new Response(linhas.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 6: Rodar o build e depois a suíte inteira**

Run: `npm run build && npx vitest run`
Expected: build passa; todos os testes verdes, incluindo `blog-build-output.test.ts`, que só roda depois do build existir.

- [ ] **Step 7: Commit**

```bash
git add app/sitemap.ts app/sitemap.test.ts app/llms.txt/route.ts app/blog/blog-build-output.test.ts
git commit -m "feat(blog): sitemap com artigos, llms.txt e guardas de regressao"
```

---

### Task 6: Verificação do build em container

**Files:**
- Modify: nenhum (verificação)

**Interfaces:**
- Consumes: o `Dockerfile` existente e a config `output: "standalone"`.
- Produces: prova de que a dependência nova não quebra a imagem de produção.

- [ ] **Step 1: Construir a imagem**

```bash
docker build -t lp-horizon:mdx-check .
```

Expected: build conclui. **Este passo existe porque `npm run build` local não prova nada sobre a imagem** — o `horizon-crm` levou exatamente esse susto em 21/08, quando uma dependência nativa passou local e quebrou no container por cache envenenado (PR #145).

- [ ] **Step 2: Subir o container e conferir as rotas servidas**

```bash
docker run --rm -d -p 3001:3000 --name lp-horizon-check lp-horizon:mdx-check
curl -s -o /dev/null -w "%{http_code} /blog\n" http://localhost:3001/blog
curl -s -o /dev/null -w "%{http_code} /blog/melhor-sistema-para-clinicas\n" http://localhost:3001/blog/melhor-sistema-para-clinicas
curl -s http://localhost:3001/llms.txt | head -n 5
curl -s http://localhost:3001/sitemap.xml | grep -c "/blog/"
```

Expected: `200 /blog` · `200 /blog/melhor-sistema-para-clinicas` · o `llms.txt` começa com `# HorizonConsultoria` · o grep no sitemap retorna pelo menos 1.

- [ ] **Step 3: Conferir os dados estruturados no HTML servido**

```bash
curl -s http://localhost:3001/blog/melhor-sistema-para-clinicas | grep -o '"@type":"[A-Za-z]*"' | sort -u
```

Expected: aparecem `"@type":"BlogPosting"`, `"@type":"FAQPage"`, `"@type":"Organization"` e `"@type":"Question"`.

- [ ] **Step 4: Derrubar o container**

```bash
docker stop lp-horizon-check
```

- [ ] **Step 5: Commit da nota de verificação**

Não há arquivo a commitar nesta task. Registrar no corpo do PR o resultado dos passos 2 e 3, colando a saída real dos comandos — não a afirmação de que passaram.

---

## Notas para quem executa

- **Desvio consciente da spec, na estrutura de arquivos.** A spec §3.2 previa `content/blog/<slug>.mdx` com o `meta` exportado do próprio MDX. O plano separa em `content/blog/<slug>/meta.ts` + `corpo.mdx`. **Motivo:** o `vitest.config.ts` roda `environment: "node"` e coleta apenas `**/*.test.ts` — com o `meta` dentro do MDX, testar a validação do schema exigiria carregar o loader de MDX no Vitest. Separando, a Task 1 inteira é TypeScript puro e testável sem nenhum tooling novo, e a dependência de MDX só entra na Task 2. O contrato da spec (meta tipado, validado por zod, build quebra sem os campos) fica intacto.

- **A branch de trabalho é `docs/geo-discovery-f0`**, que já contém as duas specs. Se preferir branch nova, criar a partir de `origin/main` e trazer as specs junto.
- **Não mexer no `metadata` raiz de `app/layout.tsx` neste plano.** A spec (§4.3) recomenda revisar título, descrição e keywords porque descrevem o posicionamento que o discovery descartou — mas isso é copy institucional e decisão do founder, não parte do andaime.
- **Publicar um artigo novo, depois deste plano, são três passos:** criar `content/blog/<slug>/meta.ts` e `corpo.mdx`, acrescentar uma linha em `content/blog/index.ts` e uma em `content/blog/corpos.ts`. A guarda de paridade em `corpos.test.ts` avisa se esquecer uma das duas.
