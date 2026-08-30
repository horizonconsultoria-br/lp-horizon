import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { artigos } from "../../content/blog";

const artigo = artigos[0];
const HTML = join(
  process.cwd(),
  ".next",
  "server",
  "app",
  "blog",
  artigo.slug + ".html",
);
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("HTML pré-renderizado do artigo", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  it("declara BlogPosting", () => {
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain(artigo.titulo);
  });

  // Autor e publisher precisam ser REFERÊNCIA por @id à Organization do
  // layout raiz. Um objeto Organization inline, sem @id, cria um segundo nó
  // anônimo: o artigo passaria a anunciar uma entidade diferente da do site,
  // que é o oposto do objetivo.
  it("referencia a Organization do site por @id, sem criar outra", () => {
    expect(html).toContain('"author":{"@id":"https://consultoriahorizon.com.br/#org"}');
    expect(html).toContain('"publisher":{"@id":"https://consultoriahorizon.com.br/#org"}');
    expect(
      html.includes('"publisher":{"@type":"Organization"'),
      "publisher voltou a ser uma Organization inline, criando um segundo nó",
    ).toBe(false);
  });

  it("dá @id ao próprio artigo", () => {
    expect(html).toContain(
      `"@id":"https://consultoriahorizon.com.br/blog/${artigo.slug}#post"`,
    );
  });

  it("declara FAQPage quando o artigo tem perguntas", () => {
    if (artigo.faq.length > 0) {
      expect(html).toContain('"@type":"FAQPage"');
      expect(html).toContain(artigo.faq[0].pergunta);
    }
  });

  // A resposta direta precisa estar no HTML servido, não só no componente.
  it("serve o bloco de resposta direta", () => {
    expect(html).toContain("artigo-resposta");
    expect(html).toContain(artigo.resumo.slice(0, 40));
  });

  it("declara o canonical do artigo", () => {
    expect(html).toMatch(
      new RegExp(`rel="canonical"[^>]*href="https://consultoriahorizon\\.com\\.br/blog/${artigo.slug}"`),
    );
  });

  it("tem exatamente um h1", () => {
    expect(html.match(/<h1[\s>]/gi)?.length ?? 0).toBe(1);
  });

  // Tabela comparativa precisa ser tabela de verdade: imagem não é
  // recuperável por modelo, e conteúdo de decisão vive de comparação.
  it("renderiza tabela como HTML e não como imagem", () => {
    expect(html).toContain("<table");
  });
});
