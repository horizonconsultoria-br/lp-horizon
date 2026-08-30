# Design F2a — Andaime do blog em `consultoriahorizon.com.br/blog`

> **Status: superseded por `2026-08-30-blog-wordpress-subpasta-design.md`.**
>
> Este documento descreve o blog como rotas MDX dentro do Next, andaime que foi
> revertido no commit `a6e33c1`. O `/blog` hoje é um WordPress em container
> próprio, roteado pelo Traefik com `stripPrefix` — a afirmação da §2 de que "o
> `/blog` não precisa de Traefik" é hoje **falsa** e induz ao erro. Leia o
> documento sucessor antes de usar qualquer coisa daqui.

- **Data:** 2026-08-29
- **Status:** design proposto · aguardando revisão do founder
- **Repo:** `lp-horizon` (Next.js 15 App Router · React 19 · Tailwind 3 · Vitest)
- **Insumo:** [`2026-08-29-blog-horizon-geo-discovery-design.md`](./2026-08-29-blog-horizon-geo-discovery-design.md) (discovery F0)
- **Escopo:** apenas o andaime. Os artigos são F2c; a skill redatora é F2b.

---

## 1. Decisões que chegam do F0 e desta sessão

| # | Decisão | Origem |
|---|---|---|
| D6 | Blog em **`consultoriahorizon.com.br/blog`**, não em subdomínio | F0 |
| D8 | Meta = **entrar**. Onda 1 é experimento com critério de parada | F0 |
| D10 | Artigos em **MDX no repositório** | esta sessão |
| D11 | Autoria via **skill `horizon-article-writer`**, destilada do 1º artigo real | esta sessão |
| D12 | Sequência **F2a → artigo 1 → F2b (skill) → F2c (artigos 2-6)** | esta sessão |
| D13 | Abordagem **`@next/mdx` + `meta` tipado validado por zod** | esta sessão |

---

## 2. Correção de premissa: o `/blog` não precisa de Traefik

O F0 registrou que a subpasta seria servida "roteando o path para um container separado". **Desnecessário.** O router `https-lp-horizon-apex` em `infra/traefik/lp-horizon.yml` já encaminha **todo** o host `consultoriahorizon.com.br` para `lp-horizon:3000`, sem regra por path.

**Consequência:** uma rota `/blog` dentro do Next.js atual é servida automaticamente. **Zero mudança de infra, zero container novo, zero mexida no arquivo do Traefik** — que, dado o incidente de TLS de 15/08 documentado no topo dele, é uma boa notícia por si só.

Container separado continua possível se um dia o blog precisar de deploy independente. **Não é o caso da Onda 1** (6 páginas, experimento de entrada): seria maquinaria antes de necessidade.

---

## 3. Arquitetura

### 3.1 Rotas

```
app/blog/page.tsx            → índice do blog (lista de artigos, agrupada por cluster)
app/blog/[slug]/page.tsx     → artigo, via import dinâmico do MDX
app/blog/layout.tsx          → layout do blog (herda o root layout)
```

`generateStaticParams` a partir do índice de conteúdo → **todas as páginas estáticas no build**. Sem runtime, sem banco, sem fetch.

### 3.2 Conteúdo

```
content/blog/
  <slug>.mdx                 → artigo: exporta `meta` tipado + corpo MDX
  index.ts                   → registro dos artigos + validação zod no build
  schema.ts                  → tipo `ArtigoMeta` + schema zod
```

Cada artigo abre com:

```tsx
export const meta = {
  slug: "melhor-sistema-para-clinicas",
  titulo: "...",
  resumo: "...",            // resposta direta, extraível por answer engine
  cluster: "vertical-sistema",
  termoAlvo: "melhor sistema para clinicas",
  publicadoEm: "2026-09-XX",
  atualizadoEm: "2026-09-XX",
  faq: [ { pergunta: "...", resposta: "..." } ],
} satisfies ArtigoMeta;
```

**Por que `meta` exportado e não frontmatter YAML:** o `meta` é **código**. O TypeScript cobra os campos na hora de escrever e o zod valida no build — um artigo que esqueça `resumo` ou `termoAlvo` **quebra o build** em vez de publicar sem os ganchos de GEO. É a tradução direta do padrão já usado em `content/prova.ts`, onde o conteúdo é objeto tipado (`Bloco`, `Item`, `Destaque`), e aproveita o `zod` que já é dependência do projeto.

### 3.3 Dependência nova

`@next/mdx` (+ `@mdx-js/react`, `@mdx-js/loader`), configurados em `next.config.ts`. É a via oficial do Next para MDX.

---

## 4. Camada GEO/AEO

### 4.1 O que já existe e deve ser reusado

`app/layout.tsx` já traz JSON-LD com **`Organization` + `Service`×4 + `FAQPage` + `WebSite`**, `metadataBase`, canonical e template de título `%s · HorizonConsultoria`. **O blog reforça uma entidade existente em vez de criar outra** — que é exatamente o objetivo de D6. Nada disso se refaz.

### 4.2 O que o andaime acrescenta

| Item | Por quê |
|---|---|
| JSON-LD **`BlogPosting`** por artigo (autor, `datePublished`, `dateModified`, `publisher` → a mesma `Organization`) | Amarra cada artigo à entidade Horizon |
| JSON-LD **`FAQPage`** quando o artigo tem `faq[]` | Answer engine levanta pergunta/resposta estruturada; é o gancho de AEO mais barato que existe |
| **Bloco de resposta direta** no topo, alimentado por `meta.resumo` | Modelo precisa de trecho conciso e extraível; enterrar a resposta na conclusão é o erro clássico |
| **Tabelas comparativas em HTML real**, nunca imagem | Conteúdo de decisão vive de tabela — e imagem não é recuperável por modelo |
| `alternates.canonical` por artigo | URL estável e sem duplicata |
| **Links internos hub → spokes** | Materializa o método de cluster do F0 |
| `public/llms.txt` | Convenção emergente, custo de minutos |

### 4.3 ⚠️ Achado de alta alavanca: os sinais de entidade contradizem o posicionamento

O `metadata` raiz em `app/layout.tsx` descreve a empresa assim:

- **title:** *"IA-native ou ser engolido pela concorrência"*
- **description:** *"Software house que constrói IA dentro do seu produto. Squad em 7 dias…"*
- **keywords:** `software house IA` · `consultoria IA Brasil` · `squad de desenvolvimento` · `agentes Claude` · `MCPs` · `AI-OS` · `IA vertical`

**Medido no F0:** `fabrica de software` = **2** de volume em assistentes de IA · `desenvolvimento de software sob medida` = **1** · `consultoria de inteligencia artificial` = **0**. É exatamente a frente que o discovery cortou por dado.

**Em GEO, `Organization` e `metadata` são o que define a entidade que o modelo aprende.** Publicar artigos sobre "melhor sistema para clínicas" sob uma organização que se descreve como fábrica de squads emite sinal contraditório — e sinal contraditório é o oposto do contorno nítido que faz um modelo citar.

**Recomendação:** revisar `title`, `description`, `keywords` e a descrição da `Organization` para a linha editorial do F0 (*avaliar e implementar ferramentas de IA e automação para PME, por vertical*). **Alta alavanca, custo de uma tarde, e independe de qualquer artigo.** Fica como decisão do founder — mexe em copy institucional, não em andaime.

---

## 5. Sitemap

`app/sitemap.ts` hoje lista **apenas a raiz**, com racional escrito no código: `/comercial` e `/lp2` ficam fora para não pôr dois textos da mesma empresa competindo pela mesma busca.

**Esse racional é o argumento de entidade do F0 e deve ser preservado.** Os artigos entram no sitemap (são conteúdo único, não variação de LP), gerados a partir do índice de conteúdo. `/comercial` e `/lp2` seguem fora.

---

## 6. Testes

O repo testa até saída de build (`app/(home)/build-output.test.ts`, `prova.css.test.ts`). O andaime segue a régua:

1. **Validação de `meta`** — schema zod rejeita artigo sem campo obrigatório.
2. **Rotas** — todo artigo registrado gera rota; nenhum slug órfão; nenhum slug duplicado.
3. **Sitemap** — contém a raiz e todos os artigos; **não** contém `/comercial` nem `/lp2` (protege a regra existente contra regressão).
4. **JSON-LD** — `BlogPosting` presente e válido; `FAQPage` presente quando há `faq[]`.
5. **Saída de build** — o HTML servido contém o bloco de resposta direta e o JSON-LD, no espírito do `build-output.test.ts` que já existe.

---

## 7. Riscos

| Risco | Mitigação |
|---|---|
| **Dependência nova quebra o build em container.** O `horizon-crm` levou exatamente esse susto em 21/08 (canário do `lightningcss` após cache envenenado, PR #145) | Verificar o build **dentro do container**, não só `npm run build` local. Passo explícito no plano. |
| Regressão no sitemap reintroduz `/comercial` ou `/lp2` | Teste 3 acima |
| Artigo publicado sem gancho de GEO | `meta` tipado + zod quebram o build |
| Blog diverge visualmente da LP | Herda o root layout e os tokens existentes; sem design system novo (Onda 1 não é projeto de marca) |

---

## 8. Fora de escopo (YAGNI)

Comentários · busca no blog · tags e categorias além do `cluster` · RSS · paginação · newsletter · i18n · CMS · publicação sem deploy · container separado. **Nenhum dos itens serve à meta D8 de entrar com 6 páginas.** Voltam à mesa se e quando houver volume que os justifique.

---

## 9. Como o F2a alimenta o resto

**F2b (skill `horizon-article-writer`):** recebe o contrato `ArtigoMeta` como formato de saída obrigatório — a skill não precisa inventar estrutura, ela preenche um tipo que o build já valida. O primeiro artigo, escrito à mão sobre este andaime, é o material de destilação.

**F2c (artigos 2-6):** cada artigo é um `.mdx` novo mais uma linha no índice. **Nenhuma mudança de código por artigo.**

**F1 (motor GEO):** o campo `meta.termoAlvo` é a chave que liga artigo publicado a termo monitorado — é por ele que a tela de acompanhamento no `horizon-crm` (D9) casa conteúdo com medição de citação.
