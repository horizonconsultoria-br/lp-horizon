# LP `/prova` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar em `/prova` uma variação textual prova-primeiro da LP institucional, com a paleta azul idêntica à do oficial, sem vídeo e sem JavaScript de runtime, para teste A/B qualitativo contra `/`.

**Architecture:** Rota nova do App Router dentro do app Next existente. A copy vive num módulo TypeScript tipado (`content/prova.ts`) separado do JSX, o que a torna revisável e — principalmente — **testável**: as regras de veracidade da spec viram testes automáticos em vez de boa intenção. O tema azul entra como escopo CSS (`.theme-v3`) que redefine os mesmos custom properties `--hzn-*` já consumidos pelas primitivas do projeto, sem tocar em nada global, então a v1 âmbar em `/lp2` fica intacta por construção.

**Tech Stack:** Next.js 15 (App Router, Server Components), TypeScript 5.7, CSS puro com custom properties, `next/font/google` (self-hosted no build), Vitest (novo no repo).

**Spec:** `docs/superpowers/specs/2026-08-15-lp-prova-textual-design.md`

## Global Constraints

Valores copiados literalmente da spec. Valem para todas as tasks.

- **Rota:** `/prova`. Não tocar em `/`, em `public/v2/` nem em `app/lp2/`.
- **Paleta (cópia literal de `public/v2/index.html`):** marca `#3b82f6` · escala `50 #eff6ff · 100 #dbeafe · 200 #bfdbfe · 300 #93c5fd · 400 #60a5fa · 500 #3b82f6 · 600 #1d4ed8 · 700 #1e3a8a` · fundo `linear-gradient(180deg, #131316 0%, #101418 50%, #131316 100%)` · halo `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,141,190,0.12), transparent 60%)` · texto `#fafafa` · gradiente de título `linear-gradient(135deg, #5b8dbe 0%, #7da9d3 50%, #bfdbfe 100%)` · card `bg rgba(24,24,27,0.4)` / `border rgba(39,39,42,0.8)` / `radius 16px` · card hover `border rgba(59,130,246,0.4)` / `shadow 0 20px 40px -20px rgba(59,130,246,0.3)`.
- **Tipografia:** display `Instrument Serif`, corpo `Newsreader`, interface `Inter`, números `JetBrains Mono`. Todas via `next/font/google`.
- **Medida de linha da prosa:** entre **62 e 72 caracteres**.
- **Zero JavaScript de runtime.** Nenhum `"use client"`, nenhuma animação, nenhum canvas.
- **Zero vídeo.** Nenhum `<video>`, `<iframe>`, moldura de player ou botão de play.
- **Zero requisição a host de terceiro.** Fontes self-hosted; nada de CDN.
- **Copy sem travessão (`—`).** Regra dura da casa: travessão em copy visível "parece IA".
- **Veracidade (spec §4), inegociável:**
  - `Umind` → pode ser descrito como produto em produção que a Horizon assumiu para evoluir e manter.
  - `PipePro` → "construído pela Horizon", em staging. **Nunca** "cliente pagante" (contexto comercial não confirmado).
  - `DocsGrowth` → **demo hi-fi construída para**. **Nunca** a palavra "cliente" associada a ele. Ele é `stage: pre-sale` e nunca fechou.
- **Sem cifra de custo em dólar** na copy (decisão D8). A prova de escala fica; o custo unitário não.
- **Todo número publicado rastreia até uma entrada do `progress.md` da Horizon.**

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `content/prova.ts` | **Criar.** Copy dos 8 blocos como dado tipado. Fonte única do texto |
| `content/prova.test.ts` | **Criar.** Guardas de veracidade, travessão, vídeo, fontes dos números |
| `app/prova/prova.css` | **Criar.** Tema escopado `.theme-v3` + tipografia da página |
| `app/prova/prova.css.test.ts` | **Criar.** Guarda de vazamento de token e de medida de linha |
| `app/prova/layout.tsx` | **Criar.** Carrega as 3 fontes novas e aplica `.theme-v3` |
| `app/prova/page.tsx` | **Criar.** Server Component que renderiza a partir de `content/prova.ts` |
| `app/prova/build-output.test.ts` | **Criar.** Asserções sobre o HTML pré-renderizado pelo `next build` |
| `vitest.config.ts` | **Criar.** Configuração do runner |
| `package.json` | **Modificar.** Adicionar `vitest` e o script `test` |
| `app/sitemap.ts` | **Modificar.** Incluir `/prova` |

Nenhum arquivo existente de estilo, token ou configuração de tema é modificado.

---

### Task 1: Runner de teste + contrato de conteúdo

Entrega: o repo passa a ter testes, e as regras de veracidade da spec viram guardas mecânicas rodando contra um conteúdo semente.

**Files:**
- Create: `vitest.config.ts`
- Create: `content/prova.ts`
- Create: `content/prova.test.ts`
- Modify: `package.json` (devDependency + script)

**Interfaces:**
- Consumes: nada (primeira task).
- Produces: os tipos `Destaque`, `Item`, `Bloco`, `Acao`, `CTA`, `ConteudoProva` e a constante `conteudoProva: ConteudoProva`, todos exportados de `content/prova.ts`. As tasks 2, 5 e 6 dependem destes nomes exatos.

- [ ] **Step 1: Instalar o runner**

```bash
npm install --save-dev --ignore-scripts vitest@^2.1.8
```

Nota: `--ignore-scripts` é convenção deste repo. O `npm install` original falhou em ETIMEDOUT no post-install do Lighthouse (registrado no plano de 2026-04-28, Sessão 2).

- [ ] **Step 2: Criar a configuração do runner**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
```

- [ ] **Step 3: Adicionar o script de teste**

Em `package.json`, dentro de `"scripts"`, logo após `"lint"`:

```json
"test": "vitest run",
"test:watch": "vitest",
```

- [ ] **Step 4: Escrever os testes falhando**

`content/prova.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { conteudoProva } from "./prova";
import type { Bloco } from "./prova";

const IDS_ESPERADOS = [
  "abertura",
  "crm-proprio",
  "numeros",
  "para-outros",
  "como-entramos",
  "antes-de-assinar",
  "objecoes",
  "cta",
];

/**
 * Todo texto visível ao leitor, achatado num array (um item por CAMPO).
 * Use para proibições absolutas de palavra (travessão, vocabulário de vídeo,
 * cifra em dólar): a regra é "nunca usar X em lugar nenhum".
 */
function textosVisiveis(): string[] {
  const out: string[] = [];
  for (const b of conteudoProva.blocos) {
    out.push(b.eyebrow, b.titulo, ...b.paragrafos);
    if (b.destaque) out.push(b.destaque.valor, b.destaque.legenda);
    for (const i of b.itens ?? []) out.push(i.nome, i.descricao);
  }
  for (const a of conteudoProva.cta.acoes) out.push(a.rotulo);
  return out;
}

/**
 * Texto visível de cada bloco concatenado numa string por BLOCO.
 * Use para checar COEXISTÊNCIA de dois termos: uma violação pode ter a
 * entidade no título e o termo proibido num parágrafo separado, e achatar
 * por campo deixaria essa combinação passar sem ser vista.
 */
function textoAgrupadoPorBloco(blocos: Bloco[]): string[] {
  return blocos.map((b) => {
    const partes: string[] = [b.eyebrow, b.titulo, ...b.paragrafos];
    if (b.destaque) partes.push(b.destaque.valor, b.destaque.legenda);
    for (const i of b.itens ?? []) partes.push(i.nome, i.descricao);
    return partes.join(" ");
  });
}

/** Verdadeiro se os dois termos aparecem juntos no texto de algum bloco. */
function algumBlocoAssocia(blocos: Bloco[], entidade: RegExp, termoProibido: RegExp): boolean {
  return textoAgrupadoPorBloco(blocos).some((t) => entidade.test(t) && termoProibido.test(t));
}

describe("estrutura", () => {
  it("tem exatamente os 8 blocos da spec, na ordem", () => {
    expect(conteudoProva.blocos.map((b) => b.id)).toEqual(IDS_ESPERADOS);
  });

  it("nenhum bloco fica sem título ou sem parágrafo", () => {
    for (const b of conteudoProva.blocos) {
      expect(b.titulo.trim().length, `bloco ${b.id}`).toBeGreaterThan(0);
      expect(b.paragrafos.length, `bloco ${b.id}`).toBeGreaterThan(0);
    }
  });
});

describe("regra de veracidade (spec §4)", () => {
  it("nunca associa a palavra cliente a DocsGrowth, nem em campos diferentes do mesmo bloco", () => {
    expect(algumBlocoAssocia(conteudoProva.blocos, /DocsGrowth/i, /cliente/i)).toBe(false);
  });

  it("a guarda de DocsGrowth pega a associação que atravessa campos", () => {
    const armadilha: Bloco[] = [
      {
        id: "regressao",
        eyebrow: "regressao",
        titulo: "Como validamos com a DocsGrowth",
        paragrafos: ["Fizemos isso pro nosso cliente mais recente."],
      },
    ];
    // Sem agrupar por bloco isto passaria: nenhum campo isolado tem os dois termos.
    expect(algumBlocoAssocia(armadilha, /DocsGrowth/i, /cliente/i)).toBe(true);
  });

  it("descreve DocsGrowth como demo onde ele aparece", () => {
    const mencoes = textosVisiveis().filter((t) => /DocsGrowth/i.test(t));
    expect(mencoes.length).toBeGreaterThan(0);
    for (const t of mencoes) {
      expect(/demo/i.test(t), `sem a palavra demo: "${t}"`).toBe(true);
    }
  });

  it("nunca chama PipePro de cliente pagante", () => {
    expect(algumBlocoAssocia(conteudoProva.blocos, /PipePro/i, /cliente pagante/i)).toBe(false);
  });
});

describe("regras da casa", () => {
  it("não usa travessão em copy visível", () => {
    for (const t of textosVisiveis()) {
      expect(t.includes("—"), `travessão em: "${t}"`).toBe(false);
    }
  });

  it("não publica cifra de custo em dólar (decisão D8)", () => {
    for (const t of textosVisiveis()) {
      expect(/US\$\s*\d/.test(t), `cifra de custo em: "${t}"`).toBe(false);
    }
  });

  it("não usa vocabulário de vídeo", () => {
    for (const t of textosVisiveis()) {
      expect(/\b(v[ií]deo|assista|player|VSL)\b/i.test(t), `vídeo em: "${t}"`).toBe(false);
    }
  });
});

describe("rastreabilidade dos números", () => {
  it("todo destaque numérico cita a fonte", () => {
    for (const b of conteudoProva.blocos) {
      if (!b.destaque) continue;
      expect(b.destaque.fonte.trim().length, `destaque do bloco ${b.id}`).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 5: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL. O módulo `./prova` não existe, todos os testes quebram na importação.

- [ ] **Step 6: Escrever o mínimo para passar**

`content/prova.ts` — apenas os tipos e um conteúdo semente com os 8 ids. A copy real é a Task 2.

```ts
export type Destaque = { valor: string; legenda: string; fonte: string };
export type Item = { nome: string; descricao: string };

export type Bloco = {
  id: string;
  eyebrow: string;
  titulo: string;
  paragrafos: string[];
  destaque?: Destaque;
  itens?: Item[];
};

export type Acao = { rotulo: string; href: string; primaria: boolean };
// Só as ações. O bloco "cta" já carrega título e parágrafos como qualquer outro
// bloco; um segundo par título/subtítulo aqui seria dado que ninguém renderiza.
export type CTA = { acoes: Acao[] };

export type ConteudoProva = { blocos: Bloco[]; cta: CTA };

const semente = (id: string): Bloco => ({
  id,
  eyebrow: id,
  titulo: `Título de ${id}`,
  paragrafos: ["Parágrafo semente."],
});

export const conteudoProva: ConteudoProva = {
  blocos: [
    semente("abertura"),
    semente("crm-proprio"),
    semente("numeros"),
    {
      ...semente("para-outros"),
      paragrafos: ["Demo hi-fi construída para a DocsGrowth, no ar."],
    },
    semente("como-entramos"),
    semente("antes-de-assinar"),
    semente("objecoes"),
    semente("cta"),
  ],
  cta: {
    acoes: [{ rotulo: "Agendar conversa", href: "#", primaria: true }],
  },
};
```

- [ ] **Step 7: Rodar e ver passar**

Run: `npm test`
Expected: PASS, 9 testes verdes.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts package.json package-lock.json content/prova.ts content/prova.test.ts
git commit -m "test(prova): vitest + contrato de conteudo com guardas de veracidade

As regras da §4 da spec (DocsGrowth nunca como cliente, PipePro nunca como
cliente pagante) viram teste automatico em vez de boa intencao. Junto entram
as guardas da casa: sem travessao em copy visivel, sem cifra de custo (D8),
sem vocabulario de video, e todo numero com fonte."
```

---

### Task 2: Copy real dos 8 blocos

Entrega: o texto de verdade da página, escrito sob as guardas da Task 1.

**Files:**
- Modify: `content/prova.ts` (substituir a semente pela copy real)

**Interfaces:**
- Consumes: os tipos de `content/prova.ts` (Task 1).
- Produces: `conteudoProva` preenchido. A Task 5 renderiza exatamente esta estrutura.

- [ ] **Step 1: Escrever a copy real**

Substituir todo o conteúdo de `conteudoProva` (mantendo os tipos acima) por:

```ts
export const conteudoProva: ConteudoProva = {
  blocos: [
    {
      id: "abertura",
      eyebrow: "Horizon",
      titulo: "A gente roda a própria operação no software que vende.",
      paragrafos: [
        "Toda software house diz que domina IA. Poucas usam o que constroem para tocar o próprio negócio.",
        "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon, roda em produção e muda quase todo dia. O que você lê abaixo não é portfólio: é a nossa operação, com os números que ela gerou.",
      ],
    },
    {
      id: "crm-proprio",
      eyebrow: "O que usamos todo dia",
      titulo: "Um CRM inteiro, construído para uma operação de verdade.",
      paragrafos: [
        "Ele descobre empresas por varredura de mapa, organiza a fila de prospecção, escaneia uma conta a partir do Instagram e volta com nome real, site, telefone e contatos.",
        "Do outro lado, gera diagnóstico do negócio do prospect, monta a proposta comercial, publica as duas como páginas próprias e ainda concentra as conversas de WhatsApp e Instagram na mesma tela.",
        "Nada disso é protótipo. É o que a nossa equipe abre de manhã.",
      ],
      itens: [
        { nome: "Ingestão", descricao: "Varredura de mapa por nicho e cidade, com fila de revisão." },
        { nome: "Prospecção", descricao: "Board de contas, carteira por vendedor e histórico." },
        { nome: "Diagnóstico", descricao: "Análise do negócio do prospect, publicada em página própria." },
        { nome: "Proposta", descricao: "Valores, escopo e prazo, publicados no mesmo endereço da análise." },
        { nome: "Conversas", descricao: "WhatsApp e Instagram na mesma caixa de entrada." },
        { nome: "Espaços do cliente", descricao: "Tarefas, checklists e arquivos por cliente, em bucket privado." },
      ],
    },
    {
      id: "numeros",
      eyebrow: "Medido, não estimado",
      titulo: "A diferença entre achar e saber é ter medido.",
      paragrafos: [
        "Numa única operação de prospecção, a varredura cobriu quatro cidades e quatro segmentos e trouxe empresas qualificadas com nome, telefone, site e Instagram de cada uma.",
        "Não é projeção nem estimativa de modelo. É o resultado de uma execução real, registrado no dia em que aconteceu.",
      ],
      destaque: {
        valor: "1.465",
        legenda: "empresas qualificadas numa única operação, em 4 cidades e 4 segmentos",
        fonte: "progress.md HorizonConsultoria, entrada de 2026-08-03/04",
      },
    },
    {
      id: "para-outros",
      eyebrow: "O que construímos para outros",
      titulo: "Produto de gente que já tem produto.",
      paragrafos: [
        "A Horizon não vive de slide. Estes são trabalhos com código rodando, cada um descrito pelo que ele é hoje.",
      ],
      itens: [
        {
          nome: "Umind",
          descricao:
            "SaaS de gestão para clínicas, com produto já em produção, que a Horizon assumiu para evoluir e manter. Ambientes de desenvolvimento e produção no ar, com o banco real do negócio.",
        },
        {
          nome: "PipePro",
          descricao:
            "Ferramenta de gestão de projetos com WhatsApp integrado, construída pela Horizon e hoje em staging.",
        },
        {
          nome: "DocsGrowth",
          descricao:
            "Demo hi-fi de CRM sob medida, construída para a DocsGrowth e publicada com dados coerentes, feita para ser navegada antes de qualquer contrato.",
        },
      ],
    },
    {
      id: "como-entramos",
      eyebrow: "Como entramos",
      titulo: "Quatro formatos, e um deles nos coloca no mesmo barco.",
      paragrafos: [
        "O formato certo depende de quanto do risco faz sentido dividir. Em todos, o que entregamos é software em produção, não relatório.",
      ],
      itens: [
        { nome: "Squad alocado", descricao: "Time dedicado ao seu produto por alguns meses, com custo previsível." },
        { nome: "Projeto fechado", descricao: "Escopo e prazo definidos, pagos por entrega." },
        { nome: "IA vertical", descricao: "Um agente construído para o seu domínio, com avaliação própria de qualidade." },
        {
          nome: "Tech for Equity",
          descricao:
            "Mensalidade reduzida somada a participação no negócio. É o formato que preferimos quando dá, porque alinha o nosso ganho ao seu crescimento em vez de à nossa hora.",
        },
      ],
    },
    {
      id: "antes-de-assinar",
      eyebrow: "Antes de assinar",
      titulo: "Você recebe a análise antes de decidir qualquer coisa.",
      paragrafos: [
        "Antes de falar de contrato, a gente estuda o seu negócio e publica o resultado numa página só sua: presença digital, o que os concorrentes estão fazendo, onde você aparece e onde não aparece.",
        "A regra que seguimos ao escrever essa análise é dura de propósito: assunto que não encontramos aparece como ponto crítico, e não some do relatório. Você recebe o que existe, incluindo o que não existe.",
        "É o mesmo material que usamos para decidir se vale a nossa conversa. Você fica com ele mesmo que a resposta seja não.",
      ],
    },
    {
      id: "objecoes",
      eyebrow: "Perguntas diretas",
      titulo: "As dúvidas que aparecem antes da primeira conversa.",
      paragrafos: [
        "Respostas curtas, do jeito que a gente responderia numa call.",
      ],
      itens: [
        {
          nome: "Vocês entregam código ou consultoria?",
          descricao: "Código rodando em produção. Consultoria sem entrega é onde a maioria dos projetos morre.",
        },
        {
          nome: "E se eu já tenho time?",
          descricao:
            "Melhor ainda. A gente entra na frente que o seu time não consegue abrir, e devolve o que construiu documentado para ele tocar.",
        },
        {
          nome: "Quanto tempo até ver algo de pé?",
          descricao: "Software em produção em semanas, não em trimestres. O primeiro corte é sempre o menor possível que já serve.",
        },
        {
          nome: "Quanto custa?",
          descricao:
            "Depende do formato. O modelo com participação tem mensalidade menor porque parte do nosso ganho fica atrelada ao seu resultado.",
        },
      ],
    },
    {
      id: "cta",
      eyebrow: "Próxima ação",
      titulo: "Uma conversa de uma hora, e você sai com um diagnóstico.",
      paragrafos: [
        "Mapeamos a sua maior dor operacional, damos uma estimativa honesta de prazo e falamos o que faríamos primeiro.",
        "Se não fizer sentido fechar, você fica com a análise mesmo assim.",
      ],
    },
  ],
  cta: {
    acoes: [
      { rotulo: "Agendar conversa", href: "https://consultoriahorizon.com.br/#contato", primaria: true },
      { rotulo: "Falar no WhatsApp", href: "https://consultoriahorizon.com.br/#contato", primaria: false },
    ],
  },
};
```

**Nota para o implementador:** os dois `href` do CTA apontam provisoriamente para a âncora de contato do oficial, que é o que a spec pede (mesmo destino, para não contaminar a comparação). Se o founder fornecer o link direto do Google Calendar e o número de WhatsApp, trocar aqui e em nenhum outro lugar.

- [ ] **Step 2: Rodar os testes**

Run: `npm test`
Expected: PASS, os mesmos 9 testes, agora guardando a copy real.

Se `não usa travessão` falhar, procurar o caractere `—` e trocar por vírgula, ponto ou dois pontos. É regra da casa, não preferência de estilo.

- [ ] **Step 3: Commit**

```bash
git add content/prova.ts
git commit -m "content(prova): copy real dos 8 blocos, prova-primeiro

Texto ancorado no que a casa entregou de fato. DocsGrowth aparece como demo
(e o teste garante que continue assim), PipePro como construido pela Horizon,
Umind como produto em producao assumido para evoluir."
```

---

### Task 3: Tema escopado `.theme-v3`

Entrega: a paleta azul aplicada por escopo, sem tocar em nada global, com teste de vazamento.

**Files:**
- Create: `app/prova/prova.css`
- Create: `app/prova/prova.css.test.ts`

**Interfaces:**
- Consumes: os nomes de token `--hzn-*` definidos em `design/tokens.css` (não modificado).
- Produces: a classe de tema `.theme-v3` e as classes de página `.prova-shell`, `.prova-bloco`, `.prova-prosa`, `.prova-destaque`, `.prova-fonte`, `.prova-itens`, `.prova-item`, `.prova-cta`. A Task 5 usa exatamente estes nomes, mais as primitivas que já existem em `globals.css` (`.eyebrow`, `.btn-primary`, `.btn-secondary`), que passam a renderizar azul por herdarem os tokens do escopo.

- [ ] **Step 1: Escrever o teste falhando**

`app/prova/prova.css.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// process.cwd() e não __dirname: o Vitest roda os .ts como ESM, onde __dirname
// não é garantido. Mesma forma que build-output.test.ts usa.
const css = readFileSync(join(process.cwd(), "app", "prova", "prova.css"), "utf-8");

/** Tokens cujo valor âmbar apareceria visualmente se não fossem redefinidos. */
const TOKENS_OBRIGATORIOS = [
  "--hzn-bg-base",
  "--hzn-bg-raised",
  "--hzn-bg-overlay",
  "--hzn-bg-muted",
  "--hzn-text-primary",
  "--hzn-text-secondary",
  "--hzn-text-muted",
  "--hzn-text-inverse",
  "--hzn-brand-50",
  "--hzn-brand-100",
  "--hzn-brand-200",
  "--hzn-brand-300",
  "--hzn-brand-400",
  "--hzn-brand-500",
  "--hzn-brand-600",
  "--hzn-brand-700",
  "--hzn-glow-amber",
  "--hzn-glow-amber-strong",
  "--hzn-border-subtle",
  "--hzn-border-default",
  "--hzn-border-strong",
];

/**
 * Cores da v1 âmbar que não podem aparecer aqui.
 * Inclui as grafias em rgba, e não só hex: os tokens de glow do design
 * system usam `rgba(245, 158, 11, ...)`, então uma lista só de hex deixaria
 * passar justamente o vazamento que faz o botão brilhar âmbar na página azul.
 */
const AMBAR_PROIBIDO = [
  "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24",
  "#f59e0b", "#d97706", "#b45309", "#92400e",
  "#0b0d12", "#131720", "#1a2030", "#0e1117",
  "rgba(245, 158, 11", "rgba(245,158,11",
];

describe("tema escopado", () => {
  it("define o escopo .theme-v3", () => {
    expect(css).toMatch(/\.theme-v3\s*\{/);
  });

  it("redefine todos os tokens que teriam vazamento âmbar", () => {
    for (const t of TOKENS_OBRIGATORIOS) {
      expect(css.includes(t), `token não redefinido: ${t}`).toBe(true);
    }
  });

  it("não contém nenhum hex da paleta âmbar da v1", () => {
    for (const hex of AMBAR_PROIBIDO) {
      expect(css.toLowerCase().includes(hex), `vazou âmbar: ${hex}`).toBe(false);
    }
  });

  it("usa a marca azul exata do oficial", () => {
    expect(css).toContain("#3b82f6");
  });

  it("trava a medida de linha da prosa entre 62 e 72 caracteres", () => {
    const m = css.match(/--prova-medida:\s*(\d+)ch/);
    expect(m, "faltou --prova-medida em ch").not.toBeNull();
    const ch = Number(m![1]);
    expect(ch).toBeGreaterThanOrEqual(62);
    expect(ch).toBeLessThanOrEqual(72);
  });
});

describe("isolamento", () => {
  it("não define nada em :root nem em html/body soltos", () => {
    expect(css).not.toMatch(/^\s*:root\s*\{/m);
    expect(css).not.toMatch(/^\s*html\s*\{/m);
    expect(css).not.toMatch(/^\s*body\s*\{/m);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL com `ENOENT` em `prova.css`.

- [ ] **Step 3: Escrever o CSS**

`app/prova/prova.css`:

```css
/*
 * Tema escopado da LP /prova.
 *
 * Redefine os MESMOS tokens --hzn-* de design/tokens.css dentro de .theme-v3.
 * Nada global é tocado: a v1 âmbar em /lp2 continua lendo os valores originais.
 *
 * Os valores azuis são cópia literal de public/v2/index.html (o oficial em /),
 * para que o A/B isole a variável certa. Não "aproximar" nenhum tom.
 *
 * ATENÇÃO: --hzn-glow-amber é consumido por .btn-primary:hover em globals.css.
 * Sem redefinir, o botão desta página brilharia âmbar. O teste guarda isso.
 */

.theme-v3 {
  /* Superfícies (fundo do oficial) */
  --hzn-bg-base: #131316;
  --hzn-bg-raised: rgba(24, 24, 27, 0.4);
  --hzn-bg-overlay: rgba(24, 24, 27, 0.7);
  --hzn-bg-muted: #101418;

  /* Texto */
  --hzn-text-primary: #fafafa;
  --hzn-text-secondary: #a1a1aa;
  --hzn-text-muted: #71717a;
  --hzn-text-inverse: #0a0a0a;

  /* Marca azul do oficial */
  --hzn-brand-50: #eff6ff;
  --hzn-brand-100: #dbeafe;
  --hzn-brand-200: #bfdbfe;
  --hzn-brand-300: #93c5fd;
  --hzn-brand-400: #60a5fa;
  --hzn-brand-500: #3b82f6;
  --hzn-brand-600: #1d4ed8;
  --hzn-brand-700: #1e3a8a;

  /* Glow: nome herdado do design system, valor azul.
     O primeiro é cópia literal da sombra de hover do card do oficial.
     O segundo é DERIVADO: mesma geometria e mesmo alfa do token original
     em design/tokens.css, recolorido para azul, porque o oficial não tem
     equivalente. Declarado como derivação, não como cópia. */
  --hzn-glow-amber: 0 20px 40px -20px rgba(59, 130, 246, 0.3);
  --hzn-glow-amber-strong: 0 0 48px rgba(59, 130, 246, 0.6);

  /* Bordas do oficial */
  --hzn-border-subtle: rgba(39, 39, 42, 0.6);
  --hzn-border-default: rgba(39, 39, 42, 0.8);
  --hzn-border-strong: rgba(59, 130, 246, 0.4);

  /* Tipografia da página */
  --prova-display: var(--font-instrument-serif), Georgia, serif;
  --prova-prosa: var(--font-newsreader), Georgia, serif;
  --prova-medida: 68ch;
}

/* Casca: pinta o fundo por cima do body, que é pintado no :root com o grafite da v1 */
.prova-shell {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91, 141, 190, 0.12), transparent 60%),
    linear-gradient(180deg, #131316 0%, #101418 50%, #131316 100%);
  color: var(--hzn-text-primary);
  padding-block: clamp(64px, 10vw, 128px);
}

.prova-bloco {
  width: 100%;
  max-width: var(--hzn-container-max);
  margin-inline: auto;
  padding-inline: var(--hzn-container-padding);
  padding-block: clamp(40px, 6vw, 80px);
  border-bottom: 1px solid var(--hzn-border-subtle);
}
.prova-bloco:last-of-type {
  border-bottom: 0;
}

/* h1 e h2 compartilham o estilo: só a abertura é h1, e visualmente
   os títulos de bloco são o mesmo objeto. */
.prova-bloco h1,
.prova-bloco h2 {
  font-family: var(--prova-display);
  font-weight: 400;
  font-size: clamp(30px, 4.5vw, 56px);
  line-height: 1.12;
  letter-spacing: -0.015em;
  max-width: 20ch;
  margin: var(--hzn-space-4) 0 var(--hzn-space-6);
  background: linear-gradient(135deg, #5b8dbe 0%, #7da9d3 50%, #bfdbfe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Prosa: onde a medida de linha manda */
.prova-prosa p {
  font-family: var(--prova-prosa);
  font-size: clamp(17px, 1.15vw, 19px);
  line-height: 1.72;
  max-width: var(--prova-medida);
  color: var(--hzn-text-secondary);
  margin: 0 0 var(--hzn-space-5);
}
.prova-prosa p:last-child {
  margin-bottom: 0;
}

/* Número em destaque, em mono */
.prova-destaque {
  margin: var(--hzn-space-8) 0 0;
  padding: var(--hzn-space-6);
  background: var(--hzn-bg-raised);
  border: 1px solid var(--hzn-border-default);
  border-radius: var(--hzn-radius-lg);
  max-width: var(--prova-medida);
}
.prova-destaque dt {
  font-family: var(--hzn-font-mono);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 500;
  line-height: 1;
  color: var(--hzn-brand-300);
  letter-spacing: -0.02em;
}
.prova-destaque dd {
  margin: var(--hzn-space-3) 0 0;
  font-family: var(--prova-prosa);
  font-size: var(--hzn-text-base);
  line-height: 1.6;
  color: var(--hzn-text-secondary);
}
.prova-destaque .prova-fonte {
  display: block;
  margin-top: var(--hzn-space-3);
  font-family: var(--hzn-font-sans);
  font-size: var(--hzn-text-xs);
  color: var(--hzn-text-muted);
}

/* Itens: lista de definição, não card com hover */
.prova-itens {
  margin: var(--hzn-space-8) 0 0;
  display: grid;
  gap: var(--hzn-space-6);
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .prova-itens {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.prova-item dt {
  font-family: var(--hzn-font-sans);
  font-weight: var(--hzn-weight-semibold);
  font-size: var(--hzn-text-lg);
  color: var(--hzn-text-primary);
  margin-bottom: var(--hzn-space-2);
}
.prova-item dd {
  margin: 0;
  font-family: var(--prova-prosa);
  font-size: var(--hzn-text-base);
  line-height: 1.65;
  color: var(--hzn-text-secondary);
  max-width: 56ch;
}

/* CTA final */
.prova-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--hzn-space-4);
  margin-top: var(--hzn-space-8);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS, 15 testes verdes (9 de conteúdo + 6 de CSS).

- [ ] **Step 5: Commit**

```bash
git add app/prova/prova.css app/prova/prova.css.test.ts
git commit -m "feat(prova): tema escopado .theme-v3 com a paleta azul do oficial

Redefine os mesmos tokens --hzn-* dentro do escopo, entao as primitivas que ja
existem passam a renderizar azul sem reescrever nenhuma. Nada global muda e a
v1 ambar em /lp2 fica intacta.

O teste guarda o vazamento que passaria despercebido: --hzn-glow-amber e
consumido pelo hover do botao primario, e sem redefinir ele o botao desta
pagina brilharia ambar."
```

---

### Task 4: Layout da rota com as fontes

Entrega: `/prova` carrega as três fontes novas (self-hosted) e aplica o tema.

**Files:**
- Create: `app/prova/layout.tsx`

**Interfaces:**
- Consumes: `app/prova/prova.css` (Task 3).
- Produces: as CSS variables `--font-instrument-serif` e `--font-newsreader`, e o wrapper `.theme-v3 .prova-shell` em volta de `children`. A Task 5 renderiza dentro dele.

- [ ] **Step 1: Escrever o layout**

`app/prova/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import "./prova.css";

// next/font baixa e serve local no build. Zero requisição a host de terceiro,
// que é o que a CSP estrita desta rota exige (font-src 'self').
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A gente roda a própria operação no software que vende",
  description:
    "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon e roda em produção. Veja a operação e os números que ela gerou.",
  alternates: { canonical: "/prova" },
  openGraph: {
    title: "A gente roda a própria operação no software que vende",
    description:
      "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon e roda em produção.",
    url: "https://consultoriahorizon.com.br/prova",
  },
};

export default function ProvaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`theme-v3 ${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <div className="prova-shell">{children}</div>
    </div>
  );
}
```

**Nota para o implementador:** o `alternates.canonical` é obrigatório aqui. O layout raiz declara `canonical: "/"`, e sem sobrescrever, `/prova` se auto-canonicalizaria para a home, o que é bug de SEO.

- [ ] **Step 2: Conferir que o projeto compila**

Run: `npx tsc --noEmit`
Expected: zero erro.

- [ ] **Step 3: Commit**

```bash
git add app/prova/layout.tsx
git commit -m "feat(prova): layout da rota com as 3 fontes novas e o tema aplicado

Instrument Serif no display, Newsreader no corpo, JetBrains Mono nos numeros,
Inter segue na interface. Todas via next/font, que serve local no build e
satisfaz a CSP estrita desta rota.

Sobrescreve o canonical: o layout raiz declara '/' e sem isso a rota se
auto-canonicalizaria pra home."
```

---

### Task 5: A página

Entrega: `/prova` renderiza os 8 blocos a partir do conteúdo, sem JavaScript de runtime.

**Files:**
- Create: `app/prova/page.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `conteudoProva` de `content/prova.ts` (Tasks 1-2), as classes de `prova.css` (Task 3), o wrapper de `layout.tsx` (Task 4).
- Produces: a rota `/prova` renderizada.

- [ ] **Step 1: Escrever a página**

`app/prova/page.tsx`:

```tsx
import { conteudoProva } from "@/content/prova";

// Server Component puro. Sem "use client", sem estado, sem efeito.
export default function ProvaPage() {
  const { blocos, cta } = conteudoProva;

  return (
    <article>
      {blocos.map((bloco, indice) => (
        <section key={bloco.id} id={bloco.id} className="prova-bloco">
          <p className="eyebrow">{bloco.eyebrow}</p>
          {/* Só a abertura é h1. Página sem h1 quebra hierarquia de heading
              pra leitor de tela e perde ponto de SEO no Lighthouse. */}
          {indice === 0 ? <h1>{bloco.titulo}</h1> : <h2>{bloco.titulo}</h2>}

          <div className="prova-prosa">
            {bloco.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {bloco.destaque && (
            <dl className="prova-destaque">
              <dt>{bloco.destaque.valor}</dt>
              <dd>
                {bloco.destaque.legenda}
                <span className="prova-fonte">Fonte: {bloco.destaque.fonte}</span>
              </dd>
            </dl>
          )}

          {bloco.itens && (
            <dl className="prova-itens">
              {bloco.itens.map((item) => (
                <div key={item.nome} className="prova-item">
                  <dt>{item.nome}</dt>
                  <dd>{item.descricao}</dd>
                </div>
              ))}
            </dl>
          )}

          {bloco.id === "cta" && (
            <div className="prova-cta">
              {cta.acoes.map((acao) => (
                <a
                  key={acao.rotulo}
                  href={acao.href}
                  className={acao.primaria ? "btn-primary" : "btn-secondary"}
                >
                  {acao.rotulo}
                </a>
              ))}
            </div>
          )}
        </section>
      ))}
    </article>
  );
}
```

**Nota:** o import usa o alias `@/`. Conferir em `tsconfig.json` se `paths` já define `"@/*": ["./*"]`. Se não definir, trocar por caminho relativo `../../content/prova`.

- [ ] **Step 2: Incluir a rota no sitemap**

Substituir o conteúdo de `app/sitemap.ts` por:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://consultoriahorizon.com.br";
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/prova`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
```

Prioridade `0.8` e não `1.0`: enquanto o A/B não decidir, o oficial continua sendo a página canônica do site.

- [ ] **Step 3: Subir local e conferir**

```bash
npm run dev
```

Abrir `http://localhost:3000/prova`. Conferir a olho:
- fundo azul-escuro do oficial, sem faixa grafite sobrando nas bordas;
- títulos em serifa com gradiente azul;
- parágrafos em Newsreader, linha curta;
- o número `1.465` grande, em mono, azul claro;
- os dois botões no fim, e **o hover do primário brilha azul, não âmbar**.

Depois abrir `http://localhost:3000/lp2` e conferir que a v1 continua **âmbar**, inalterada.

- [ ] **Step 4: Commit**

```bash
git add app/prova/page.tsx app/sitemap.ts
git commit -m "feat(prova): pagina /prova renderizando os 8 blocos do conteudo

Server Component puro, sem JS de runtime, sem video. O markup sai do dado
tipado em content/prova.ts, entao a copy continua sendo revisavel e testavel
fora do JSX."
```

---

### Task 6: Guarda sobre o HTML pré-renderizado

Entrega: os critérios de aceite que só existem no HTML final viram teste, não conferência a olho.

**Files:**
- Create: `app/prova/build-output.test.ts`

**Interfaces:**
- Consumes: a saída de `next build` (a rota é estática, então o HTML é gerado em disco).
- Produces: nada consumido por outras tasks.

- [ ] **Step 1: Rodar o build para gerar a saída**

```bash
npm run build
```

Expected: build limpo. Anotar o caminho do HTML gerado, que em Next 15 costuma ser `.next/server/app/prova.html`.

- [ ] **Step 2: Escrever o teste falhando**

`app/prova/build-output.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HTML = join(process.cwd(), ".next", "server", "app", "prova.html");
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("HTML pré-renderizado de /prova", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  it("não tem nenhum elemento de vídeo ou moldura de player", () => {
    expect(html).not.toMatch(/<video[\s>]/i);
    expect(html).not.toMatch(/<iframe[\s>]/i);
    expect(html).not.toContain("vsl-frame");
    expect(html).not.toContain("vsl-play");
  });

  it("não pede nada a host de terceiro", () => {
    expect(html).not.toContain("cdn.tailwindcss.com");
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fonts.gstatic.com");
  });

  it("renderiza as 8 seções da spec", () => {
    for (const id of [
      "abertura", "crm-proprio", "numeros", "para-outros",
      "como-entramos", "antes-de-assinar", "objecoes", "cta",
    ]) {
      expect(html.includes(`id="${id}"`), `faltou a seção ${id}`).toBe(true);
    }
  });

  it("aplica o tema escopado", () => {
    expect(html).toContain("theme-v3");
  });

  it("tem exatamente um h1", () => {
    expect(html.match(/<h1[\s>]/gi)?.length ?? 0).toBe(1);
  });

  it("nunca chama DocsGrowth de cliente no HTML final", () => {
    const trechos = html.split(/(?=DocsGrowth)/i).slice(1);
    for (const t of trechos) {
      expect(/cliente/i.test(t.slice(0, 400)), "DocsGrowth descrito como cliente").toBe(false);
    }
  });

  it("declara o canonical próprio, não o da home", () => {
    expect(html).toMatch(/rel="canonical"[^>]*\/prova/);
  });
});
```

**Nota:** o `describe.skipIf` evita que o teste falhe em máquina sem build feito. Se o caminho do HTML mudar em outra versão do Next, ajustar a constante `HTML` em vez de remover o teste.

- [ ] **Step 3: Rodar e ver passar**

Run: `npm test`
Expected: PASS. Se algum caso falhar, o defeito está na página, não no teste.

- [ ] **Step 4: Commit**

```bash
git add app/prova/build-output.test.ts
git commit -m "test(prova): guardas sobre o HTML pre-renderizado

Os criterios de aceite que so existem no HTML final (zero video, zero host de
terceiro, 8 secoes, canonical proprio, DocsGrowth nunca como cliente) passam a
ser verificados por teste em vez de conferencia a olho."
```

---

### Task 7: Auditoria, deploy e smoke

Entrega: a página no ar, auditada, com o oficial comprovadamente intacto.

**Files:**
- Nenhum arquivo novo. Auditoria e operação.

- [ ] **Step 1: Auditoria de UI/UX**

Rodar a skill `horizon-uiux-guard` em modo standalone sobre `app/prova/`. Corrigir **BLOCKER** e **MUST-FIX**. Registrar WARN e INFO no PR sem necessariamente corrigir.

Atenção especial ao contraste real: `--hzn-text-muted: #71717a` sobre `#131316` é o par mais apertado da página e precisa ser conferido de fato, não presumido.

- [ ] **Step 2: Conferir que a v1 e o oficial não mudaram**

```bash
npm run build
```

Com `npm start` rodando, comparar `/` e `/lp2` contra o que está em produção hoje. Nenhuma diferença visual é aceitável nessas duas rotas.

- [ ] **Step 3: Abrir o PR**

```bash
gh pr create --base main --head feat/lp-prova-textual \
  --title "feat(prova): LP textual prova-primeiro em /prova" \
  --body "Ver docs/superpowers/specs/2026-08-15-lp-prova-textual-design.md"
```

O corpo do PR deve trazer **Summary** e **Test plan**, conforme convenção da casa.

- [ ] **Step 4: Merge e deploy**

O merge na `main` dispara a GHA. **Pré-requisito:** o PR #1 (porta 2289) precisa estar mergeado antes, senão o job de deploy não alcança a VPS.

- [ ] **Step 5: Smoke em produção**

```bash
curl -s -o /dev/null -w "prova %{http_code}\n" https://consultoriahorizon.com.br/prova
curl -s -o /dev/null -w "oficial %{http_code}\n" https://consultoriahorizon.com.br/
curl -s -o /dev/null -w "lp2 %{http_code}\n" https://consultoriahorizon.com.br/lp2
```

Expected: 200 nos três. Depois abrir `/prova` em navegador real (curl não prova asset nem fonte) e conferir num celular de verdade.

- [ ] **Step 6: Lighthouse**

```bash
npx lighthouse https://consultoriahorizon.com.br/prova --preset=desktop --output=json --output-path=./reports/prova-desktop.json --quiet
npx lighthouse https://consultoriahorizon.com.br/prova --output=json --output-path=./reports/prova-mobile.json --quiet
```

Expected: ≥90 nas 4 categorias, mobile e desktop. Sem JS de runtime e com fonte local, isso deve sair sem esforço. Se não sair, o relatório aponta o culpado.

- [ ] **Step 7: Atualizar o vault**

Adicionar entrada em `progress.md` e `changelog.md` da HorizonConsultoria e atualizar a linha do `lp-horizon` na ficha `_horizon-internal.md` com o link de `/prova` e o estado do A/B.

---

## Notas de execução

**O que fazer se a paleta não bater.** A referência é `public/v2/index.html`, não a memória de ninguém. Abrir o arquivo e comparar o valor. Esta lição está registrada no plano de 2026-04-28: quatro commits foram gastos tentando igualar um efeito por tentativa e erro quando bastava ler a fonte primeiro.

**O que NÃO fazer.** Não mexer em `tailwind.config.ts`, `design/tokens.css` ou `app/globals.css`. Se parecer necessário, é sinal de que o tema escopado está sendo contornado em vez de usado. Parar e escalar.

**Sobre o A/B.** Nenhum dos dois lados tem tracking. A comparação será qualitativa, com decisor real. Não apresentar como teste estatístico.
