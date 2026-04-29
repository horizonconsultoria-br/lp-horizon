/**
 * GA4 events wrapper — centraliza disparos pra evitar typos e manter o catálogo claro.
 *
 * Eventos definidos no FR-009 do plano `2026-04-28-lp-consultoriahorizon.md`:
 *   - view_hero
 *   - scroll_50
 *   - scroll_90
 *   - cta_form_open
 *   - lead_form_submit_success
 *   - cta_calendly_open
 *   - case_card_click
 *
 * Usa window.gtag injetado pelo @next/third-parties/google. No-op se GA4 não configurado.
 */

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "set",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export type HznEventName =
  | "view_hero"
  | "scroll_50"
  | "scroll_90"
  | "cta_form_open"
  | "lead_form_submit_success"
  | "cta_calendly_open"
  | "case_card_click";

export function track(event: HznEventName, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", event, params ?? {});
}

/**
 * Hook utilitário pra registrar scroll depth — escuta scroll, dispara scroll_50 e scroll_90 1× cada.
 * Chamar uma vez em client component (ex.: dentro do <Hero/>).
 */
export function attachScrollDepthTracker(): () => void {
  if (typeof window === "undefined") return () => undefined;

  let fired50 = false;
  let fired90 = false;

  const onScroll = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const pct = (window.scrollY / docH) * 100;
    if (!fired50 && pct >= 50) {
      fired50 = true;
      track("scroll_50");
    }
    if (!fired90 && pct >= 90) {
      fired90 = true;
      track("scroll_90");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
