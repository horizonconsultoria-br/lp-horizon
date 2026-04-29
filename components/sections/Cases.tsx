"use client";

import Image from "next/image";
import { track } from "@/lib/analytics";

type Case = {
  setor: string;
  title: string;
  body: string;
  metrics: string[];
  loser: string;
  fonteLabel: string;
  fonteUrl: string;
  illustration: string;
  illustrationAlt: string;
};

const CASES: Case[] = [
  {
    setor: "Advocacia",
    title: 'Enter virou "escritório de IA" defendendo Itaú, Santander e Nubank',
    body:
      "Fundada em 2023. Em 2025 fechou Série A de US$35M com Sequoia + Founders Fund e foi avaliada em R$2 bilhões. Construiu agente que analisa o motivo da ação, acessa dados internos da empresa, reconstrói os fatos e gera peça de defesa em horas — o que escritórios tradicionais levavam semanas.",
    metrics: ["R$2B em valuation (2025)", "250 mil casos previstos pra 2025", "Itaú, Santander, Nubank, Magalu como clientes"],
    loser: "Bancas tradicionais que faziam defesa massiva de litígios de consumidor.",
    fonteLabel: "Brazil Journal · GlobeNewswire 09/2025",
    fonteUrl: "https://braziljournal.com/the-founders-fund-de-peter-thiel-avalia-a-enter-em-r-2-bilhoes/",
    illustration: "/illustrations/advocacia.svg",
    illustrationAlt: "Ilustração de uma balança da justiça com nodes de IA conectados a um dos pratos",
  },
  {
    setor: "Estética",
    title: "+40% de faturamento numa clínica trocando atendimento humano por IA no WhatsApp",
    body:
      "Clínica Lucas Miranda implementou agente conversacional via SleekFlow que centraliza captação, qualificação, agendamento, confirmação, cancelamento e campanhas (tipo aniversariantes do mês). Atendimento + agenda + planilha viraram um único loop.",
    metrics: ["+40% faturamento", "−30% esforço operacional", "Atendimento unificado em 1 canal"],
    loser: "Redes maiores que ainda operam atendimento manual fragmentado.",
    fonteLabel: "Case publicado por SleekFlow",
    fonteUrl: "https://sleekflow.io/pt-br/blog/chatbot-para-clinicas-com-ia",
    illustration: "/illustrations/estetica.svg",
    illustrationAlt: "Ilustração de balão de mensagem WhatsApp com spark de IA conectado",
  },
  {
    setor: "Varejo",
    title: "A Lu da Magalu virou vendedora no WhatsApp e converteu 3× mais que o app",
    body:
      "Magazine Luiza + Nama AI transformaram a Lu de assistente estática em agente de vendas. Reconhece imagem e áudio, sugere produto, completa compra dentro do WhatsApp. Combinam LLMs do Google Cloud com modelos open-source em infra própria.",
    metrics: ["1,2 milhão de usuários em 7 meses", "Conversão 3× maior vs. app", "NPS 90"],
    loser: "Varejistas que vendem só via app/web e ignoraram WhatsApp commerce com IA.",
    fonteLabel: "Exame · Nama Case Study",
    fonteUrl: "https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/",
    illustration: "/illustrations/varejo.svg",
    illustrationAlt: "Ilustração de sacola de compras com gráfico de barras crescente e spark de IA",
  },
];

export default function Cases() {
  return (
    <section className="section-y bg-hzn-bg-base" id="cases">
      <div className="container-h">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">CASES REAIS · FONTE PÚBLICA</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Quem está sendo engolido agora
          </h2>
          <p className="mt-4 text-hzn-text-secondary">
            Cases reais. Fontes públicas. Datas recentes. Sem inventar.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <article
              key={c.setor}
              className="surface-card flex flex-col"
              onClick={() =>
                track("case_card_click", { setor: c.setor, position: i + 1 })
              }
            >
              <Image
                src={c.illustration}
                alt={c.illustrationAlt}
                width={80}
                height={80}
                className="mb-4 rounded-lg"
              />
              <span className="eyebrow mb-3">{c.setor.toUpperCase()}</span>
              <h3 className="text-xl font-bold leading-snug">{c.title}</h3>
              <p className="mt-4 text-sm text-hzn-text-secondary leading-relaxed">
                {c.body}
              </p>
              <ul className="mt-5 space-y-1 text-sm text-hzn-text-primary">
                {c.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <span className="text-hzn-brand-400 mt-1">▸</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-5 border-t border-hzn-border-default text-xs text-hzn-text-muted">
                <span className="text-hzn-brand-400">Quem perde: </span>
                {c.loser}
              </p>
              <a
                href={c.fonteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs italic text-hzn-brand-400 hover:underline"
              >
                Fonte: {c.fonteLabel} ↗
              </a>
            </article>
          ))}
        </div>

        <p className="mt-14 text-center text-hzn-text-secondary max-w-3xl mx-auto">
          Em todo setor, alguém pequeno está se movendo primeiro. O custo de esperar
          18 meses de roadmap interno é virar o case do próximo report.
        </p>
      </div>
    </section>
  );
}
