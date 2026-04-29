"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    q: "Quanto custa?",
    a: "Squad Retainer começa em R$15K/mês com commitment de 3 meses. Projeto fechado começa em R$50K com escopo + prazo definidos. Auditoria técnica + UX inicial: R$5-10K (ou grátis se virar contrato em 60 dias). Não trabalhamos abaixo desses pisos — abaixo disso, é freelancer.",
  },
  {
    q: "Quanto tempo demora?",
    a: "Spin-up de squad: 7 dias após assinatura. MVP de IA vertical: 60-120 dias. AI-OS completo: 120-240 dias. Auditoria: 5 dias úteis.",
  },
  {
    q: "Vocês entregam código ou consultoria?",
    a: "Código rodando em produção, sempre. Consultoria pura (\"damos as recomendações, você implementa\") não fazemos — porque é onde 80% dos projetos morrem.",
  },
  {
    q: "Funciona pra empresa pequena?",
    a: "Funciona pra empresa que tem pelo menos 1 produto rodando e dor clara onde IA pode mover métrica. Se você ainda está validando ideia, não somos a melhor escolha — vai num dev solo. A partir de Series Pre-Seed/Seed com produto em produção, faz sentido conversar.",
  },
  {
    q: "Qual a diferença pra agência digital?",
    a: "Agência digital faz site, marketing, funil. A gente faz software com IA por dentro do produto. Se o que você precisa é uma LP ou campanha de Ads, somos a ferramenta errada — vai numa agência. Se é um agente de atendimento que vai economizar 3 SDRs ou um modelo que vai reduzir 40% do custo de underwriting, é com a gente.",
  },
  {
    q: "Vocês fazem manutenção depois?",
    a: "Sim. Squad Retainer é o modelo natural pra continuar evoluindo o que entregamos. Em Projeto Fechado, oferecemos contrato de manutenção mensal (3-15% do valor do projeto, dependendo do SLA). Não desaparecemos no dia da entrega.",
  },
  {
    q: "Como sei se preciso de IA?",
    a: "Pergunta inversa: alguma das suas métricas vai mexer se você automatizar uma tarefa repetitiva, classificar texto/imagem, ou personalizar saída por usuário? Se sim, você precisa. Se não, IA é overkill — e a gente diz isso na call de diagnóstico, mesmo que isso signifique perder o contrato.",
  },
  {
    q: "Posso começar com a auditoria gratuita?",
    a: "Pode. Auditoria de 5 dias úteis com 10-15 recomendações priorizadas: R$5-10K ou grátis se virar contrato de Squad Retainer ou Projeto Fechado em até 60 dias.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-y bg-hzn-bg-base" id="faq">
      <div className="container-h max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">★ FAQ</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Perguntas que founders fazem
          </h2>
        </div>

        <ul className="mt-12 space-y-3">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className="rounded-xl border border-hzn-border-default bg-hzn-bg-raised overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-semibold text-hzn-text-primary">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={
                      "shrink-0 text-hzn-brand-400 transition-transform " +
                      (isOpen ? "rotate-180" : "rotate-0")
                    }
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-hzn-text-secondary leading-relaxed">
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
