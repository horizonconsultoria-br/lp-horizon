import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
// Relativo, não "@/": o alias do tsconfig é resolvido pelo Next, e o Vitest
// roda sem ele; com "@/" o arquivo nem coleta.
import { artigos } from "../../content/blog";

const SITE = "https://consultoriahorizon.com.br";

const caminhoHtml = (slug: string) =>
  join(process.cwd(), ".next", "server", "app", "blog", slug + ".html");

// Sem `next build` não há HTML e a suíte inteira pula, como antes. A mudança
// é a cobertura: estas guardas pegaram uma violação real de spec, e prendê-las
// ao primeiro artigo do registro faria elas pararem de valer exatamente quando
// o andaime começasse a ser usado — do artigo 2 em diante ninguém checaria
// BlogPosting, canonical, bloco de resposta, h1 único nem tabela.
const disponivel = artigos.every((a) => existsSync(caminhoHtml(a.slug)));

describe.skipIf(!disponivel)("HTML pré-renderizado dos artigos", () => {
  describe.each(artigos)("/blog/$slug", (artigo) => {
    // O corpo do describe é coletado mesmo quando a suíte está pulada, então
    // a leitura precisa continuar condicional.
    const html = disponivel ? readFileSync(caminhoHtml(artigo.slug), "utf-8") : "";

    it("declara BlogPosting", () => {
      expect(html).toContain('"@type":"BlogPosting"');
      expect(html).toContain(artigo.titulo);
    });

    // Autor e publisher precisam ser REFERÊNCIA por @id à Organization do
    // layout raiz. Um objeto Organization inline, sem @id, cria um segundo nó
    // anônimo: o artigo passaria a anunciar uma entidade diferente da do site,
    // que é o oposto do objetivo.
    it("referencia a Organization do site por @id, sem criar outra", () => {
      expect(html).toContain(`"author":{"@id":"${SITE}/#org"}`);
      expect(html).toContain(`"publisher":{"@id":"${SITE}/#org"}`);
      expect(
        html.includes('"publisher":{"@type":"Organization"'),
        "publisher voltou a ser uma Organization inline, criando um segundo nó",
      ).toBe(false);
    });

    it("dá @id ao próprio artigo", () => {
      expect(html).toContain(`"@id":"${SITE}/blog/${artigo.slug}#post"`);
    });

    it("declara FAQPage quando o artigo tem perguntas", () => {
      if (artigo.faq.length > 0) {
        expect(html).toContain('"@type":"FAQPage"');
        expect(html).toContain(artigo.faq[0].pergunta);
      } else {
        // FAQPage vazio é sinal estruturado mentindo.
        expect(html).not.toContain('"@type":"FAQPage"');
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

    // O Next mescla metadata de forma rasa: declarar openGraph no artigo
    // substitui o do layout raiz inteiro. Sem redeclarar, o link do artigo
    // compartilhado sai sem imagem; e sem um bloco twitter próprio, o card
    // anuncia a manchete da landing em vez da do artigo.
    it("mantém og:image, og:site_name e og:locale próprios", () => {
      expect(html).toMatch(/<meta[^>]*property="og:image"[^>]*>/i);
      expect(html).toMatch(/<meta[^>]*property="og:site_name"[^>]*>/i);
      expect(html).toMatch(/<meta[^>]*property="og:locale"[^>]*>/i);
    });

    it("anuncia o próprio título no card do Twitter", () => {
      const tag = html.match(/<meta[^>]*name="twitter:title"[^>]*>/i);
      expect(tag, "o artigo não declara twitter:title e herda o da raiz").not.toBeNull();
      expect(tag![0]).toContain(artigo.titulo);
    });

    it("tem exatamente um h1", () => {
      expect(html.match(/<h1[\s>]/gi)?.length ?? 0).toBe(1);
    });

    // Tabela comparativa precisa ser tabela de verdade: imagem não é
    // recuperável por modelo, e conteúdo de decisão vive de comparação. Mas
    // nem todo artigo compara, então a exigência sai do sinal explícito
    // `temTabela` do meta, e vale nos dois sentidos — assim tanto a tabela
    // que virou imagem quanto o sinal que ficou desatualizado ficam vermelhos.
    it("a tabela comparativa existe como HTML exatamente quando o meta declara", () => {
      expect(
        html.includes("<table"),
        artigo.temTabela
          ? "meta diz temTabela, mas o HTML não tem <table> (virou imagem?)"
          : "o HTML tem <table>, mas o meta não declara temTabela",
      ).toBe(artigo.temTabela);
    });
  });
});
