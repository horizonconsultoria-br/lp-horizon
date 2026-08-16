import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// process.cwd() e não __dirname: o Vitest roda os .ts como ESM, onde __dirname
// não é garantido. Mesma forma que build-output.test.ts usa.
const css = readFileSync(join(process.cwd(), "app", "prova", "prova.css"), "utf-8");

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

/** Hex da paleta âmbar da v1. Nenhum pode aparecer aqui. */
const HEX_AMBAR = [
  "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24",
  "#f59e0b", "#d97706", "#b45309", "#92400e",
  "#0b0d12", "#131720", "#1a2030", "#0e1117",
];

describe("tema escopado", () => {
  it("define o escopo .theme-v3", () => {
    expect(css).toMatch(/\.theme-v3\s*\{/);
  });

  it("redefine todos os tokens que teriam vazamento âmbar", () => {
    for (const t of TOKENS_OBRIGATORIOS) {
      expect(css.includes(t), `token não redefinido: ${t}`).toBe(true);
    }
  });

  it("não contém nenhum hex da paleta âmbar da v1", () => {
    for (const hex of HEX_AMBAR) {
      expect(css.toLowerCase().includes(hex), `vazou âmbar: ${hex}`).toBe(false);
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
