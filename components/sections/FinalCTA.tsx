"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { CAL_URL } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { FadeUp, MagneticBtn } from "@/components/animations";

// Carregar matrix rain só client-side (canvas precisa de window)
const MatrixRain = dynamic(() => import("@/components/animations/MatrixRain"), {
  ssr: false,
});

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="relative isolate overflow-hidden border-t border-b border-hzn-border-default"
    >
      {/* Matrix rain canvas como fundo (corporativo IA-native) */}
      <div className="absolute inset-0 -z-20">
        <MatrixRain className="absolute inset-0" />
      </div>

      {/* Vignette + gradient âmbar overlay pra legibilidade */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(11,13,18,0.55), rgba(11,13,18,0.95) 75%), linear-gradient(180deg, rgba(245,158,11,0.06), rgba(11,13,18,0))",
        }}
      />

      <div className="container-h relative py-28 md:py-40 max-w-4xl text-center">
        <FadeUp>
          <span className="eyebrow inline-flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-hzn-brand-400"
            />
            ★ AINDA DÁ TEMPO
          </span>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Não vire o próximo case
            <br />
            <span className="text-hzn-brand-400">do report do ano que vem.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-hzn-text-secondary leading-relaxed">
            30 minutos com o CTO. Sem SDR, sem deck, sem pré-qualificação. Você sai com
            2-3 caminhos concretos pra mover métrica com IA — ou um "isso aqui não é pra
            você", honestamente.
          </p>
        </FadeUp>

        <FadeUp delay={0.45}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <MagneticBtn strength={0.3}>
              <Link
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group relative overflow-hidden inline-flex"
                onClick={() => track("cta_calendly_open", { source: "final_cta" })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={18} aria-hidden /> Agendar diagnóstico de 30min
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                />
                {/* halo pulsante */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] ring-2 ring-hzn-brand-400/40"
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </Link>
            </MagneticBtn>
            <MagneticBtn strength={0.18}>
              <Link
                href="#auditoria"
                className="btn-secondary"
                onClick={() => track("cta_form_open", { source: "final_cta" })}
              >
                Quero a auditoria-isca grátis
              </Link>
            </MagneticBtn>
          </div>
        </FadeUp>

        <FadeUp delay={0.6}>
          <p className="mt-10 text-xs md:text-sm text-hzn-text-muted tracking-wide">
            ★ RESPOSTA EM 24H &nbsp;·&nbsp; ★ ZERO COMPROMETIMENTO &nbsp;·&nbsp; ★ DIRETO COM O CTO
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
