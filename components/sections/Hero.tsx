"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Calendar, FileSearch, ArrowRight } from "lucide-react";
import { track, attachScrollDepthTracker } from "@/lib/analytics";
import { CAL_URL } from "@/lib/utils";

export default function Hero() {
  useEffect(() => {
    track("view_hero");
    const detach = attachScrollDepthTracker();
    return detach;
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Halo âmbar de fundo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 0%, rgba(245,158,11,0.35), rgba(11,13,18,0) 60%)",
        }}
      />

      <div className="container-h pt-28 pb-24 md:pt-40 md:pb-32">
        <span className="eyebrow">★ HorizonConsultoria · Software house IA-native</span>

        <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          IA-native ou ser engolido
          <br />
          <span className="text-hzn-brand-400">pela concorrência.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-hzn-text-secondary leading-relaxed">
          Bancas tradicionais estão sendo trocadas por legaltechs de 2 anos.
          Clínicas pequenas batem rede grande no WhatsApp. A Horizon constrói a camada
          de IA do seu produto antes que seu concorrente faça primeiro.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={() => track("cta_calendly_open", { source: "hero" })}
          >
            <Calendar size={18} aria-hidden /> Agendar diagnóstico de 30min
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="#auditoria"
            className="btn-secondary"
            onClick={() => track("cta_form_open", { source: "hero" })}
          >
            <FileSearch size={18} aria-hidden /> Quero a auditoria-isca grátis
          </Link>
        </div>

        <p className="mt-12 text-xs md:text-sm text-hzn-text-muted tracking-wide">
          ★ 1 ECOSSISTEMA EM PRODUÇÃO &nbsp;·&nbsp; ★ DOCSGROWTH CASE LIVE &nbsp;·&nbsp; ★ IA-NATIVE DESDE DAY 1
        </p>
      </div>
    </section>
  );
}
