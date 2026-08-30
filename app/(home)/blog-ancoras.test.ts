import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guarda da única costura que atravessa a fronteira do git.
 *
 * O tema WordPress do blog (`horizon-blog`, que mora só na VPS em
 * `/srv/blog-horizon/theme-src/horizon-blog/` e no cofre em
 * `_horizon-internal/infra/2026-08-30-blog-horizon-infra/`) linka de TODA página
 * do blog para âncoras da home institucional, que é gerada por ESTE repositório.
 *
 * Nada mais liga os dois lados: nenhum portão de tarefa pega uma âncora que
 * deixou de existir aqui. Foi exatamente assim que o CTA do blog inteiro passou
 * a apontar para `#auditoria` — id que existe em `components/sections/Ofertas.tsx`,
 * importado só por `app/lp2/page.tsx` (a v1 aposentada, fora do sitemap) e que
 * portanto NUNCA saiu no HTML servido do apex. Todo artigo tinha o seu único
 * caminho de conversão caindo no topo da home, sem rolagem.
 *
 * Se você mexer nos ids das dobras de `app/(home)/page.tsx`, este teste fica
 * vermelho. O conserto NÃO é editar a lista abaixo: é abrir o tema na VPS
 * (`header.php`, `footer.php` e `HZN_AGENDA` em `functions.php`), repontar os
 * links e só então atualizar a lista, mantendo os dois lados juntos.
 */
const ANCORAS_DO_TEMA = [
  // functions.php · HZN_AGENDA — o CTA "Auditoria grátis" de todo artigo.
  "cta",
  // header.php · menu "Sobre"
  "crm-proprio",
  // header.php e footer.php · menu "Serviços"
  "playbook",
  // header.php · menu "Como funciona"
  "recursos",
] as const;

const HTML = join(process.cwd(), ".next", "server", "app", "index.html");
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("âncoras que o blog WordPress consome da home", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  it.each(ANCORAS_DO_TEMA)(
    "a home entrega a seção #%s, linkada pelo tema do blog",
    (ancora) => {
      expect(
        html.includes(`id="${ancora}"`),
        `o tema do blog linka para #${ancora}, que sumiu do HTML da home`,
      ).toBe(true);
    },
  );

  // A armadilha específica que gerou o defeito: #auditoria existe no repositório,
  // mas em uma página que a home não renderiza. Se alguém "consertar" um link do
  // blog voltando para ele, este teste explica por que não vale.
  it("não confunde #auditoria (só existe na lp2 aposentada) com âncora da home", () => {
    expect(
      html.includes('id="auditoria"'),
      "se #auditoria voltou para a home, revise o tema do blog junto",
    ).toBe(false);
  });
});
