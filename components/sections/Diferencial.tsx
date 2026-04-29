import { Cpu, FlaskConical, DollarSign, Package } from "lucide-react";

const ITEMS = [
  {
    icon: Cpu,
    title: "IA-native desde day 1",
    body:
      "Não somos uma agência que adicionou IA depois. Stack default já inclui Claude (Opus/Sonnet/Haiku), MCPs, AI-OS Paperclip e agentes verticais. Vendemos software construído com IA por dentro.",
  },
  {
    icon: FlaskConical,
    title: "Blueprints testados em produção",
    body:
      "O que vendemos pra você já rodou no nosso ecossistema interno. MCPs, agentes Claude, plataforma AI-OS — tudo em produção interna antes de virar oferta. Você não paga pra ser cobaia.",
  },
  {
    icon: DollarSign,
    title: "5–10× mais barato que big consulting",
    body:
      "Time enxuto + IA assistindo codificação + foco em entrega. Sem 6 camadas de gerência, sem PMO inflado, sem deck de 40 slides antes da primeira commit.",
  },
  {
    icon: Package,
    title: "Entregamos produto, não horas",
    body:
      "Squad opera como time interno seu — com ownership de outcome. Discovery → spec → entrega iterativa → métrica. Se o seu KPI não mexe, a culpa é nossa.",
  },
];

export default function Diferencial() {
  return (
    <section className="section-y bg-hzn-bg-raised" id="diferencial">
      <div className="container-h">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">★ POR QUE A HORIZON</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            4 motivos concretos.
          </h2>
          <p className="mt-4 text-hzn-text-secondary">Sem os adjetivos de slide.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-hzn-border-default bg-hzn-bg-base p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-hzn-brand-500/15 text-hzn-brand-400">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm text-hzn-text-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
