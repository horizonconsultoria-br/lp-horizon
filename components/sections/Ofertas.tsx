import LeadForm from "@/components/LeadForm";

const OFERTAS = [
  {
    badge: "PREVISIBILIDADE",
    title: "Squad Retainer",
    body: "2-3 profissionais (devs IA + BA) alocados no seu produto por 3-6 meses. Spin-up em 7 dias.",
    price: "R$15-40K",
    suffix: "por mês",
  },
  {
    badge: "ESCOPO + PRAZO",
    title: "Projeto Fechado",
    body: "MVPs e IAs verticais com entregável claro. Milestones quinzenais. Pago por entregável.",
    price: "R$50-200K",
    suffix: "60-120 dias",
  },
  {
    badge: "MOAT DE DOMÍNIO",
    title: "IA Vertical Customizada",
    body: "Agentes/IAs específicos do seu setor. Prompt engineering, RAG, fine-tuning quando faz sentido.",
    price: "R$80-250K",
    suffix: "90-180 dias",
  },
  {
    badge: "DIFERENCIAÇÃO MAX",
    title: "AI-OS as a Service",
    body: "Plataforma agêntica completa (Paperclip + MCPs + agentes orquestrados). Mesmo padrão que rodamos internamente.",
    price: "R$150-500K",
    suffix: "120-240 dias",
    featured: true,
  },
];

export default function Ofertas() {
  return (
    <section className="section-y bg-hzn-bg-base" id="ofertas">
      <div className="container-h">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">★ O QUE ENTREGAMOS</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            4 modelos de engagement
          </h2>
          <p className="mt-4 text-hzn-text-secondary">
            Ticket transparente. Outcome no centro.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OFERTAS.map((o) => (
            <article
              key={o.title}
              className={
                "rounded-2xl border bg-gradient-to-b from-hzn-bg-overlay to-hzn-bg-raised p-6 flex flex-col " +
                (o.featured
                  ? "border-hzn-brand-300 shadow-amber-glow"
                  : "border-hzn-border-default")
              }
            >
              <span className="eyebrow text-xs">{o.badge}</span>
              <h3 className="mt-3 text-2xl font-bold">{o.title}</h3>
              <p className="mt-3 text-sm text-hzn-text-secondary leading-relaxed flex-1">
                {o.body}
              </p>
              <div className="mt-6 pt-6 border-t border-hzn-border-default">
                <div className="text-3xl font-bold text-hzn-brand-400">{o.price}</div>
                <div className="text-xs text-hzn-text-muted mt-1">{o.suffix}</div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA secundário — auditoria isca + form embedded */}
        <div
          id="auditoria"
          className="mt-16 rounded-3xl border border-hzn-border-strong bg-hzn-bg-raised p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="eyebrow">CTA SECUNDÁRIO · ENTRADA SUAVE</span>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold">
                Não sabe por onde começar?
              </h3>
              <p className="mt-4 text-hzn-text-secondary leading-relaxed">
                Auditoria técnica + UX em 5 dias úteis. Relatório acionável com
                10-15 melhorias priorizadas.
              </p>
              <p className="mt-3 text-hzn-text-primary text-lg">
                <strong className="text-hzn-brand-400">R$5-10K</strong>{" "}
                <span className="text-hzn-text-secondary">— ou grátis se virar contrato em 60 dias.</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-hzn-text-secondary">
                <li>▸ Análise técnica de stack e arquitetura</li>
                <li>▸ Heurísticas UX nos golden paths</li>
                <li>▸ Quick wins priorizados por impacto/esforço</li>
                <li>▸ Recomendações onde IA pode mover métrica</li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
