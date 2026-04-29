"use client";

import { Cpu, FlaskConical, DollarSign, Package } from "lucide-react";
import { motion } from "motion/react";
import { FadeUp, Stagger, StaggerItem, Counter } from "@/components/animations";

const ITEMS = [
  {
    icon: Cpu,
    title: "IA-native desde day 1",
    body:
      "Não somos uma agência que adicionou IA depois. Stack default já inclui Claude (Opus/Sonnet/Haiku), MCPs, AI-OS Paperclip e agentes verticais. Vendemos software construído com IA por dentro.",
    counterTo: null,
    counterLabel: null,
  },
  {
    icon: FlaskConical,
    title: "Blueprints testados em produção",
    body:
      "O que vendemos pra você já rodou no nosso ecossistema interno. MCPs, agentes Claude, plataforma AI-OS — tudo em produção interna antes de virar oferta. Você não paga pra ser cobaia.",
    counterTo: null,
    counterLabel: null,
  },
  {
    icon: DollarSign,
    title: "Mais barato que big consulting",
    body:
      "Time enxuto + IA assistindo codificação + foco em entrega. Sem 6 camadas de gerência, sem PMO inflado, sem deck de 40 slides antes da primeira commit.",
    counterTo: 10,
    counterLabel: "× mais barato",
  },
  {
    icon: Package,
    title: "Entregamos produto, não horas",
    body:
      "Squad opera como time interno seu — com ownership de outcome. Discovery → spec → entrega iterativa → métrica. Se o seu KPI não mexe, a culpa é nossa.",
    counterTo: null,
    counterLabel: null,
  },
];

export default function Diferencial() {
  return (
    <section className="section-y bg-hzn-bg-raised relative overflow-hidden" id="diferencial">
      {/* nodes connected SVG decorativo de fundo */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="nodes-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="rgb(245 158 11)" />
            <circle cx="100" cy="20" r="2" fill="rgb(245 158 11)" />
            <circle cx="60" cy="80" r="2" fill="rgb(245 158 11)" />
            <line x1="20" y1="20" x2="60" y2="80" stroke="rgb(245 158 11)" strokeWidth="0.5" />
            <line x1="100" y1="20" x2="60" y2="80" stroke="rgb(245 158 11)" strokeWidth="0.5" />
            <line x1="20" y1="20" x2="100" y2="20" stroke="rgb(245 158 11)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nodes-pattern)" />
      </svg>

      <div className="container-h relative">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">★ POR QUE A HORIZON</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            4 motivos <span className="text-hzn-brand-400">concretos.</span>
          </h2>
          <p className="mt-4 text-hzn-text-secondary">Sem os adjetivos de slide.</p>
        </FadeUp>

        <Stagger className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ icon: Icon, title, body, counterTo, counterLabel }, i) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group rounded-2xl border border-hzn-border-default bg-hzn-bg-base p-6 h-full transition-colors hover:border-hzn-brand-400/40"
              >
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-hzn-brand-500/15 text-hzn-brand-400"
                >
                  <Icon size={22} aria-hidden />
                </motion.div>
                {counterTo !== null && (
                  <div className="mt-5 text-3xl font-bold text-hzn-brand-400 tabular-nums">
                    5–<Counter to={counterTo} duration={1.5} />
                    <span className="text-base font-semibold ml-1 text-hzn-text-secondary">
                      {counterLabel}
                    </span>
                  </div>
                )}
                <h3 className={`${counterTo !== null ? "mt-3" : "mt-5"} text-lg font-bold`}>
                  {title}
                </h3>
                <p className="mt-3 text-sm text-hzn-text-secondary leading-relaxed">{body}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
