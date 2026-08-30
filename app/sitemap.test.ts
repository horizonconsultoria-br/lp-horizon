import { describe, it, expect } from "vitest";
// Relativo, não "@/": o alias do tsconfig é resolvido pelo Next, e o Vitest
// roda sem ele; com "@/" o arquivo nem coleta.
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);

  it("anuncia a raiz", () => {
    expect(urls).toContain("https://consultoriahorizon.com.br/");
  });

  // Guarda que nasceu antes do blog e sobrevive a ele: /comercial e /lp2 são
  // outros textos sobre a MESMA empresa. Anunciar os três poria a Horizon
  // competindo consigo mesma pela mesma busca.
  it("nunca anuncia /comercial nem /lp2", () => {
    expect(urls.some((u) => u.includes("/comercial"))).toBe(false);
    expect(urls.some((u) => u.includes("/lp2"))).toBe(false);
  });

  // O blog agora é WordPress atrás do proxy, com sitemap PRÓPRIO em
  // /blog/wp-sitemap.xml. Anunciá-lo aqui também criaria duas fontes para a
  // mesma URL. Se alguém tentar "completar" o sitemap com o blog, isto
  // fica vermelho.
  it("não anuncia o blog — ele tem sitemap próprio no WordPress", () => {
    expect(urls.some((u) => u.includes("/blog"))).toBe(false);
  });
});
