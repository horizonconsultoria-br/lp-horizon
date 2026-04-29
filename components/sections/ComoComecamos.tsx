import Link from "next/link";
import { Calendar } from "lucide-react";
import { CAL_URL } from "@/lib/utils";

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
    <section className="section-y bg-hzn-bg-raised" id="como">
      <div className="container-h">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">★ COMO COMEÇAMOS</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            3 passos. Sem deck de 40 slides.
          </h2>
          <p className="mt-4 text-hzn-text-secondary">
            Sem 6 reuniões de "alinhamento de cultura".
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-hzn-border-default bg-hzn-bg-base p-6">
              <div className="text-5xl font-bold text-hzn-brand-400 leading-none">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-3 text-sm text-hzn-text-secondary leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Calendar size={18} aria-hidden /> Agendar diagnóstico agora
          </Link>
        </div>
      </div>
    </section>
  );
}
