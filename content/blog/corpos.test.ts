import { describe, it, expect } from "vitest";
import { corpos } from "./corpos";
import { slugs } from "./index";

// O registro (index.ts) e o mapa de corpos (corpos.ts) são duas listas
// mantidas à mão. Este teste é a guarda contra a única falha que essa
// duplicação permite: registrar o artigo e esquecer o corpo, ou o contrário.
// A página serviria 404 ou sumiria do índice sem ninguém notar.
describe("mapa de corpos", () => {
  it("tem exatamente uma entrada por artigo registrado", () => {
    expect(Object.keys(corpos).sort()).toEqual(slugs().sort());
  });

  it("cada entrada é uma função de import", () => {
    for (const [slug, carregar] of Object.entries(corpos)) {
      expect(typeof carregar, `corpo de ${slug} não é função`).toBe("function");
    }
  });
});
