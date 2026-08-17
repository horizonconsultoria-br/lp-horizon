import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HTML = join(process.cwd(), ".next", "server", "app", "prova.html");
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("HTML pré-renderizado de /prova", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  // A regra original era "zero vídeo", escrita quando a página seria só texto.
  // O founder depois pediu o efeito de neblina em movimento da referência, que
  // é feito com vídeo. A regra que ele sempre quis dizer não era "nenhuma tag
  // video no HTML": era "nenhum player de marketing", porque a landing oficial
  // tem 5 molduras de play que não têm vídeo nenhum e abrem um alerta de
  // desenvolvedor. Então a guarda mudou de forma e continua guardando a mesma
  // coisa: nada de player, nada de iframe, e o único vídeo permitido é o de
  // fundo, decorativo, escondido de leitor de tela.
  it("não tem player de marketing nem iframe", () => {
    expect(html).not.toMatch(/<iframe[\s>]/i);
    expect(html).not.toContain("vsl-frame");
    expect(html).not.toContain("vsl-play");
    expect(html).not.toMatch(/\bcontrols\b/i);
  });

  it("o único vídeo é o de fundo, decorativo e sem áudio", () => {
    const tags = html.match(/<video[^>]*>/gi) ?? [];
    expect(tags.length, "esperado exatamente um vídeo de fundo").toBe(1);
    const tag = tags[0];
    expect(tag, "vídeo de fundo precisa ser mudo").toMatch(/muted/i);
    expect(tag, "vídeo de fundo precisa estar oculto pra leitor de tela").toMatch(
      /aria-hidden/i,
    );
    expect(tag, "vídeo de fundo não pode ter controles").not.toMatch(/controls/i);
  });

  it("não pede nada a host de terceiro", () => {
    expect(html).not.toContain("cdn.tailwindcss.com");
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fonts.gstatic.com");
  });

  it("renderiza as 8 seções da spec", () => {
    for (const id of [
      "abertura", "crm-proprio", "playbook", "mesmo-time",
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

  // As simulações são ilustrações encenadas. Diálogo e execução falsos
  // lidos em voz alta confundem quem usa leitor de tela, então todas nascem
  // aria-hidden. Se alguém remover o atributo ao mexer no markup, este
  // teste fica vermelho.
  it("as simulações existem e ficam escondidas de leitor de tela", () => {
    for (const classe of [
      'class="zap"',
      'class="n8n"',
      'class="funil"',
      'class="memb"',
      'class="stack"',
      'class="esp"',
    ]) {
      const tag = html.match(new RegExp(`<div[^>]*${classe}[^>]*>`));
      expect(tag, `faltou a ilustração ${classe}`).not.toBeNull();
      expect(tag![0], `${classe} sem aria-hidden`).toContain('aria-hidden="true"');
    }
  });

  // A faixa de clientes: o letreiro precisa das DUAS cópias da fila para o
  // loop fechar sem emenda, mas só a primeira é conteúdo; a segunda é
  // decorativa e nasce aria-hidden, senão o leitor de tela lê cada cliente
  // duas vezes.
  it("a faixa de clientes tem as duas filas e a cópia é decorativa", () => {
    const filas = html.match(/<ul[^>]*class="clientes-fila"[^>]*>/g) ?? [];
    expect(filas.length, "esperadas exatamente 2 filas no letreiro").toBe(2);
    expect(
      filas.filter((f) => f.includes('aria-hidden="true"')).length,
      "exatamente uma fila deve ser decorativa",
    ).toBe(1);
    expect(html).toContain('/prova/clientes/');
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
