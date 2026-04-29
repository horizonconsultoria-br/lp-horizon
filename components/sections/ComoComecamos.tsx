"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { CAL_URL } from "@/lib/utils";
import { FadeUp, Stagger, StaggerItem, MagneticBtn } from "@/components/animations";

const STEPS = [
  {
    n: "1",
    title: "Você preenche o formulário (3 min)",
    body:
      "Seu nome, sua empresa, o cargo, e a dor que está te incomodando. Quanto mais específico, melhor — \"queremos IA\" não nos diz nada; \"nosso CAC subiu 40% e o time de SDR não escala\" diz tudo.",
  },
  {
    n: "2",
    title: "Call de diagnóstico de 30-45min com o CTO",
    body:
      "Direto comigo, Gustavo Rodrigo. Sem SDR, sem pré-qualificação burocrática. Você expõe o problema, eu mostro 2-3 caminhos possíveis e o trade-off honesto de cada um.",
  },
  {
    n: "3",
    title: "Proposta personalizada em até 5 dias úteis",
    body:
      "Documento curto: escopo, cronograma, ticket, riscos, critério de sucesso. Sem letra miúda. Você lê em 15 minutos e decide.",
  },
];

export default function ComoComecamos() {
  return (
    <section className="section-y bg-hzn-bg-raised relative" id="como">
      <div className="container-h relative">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">★ COMO COMEÇAMOS</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            3 passos. <span className="text-hzn-brand-400">Sem deck de 40 slides.</span>
          </h2>
          <p className="mt-4 text-hzn-text-secondary">
            Sem 6 reuniões de "alinhamento de cultura".
          </p>
        </FadeUp>

        <div className="relative mt-14">
          {/* linha conectora gradient animada (desktop apenas) */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-hzn-brand-400/60 to-transparent"
          />

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {STEPS.map((s, idx) => (
              <StaggerItem key={s.n}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-hzn-border-default bg-hzn-bg-base p-6 h-full transition-colors hover:border-hzn-brand-400/40 relative"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + idx * 0.15,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-5xl font-bold text-hzn-brand-400 leading-none relative inline-block"
                  >
                    {s.n}
                    {/* glow halo atrás do número */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-10 blur-2xl opacity-40 bg-hzn-brand-500"
                    />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm text-hzn-text-secondary leading-relaxed">{s.body}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-12 text-center">
            <MagneticBtn strength={0.3}>
              <Link
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group relative overflow-hidden inline-flex"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={18} aria-hidden /> Agendar diagnóstico agora
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                />
              </Link>
            </MagneticBtn>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
