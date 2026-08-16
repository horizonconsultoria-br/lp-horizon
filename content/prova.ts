export type Destaque = { valor: string; legenda: string; fonte: string };
export type Item = { nome: string; descricao: string };

export type Bloco = {
  id: string;
  /** Opcional: o herói não usa. */
  eyebrow?: string;
  /** Opcional: linha de apoio logo abaixo do título da dobra. */
  subtitulo?: string;
  /** "abas" renderiza os `itens` como painéis selecionáveis em vez de lista. */
  layout?: "abas";
  titulo: string;
  paragrafos: string[];
  destaque?: Destaque;
  itens?: Item[];
};

export type Acao = { rotulo: string; href: string; primaria: boolean };
// Só as ações. O bloco "cta" já carrega título e parágrafos como qualquer outro
// bloco; um segundo par título/subtítulo aqui seria dado que ninguém renderiza.
export type CTA = { acoes: Acao[] };

export type ConteudoProva = { blocos: Bloco[]; cta: CTA };

export const conteudoProva: ConteudoProva = {
  blocos: [
    {
      id: "abertura",
      titulo: "Tecnologia e Inteligência Artificial aplicada a vendas e otimização operacional",
      paragrafos: [
        "Aumente sua receita e diminua seu custo operacional usando tecnologia, automação e inteligência artificial do jeito certo",
        "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon, roda em produção e muda quase todo dia. O que você lê abaixo não é portfólio: é a nossa operação, com os números que ela gerou.",
      ],
    },
    {
      id: "crm-proprio",
      titulo: "Sua squad técnica para soluções de vendas e vazão no backlog",
      subtitulo: "Onde a IA faz diferença para você",
      layout: "abas",
      // Sem prosa nesta dobra: a estrutura de abas fala por si, como na
      // referência. Isso também resolve o pronome órfão que ficou quando a
      // manchete mudou de "Um CRM inteiro" para "Sua squad técnica" e o
      // parágrafo seguinte continuou começando com "Ele descobre empresas".
      paragrafos: [],
      itens: [
        {
          nome: "AI Chatbots",
          descricao:
            "Qualifica, agenda, responde em 3 segundos. Clone do hello seu melhor vendedor online 24/7, sem folga, sem café, sem segunda-feira ruim.",
        },
        {
          nome: "Sistema de qualificação de leads",
          descricao:
            "Encontra tudo sobre o lead, analisa se é fit, personaliza a primeira mensagem e entrega um dossiê completo já dentro do CRM. Sua equipe falando por mais tempo com quem pode comprar.",
        },
        {
          nome: "Sistema de prospecção",
          descricao:
            "Aborda automaticamente com mensagens personalizadas 1-pra-1, só que agora no automático para listas ultrasegmentadas. Uma equipe de hunters sistemáticos para encher o pipeline.",
        },
        {
          nome: "Sistemas de treinamento",
          descricao:
            "Acompanha calls, identifica gaps e recomenda melhorias em tempo real. Cada vendedor recebe coaching personalizado baseado em dados, não em achismo.",
        },
        {
          nome: "CRM Automation",
          descricao:
            "CRM que se atualiza sozinho. Automações que preenchem campos, movem deals e criam tarefas sem ninguém clicar em nada. Seu pipeline sempre atualizado, seu forecast sempre confiável.",
        },
        {
          nome: "Inteligência de Mercado",
          descricao:
            "Monitora seus concorrentes, rastreia mudanças de preço, identifica empresas procurando sua solução. Meio como ter um espião, só que sem infringir leis e que opera no automático.",
        },
        {
          nome: "Dados",
          descricao:
            "Converse com seus dados como se fosse o ChatGPT. “Qual vendedor converte melhor?” “Onde perdemos mais deals?” Respostas instantâneas, sem abrir uma planilha sequer.",
        },
      ],
    },
    {
      id: "numeros",
      eyebrow: "Medido, não estimado",
      titulo: "A diferença entre achar e saber é ter medido.",
      paragrafos: [
        "Numa única operação de prospecção, a varredura cobriu quatro cidades e quatro segmentos e trouxe empresas qualificadas com nome, telefone, site e Instagram de cada uma.",
        "Não é projeção nem estimativa de modelo. É o resultado de uma execução real, registrado no dia em que aconteceu.",
      ],
      destaque: {
        valor: "1.465",
        legenda: "empresas qualificadas numa única operação, em 4 cidades e 4 segmentos",
        fonte: "progress.md HorizonConsultoria, entrada de 2026-08-03/04",
      },
    },
    {
      id: "para-outros",
      eyebrow: "O que construímos para outros",
      titulo: "Produto de gente que já tem produto.",
      paragrafos: [
        "A Horizon não vive de slide. Estes são trabalhos com código rodando, cada um descrito pelo que ele é hoje.",
      ],
      itens: [
        {
          nome: "Umind",
          descricao:
            "SaaS de gestão para clínicas, com produto já em produção, que a Horizon assumiu para evoluir e manter. Ambientes de desenvolvimento e produção no ar, com o banco real do negócio.",
        },
        {
          nome: "PipePro",
          descricao:
            "Ferramenta de gestão de projetos com WhatsApp integrado, construída pela Horizon e hoje em staging.",
        },
        {
          nome: "DocsGrowth",
          descricao:
            "Demo hi-fi de CRM sob medida, construída para a DocsGrowth e publicada com dados coerentes, feita para ser navegada antes de qualquer contrato.",
        },
      ],
    },
    {
      id: "como-entramos",
      eyebrow: "Como entramos",
      titulo: "Quatro formatos, e um deles nos coloca no mesmo barco.",
      paragrafos: [
        "O formato certo depende de quanto do risco faz sentido dividir. Em todos, o que entregamos é software em produção, não relatório.",
      ],
      itens: [
        { nome: "Squad alocado", descricao: "Time dedicado ao seu produto por alguns meses, com custo previsível." },
        { nome: "Projeto fechado", descricao: "Escopo e prazo definidos, pagos por entrega." },
        { nome: "IA vertical", descricao: "Um agente construído para o seu domínio, com avaliação própria de qualidade." },
        {
          nome: "Tech for Equity",
          descricao:
            "Mensalidade reduzida somada a participação no negócio. É o formato que preferimos quando dá, porque alinha o nosso ganho ao seu crescimento em vez de à nossa hora.",
        },
      ],
    },
    {
      id: "antes-de-assinar",
      eyebrow: "Antes de assinar",
      titulo: "Você recebe a análise antes de decidir qualquer coisa.",
      paragrafos: [
        "Antes de falar de contrato, a gente estuda o seu negócio e publica o resultado numa página só sua: presença digital, o que os concorrentes estão fazendo, onde você aparece e onde não aparece.",
        "A regra que seguimos ao escrever essa análise é dura de propósito: assunto que não encontramos aparece como ponto crítico, e não some do relatório. Você recebe o que existe, incluindo o que não existe.",
        "É o mesmo material que usamos para decidir se vale a nossa conversa. Você fica com ele mesmo que a resposta seja não.",
      ],
    },
    {
      id: "objecoes",
      eyebrow: "Perguntas diretas",
      titulo: "As dúvidas que aparecem antes da primeira conversa.",
      paragrafos: [
        "Respostas curtas, do jeito que a gente responderia numa call.",
      ],
      itens: [
        {
          nome: "Vocês entregam código ou consultoria?",
          descricao: "Código rodando em produção. Consultoria sem entrega é onde a maioria dos projetos morre.",
        },
        {
          nome: "E se eu já tenho time?",
          descricao:
            "Melhor ainda. A gente entra na frente que o seu time não consegue abrir, e devolve o que construiu documentado para ele tocar.",
        },
        {
          nome: "Quanto tempo até ver algo de pé?",
          descricao: "Software em produção em semanas, não em trimestres. O primeiro corte é sempre o menor possível que já serve.",
        },
        {
          nome: "Quanto custa?",
          descricao:
            "Depende do formato. O modelo com participação tem mensalidade menor porque parte do nosso ganho fica atrelada ao seu resultado.",
        },
      ],
    },
    {
      id: "cta",
      eyebrow: "Próxima ação",
      titulo: "Uma conversa de uma hora, e você sai com um diagnóstico.",
      paragrafos: [
        "Mapeamos a sua maior dor operacional, damos uma estimativa honesta de prazo e falamos o que faríamos primeiro.",
        "Se não fizer sentido fechar, você fica com a análise mesmo assim.",
      ],
    },
  ],
  cta: {
    acoes: [
      {
        rotulo: "Agendar conversa",
        href: "mailto:suporte@consultoriahorizon.com.br?subject=Conversa%20com%20a%20Horizon",
        primaria: true,
      },
    ],
  },
};
