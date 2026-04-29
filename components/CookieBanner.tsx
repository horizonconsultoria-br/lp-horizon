"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hzn_cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function decide(value: "accept" | "decline") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore storage errors */
    }
    // Consent Mode v2 — informa GA4 do escolha
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config" as never, "consent" as never, {
        ad_storage: "denied",
        analytics_storage: value === "accept" ? "granted" : "denied",
      } as never);
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-3 bottom-3 z-50 max-w-3xl mx-auto rounded-2xl border border-hzn-border-strong bg-hzn-bg-overlay p-5 shadow-2xl"
    >
      <p className="text-sm text-hzn-text-secondary leading-relaxed">
        Usamos cookies analíticos (Google Analytics) pra entender como você usa o site.
        Sem cookies de marketing, sem retargeting, sem fingerprinting.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button onClick={() => decide("accept")} className="btn-primary text-sm py-2 px-4">
          Aceitar
        </button>
        <button
          onClick={() => decide("decline")}
          className="btn-secondary text-sm py-2 px-4"
        >
          Recusar
        </button>
        <a
          href="/legal/privacidade"
          className="self-center text-xs text-hzn-text-muted hover:text-hzn-brand-400"
        >
          Saiba mais
        </a>
      </div>
    </div>
  );
}
