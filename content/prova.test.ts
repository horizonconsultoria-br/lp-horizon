import { describe, it, expect } from "vitest";
import { conteudoProva } from "./prova";

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

/** Todo texto visível ao leitor, achatado num array. */
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
  it("nunca associa a palavra cliente a DocsGrowth", () => {
    for (const t of textosVisiveis()) {
      if (/DocsGrowth/i.test(t)) {
        expect(/cliente/i.test(t), `texto proibido: "${t}"`).toBe(false);
      }
    }
  });

  it("descreve DocsGrowth como demo onde ele aparece", () => {
    const mencoes = textosVisiveis().filter((t) => /DocsGrowth/i.test(t));
    expect(mencoes.length).toBeGreaterThan(0);
    for (const t of mencoes) {
      expect(/demo/i.test(t), `sem a palavra demo: "${t}"`).toBe(true);
    }
  });

  it("nunca chama PipePro de cliente pagante", () => {
    for (const t of textosVisiveis()) {
      if (/PipePro/i.test(t)) {
        expect(/cliente pagante/i.test(t), `texto proibido: "${t}"`).toBe(false);
      }
    }
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
      expect(/US\$\s*0[.,]/.test(t), `cifra de custo em: "${t}"`).toBe(false);
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
