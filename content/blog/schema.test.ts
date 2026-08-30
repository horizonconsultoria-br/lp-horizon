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
