# Design — Blog da Horizon em WordPress sob `consultoriahorizon.com.br/blog`

- **Data:** 2026-08-30
- **Status:** design proposto · aguardando revisão do founder
- **Substitui:** a decisão D10 (artigos em MDX no repositório) do design F2a
- **Prior art replicada:** `CodeUP/products/Teachflow/teachflow-grid/planos-aprovados/2026-06-14-EPIC-BLOG-2-codeup-blog-subdiretorio.md` + o diretório `2026-06-14-EPIC-BLOG-2-infra/` (arquivos as-built)
- **Insumo de conteúdo:** `2026-08-29-blog-horizon-geo-discovery-design.md` (discovery F0 — linha editorial e mapa de clusters)

---

## 1. Decisões

| # | Decisão | Origem |
|---|---|---|
| **D14** | **REVOGA D10.** Os artigos não vivem em MDX no repositório. O blog é **WordPress**, replicando o modelo Teachflow. | founder, 30/08 |
| **D15** | O motor de conteúdo **permanece no `teachflow-backend`** (CodeUP) e serve a Horizon como terceiro blog. **Dívida de ownership registrada** — ver §8. | founder, 30/08 |
| **D16** | **Subpasta, não subdomínio.** `consultoriahorizon.com.br/blog`. Mantém D6 do F0. | founder, 30/08 |
| **D17** | Credenciais do WP da Horizon no `.env` da VPS, com ponteiro no vault (padrão `dexter-agent`). Não replicar o texto-claro do EPIC-BLOG-2. | controlador |

### Por que a decisão mudou

O F2a escolheu MDX a partir de um menu que **nunca incluiu WordPress** — omissão do controlador, apesar de o motor do Teachflow constar no discovery desde a primeira hora. Dois requisitos que só apareceram depois invalidam MDX:

1. **Quem escreve é uma pessoa não-técnica**, que revisa a versão da IA e edita por conta própria. MDX-no-repo exige git e deploy.
2. **SEO importa ao longo do tempo**, não só AEO/GEO.

E a afirmação do controlador de que "Next ranqueia melhor que WordPress" **estava errada e foi retratada**: plataforma não é fator de ranqueamento. A única falha de dado estruturado medida nesta casa foi causada por um idiom do **Next** (`next/script` colocando JSON-LD no payload do Flight em vez do HTML). WordPress renderiza no servidor por natureza.

---

## 2. Onde os artigos são escritos

```
Pessoa não-técnica
  → CRM Teachflow, tela /content/blog-ia, seletor de blog = Horizon
  → gerar (pesquisador → redator → crítico)
  → comparar as duas versões no WYSIWYG, editar à mão
  → publicar
      → WordPress da Horizon (VPS)
          → servido em consultoriahorizon.com.br/blog (Traefik)
```

Edições avulsas pós-publicação também são possíveis em `/blog/wp-admin`. A curadoria — onde a pessoa passa o tempo — é no CRM.

**Custo concreto da D15:** essa pessoa precisa de **login no CRM da CodeUP** com papel `copywriter` (a tela é gated em `admin`/`copywriter`/`head_producao`). Uma empresa dando acesso ao sistema da outra.

---

## 3. Arquitetura

### 3.1 As-built da CodeUP (o que estamos replicando)

```
Visitante → codeup.dev.br/blog/* → [Vercel apex]
   rewrite /blog/:path(.*) → strip → https://blogprincipal.codeup.dev.br/:path
        → [VPS: WP6 + mariadb11 + Traefik/LE]
```

### 3.2 A da Horizon (mesma ideia, um hop a menos)

```
Visitante → consultoriahorizon.com.br/blog/* → [Traefik na VPS]
   router PathPrefix(/blog) prioridade 30  →  stripPrefix  →  http://blog-horizon-wp:80
        → [mesmo host, mesma rede easypanel]
```

**O truque de duas camadas é idêntico e é o coração da coisa:** o WordPress roda **vanilla na raiz** do container, o proxy **remove** o `/blog`, e o `wp-config` **virtualiza** o `REQUEST_URI` prefixando `/blog` de volta. Assim o roteamento do Apache funciona na raiz enquanto o WP gera todas as URLs como se estivesse em `/blog`. `WP_HOME` e `WP_SITEURL` apontam para `https://consultoriahorizon.com.br/blog`.

### 3.3 Duas vantagens que a CodeUP não pôde ter

**Sem hop externo.** O épico registra: *"a Vercel NÃO faz edge-cache de rewrites externos… cada request nova bate no VPS (1 hop)"*, e deixou page-cache como pendência. No nosso caso Traefik e WordPress são **containers na mesma rede** — a limitação não existe.

**Sem host bruto público.** A CodeUP precisou expor `blogprincipal.codeup.dev.br` com cert próprio porque a Vercel é externa e precisa de uma URL pública para onde apontar. Nós não temos essa restrição: o Traefik alcança o container pelo nome na rede interna. **Não expomos subdomínio nenhum**, e com isso somem de uma vez o risco de conteúdo duplicado e toda a complexidade do `codeup-robots.php`.

---

## 4. O que replica verbatim

| Arquivo | Mudança |
|---|---|
| `Dockerfile` | nenhuma — `wordpress:6-php8.3-apache` + `a2enmod headers rewrite` + o conf |
| `blog-alias.conf` | nenhuma — WP vanilla na raiz, permalinks em server-config, assets `immutable` 1 ano |
| `inject-uri.php` | só o comentário — **o prefixo `/blog` é o mesmo**, o código não muda |
| filtro `redirect_canonical` p/ sitemap | nenhuma — é fix de nível WP, independe do proxy |
| `docker-compose.yml` | nomes (`blog-horizon-*`), `WP_HOME`/`WP_SITEURL`, e **sem labels de router público** |
| `codeup-cache-headers.php` | nomes |
| `codeup-ga4.php` | id do GA4 da Horizon |

---

## 5. A peça nova: o proxy no Traefik

Adicionar ao `infra/traefik/lp-horizon.yml` (o arquivo que o deploy já sincroniza para a VPS):

```yaml
    https-horizon-blog:
      rule: "Host(`consultoriahorizon.com.br`) && PathPrefix(`/blog`)"
      entryPoints:
        - https
      service: horizon-blog-svc
      tls:
        certResolver: letsencrypt
      middlewares:
        - horizon-blog-strip
        - secure-headers
      priority: 30   # acima do apex (20), senão o Next captura /blog
```

```yaml
    horizon-blog-strip:
      stripPrefix:
        prefixes:
          - "/blog"
```

```yaml
    horizon-blog-svc:
      loadBalancer:
        servers:
          - url: "http://blog-horizon-wp:80"
```

⚠️ **Ler o cabeçalho do `infra/traefik/lp-horizon.yml` antes de editar.** Ele carrega o registro do incidente de TLS de 15/08 e a regra derivada: *nome só entra como SAN depois de resolver em DNS*. Não estamos adicionando SAN nenhum — mas quem mexer no arquivo precisa ter lido.

O router HTTP existente (prioridade 20, `Host(...)`) continua redirecionando `/blog` para HTTPS antes de qualquer coisa. Não precisa de router HTTP próprio.

---

## 6. Tema

Tema clássico próprio `horizon-blog`, modelado no `codeup-blog` (backupeado no vault), com a identidade da Horizon a partir de `design/tokens.css` — `--hzn-brand-*`, `--hzn-bg-*`, `--hzn-text-*`.

⚠️ **Gotcha cravado pela CodeUP, replicar a defesa:** o `blog-alias.conf` serve `.css` como `immutable` por 1 ano. **Versionar o CSS por `filemtime` no enqueue**, senão toda alteração de tema fica invisível por um ano no navegador de quem já visitou.

Herdar também o **rótulo de autor E-E-A-T** no fim de cada artigo (foto, nome, bio, links) — com a assinatura da Horizon, não a da CodeUP.

---

## 7. Registro da Horizon no motor

Não é código, é dado:

1. Linha na tabela `blogs` mapeando `project=horizon` → credenciais do WP da Horizon.
2. Persona(s) escopadas em `project=horizon`, na voz da Horizon.
3. Categorias do WP espelhando os clusters do F0: **Vertical + sistema** · **IA jurídica** · **Serviço em campo aberto** · **Ferramentas e CRM**.
4. O **mapa de clusters do F0** entra como insumo do Pesquisador, que já opera em modo cluster (hub + 4-8 satélites + mapa de links internos).

---

## 8. Dívida de ownership registrada (D15)

O motor vive no `teachflow-backend`, da CodeUP. Com a Horizon consumindo, são **duas empresas num módulo** — e a regra da casa (2026-04-21) diz que N-empresas sobe para a camada Horizon.

**Aceito conscientemente**, no mesmo padrão do storage que virou `Shared.Kernel` depois do segundo consumidor. **Gatilho de extração:** quando aparecer o terceiro consumidor, ou quando a Horizon precisar de um ciclo de release independente do da CodeUP.

Consequência derivada: a conta **DataForSEO** usada pelo motor é a da CodeUP. A pendência de governança levantada no F0 §2.1 fica **subsumida nesta** — mesma dívida, mesmo gatilho.

---

## 9. O que sai

O andaime MDX entregue em 29/08 é **superseded**, não consertável:

- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/blog/layout.tsx`, `app/blog/blog.css`
- `content/blog/**` (schema, registro, corpos, meta, mdx)
- `mdx-components.tsx`, `mdx.d.ts`, `@next/mdx`, `remark-gfm`
- `app/blog/blog-build-output.test.ts`
- O `/blog` do `app/sitemap.ts` e do `app/llms.txt/route.ts` — **o sitemap passa a ser o do WP** (`/blog/wp-sitemap.xml`)

**Sai por `git revert`, não por conserto.** Manter por já existir é exatamente o custo afundado que este documento existe para evitar.

**Fica** (foi trabalho de valor permanente): o discovery F0 · o conserto do CI que fez as guardas de build rodarem · o achado do JSON-LD raiz · a decisão de subpasta.

---

## 10. Gotchas herdados — medidos pela CodeUP, não por nós

1. **Sitemap:** o do RankMath **não registrou**; o core do WP (`wp-sitemap.xml`) funcionou. Usar o core.
2. **Loop 301 no sitemap:** o `REQUEST_URI` virtualizado confunde o `redirect_canonical` do WP. O filtro que o desativa nas URLs de sitemap é obrigatório.
3. **CSS imutável por 1 ano** → versionar por `filemtime` (§6).
4. **Capa automática:** o motor gera imagem na primeira publicação de artigo sem capa e seta como destaque, de forma não-fatal. Vem de graça.

---

## 11. Segredos (D17)

Credenciais do WP e do banco vão para o `.env` da VPS em `/srv/blog-horizon/`, com **ponteiro** em `clientes/_horizon-internal/secrets/` — nunca o valor. O EPIC-BLOG-2 gravou as da CodeUP em texto claro no vault e a pendência de rotação está aberta desde junho; o founder decidiu não rotacionar agora, mas **não replicamos o padrão**.

⚠️ **Ressalva medida, que corrige a intenção acima.** O schema da tabela `blogs` (`teachflow-backend/src/shared/db/schema.ts:2196`) guarda `wp_app_password` como coluna **`text` sem cifra**. Ou seja, a Application Password que o motor usa **tem** de viver no banco da CodeUP, por desenho do motor — não há como mantê-la só no `.env` da Horizon. A separação real fica assim:

| Segredo | Onde vive | De quem é |
|---|---|---|
| Senha do admin do WP · senhas do MariaDB | `.env` em `/srv/blog-horizon/` na VPS | Horizon |
| **Application Password do WP** (a que o motor usa pra publicar) | linha da tabela `blogs`, banco da CodeUP, em texto claro | atravessa a fronteira |

Isso é **consequência direta da D15** e faz parte da dívida: a credencial de publicação da Horizon fica legível para quem tem acesso ao banco da CodeUP. Mitigação disponível hoje: a Application Password é **escopada e revogável** no WP sem tocar na senha do admin — se a dívida for extraída ou a confiança mudar, revoga-se só ela.

---

## 12. Fora de escopo

Rotação das credenciais da CodeUP · extração do motor para a camada Horizon · page-cache na origem (a CodeUP precisava pelo hop externo; nós não temos) · GSC/GA4 além de plugar o id · migrar o artigo semente de 196 palavras, que morre com o revert.

---

## 13. Riscos

| Risco | Mitigação |
|---|---|
| O router `/blog` não vence o do apex | `priority: 30` contra 20; verificar servindo, não pela config |
| WP gerando URL sem `/blog` | É o que `inject-uri.php` + `WP_HOME`/`WP_SITEURL` resolvem; conferir no HTML servido |
| Editar o arquivo do Traefik e derrubar o apex | O deploy do `lp-horizon` sincroniza esse arquivo; testar o apex **e** o `/blog` após o deploy |
| Revert do andaime quebrar o sitemap | O `app/sitemap.ts` volta ao estado anterior; o teste de exclusão de `/comercial` e `/lp2` continua guardando |
| Pessoa não-técnica sem acesso | Provisionar o papel `copywriter` no CRM da CodeUP **antes** de anunciar o fluxo |
