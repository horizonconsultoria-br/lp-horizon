import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instruções de Exclusão de Dados | Horizon Consultoria",
  description: "Como solicitar a exclusão de dados tratados no Teachflow pela Horizon Consultoria.",
  alternates: { canonical: "/legal/exclusao-de-dados" },
};

export default function DataDeletionPage() {
  return (
    <article className="container-h max-w-4xl py-12 md:py-20">
      <p className="eyebrow">Documento legal</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-hzn-text-primary md:text-5xl">
        Instruções de Exclusão de Dados
      </h1>
      <p className="mt-5 text-sm text-hzn-text-muted">Última atualização: 18 de novembro de 2026</p>

      <div className="mt-12 space-y-10 text-base leading-8 text-hzn-text-secondary">
        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">1. O que pode ser excluído</h2>
          <p className="mt-3">
            Você pode solicitar a exclusão dos dados associados às suas mensagens diretas com a conta
            <strong className="font-semibold text-hzn-text-primary"> @codeupoficial</strong> que estejam no
            Teachflow da CodeUp, operado pela Horizon Consultoria. Isso inclui o histórico da conversa e os
            registros associados mantidos pelo CRM, quando não houver obrigação legal ou outra base válida para
            retenção.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">2. Como solicitar</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>
              Envie um e-mail para{" "}
              <a className="text-hzn-brand-300 underline hover:text-hzn-brand-200" href="mailto:contato@consultoriahorizon.com.br?subject=Solicita%C3%A7%C3%A3o%20de%20exclus%C3%A3o%20de%20dados">
                contato@consultoriahorizon.com.br
              </a>{" "}
              com o assunto <strong className="font-semibold text-hzn-text-primary">“Solicitação de exclusão de dados”</strong>.
            </li>
            <li>Informe o seu usuário do Instagram e, se possível, a data aproximada da conversa.</li>
            <li>Envie o pedido a partir da conta de e-mail ou forneça informações que nos permitam confirmar que você é a pessoa titular dos dados.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">3. O que acontece depois</h2>
          <p className="mt-3">
            Confirmaremos o recebimento do pedido e poderemos solicitar informações adicionais para evitar a
            exclusão de dados da pessoa errada. Depois de verificar a solicitação, excluiremos ou anonimizaremos os
            dados elegíveis no Teachflow e comunicaremos a conclusão pelo mesmo canal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">4. Limites da exclusão</h2>
          <p className="mt-3">
            A solicitação não exclui mensagens ou dados que permaneçam no Instagram, Facebook ou outros serviços da
            Meta; esses serviços possuem controles e políticas próprios. Também poderemos manter a parcela mínima
            de dados exigida por lei, para cumprimento de obrigações ou para exercício regular de direitos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-hzn-text-primary">5. Contato do encarregado</h2>
          <p className="mt-3">
            O encarregado para assuntos de dados pessoais é Caetano Cabral. Para dúvidas sobre este processo,
            escreva para{" "}
            <a className="text-hzn-brand-300 underline hover:text-hzn-brand-200" href="mailto:contato@consultoriahorizon.com.br">
              contato@consultoriahorizon.com.br
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
}
