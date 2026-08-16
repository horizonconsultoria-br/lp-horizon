export type Destaque = { valor: string; legenda: string; fonte: string };
export type Item = { nome: string; descricao: string };

export type Bloco = {
  id: string;
  /** Opcional: o herói não usa. */
  eyebrow?: string;
  /** Opcional: linha de apoio logo abaixo do título da dobra. */
  subtitulo?: string;
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
      eyebrow: "O que usamos todo dia",
      titulo: "Sua squad técnica para soluções de vendas e vazão no backlog",
      subtitulo: "Onde a IA faz diferença para você",
      paragrafos: [
        "Ele descobre empresas por varredura de mapa, organiza a fila de prospecção, escaneia uma conta a partir do Instagram e volta com nome real, site, telefone e contatos.",
        "Do outro lado, gera diagnóstico do negócio do prospect, monta a proposta comercial, publica as duas como páginas próprias e ainda concentra as conversas de WhatsApp e Instagram na mesma tela.",
        "Nada disso é protótipo. É o que a nossa equipe abre de manhã.",
      ],
      itens: [
        { nome: "Ingestão", descricao: "Varredura de mapa por nicho e cidade, com fila de revisão." },
        { nome: "Prospecção", descricao: "Board de contas, carteira por vendedor e histórico." },
        { nome: "Diagnóstico", descricao: "Análise do negócio do prospect, publicada em página própria." },
        { nome: "Proposta", descricao: "Valores, escopo e prazo, publicados no mesmo endereço da análise." },
        { nome: "Conversas", descricao: "WhatsApp e Instagram na mesma caixa de entrada." },
        { nome: "Espaços do cliente", descricao: "Tarefas, checklists e arquivos por cliente, em bucket privado." },
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
