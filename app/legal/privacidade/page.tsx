import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Horizon Consultoria",
  description: "Política de Privacidade da Horizon Consultoria para o tratamento de dados no Teachflow.",
  alternates: { canonical: "/legal/privacidade" },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container-h max-w-4xl py-12 md:py-20">
      <p className="eyebrow">Documento legal</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-hzn-text-primary md:text-5xl">
        Política de Privacidade
      </h1>
      <p className="mt-5 text-sm text-hzn-text-muted">Última atualização: 18 de novembro de 2026</p>

      <div className="mt-12 space-y-10 text-base leading-8 text-hzn-text-secondary">
        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">1. Quem trata os dados</h2>
          <p className="mt-3">
            A Horizon Consultoria, no Brasil, é a controladora dos dados tratados neste fluxo. Ela opera o
            Teachflow da CodeUp para atender e organizar mensagens diretas da conta Instagram
            <strong className="font-semibold text-hzn-text-primary"> @codeupoficial</strong>. Caetano Cabral é o
            encarregado para assuntos de proteção de dados e pode ser contatado em{" "}
            <a className="text-hzn-brand-300 underline hover:text-hzn-brand-200" href="mailto:contato@consultoriahorizon.com.br">
              contato@consultoriahorizon.com.br
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">2. Dados tratados e origem</h2>
          <p className="mt-3">
            Quando uma pessoa envia uma DM ou interage com a conta conectada, recebemos da plataforma Meta os dados
            necessários para a conversa: identificadores da conta, nome ou nome de usuário disponibilizado, conteúdo
            da mensagem, mídia enviada, data e hora, identificadores técnicos da conversa e o histórico de atendimento.
            Os dados são obtidos do Instagram e do Facebook/Meta conforme as permissões concedidas à conta profissional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">3. Finalidades</h2>
          <p className="mt-3">Usamos esses dados somente para:</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>receber, organizar e responder às DMs do Instagram pelo CRM Teachflow;</li>
            <li>dar continuidade ao atendimento, encaminhar uma conversa a uma pessoa responsável e registrar o histórico;</li>
            <li>proteger o serviço, prevenir abuso, corrigir falhas e manter registros necessários à operação.</li>
          </ul>
          <p className="mt-3">
            Não vendemos dados pessoais nem os usamos para criar públicos publicitários de terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">4. Armazenamento e operadores</h2>
          <p className="mt-3">
            As conversas e os registros do Teachflow são mantidos em infraestrutura de VPS da Hostinger (KVM2),
            operada por contêineres gerenciados com EasyPanel. Quando necessário ao atendimento automatizado,
            serviços Hermes executados em VPS da Contabo, também gerenciados com EasyPanel, acessam os registros
            estritamente necessários. Arquivos e mídias do Teachflow podem ser armazenados no Cloudflare R2.
          </p>
          <p className="mt-3">
            Esses fornecedores atuam como operadores de infraestrutura ou armazenamento sob instruções da Horizon
            Consultoria. Instagram, Facebook e Meta seguem sendo plataformas independentes e tratam os dados
            conforme suas próprias políticas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">5. Retenção e exclusão</h2>
          <p className="mt-3">
            Conservamos os dados enquanto forem necessários para o atendimento, para manter o histórico operacional,
            cumprir obrigações legais ou regulatórias e exercer ou defender direitos. Depois disso, os dados são
            excluídos ou anonimizados de forma segura. A exclusão do histórico no Teachflow não apaga a mensagem da
            plataforma Meta.
          </p>
          <p className="mt-3">
            Para solicitar a exclusão de dados do Teachflow, siga as{" "}
            <Link href="/legal/exclusao-de-dados" className="text-hzn-brand-300 underline hover:text-hzn-brand-200">
              instruções de exclusão de dados
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">6. Direitos e contato</h2>
          <p className="mt-3">
            Nos termos da legislação aplicável, você pode pedir confirmação de tratamento, acesso, correção,
            anonimização, bloqueio, eliminação, informação sobre compartilhamentos e revisão das informações
            fornecidas. Para exercer esses direitos ou tirar dúvidas, escreva para{" "}
            <a className="text-hzn-brand-300 underline hover:text-hzn-brand-200" href="mailto:contato@consultoriahorizon.com.br">
              contato@consultoriahorizon.com.br
            </a>{" "}
            e informe o usuário do Instagram ou outro identificador usado na conversa.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">7. Atualizações</h2>
          <p className="mt-3">
            Esta política pode ser atualizada para refletir mudanças operacionais, legais ou de segurança. A versão
            vigente estará sempre nesta página.
          </p>
        </section>
      </div>
    </article>
  );
}
