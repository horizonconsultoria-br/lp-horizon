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
 * cifra em dólar) e para checar presença de uma palavra num contexto já
 * filtrado: a regra é "nunca/sempre usar X em algum lugar", não uma
 * associação entre duas entidades que pode atravessar campos.
 */
function textosVisiveis(): string[] {
  const out: string[] = [];
  for (const b of conteudoProva.blocos) {
    out.push(b.eyebrow ?? "", b.titulo, ...b.paragrafos);
    if (b.destaque) out.push(b.destaque.valor, b.destaque.legenda);
    for (const i of b.itens ?? []) out.push(i.nome, i.descricao);
  }
  for (const a of conteudoProva.cta.acoes) out.push(a.rotulo);
  return out;
}

/**
 * Todo texto visível de cada bloco, concatenado numa string por BLOCO (não
 * por campo). Use para checar COEXISTÊNCIA de dois termos dentro do mesmo
 * bloco (ex: "DocsGrowth" e "cliente") — uma violação pode ter uma entidade
 * no título e o termo proibido num parágrafo separado; achatar por campo
 * (como `textosVisiveis`) deixaria essa combinação passar sem ser vista.
 */
function textoAgrupadoPorBloco(blocos: Bloco[]): string[] {
  return blocos.map((b) => {
    const partes: string[] = [b.eyebrow ?? "", b.titulo, ...b.paragrafos];
    if (b.destaque) partes.push(b.destaque.valor, b.destaque.legenda);
    for (const i of b.itens ?? []) partes.push(i.nome, i.descricao);
    return partes.join(" ");
  });
}

/**
 * Verdadeiro se `entidade` e `termoProibido` aparecem juntos no texto
 * agrupado de algum bloco, mesmo que em campos diferentes desse bloco.
 */
function algumBlocoAssocia(blocos: Bloco[], entidade: RegExp, termoProibido: RegExp): boolean {
  return textoAgrupadoPorBloco(blocos).some((t) => entidade.test(t) && termoProibido.test(t));
}

/**
 * Verdadeiro se nenhum bloco que menciona `entidade` deixa de mencionar `afirmacao`.
 * Usa `textoAgrupadoPorBloco` para garantir que a verificação vê coexistência em
 * campos diferentes do mesmo bloco. Se algum bloco tem a entidade mas não tem a
 * afirmação, retorna falso.
 */
function nenhumBlocoTemEntidadeSemAfirmacao(
  blocos: Bloco[],
  entidade: RegExp,
  afirmacao: RegExp,
): boolean {
  return !textoAgrupadoPorBloco(blocos).some((t) => entidade.test(t) && !afirmacao.test(t));
}

describe("estrutura", () => {
  it("tem exatamente os 8 blocos da spec, na ordem", () => {
    expect(conteudoProva.blocos.map((b) => b.id)).toEqual(IDS_ESPERADOS);
  });

  it("nenhum bloco fica sem título, e só a dobra de abas pode ficar sem prosa", () => {
    for (const b of conteudoProva.blocos) {
      expect(b.titulo.trim().length, `bloco ${b.id}`).toBeGreaterThan(0);
      if (b.layout === "abas") {
        // A dobra de abas dispensa prosa de propósito: os painéis carregam o
        // conteúdo. Em troca, ela precisa ter itens, senão fica vazia.
        expect(b.itens?.length ?? 0, `bloco ${b.id} sem itens`).toBeGreaterThan(1);
      } else {
        expect(b.paragrafos.length, `bloco ${b.id}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("regra de veracidade (spec §4)", () => {
  it("nunca associa a palavra cliente a DocsGrowth no mesmo bloco", () => {
    expect(
      algumBlocoAssocia(conteudoProva.blocos, /DocsGrowth/i, /cliente/i),
      "algum bloco associa DocsGrowth a cliente",
    ).toBe(false);
  });

  it("descreve DocsGrowth como demo onde ele aparece", () => {
    expect(
      nenhumBlocoTemEntidadeSemAfirmacao(conteudoProva.blocos, /DocsGrowth/i, /demo/i),
      "algum bloco menciona DocsGrowth mas não contém demo em nenhum campo",
    ).toBe(true);
  });

  it("nunca chama PipePro de cliente pagante no mesmo bloco", () => {
    expect(
      algumBlocoAssocia(conteudoProva.blocos, /PipePro/i, /cliente pagante/i),
      "algum bloco chama PipePro de cliente pagante",
    ).toBe(false);
  });

  it("REGRESSAO: pega DocsGrowth associado a cliente mesmo quando estao em campos diferentes do mesmo bloco", () => {
    // Cenario do achado do revisor: titulo menciona DocsGrowth, o paragrafo
    // (campo diferente, mesmo bloco) menciona "cliente". Antes da correcao,
    // uma guarda achatada por CAMPO (como textosVisiveis) nao pegava essa
    // combinacao porque nenhum campo isolado continha as duas palavras ao
    // mesmo tempo. Exercita a MESMA funcao que as guardas reais usam acima,
    // para travar qualquer regressao de volta a checagem por campo.
    const blocoRuim: Bloco = {
      id: "regressao",
      eyebrow: "regressao",
      titulo: "Como validamos com a DocsGrowth",
      paragrafos: ["Fizemos isso pro nosso cliente mais recente."],
    };
    expect(
      algumBlocoAssocia([blocoRuim], /DocsGrowth/i, /cliente/i),
      "a guarda deveria pegar DocsGrowth associado a cliente no mesmo bloco, mesmo em campos diferentes",
    ).toBe(true);
  });

  it("REGRESSAO: aceita DocsGrowth descrito como demo mesmo quando em campos diferentes do mesmo bloco", () => {
    // Cenario que explica o conserto: nome do item é "DocsGrowth", mas descrição
    // do mesmo item (campo diferente, mesmo bloco) é "Demo hi-fi...". A guarda
    // agora agrupa por bloco e valida que nenhum bloco com DocsGrowth deixa de
    // ter "demo". Isso corrige o problema onde achatamento por campo rejeitava.
    const blocoBom: Bloco = {
      id: "teste",
      eyebrow: "teste",
      titulo: "Produtos",
      paragrafos: ["Lista de produtos."],
      itens: [
        { nome: "DocsGrowth", descricao: "Demo hi-fi de CRM construída." },
      ],
    };
    expect(
      nenhumBlocoTemEntidadeSemAfirmacao([blocoBom], /DocsGrowth/i, /demo/i),
      "bloco com DocsGrowth em campo diferente de demo deveria passar",
    ).toBe(true);
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
