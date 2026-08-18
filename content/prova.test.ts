import { describe, it, expect } from "vitest";
import { conteudoProva } from "./prova";
import type { Bloco } from "./prova";

const IDS_ESPERADOS = [
  "abertura",
  "crm-proprio",
  "playbook",
  "mesmo-time",
  "tecnologias",
  "recursos",
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
  // O rodapé também é copy visível: sem ele aqui, as regras da casa
  // (travessão, vocabulário de vídeo, cifra em dólar) parariam na última
  // dobra e a página inteira menos o pé ficaria guardada.
  const r = conteudoProva.rodape;
  out.push(r.descricao, r.assinatura, r.whatsapp.rotulo, r.email, r.cnpj);
  for (const n of r.navegacao) out.push(n.rotulo);
  for (const s of r.redes) out.push(s.nome);
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

  it("nenhum bloco fica sem título, e cada layout exige o próprio conteúdo", () => {
    for (const b of conteudoProva.blocos) {
      expect(b.titulo.trim().length, `bloco ${b.id}`).toBeGreaterThan(0);
      if (
        b.layout === "abas" ||
        b.layout === "cartoes" ||
        b.layout === "recursos" ||
        b.layout === "faq"
      ) {
        // Abas, cartões e o acordeão dispensam prosa de propósito: os
        // painéis carregam o conteúdo. Em troca, precisam ter itens, senão
        // a dobra fica vazia.
        expect(b.itens?.length ?? 0, `bloco ${b.id} sem itens`).toBeGreaterThan(1);
      } else if (b.layout === "chamada") {
        // A banda de conversão vive de título + botão; sem ação ela é um
        // título solto numa moldura.
        expect(b.acao?.rotulo.trim().length ?? 0, `bloco ${b.id} sem ação`).toBeGreaterThan(0);
        expect(b.acao?.href.trim().length ?? 0, `bloco ${b.id} com ação sem destino`).toBeGreaterThan(0);
      } else if (b.layout === "techs") {
        // O letreiro de tecnologias precisa de itens com nome e ícone; um
        // letreiro vazio é um título girando nada.
        expect(b.techs?.length ?? 0, `bloco ${b.id} sem techs`).toBeGreaterThan(1);
        for (const t of b.techs ?? []) {
          expect(t.nome.trim().length, `tech sem nome no bloco ${b.id}`).toBeGreaterThan(0);
          expect(/^[\w-]+\.svg$/.test(t.arquivo), `arquivo inválido em ${t.nome}`).toBe(true);
        }
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

describe("rodapé", () => {
  // Mesma regra do menu do topo, que a página já cumpre: item de menu sem
  // destino que existe é o defeito da landing oficial. No rodapé o risco é
  // maior, porque ninguém rola até lá pra conferir.
  it("todo link de navegação aponta para uma dobra que existe", () => {
    for (const item of conteudoProva.rodape.navegacao) {
      expect(item.href.startsWith("#"), `link de navegação não é âncora: ${item.href}`).toBe(true);
      expect(
        IDS_ESPERADOS.includes(item.href.slice(1)),
        `âncora sem dobra correspondente: ${item.href}`,
      ).toBe(true);
    }
  });

  it("as redes apontam para perfis absolutos", () => {
    expect(conteudoProva.rodape.redes.length, "rodapé sem nenhuma rede").toBeGreaterThan(0);
    for (const rede of conteudoProva.rodape.redes) {
      expect(/^https:\/\/\S+$/.test(rede.href), `rede sem URL absoluta: ${rede.nome}`).toBe(true);
    }
  });

  // O telefone do rodapé precisa DISCAR. Número escrito só como texto é o
  // caso em que o visitante decide falar e não tem onde clicar.
  it("o WhatsApp é link de wa.me e o rótulo mostra o mesmo número", () => {
    const { href, rotulo } = conteudoProva.rodape.whatsapp;
    const digitos = href.replace(/^https:\/\/wa\.me\//, "").split("?")[0];
    expect(/^https:\/\/wa\.me\/\d{12,13}(\?|$)/.test(href), `href inválido: ${href}`).toBe(true);
    expect(rotulo.replace(/\D/g, ""), "o rótulo mostra um número diferente do link").toBe(digitos);
  });

  it("o CNPJ sai formatado, não em dígitos crus", () => {
    expect(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(conteudoProva.rodape.cnpj),
      `CNPJ fora do formato: ${conteudoProva.rodape.cnpj}`,
    ).toBe(true);
  });

  it("o e-mail de contato é o mesmo que a página usa nas chamadas", () => {
    const mailtos = conteudoProva.blocos
      .map((b) => b.acao?.href ?? "")
      .concat(conteudoProva.cta.acoes.map((a) => a.href))
      .filter((h) => h.startsWith("mailto:"))
      .map((h) => h.slice("mailto:".length).split("?")[0]);
    for (const endereco of mailtos) {
      expect(endereco, "a página escreve para um endereço e o rodapé publica outro").toBe(
        conteudoProva.rodape.email,
      );
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

describe("título da dobra de abas: uma linha", () => {
  /**
   * O tamanho do título desta dobra não é um número escolhido no olho: sai de
   * `clamp(28px, calc((100vw - 96px) / 33), 45px)` em prova.css. O divisor 33
   * veio de uma medição no navegador — a largura de UMA linha desta frase em
   * Syne 600 é 32,32× o tamanho da fonte — e só vale para ESTA copy.
   *
   * Trocar o título sem remedir quebra a promessa de uma linha só, e o
   * defeito aparece em produção, não aqui. Então a copy fica presa: mudou,
   * este teste fica vermelho e a mensagem diz o que fazer.
   */
  const TITULO_MEDIDO =
    "Seu time técnico para soluções de vendas e desenvolvimento de software";

  it("a copy do título continua sendo a que foi medida", () => {
    const dobra = conteudoProva.blocos.find((b) => b.layout === "abas");
    expect(dobra, "sumiu a dobra com layout de abas").toBeDefined();
    expect(
      dobra!.titulo,
      "o título mudou: remeça a largura de uma linha no navegador e ajuste o " +
        "divisor de --font-size em .prova-bloco-centro > h2 (prova.css)",
    ).toBe(TITULO_MEDIDO);
  });
});
