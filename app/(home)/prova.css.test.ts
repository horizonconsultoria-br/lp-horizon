import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// process.cwd() e não __dirname: o Vitest roda os .ts como ESM, onde __dirname
// não é garantido. Mesma forma que build-output.test.ts usa.
const css = readFileSync(join(process.cwd(), "app", "(home)", "prova.css"), "utf-8");

/** Tokens cujo valor âmbar apareceria visualmente se não fossem redefinidos. */
const TOKENS_OBRIGATORIOS = [
  "--hzn-bg-base",
  "--hzn-bg-raised",
  "--hzn-bg-overlay",
  "--hzn-bg-muted",
  "--hzn-text-primary",
  "--hzn-text-secondary",
  "--hzn-text-muted",
  "--hzn-text-inverse",
  "--hzn-brand-50",
  "--hzn-brand-100",
  "--hzn-brand-200",
  "--hzn-brand-300",
  "--hzn-brand-400",
  "--hzn-brand-500",
  "--hzn-brand-600",
  "--hzn-brand-700",
  "--hzn-glow-amber",
  "--hzn-glow-amber-strong",
  "--hzn-border-subtle",
  "--hzn-border-default",
  "--hzn-border-strong",
];

/** Valores proibidos da paleta âmbar da v1. Hex + rgba com/sem espaço. */
const AMBAR_PROIBIDO = [
  // Hex da paleta âmbar
  "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24",
  "#f59e0b", "#d97706", "#b45309", "#92400e",
  "#0b0d12", "#131720", "#1a2030", "#0e1117",
  // Triplet decimal do glow âmbar (com e sem espaço após vírgulas)
  "rgba(245, 158, 11",
  "rgba(245,158,11",
];

/**
 * Extrai só o corpo do primeiro bloco `.theme-v3 { ... }`, contando chaves
 * pra achar o fechamento certo. Checar tokens dentro desse recorte (em vez
 * do arquivo inteiro) evita que uma declaração em QUALQUER outra regra —
 * ou um comentário em outro lugar do arquivo — conte como redefinição.
 */
function extrairBlocoThemeV3(cssTexto: string): string {
  const inicio = cssTexto.indexOf(".theme-v3");
  if (inicio === -1) throw new Error("bloco .theme-v3 não encontrado no CSS");

  const aberturaChave = cssTexto.indexOf("{", inicio);
  if (aberturaChave === -1) throw new Error("chave de abertura de .theme-v3 não encontrada");

  let profundidade = 0;
  let i = aberturaChave;
  for (; i < cssTexto.length; i++) {
    if (cssTexto[i] === "{") profundidade++;
    else if (cssTexto[i] === "}") {
      profundidade--;
      if (profundidade === 0) break;
    }
  }

  return cssTexto.slice(aberturaChave + 1, i);
}

/**
 * Casa a DECLARAÇÃO de verdade de um token — o nome seguido de dois-pontos —
 * dentro de um recorte de CSS já isolado ao bloco certo. Não usa
 * `.includes()`, que seria satisfeito por qualquer menção do nome, inclusive
 * dentro de um comentário ou de um `var(--token)` de consumo.
 */
function tokenEstaDeclarado(blocoCss: string, token: string): boolean {
  const escapado = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const padraoDeDeclaracao = new RegExp(`${escapado}\\s*:`);
  return padraoDeDeclaracao.test(blocoCss);
}

const blocoThemeV3 = extrairBlocoThemeV3(css);

describe("tema escopado", () => {
  it("define o escopo .theme-v3", () => {
    expect(css).toMatch(/\.theme-v3\s*\{/);
  });

  it("redefine todos os tokens que teriam vazamento âmbar", () => {
    for (const t of TOKENS_OBRIGATORIOS) {
      expect(tokenEstaDeclarado(blocoThemeV3, t), `token não declarado dentro de .theme-v3: ${t}`).toBe(true);
    }
  });

  it("não contém nenhum valor âmbar (hex ou rgba)", () => {
    for (const valor of AMBAR_PROIBIDO) {
      expect(css.toLowerCase().includes(valor.toLowerCase()), `vazou âmbar: ${valor}`).toBe(false);
    }
  });

  it("usa a marca azul exata do oficial", () => {
    expect(css).toContain("#3b82f6");
  });

  it("trava a medida de linha da prosa entre 62 e 72 caracteres", () => {
    const m = css.match(/--prova-medida:\s*(\d+)ch/);
    expect(m, "faltou --prova-medida em ch").not.toBeNull();
    const ch = Number(m![1]);
    expect(ch).toBeGreaterThanOrEqual(62);
    expect(ch).toBeLessThanOrEqual(72);
  });
});

describe("isolamento", () => {
  it("não define nada em :root nem em html/body soltos", () => {
    expect(css).not.toMatch(/^\s*:root\s*\{/m);
    expect(css).not.toMatch(/^\s*html\s*\{/m);
    expect(css).not.toMatch(/^\s*body\s*\{/m);
  });
});

/**
 * Extrai as regras-folha (seletor + corpo) de um CSS: os blocos cujo corpo não
 * tem outro bloco dentro. Regra dentro de `@media` entra normalmente, porque o
 * prelúdio do @media nunca casa (o corpo dele contém `{`). Comentários saem
 * antes, senão um seletor comentado contaria como regra viva.
 */
function regrasFolha(cssTexto: string): Array<{ seletor: string; corpo: string }> {
  const semComentarios = cssTexto.replace(/\/\*[\s\S]*?\*\//g, "");
  const regras: Array<{ seletor: string; corpo: string }> = [];
  const padrao = /([^{}]+)\{([^{}]*)\}/g;
  let achado: RegExpExecArray | null;
  while ((achado = padrao.exec(semComentarios)) !== null) {
    regras.push({ seletor: achado[1].trim().replace(/\s+/g, " "), corpo: achado[2] });
  }
  return regras;
}

/**
 * Devolve os seletores que mexem no `display` de um painel de aba SEM depender
 * do `:checked`. Cada um desses é um painel que pode aparecer fora da vez.
 */
function paineisQueLigamDisplaySemChecked(cssTexto: string): string[] {
  return regrasFolha(cssTexto)
    .filter(
      (r) =>
        r.seletor.includes(".prova-aba-painel") &&
        /(^|[;{\s])display\s*:/.test(r.corpo) &&
        !r.seletor.includes(":checked"),
    )
    .map((r) => r.seletor);
}

describe("abas: só o painel da aba marcada aparece", () => {
  /**
   * O defeito que isso guarda já aconteceu. `.prova-aba-painel-visual` (o
   * painel com a simulação de WhatsApp) declarava `display: grid` solto. Como
   * tem a MESMA especificidade do `.prova-aba-painel { display: none }` e vem
   * depois no arquivo, vencia sempre: a simulação ficava visível por cima de
   * qualquer outra aba que o visitante escolhesse. Quem liga o display de um
   * painel é o `:checked`, e só ele.
   */
  it("nenhuma regra fora do :checked liga o display de um painel", () => {
    // A única exceção é a regra base, que é justamente quem ESCONDE. Ela é
    // conferida no teste seguinte.
    const infratores = paineisQueLigamDisplaySemChecked(css).filter(
      (seletor) => seletor !== ".prova-aba-painel",
    );
    expect(
      infratores,
      `regra declara display de painel sem :checked: ${infratores.join(" | ")}`,
    ).toEqual([]);
  });

  it("o esconderijo padrão do painel continua sendo display: none", () => {
    const base = regrasFolha(css).find((r) => r.seletor === ".prova-aba-painel");
    expect(base, "regra base .prova-aba-painel sumiu").toBeDefined();
    expect(base!.corpo).toMatch(/display\s*:\s*none/);
  });

  it("pega o defeito exato que já foi ao ar", () => {
    const cssComOBug = `
      .prova-aba-painel { display: none; }
      .prova-aba input:checked ~ .prova-aba-painel { display: block; }
      .prova-aba-painel-visual { display: grid; grid-template-columns: 395px 1fr; }
    `;
    expect(paineisQueLigamDisplaySemChecked(cssComOBug)).toContain(
      ".prova-aba-painel-visual",
    );
  });
});

describe("regressão: glow âmbar em rgba", () => {
  /**
   * Prova que o buraco foi fechado: a checagem de AMBAR_PROIBIDO rejeita
   * glow âmbar em rgba(). Isso valida que a lista agora cobre a forma que
   * importa: alguém não pode colar --hzn-glow-amber: 0 20px 40px -20px rgba(245, 158, 11, 0.35)
   * e passar nos testes.
   */
  it("falha se rgba âmbar aparecer no conteúdo", () => {
    // Simula o que aconteceria se alguém reintroduzisse o glow âmbar
    const testeComAmbarRgba = "rgba(245, 158, 11, 0.35)";

    // Verifica que a lista detectaria isso
    let encontrado = false;
    for (const valor of AMBAR_PROIBIDO) {
      if (testeComAmbarRgba.toLowerCase().includes(valor.toLowerCase())) {
        encontrado = true;
        break;
      }
    }
    expect(encontrado, "lista deveria detectar rgba âmbar").toBe(true);
  });
});

describe("regressão: guarda de token com dentes de verdade", () => {
  /**
   * Prova 1: a guarda antiga usava `css.includes(token)` sobre o arquivo
   * inteiro, satisfeita por qualquer menção do nome — inclusive um
   * comentário que promete a declaração sem entregar. Este CSS de exemplo
   * reproduz exatamente esse caso: --hzn-glow-amber só existe dentro de um
   * comentário, nunca como declaração real. A guarda tem que reprovar.
   */
  it("reprova quando o token só aparece dentro de um comentário", () => {
    const cssComTokenSoEmComentario = `
      .theme-v3 {
        /* TODO: lembrar de redefinir --hzn-glow-amber aqui algum dia */
        --hzn-bg-base: #131316;
      }
    `;
    const bloco = extrairBlocoThemeV3(cssComTokenSoEmComentario);
    expect(tokenEstaDeclarado(bloco, "--hzn-glow-amber")).toBe(false);
  });

  /**
   * Prova 2: usando o CSS real do arquivo, remove a declaração verdadeira
   * de --hzn-glow-amber do bloco .theme-v3 (a mesma que, se apagada,
   * devolveria o glow âmbar ao :hover do .btn-primary) e confirma que a
   * guarda fica vermelha. O regex de remoção usa `--hzn-glow-amber:` com
   * dois-pontos colado, então não risca --hzn-glow-amber-strong por engano
   * — e o teste confirma isso explicitamente.
   */
  it("fica vermelha se a declaração real de --hzn-glow-amber for apagada do bloco", () => {
    expect(tokenEstaDeclarado(blocoThemeV3, "--hzn-glow-amber")).toBe(true);

    const blocoSemGlowAmbar = blocoThemeV3.replace(/--hzn-glow-amber:\s*[^;]+;/, "");
    expect(tokenEstaDeclarado(blocoSemGlowAmbar, "--hzn-glow-amber")).toBe(false);

    // --hzn-glow-amber-strong não pode ter sido afetado pela remoção acima:
    // prova que o regex de escape/match é específico ao token exato, não a
    // um prefixo compartilhado.
    expect(tokenEstaDeclarado(blocoSemGlowAmbar, "--hzn-glow-amber-strong")).toBe(true);
  });
});
