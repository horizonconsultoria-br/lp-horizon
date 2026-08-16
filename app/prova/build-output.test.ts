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

  // Adição do controlador (fora do brief original): o layout de /prova declara
  // openGraph com título, descrição e URL, mas não define `images` — a aposta é
  // que o Next herda a imagem do layout raiz. Isso nunca foi confirmado. Se a
  // herança não acontecer, o link compartilhado em contexto de venda aparece
  // sem imagem no preview.
  it("declara og:image no HTML pré-renderizado", () => {
    expect(html).toMatch(/<meta[^>]*property="og:image"[^>]*>/i);
  });
});
