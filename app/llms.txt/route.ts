export const dynamic = "force-static";

/**
 * Convenção emergente (llmstxt.org): um índice em texto do que o site tem, para
 * quem consome a página por modelo em vez de navegador. Artefato GEO em um
 * projeto cujo KPI é justamente ser citado por motor de resposta.
 *
 * A versão anterior listava artigo por artigo a partir de `content/blog`. Esse
 * conteúdo saiu do repositório: os artigos agora vivem no WordPress em /blog e
 * quem os enumera é o `wp-sitemap.xml`, já anunciado em `app/robots.ts`. Então
 * aqui fica só a identidade da empresa e o ponteiro para o blog — nada que
 * precise ser mantido em sincronia com um banco que este repositório não vê.
 */
export function GET() {
  const base = "https://consultoriahorizon.com.br";
  const linhas = [
    "# HorizonConsultoria",
    "",
    "> Software house IA-nativa. Avalia e implementa ferramentas de IA e automação",
    "> para pequenas e médias empresas, por vertical: diagnóstico do que trava,",
    "> escolha da ferramenta e o código rodando em produção.",
    "",
    "## Site",
    "",
    `- [Home](${base}/): serviços, playbook de entrega, tecnologias e agendamento.`,
    "",
    "## Blog",
    "",
    `- [Blog da Horizon](${base}/blog/): artigos sobre avaliação e implementação de IA`,
    "  e automação para PME, por vertical.",
    `- [Índice completo dos artigos](${base}/blog/wp-sitemap.xml): sitemap XML mantido`,
    "  pelo WordPress, sempre atualizado.",
    "",
    "## Contato",
    "",
    // Sem e-mail literal aqui de propósito: o apex serve `suporte@` e o tema do
    // blog serve `contato@`, e não há fonte que diga qual é o canal oficial.
    // Apontar para a dobra de agendamento (#cta, id conferido no HTML servido)
    // não corre o risco de publicar um endereço errado.
    `- [Agendar uma conversa](${base}/#cta): diagnóstico com a equipe da Horizon.`,
    "",
  ];
  return new Response(linhas.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
