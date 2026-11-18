import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Horizon Consultoria",
  description: "Termos de Uso da integração de mensagens Instagram operada pela Horizon Consultoria.",
  alternates: { canonical: "/legal/termos-de-uso" },
};

export default function TermsOfUsePage() {
  return (
    <article className="container-h max-w-4xl py-12 md:py-20">
      <p className="eyebrow">Documento legal</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-hzn-text-primary md:text-5xl">
        Termos de Uso
      </h1>
      <p className="mt-5 text-sm text-hzn-text-muted">Última atualização: 18 de novembro de 2026</p>

      <div className="mt-12 space-y-10 text-base leading-8 text-hzn-text-secondary">
        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">1. Escopo</h2>
          <p className="mt-3">
            Estes termos regulam o uso da integração de mensagens Instagram/Facebook operada pela Horizon
            Consultoria no CRM Teachflow da CodeUp. A integração é de uso próprio da operação e permite administrar
            as mensagens diretas da conta profissional <strong className="font-semibold text-hzn-text-primary">@codeupoficial</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">2. Uso permitido</h2>
          <p className="mt-3">
            O acesso ao CRM é restrito às pessoas autorizadas pela operação. Quem o utiliza deve tratar as conversas
            com confidencialidade, usar somente as permissões necessárias à sua função, manter suas credenciais em
            segurança e obedecer à legislação aplicável e às regras da Meta, do Facebook e do Instagram.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">3. Mensagens e conteúdo</h2>
          <p className="mt-3">
            As DMs recebidas podem ser visualizadas, organizadas, respondidas e encaminhadas dentro do Teachflow
            para a finalidade de atendimento da CodeUp. Não é permitido usar a integração para spam, fraude,
            discriminação, assédio, coleta indevida de dados ou qualquer atividade que viole direitos de terceiros
            ou os termos das plataformas Meta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">4. Disponibilidade e plataformas de terceiros</h2>
          <p className="mt-3">
            A integração depende dos serviços da Meta e da infraestrutura técnica descrita na Política de
            Privacidade. Mudanças, indisponibilidades, limites ou decisões dessas plataformas podem afetar o
            funcionamento do canal. Facebook, Instagram e Meta são marcas e serviços de terceiros, sujeitos aos
            seus próprios termos e políticas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">5. Privacidade</h2>
          <p className="mt-3">
            O tratamento de dados pessoais decorrente das mensagens é explicado na Política de Privacidade. Pedidos
            de exclusão de dados do Teachflow devem seguir as instruções específicas publicadas neste site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">6. Alterações e contato</h2>
          <p className="mt-3">
            Podemos atualizar estes termos quando houver mudança operacional, legal ou nas exigências das
            plataformas. Dúvidas sobre estes termos podem ser enviadas ao encarregado, Caetano Cabral, em{" "}
            <a className="text-hzn-brand-300 underline hover:text-hzn-brand-200" href="mailto:contato@consultoriahorizon.com.br">
              contato@consultoriahorizon.com.br
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
