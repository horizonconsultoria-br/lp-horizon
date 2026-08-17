"use client";

import { useEffect } from "react";

/**
 * Rotação automática das abas: a cada `segundos`, o próximo radio do grupo é
 * marcado, e o CSS faz todo o resto. O painel troca e a cena reinicia pelo
 * mesmo caminho do clique: `:checked` muda, o painel sai de `display: none`,
 * as caixas são recriadas e as animações partem do zero.
 *
 * É a única ilha de JavaScript autoral da página, e por decisão: marcar um
 * radio com o passar do tempo não existe em CSS, e encenar a troca inteira
 * em keyframes de `display` deixaria a dobra VAZIA em navegador sem suporte
 * a animação discreta de display. Um radio marcado é um estado que qualquer
 * navegador entende.
 *
 * A rotação é educada:
 * - não roda para quem pediu menos movimento (prefers-reduced-motion);
 * - só conta o tempo com a dobra visível, e o relógio zera quando ela entra
 *   em cena, então a aba da vez ganha os 12 segundos inteiros de leitura;
 * - pausa enquanto o ponteiro está sobre a dobra: alguém está lendo;
 * - para DE VEZ na primeira interação real com as abas (clique no rótulo ou
 *   seleção por teclado): quem pegou o volante fica com ele. A distinção
 *   vem de graça, porque `change` não dispara no `checked = true`
 *   programático, só em interação.
 */
export function RotacaoAbas({
  grupo,
  segundos = 12,
  cerca: seletorCerca = ".prova-abas",
}: {
  grupo: string;
  segundos?: number;
  /** Seletor do container que delimita visibilidade, hover e interação
   *  (a "cerca"). O acordeão de recursos passa o dele. */
  cerca?: string;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const radios = Array.from(
      document.querySelectorAll<HTMLInputElement>(`input[name="${CSS.escape(grupo)}"]`),
    );
    const cerca = radios[0]?.closest(seletorCerca);
    if (!cerca || radios.length < 2) return;

    let usuarioAssumiu = false;
    let ponteiroEmCima = false;
    let visivel = false;
    let temporizador = 0;

    const para = () => window.clearInterval(temporizador);
    const rearma = () => {
      para();
      temporizador = window.setInterval(() => {
        if (usuarioAssumiu) return para();
        if (!visivel || ponteiroEmCima || document.hidden) return;
        const atual = radios.findIndex((r) => r.checked);
        radios[(atual + 1) % radios.length].checked = true;
      }, segundos * 1000);
    };

    // Toque de rolagem no meio do painel não é escolha de aba; clique no
    // rótulo e mudança de seleção são. Só esses assumem o controle.
    const assumir = (ev: Event) => {
      const noRotulo = ev.target instanceof Element && ev.target.closest("label");
      if (ev.type === "change" || noRotulo) {
        usuarioAssumiu = true;
        para();
      }
    };
    const entra = () => {
      ponteiroEmCima = true;
    };
    const sai = () => {
      ponteiroEmCima = false;
    };
    cerca.addEventListener("change", assumir, true);
    cerca.addEventListener("pointerdown", assumir, true);
    cerca.addEventListener("pointerenter", entra);
    cerca.addEventListener("pointerleave", sai);

    const io = new IntersectionObserver(
      ([e]) => {
        const antes = visivel;
        visivel = e.isIntersecting;
        if (!antes && visivel) rearma();
      },
      { threshold: 0.35 },
    );
    io.observe(cerca);
    rearma();

    return () => {
      para();
      io.disconnect();
      cerca.removeEventListener("change", assumir, true);
      cerca.removeEventListener("pointerdown", assumir, true);
      cerca.removeEventListener("pointerenter", entra);
      cerca.removeEventListener("pointerleave", sai);
    };
  }, [grupo, segundos, seletorCerca]);

  return null;
}
