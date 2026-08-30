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
