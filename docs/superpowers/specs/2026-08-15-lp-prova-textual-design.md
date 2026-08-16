# LP `/prova` — variação textual prova-primeiro

**Data:** 2026-08-15
**Solicitante:** `_horizon-internal` (Rodrigo, founder)
**Projeto:** `lp-horizon`
**Tipo:** superfície nova (arquitetural)
**Status:** aguardando revisão do founder

---

## 1. Contexto

O site institucional da Horizon vive em `consultoriahorizon.com.br`. Hoje o oficial em `/` é um HTML standalone de 88KB com Tailwind por CDN (`public/v2/index.html`), produzido no Cowork e promovido a oficial no swap de 2026-05-02 (commit `3e25052`). A v1 âmbar, em Next.js/React, ficou em `/lp2`.

O oficial vende **"aumente até 40% o faturamento em até 90 dias"** e se apoia em vídeo: tem 11 dobras, das quais uma abre com VSL e outra com demo do WhatsApp.

Dois fatos observados no repositório e em produção motivam esta variação:

1. **Os vídeos não existem.** Há 5 molduras de player (`vsl-frame`) na página. Clicar em qualquer uma dispara `alert('Placeholder do player VSL. Substituir por embed YouTube/Vimeo/Mux quando o vídeo estiver pronto.')`. Está assim em produção desde 2026-05-02.
2. **A promessa central é uma projeção.** O rodapé traz: *"Estimativa baseada em projeção de modelo de uso dos agentes Horizon em ambiente operacional... Não constitui garantia contratual de retorno."*

O founder pediu uma variação para **teste A/B**, mantendo a paleta e **sem vídeos**, com o argumento carregado por texto.

## 2. Hipótese sendo testada

> Numa LP B2B da Horizon, **prova concreta e específica converte mais que promessa grande apoiada em vídeo.**

A variável isolada é a natureza do argumento (vídeo + promessa × texto + prova). A paleta é mantida idêntica por decisão do founder, justamente para não confundir a leitura do resultado.

## 3. Decisões cravadas com o founder

| # | Decisão | Escolha | Consequência |
|---|---|---|---|
| D1 | Escopo | Rota nova para A/B; **oficial em `/` intocado** | Risco zero para o que está no ar |
| D2 | Hipótese | Mesma paleta, **sem vídeo**, texto carrega | Remove também 5 players quebrados |
| D3 | Espinha do argumento | **Prova-primeiro** | Página feita de fatos verificáveis, não de promessa |
| D4 | Prova pública | **Clientes nomeados**, risco assumido pelo founder | Ver §4 (restrição de veracidade) |
| D5 | Stack | **Next.js** (rota no app), não HTML standalone | Nasce pronta para virar oficial: GA4 + Lighthouse |
| D6 | Tema | CSS próprio + **tema escopado**, sem tocar config global | v1 âmbar em `/lp2` intacta |
| D7 | Tipografia | **Face de leitura no corpo, Inter na interface** | Página longa deixa de cansar |
| D8 | Custos em dólar | **Não publicar a cifra**; manter prova de escala | Decidido pelo executor; reversível em 1 linha |
| D9 | Rota | `/prova` | Numeração `lp2`/`v2` já está invertida desde o swap |
| D10 | Densidade | Escaneável no topo de cada bloco, sustentada no corpo | Serve quem escaneia e quem lê |

## 4. Restrição de veracidade (não negociável)

D4 autoriza nomear clientes sem pedir consentimento — decisão de risco do founder, sobre relações que são dele. **Isso não autoriza afirmação falsa.** Cada menção diz o que é verdade segundo o vault:

| Nome | Estado real no vault | Como pode aparecer | Como **não** pode |
|---|---|---|---|
| **Umind** | `stage: onboarding`, prod no ar apontando pro MongoDB Atlas do cliente; registrado como "cliente externo pagante" | "SaaS de gestão para clínicas cujo produto em produção a Horizon assumiu para evoluir e manter" | — |
| **PipePro** | `stage: mvp-staging`, contexto comercial `⛔ a levantar` | "Ferramenta de gestão de projetos com WhatsApp integrado, construída pela Horizon, em staging" | "cliente pagante" (não confirmado) |
| **DocsGrowth** | `stage: pre-sale` — **nunca fechou** | "Demo hi-fi de CRM construída para a DocsGrowth, no ar" | **"cliente"** — seria falso |

Regra herdada das páginas de Diagnóstico e Proposta, que vale aqui: **campo ausente não vira frase.** Nada estimado, nada arredondado para cima, nada inferido.

## 5. Arquitetura

### 5.1. Onde vive

```
app/prova/page.tsx        <- a página (Server Component, sem JS de runtime)
app/prova/prova.css       <- tema escopado + tipografia da página
content/prova.md          <- copy revisável fora do JSX (fonte da redação)
```

Rota servida pelo App Router em `/prova`. Não colide com o rewrite de `/` (que aponta para `/v2/index.html`) nem com o catch-all de CSP, que já usa lookahead negativo `((?!v2(?:$|/)).+)` — `/prova` cai naturalmente na CSP estrita, que é o que se quer.

### 5.2. Tema escopado (D6)

O `tailwind.config.ts` declara as cores como **hex literal** (`hzn-brand-500: "#d97706"`), então classes utilitárias do Tailwind **não são temáveis** — trocar a custom property não muda `bg-hzn-brand-500`. Consequência de projeto: a `/prova` **não usa utilitárias de cor do Tailwind**. Usa as primitivas em CSS que já leem `var(--hzn-*)` (`.container-h`, `.section-y`, `.btn-primary`) mais o `prova.css` próprio.

O wrapper `.theme-v3` redefine os mesmos `--hzn-*` com a paleta azul. Nada global muda; a v1 âmbar continua lendo os valores originais.

Valores extraídos de `public/v2/index.html` (cópia literal, não aproximação):

| Token | Valor |
|---|---|
| Marca | `#3b82f6` |
| Escala | `50 #eff6ff · 100 #dbeafe · 200 #bfdbfe · 300 #93c5fd · 400 #60a5fa · 500 #3b82f6 · 600 #1d4ed8 · 700 #1e3a8a` |
| Fundo | `linear-gradient(180deg, #131316 0%, #101418 50%, #131316 100%)` |
| Halo do topo | `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,141,190,0.12), transparent 60%)` |
| Texto | `#fafafa` |
| Gradiente de título | `linear-gradient(135deg, #5b8dbe 0%, #7da9d3 50%, #bfdbfe 100%)` |
| Card | `bg rgba(24,24,27,0.4)` · `border rgba(39,39,42,0.8)` · `radius 16px` |
| Card hover | `border rgba(59,130,246,0.4)` · `shadow 0 20px 40px -20px rgba(59,130,246,0.3)` |

### 5.3. Tipografia (D7)

Três papéis, carregados via `next/font` (self-hosted, sem requisição a CDN de terceiro — ganho direto de Lighthouse sobre o oficial):

- **Display** (títulos de bloco): face com personalidade, peso alto, tracking apertado.
- **Corpo** (prosa): face de leitura, altura de x generosa, medida de linha travada em **62-72 caracteres**.
- **Interface** (botões, labels, números): **Inter**, mantendo a assinatura do oficial.

A escolha das duas faces novas é a única decisão visual em aberto e será apresentada com amostra antes de entrar.

### 5.4. Sem JavaScript de runtime

A página é conteúdo. Nada nela exige interatividade: sem carrossel, sem accordion, sem canvas. Server Component puro, zero `use client`. Isso é o que torna Lighthouse ≥90 alcançável sem esforço, e é uma diferença honesta em relação ao oficial (que carrega Tailwind por CDN e roda JS de animação).

## 6. Estrutura de conteúdo

Oito blocos, na ordem em que um decisor precisa:

| # | Bloco | O que faz | Fonte da prova |
|---|---|---|---|
| 1 | **Abertura** | Afirmação verificável, não promessa: a Horizon roda a própria operação no software que vende | — |
| 2 | **O CRM que usamos todo dia** | Horizon CRM em produção, evolução diária, módulos reais (ingestão, prospecção, diagnóstico, proposta, conversas WA+IG) | `progress` 03/08→14/08 |
| 3 | **Números medidos** | 1.465 empresas qualificadas numa única operação (4 cidades × 4 segmentos). **Sem cifra em dólar** (D8) | `progress` 03-04/08 |
| 4 | **O que construímos para outros** | Umind, PipePro, DocsGrowth — cada um descrito conforme §4 | fichas dos clientes |
| 5 | **Como entramos** | Squad, projeto fechado, IA vertical, **Tech-for-Equity** (piso R$ 7K/mês + participação) | `_overview` §Oferta |
| 6 | **O que você recebe antes de assinar** | Diagnóstico Profundo — produto existente com página pública, não promessa | `reference-diagnostico-profundo-hermes` |
| 7 | **Objeções** | Preço, prazo, "código ou consultoria", "e se eu já tenho time" | — |
| 8 | **CTA** | Mesmo destino do oficial (agendar / WhatsApp), para não contaminar a comparação | `public/v2/index.html` §contato |

**Regra de redação:** cada bloco abre com uma linha que se lê em 2 segundos e sustenta com 2-3 parágrafos. Sem travessão em copy visível (convenção da casa). Voz pragmática, anti-bullshit, técnica mas acessível — a mesma cravada no brand review da v1.

## 7. Fora de escopo

- Não tocar em `/` nem em `public/v2/`.
- Não tocar em `/lp2` (v1 âmbar).
- Não migrar o oficial para Next.
- Não refatorar `tailwind.config.ts` para tokens temáveis (avaliado e recusado em D6: mexe em config global que a v1 em produção consome).
- Não instrumentar GA4 nesta entrega — a página **nasce preparada** (sem CDN de terceiro, sem JS de runtime), mas ligar o tracking exige a Property que o plano de abril deixou pendente em S6, e é trabalho próprio.
- Vídeo, em qualquer forma.

## 8. Critérios de aceite

- **AC-01** `/prova` responde 200 com a paleta azul, e `/` e `/lp2` permanecem visualmente inalteradas (comparação por screenshot antes/depois).
- **AC-02** Nenhum token âmbar vaza para `/prova` e nenhum token azul vaza para `/lp2`.
- **AC-03** Zero elementos de vídeo ou molduras de player na página.
- **AC-04** Zero requisições a hosts de terceiro (fontes self-hosted; sem Tailwind CDN).
- **AC-05** Nenhuma afirmação da §4 na coluna "como não pode" aparece no texto publicado.
- **AC-06** Todo número na página rastreia até uma entrada do `progress` da Horizon.
- **AC-07** Lighthouse ≥90 nas 4 categorias, mobile e desktop.
- **AC-08** `horizon-uiux-guard` sem BLOCKER e sem MUST-FIX.
- **AC-09** Medida de linha da prosa entre 62 e 72 caracteres nos breakpoints principais.
- **AC-10** `npm run build` limpo, zero erro de TypeScript.

## 9. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Nomear cliente sem consentimento gera desgaste | Médio | Decisão consciente do founder (D4). §4 garante que ao menos nada falso é publicado. Remoção de um nome é edição de um parágrafo |
| Paleta divergir do oficial e sujar o A/B | Médio | Valores copiados literalmente (§5.2), conferidos token a token contra `public/v2/index.html` |
| Trocar a fonte enfraquece a paridade do teste | Baixo | A restrição do founder foi paleta, não tipo. Fonte é parte da hipótese "texto bem feito converte" |
| A/B sem instrumentação não produz dado | **Alto** | **Nenhum dos dois lados tem tracking hoje.** A comparação inicial é qualitativa, com decisor real. Ver §10 |

## 10. Pendência que o A/B expõe

Nem `/` nem `/prova` terão medição. **A decisão entre as duas será qualitativa** — reação de decisor em call, que foi exatamente o método usado no A/B de 02/05.

Isso é aceitável para esta entrega e **não** deve ser confundido com teste A/B estatístico. Se o founder quiser dado real, o pré-requisito é o S6 do plano de abril (Property GA4 + Measurement ID), que está pendente desde 29/04 e é trabalho próprio, para os dois lados.

---

## Referências

- Plano original (`partial`): `clientes/_horizon-internal/briefings/planos-aprovados/2026-04-28-lp-consultoriahorizon.md`
- Oficial atual: `public/v2/index.html`
- Tokens âmbar da v1: `design/tokens.css`, `tailwind.config.ts`
- Incidente TLS do mesmo dia: PR #1 e `infra/traefik/lp-horizon.yml`
