import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// O alias "@/" só é permitido em CÓDIGO DE APP (ex.: app/sitemap.ts), nunca
// dentro de arquivo de teste. Mas quando um teste importa esse código de app
// (como app/sitemap.test.ts importa ./sitemap), o Vitest precisa resolver o
// alias transitivamente, senão a coleta falha antes de rodar um teste sequer.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
