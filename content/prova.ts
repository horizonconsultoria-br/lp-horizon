export type Destaque = { valor: string; legenda: string; fonte: string };
export type Item = {
  nome: string;
  descricao: string;
  /** Ilustração opcional do painel. "whatsapp" simula um atendimento que
   *  termina virando compromisso na agenda; "n8n" encena uma automação de
   *  lead scoring executando nó a nó até atualizar o CRM; "funil" mostra a
   *  captação atravessando o funil até virar linha no CRM; "membros" é a
   *  área de membros com módulos de vendas e de Claude; "stack" são as
   *  ferramentas de prospecção em balões flutuantes; "radar" é o radar de
   *  concorrência com o feed de sinais interceptados. */
  visual?: "whatsapp" | "n8n" | "funil" | "membros" | "stack" | "radar";
  /** Glifo do cartão na dobra de layout "cartoes", desenhado em CSS. */
  icone?: "squad" | "diagnostico" | "treinamento" | "projeto" | "saas";
};

export type Bloco = {
  id: string;
  /** Opcional: o herói não usa. */
  eyebrow?: string;
  /** Opcional: linha de apoio logo abaixo do título da dobra. */
  subtitulo?: string;
  /** "abas" renderiza os `itens` como painéis selecionáveis em vez de lista;
   *  "cartoes" renderiza como grade de cartões com glifo, título e texto;
   *  "chamada" é a banda de conversão full-bleed com botão próprio;
   *  "techs" é o título centrado com o letreiro infinito de tecnologias. */
  layout?: "abas" | "cartoes" | "chamada" | "techs";
  titulo: string;
  paragrafos: string[];
  destaque?: Destaque;
  itens?: Item[];
  /** Botão da dobra de layout "chamada". */
  acao?: Acao;
  /** Letreiro da dobra de layout "techs": nome como o founder escreveu e o
   *  arquivo do ícone em public/prova/techs/. Ícones oficiais vêm de
   *  devicon/simpleicons; Openclaw, Hermes Agent e Microserviços não têm
   *  marca pública e usam traço da casa. */
  techs?: Array<{ nome: string; arquivo: string }>;
};

/** Um cliente da faixa de logos. `largura`/`altura` são as dimensões reais
 *  do arquivo em public/prova/clientes/, para o navegador reservar o espaço;
 *  `rotulo: true` quando a marca é só símbolo ou monograma e o nome precisa
 *  aparecer escrito ao lado. */
export type Cliente = {
  nome: string;
  arquivo: string;
  largura: number;
  altura: number;
  rotulo?: boolean;
};

export type Acao = { rotulo: string; href: string; primaria: boolean };
// Só as ações. O bloco "cta" já carrega título e parágrafos como qualquer outro
// bloco; um segundo par título/subtítulo aqui seria dado que ninguém renderiza.
export type CTA = { acoes: Acao[] };

export type ConteudoProva = { blocos: Bloco[]; cta: CTA; clientes: Cliente[] };

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
      titulo: "Seu time técnico para soluções de vendas e desenvolvimento de software",
      subtitulo: "Onde a IA faz diferença para seu time Comercial",
      layout: "abas",
      // Sem prosa nesta dobra: a estrutura de abas fala por si, como na
      // referência. Isso também resolve o pronome órfão que ficou quando a
      // manchete mudou de "Um CRM inteiro" para "Sua squad técnica" e o
      // parágrafo seguinte continuou começando com "Ele descobre empresas".
      paragrafos: [],
      itens: [
        {
          nome: "AI Chatbots",
          visual: "whatsapp",
          descricao:
            "Qualifica, agenda, responde em 3 segundos. Clone do hello seu melhor vendedor online 24/7, sem folga, sem café, sem segunda-feira ruim.",
        },
        {
          nome: "Sistema de qualificação de leads",
          visual: "funil",
          descricao:
            "Encontra tudo sobre o lead, analisa se é fit, personaliza a primeira mensagem e entrega um dossiê completo já dentro do CRM. Sua equipe falando por mais tempo com quem pode comprar.",
        },
        {
          nome: "Sistema de prospecção",
          visual: "stack",
          descricao:
            "Aborda automaticamente com mensagens personalizadas 1-pra-1, só que agora no automático para listas ultrasegmentadas. Uma equipe de hunters sistemáticos para encher o pipeline.",
        },
        {
          nome: "Sistemas de treinamento",
          visual: "membros",
          descricao:
            "Acompanha calls, identifica gaps e recomenda melhorias em tempo real. Cada vendedor recebe coaching personalizado baseado em dados, não em achismo.",
        },
        {
          nome: "CRM Automation",
          visual: "n8n",
          descricao:
            "CRM que se atualiza sozinho. Automações que preenchem campos, movem deals e criam tarefas sem ninguém clicar em nada. Seu pipeline sempre atualizado, seu forecast sempre confiável.",
        },
        {
          nome: "Inteligência de Mercado",
          visual: "radar",
          descricao:
            "Monitora seus concorrentes, rastreia mudanças de preço, identifica empresas procurando sua solução. Meio como ter um espião, só que sem infringir leis e que opera no automático.",
        },
      ],
    },
    {
      id: "playbook",
      // Dobra espelhada de playbooklab.com.br ("O jeito Playbook Lab"), por
      // instrução do founder: mesma estrutura e copy, paleta e nomes da casa.
      // Os cartões "Projetos fechados" e "SAAS" são adição nossa, escritos na
      // mesma voz e tamanho dos demais.
      eyebrow: "Nossos serviços",
      titulo: "O Playbook da Horizon",
      layout: "cartoes",
      paragrafos: [],
      itens: [
        {
          nome: "Squad multidisciplinar",
          icone: "squad",
          descricao:
            "Sales specialist, project manager e automation expert. Três perfis que falam a língua de vendas e escrevem em código. Seu time de IA desde o dia 1.",
        },
        {
          nome: "Diagnóstico e Auditoria com IA",
          icone: "diagnostico",
          descricao:
            "Antes de automatizar qualquer coisa, a gente entende o que trava. Diagnóstico completo da sua operação com um plano claro de onde IA faz diferença de verdade.",
        },
        {
          nome: "Treinamento de IA",
          icone: "treinamento",
          descricao:
            "Mini cursos práticos para seu time usar IA no dia a dia, sem depender de ninguém. Sua equipe extraindo o máximo das ferramentas de IA que já tem em mãos.",
        },
        {
          nome: "Projetos fechados",
          icone: "projeto",
          descricao:
            "Escopo, prazo e preço definidos antes de começar, pagos por entrega. Você sabe o que recebe e quando. O jeito de tirar do papel o sistema que o seu time não tem braço pra construir.",
        },
        {
          nome: "SAAS",
          icone: "saas",
          descricao:
            "Do zero ao produto no ar: arquitetura, código, deploy e operação. A gente constrói e opera o seu SaaS como se fosse nosso, porque o nosso também roda assim.",
        },
      ],
    },
    {
      id: "mesmo-time",
      // Banda de conversão espelhada de playbooklab ("Mesmo time, mais
      // vendas."), por instrução do founder: moldura de janela com arte à
      // esquerda e título + botão à direita. A arte deles é uma foto glitch;
      // a nossa é a fotografia do herói, que o navegador já tem em cache.
      titulo: "Mesmo time, mais vendas.",
      layout: "chamada",
      paragrafos: [],
      acao: {
        rotulo: "Quero um diagnóstico",
        href: "mailto:suporte@consultoriahorizon.com.br?subject=Diagn%C3%B3stico%20Horizon",
        primaria: true,
      },
    },
    {
      id: "tecnologias",
      titulo: "Tecnologias Parceiras",
      layout: "techs",
      paragrafos: [],
      // Lista dada pelo founder, nomes como ele escreveu.
      techs: [
        { nome: "C#", arquivo: "csharp.svg" },
        { nome: ".NET", arquivo: "dotnet.svg" },
        { nome: "Python", arquivo: "python.svg" },
        { nome: "Node JS", arquivo: "nodejs.svg" },
        { nome: "React JS", arquivo: "react.svg" },
        { nome: "Angular", arquivo: "angular.svg" },
        { nome: "Vue JS", arquivo: "vuejs.svg" },
        { nome: "Supabase", arquivo: "supabase.svg" },
        { nome: "N8N", arquivo: "n8n.svg" },
        { nome: "Openclaw", arquivo: "openclaw.svg" },
        { nome: "Hermes Agent", arquivo: "hermes.svg" },
        { nome: "AWS", arquivo: "aws.svg" },
        { nome: "Azure", arquivo: "azure.svg" },
        { nome: "Docker", arquivo: "docker.svg" },
        { nome: "Microserviços", arquivo: "microservicos.svg" },
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
  // A faixa de logos entre o Playbook e a dobra de produtos. Lista dada pelo
  // founder; as artes vivem em public/prova/clientes/, todas convertidas ao
  // mesmo tratamento gelo-sobre-transparente (a da Umind é a versão branca
  // que o próprio site deles publica).
  clientes: [
    { nome: "Umind", arquivo: "umind.svg", largura: 589, altura: 165 },
    { nome: "Ferreira & Sá Advocacia", arquivo: "ferreira.png", largura: 634, altura: 112 },
    { nome: "Wikialphabet", arquivo: "wikialphabet.png", largura: 234, altura: 112 },
    { nome: "Family Protect", arquivo: "familyprotect.png", largura: 112, altura: 112, rotulo: true },
    { nome: "Nádia Contabilidade", arquivo: "nadia.png", largura: 140, altura: 112, rotulo: true },
  ],
};
