"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Calendar, FileSearch, ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { track, attachScrollDepthTracker } from "@/lib/analytics";
import { CAL_URL } from "@/lib/utils";
import {
  FadeUp,
  RevealChars,
  GradientMeshBg,
  FloatingBadge,
  MagneticBtn,
} from "@/components/animations";

export default function Hero() {
  useEffect(() => {
    track("view_hero");
    const detach = attachScrollDepthTracker();
    return detach;
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      <GradientMeshBg />

      {/* Floating proof badges (decorativos, escondidos em mobile) */}
      <FloatingBadge
        delay={0.8}
        floatY={12}
        className="hidden lg:flex absolute right-[8%] top-[18%] items-center gap-2 rounded-full border border-hzn-border-default bg-hzn-bg-raised/80 backdrop-blur px-4 py-2 text-xs text-hzn-text-secondary shadow-lg shadow-black/30"
      >
        <TrendingUp size={14} className="text-hzn-brand-400" /> +R$2B em valuation · Enter Legaltech
      </FloatingBadge>

      <FloatingBadge
        delay={1.2}
        floatY={14}
        floatDuration={5.2}
        className="hidden lg:flex absolute right-[14%] bottom-[22%] items-center gap-2 rounded-full border border-hzn-border-default bg-hzn-bg-raised/80 backdrop-blur px-4 py-2 text-xs text-hzn-text-secondary shadow-lg shadow-black/30"
      >
        <Users size={14} className="text-hzn-brand-400" /> 1,2M usuários · Lu Magalu via WhatsApp
      </FloatingBadge>

      <FloatingBadge
        delay={1.6}
        floatY={10}
        floatDuration={4.8}
        className="hidden lg:flex absolute left-[6%] bottom-[24%] items-center gap-2 rounded-full border border-hzn-border-default bg-hzn-bg-raised/80 backdrop-blur px-4 py-2 text-xs text-hzn-text-secondary shadow-lg shadow-black/30"
      >
        <Sparkles size={14} className="text-hzn-brand-400" /> +40% faturamento · Lucas Miranda Estética
      </FloatingBadge>

      <div className="container-h relative z-10 pt-28 pb-24 md:pt-40 md:pb-32 max-w-4xl">
        <FadeUp delay={0.05}>
          <span className="eyebrow inline-flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block h-1.5 w-1.5 rounded-full bg-hzn-brand-400"
            />
            HorizonConsultoria · Software house IA-native
          </span>
        </FadeUp>

        <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <RevealChars text="IA-native ou ser engolido" delay={0.15} />
          <br />
          <RevealChars
            text="pela concorrência."
            delay={0.55}
            highlight="pela concorrência."
            className="text-hzn-brand-400"
          />
          <motion.span
            aria-hidden
            className="inline-block ml-2 w-[3px] md:w-1 h-[0.85em] align-middle bg-hzn-brand-400 translate-y-[-0.05em]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </h1>

        <FadeUp delay={1.2}>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-hzn-text-secondary leading-relaxed">
            Bancas tradicionais estão sendo trocadas por legaltechs de 2 anos.
            Clínicas pequenas batem rede grande no WhatsApp. A Horizon constrói a camada
            de IA do seu produto antes que seu concorrente faça primeiro.
          </p>
        </FadeUp>

        <FadeUp delay={1.4}>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <MagneticBtn strength={0.25}>
              <Link
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group relative overflow-hidden"
                onClick={() => track("cta_calendly_open", { source: "hero" })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={18} aria-hidden /> Agendar diagnóstico de 30min
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                {/* sweep shimmer no hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                />
              </Link>
            </MagneticBtn>
            <MagneticBtn strength={0.18}>
              <Link
                href="#auditoria"
                className="btn-secondary group"
                onClick={() => track("cta_form_open", { source: "hero" })}
              >
                <FileSearch
                  size={18}
                  aria-hidden
                  className="transition-transform group-hover:rotate-12"
                />{" "}
                Quero a auditoria-isca grátis
              </Link>
            </MagneticBtn>
          </div>
        </FadeUp>

        <FadeUp delay={1.6}>
          <p className="mt-12 text-xs md:text-sm text-hzn-text-muted tracking-wide">
            ★ 1 ECOSSISTEMA EM PRODUÇÃO &nbsp;·&nbsp; ★ DOCSGROWTH CASE LIVE &nbsp;·&nbsp; ★ IA-NATIVE DESDE DAY 1
          </p>
        </FadeUp>
      </div>

      {/* scroll indicator */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-6 text-hzn-text-muted text-[10px] tracking-[0.4em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 1, delay: 2 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
}
