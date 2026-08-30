import type { ComponentType } from "react";

// Uma linha por artigo, com caminho literal de propósito: import com caminho
// montado em variável faz o bundler incluir a pasta inteira ou não achar nada.
// A guarda em corpos.test.ts garante que esta lista e o registro não divirjam.
export const corpos: Record<string, () => Promise<{ default: ComponentType }>> = {
  "melhor-sistema-para-clinicas": () =>
    import("./melhor-sistema-para-clinicas/corpo.mdx"),
};
