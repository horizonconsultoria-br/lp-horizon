import Image from "next/image";
import { Fragment } from "react";
import { conteudoProva, type Cliente } from "@/content/prova";
import { RotacaoAbas } from "./RotacaoAbas";

/**
 * Letreiro infinito com as logos dos clientes, no jeito da referência
 * playbooklab (98px entre logos, deriva contínua e lenta). Duas cópias da
 * fila no trilho; o CSS translada o trilho em -50% e o laço fecha sem
 * emenda. A segunda cópia é decorativa e fica aria-hidden; a primeira
 * carrega os alts de verdade, porque cliente é informação, não enfeite.
 *
 * As artes são servidas como <img> puro: já chegam no tamanho final e no
 * tratamento monocromático, não há o que o otimizador de imagem melhorar.
 */
function FaixaClientes({ clientes }: { clientes: Cliente[] }) {
  return (
    <aside className="clientes" aria-label="Clientes da Horizon">
      <div className="clientes-trilho">
        {[0, 1].map((copia) => (
          <ul key={copia} className="clientes-fila" aria-hidden={copia === 1 || undefined}>
            {clientes.map((c) => (
              <li key={c.nome} className="clientes-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/prova/clientes/${c.arquivo}`}
                  alt={copia === 0 ? c.nome : ""}
                  width={c.largura}
                  height={c.altura}
                  loading="lazy"
                />
                {c.rotulo && <span>{c.nome}</span>}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

/**
 * Simulação de um atendimento que qualifica, responde e agenda sozinho.
 *
 * É ILUSTRAÇÃO, não registro: a conversa é encenada para mostrar a forma do
 * produto. Fica `aria-hidden` de propósito, porque ler um diálogo falso em voz
 * alta confunde quem usa leitor de tela mais do que ajuda.
 *
 * O formato é o do WhatsApp (balões com cauda, hora, dois tiques de leitura),
 * mas nas cores da casa. Copiar o verde e a marca deles seria uso indevido de
 * identidade de terceiro, e a forma sozinha já é reconhecível.
 *
 * A animação roda uma vez, sem laço, e é escalonada por `--i`. Zero JavaScript.
 */
function SimulacaoWhatsApp() {
  // Roteiro do atendimento. `digitando` é quanto tempo o indicador de "está
  // digitando" fica no ar antes da resposta chegar, em segundos. Falas do lead
  // não têm espera: quem digita e faz o outro esperar é o atendimento.
  const roteiro: Array<{
    de: "lead" | "bot";
    texto: string;
    hora: string;
    digitando?: number;
  }> = [
    { de: "lead", texto: "Vocês fazem automação pra time de vendas?", hora: "14:02" },
    { de: "bot", texto: "Fazemos. Vocês já usam CRM?", hora: "14:02", digitando: 1.4 },
    { de: "lead", texto: "Usamos, mas ninguém preenche", hora: "14:03" },
    {
      de: "bot",
      texto: "É o mais comum. Te mostro em 30 min, amanhã às 15h?",
      hora: "14:03",
      digitando: 2.1,
    },
    { de: "lead", texto: "Fecha", hora: "14:04" },
  ];

  // Linha do tempo calculada aqui, na renderização do servidor. O CSS só recebe
  // o instante de cada evento em custom properties: nada roda no navegador.
  let t = 0.6;
  const eventos = roteiro.map((m) => {
    const espera = m.digitando ?? 0;
    const iniciaDigitando = t;
    t += espera;
    const iniciaBalao = t;
    t += m.de === "lead" ? 0.7 : 0.95;
    return { ...m, espera, iniciaDigitando, iniciaBalao };
  });
  const iniciaAgenda = t + 0.15;

  return (
    <div className="zap" aria-hidden="true">
      <div className="zap-topo">
        <span className="zap-voltar">‹</span>
        <span className="zap-avatar" />
        <div className="zap-quem">
          <strong>Atendimento Horizon</strong>
          <span className="zap-estado">
            online
            {/* Um rótulo "digitando" por resposta, sobreposto ao "online" na
                mesma linha e no mesmo instante em que os pontinhos aparecem
                no fio. É onde o WhatsApp de verdade mostra esse estado. */}
            {eventos
              .filter((m) => m.espera > 0)
              .map((m, i) => (
                <em
                  key={i}
                  className="zap-digitando-rotulo"
                  style={
                    {
                      "--inicio": m.iniciaDigitando,
                      "--dur": m.espera,
                    } as React.CSSProperties
                  }
                >
                  digitando...
                </em>
              ))}
          </span>
        </div>
        <span className="zap-icones">
          <i />
          <i />
        </span>
      </div>

      <div className="zap-fio">
        <span className="zap-dia">hoje</span>

        {eventos.map((m, i) => (
          <div key={i} className="zap-par">
            {m.espera > 0 && (
              <div
                className="zap-digitando"
                style={
                  {
                    "--inicio": m.iniciaDigitando,
                    "--dur": m.espera,
                  } as React.CSSProperties
                }
              >
                <i />
                <i />
                <i />
              </div>
            )}
            <p
              className={m.de === "bot" ? "zap-msg zap-nossa" : "zap-msg"}
              style={{ "--inicio": m.iniciaBalao } as React.CSSProperties}
            >
              {m.texto}
              <span className="zap-hora">
                {m.hora}
                {m.de === "bot" && <span className="zap-tiques">✓✓</span>}
              </span>
            </p>
          </div>
        ))}

        <div className="zap-agenda" style={{ "--inicio": iniciaAgenda } as React.CSSProperties}>
          <span className="zap-agenda-selo">Agenda</span>
          <strong>Quinta, 15h00</strong>
          <span className="zap-agenda-nota">Diagnóstico de 30 minutos, confirmado</span>
        </div>
      </div>

      <div className="zap-barra">
        <span className="zap-campo">Mensagem</span>
        <span className="zap-enviar" />
      </div>
    </div>
  );
}

/**
 * Simulação da automação de lead scoring executando no n8n.
 *
 * ILUSTRAÇÃO encenada, não registro de execução real, e escondida de leitor
 * de tela por isso. A fidelidade visual às marcas foi decisão explícita do
 * founder: o editor com a cara real do n8n (canvas escuro, nós com nome
 * embaixo, gatilho de borda esquerda arredondada, rosa #ea4b71, check verde,
 * rótulo "1 item" na saída) e o destino num contato real de HubSpot (cartão
 * claro, slate, laranja #ff7a59, flash de propriedade atualizada). Uso
 * nominativo das ferramentas que as automações da casa usam; nenhum arquivo
 * de logo, os ícones são formas desenhadas em CSS.
 *
 * A mecânica é a mesma da conversa de WhatsApp: linha do tempo calculada no
 * servidor, custom properties, animações só sob a aba marcada (reinicia a
 * cada seleção), estado base = estado final (movimento reduzido recebe a
 * cena montada). Zero JavaScript no navegador.
 */
function SimulacaoN8N() {
  // Um pipeline plausível de verdade no n8n: o Webhook recebe o lead, um nó
  // de código calcula o score, e o nó do HubSpot grava no contato.
  const passos: Array<{
    nome: string;
    tipo: "webhook" | "code" | "hubspot";
    dur: number;
  }> = [
    { nome: "Webhook", tipo: "webhook", dur: 0.6 },
    { nome: "Lead Score", tipo: "code", dur: 0.9 },
    { nome: "HubSpot", tipo: "hubspot", dur: 0.8 },
  ];

  let t = 0.6;
  const nos = passos.map((p, i) => {
    const inicio = t;
    const fim = inicio + p.dur;
    // O pulso parte quando o nó termina e chega antes do próximo acender;
    // o rótulo "1 item" aparece no fio no mesmo instante, como no n8n.
    const fio = i < passos.length - 1 ? { inicio: fim + 0.05, dur: 0.5 } : null;
    t = fim + 0.6;
    return { ...p, inicio, fim, fio };
  });
  // O contato só muda depois que o nó do HubSpot grava: barra, número em
  // crossfade, flash de propriedade e os selos como ponto final.
  const iniciaCarta = nos[nos.length - 1].fim + 0.25;

  return (
    <div className="n8n" aria-hidden="true">
      <div className="n8n-topo">
        <span className="n8n-volta">‹</span>
        <strong className="n8n-nome">Lead scoring</strong>
        <span className="n8n-ativo">
          Active
          <i className="n8n-toggle" />
        </span>
      </div>

      <div className="n8n-tela">
        <div className="n8n-fluxo">
          {nos.map((no) => (
            <Fragment key={no.nome}>
              <div
                className="n8n-passo"
                style={{ "--inicio": no.inicio, "--dur": no.dur } as React.CSSProperties}
              >
                <span className={`n8n-no n8n-no-${no.tipo}`}>
                  <i className="n8n-icone" />
                  <i className="n8n-spinner" />
                  <i className="n8n-check">✓</i>
                </span>
                <span className="n8n-rotulo">{no.nome}</span>
              </div>
              {no.fio && (
                <div
                  className="n8n-fio"
                  style={{ "--inicio": no.fio.inicio, "--dur": no.fio.dur } as React.CSSProperties}
                >
                  <em className="n8n-itens">1 item</em>
                  <i className="n8n-pulso" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="n8n-card" style={{ "--carta": iniciaCarta } as React.CSSProperties}>
        <div className="n8n-hs-topo">
          <i className="n8n-hs-marca" />
          <span>HubSpot · Contato</span>
        </div>
        <div className="n8n-hs-corpo">
          <div className="n8n-hs-quem">
            <span className="n8n-hs-avatar">MR</span>
            <span className="n8n-hs-nomes">
              <strong>Mariana Ribeiro</strong>
              <em>Diretora comercial</em>
            </span>
          </div>
          <div className="n8n-hs-prop">
            <span className="n8n-hs-prop-linha">
              <span className="n8n-hs-prop-rotulo">HubSpot Score</span>
              <span className="n8n-score-valor">
                <span className="n8n-score-antes">52</span>
                <span className="n8n-score-depois">87</span>
              </span>
            </span>
            <span className="n8n-barra">
              <i className="n8n-barra-fill" />
            </span>
          </div>
          <div className="n8n-hs-pe">
            <span className="n8n-chip">+35 pontos</span>
            <span className="n8n-selo-quente">Lead quente</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simulação do sistema de qualificação de leads: formulário, funil, CRM.
 *
 * É ILUSTRAÇÃO, não registro: nomes e números são encenados para mostrar a
 * forma do sistema. Fica `aria-hidden` de propósito, porque narrar um funil
 * falso em voz alta confunde quem usa leitor de tela mais do que ajuda.
 *
 * Três atores empilhados: o formulário que captura, o funil que filtra em
 * três estágios de trapézio, e o CRM onde só os prontos chegam com selo.
 * O movimento contínuo é a chuva de leads: bolinhas nascem sob o formulário
 * e caem pelo funil em loop; as filtradas somem na borda do estágio, as
 * aprovadas atravessam até a saída. Os números batem de propósito: 128
 * capturados viram 37 com fit e 12 prontos, e são os prontos que aparecem
 * embaixo, um a um, com o selo verde.
 *
 * A mecânica é a mesma das outras simulações: linha do tempo calculada no
 * servidor, custom properties, animações declaradas só sob a aba marcada
 * (a cena reinicia a cada seleção), estado base = estado final (movimento
 * reduzido recebe a cena montada). Zero JavaScript no navegador.
 */
function SimulacaoFunil() {
  const campos = ["Nome", "WhatsApp"];

  const estagios: Array<{ nome: string; qtd: number }> = [
    { nome: "Capturados", qtd: 128 },
    { nome: "Com fit", qtd: 37 },
    { nome: "Prontos", qtd: 12 },
  ];

  const leads: Array<{ iniciais: string; nome: string; nota: string }> = [
    { iniciais: "AS", nome: "A. Souza", nota: "Orçamento aprovado" },
    { iniciais: "MC", nome: "M. Costa", nota: "Decisora direta" },
    { iniciais: "RL", nome: "R. Lima", nota: "Quer começar já" },
  ];

  // A chuva de leads, em loop. `x` é onde a gota nasce (% da largura do
  // funil); `queda` é até onde ela desce, em px: 132 atravessa o funil
  // inteiro, 48 e 90 morrem na borda dos estágios 1 e 2, que é o desenho da
  // filtragem. `desvio` puxa a gota pro eixo central na proporção da descida,
  // pra ela acompanhar o afunilamento em vez de vazar pela parede do
  // trapézio. Delays escalonados fazem a chuva parecer contínua.
  const quedaTotal = 132;
  const gotas: Array<{ x: number; queda: number; ciclo: number; inicio: number }> = [
    { x: 38, queda: 132, ciclo: 3.4, inicio: 1.9 },
    { x: 78, queda: 48, ciclo: 2.8, inicio: 2.3 },
    { x: 55, queda: 132, ciclo: 3.6, inicio: 2.7 },
    { x: 30, queda: 90, ciclo: 3.1, inicio: 3.1 },
    { x: 18, queda: 48, ciclo: 2.9, inicio: 3.5 },
    { x: 64, queda: 132, ciclo: 3.3, inicio: 3.9 },
    { x: 70, queda: 90, ciclo: 3.0, inicio: 4.3 },
  ];
  const chuva = gotas.map((g) => ({
    ...g,
    desvio: Math.round((50 - g.x) * (g.queda / quedaTotal) * 0.9),
  }));

  // Linha do tempo calculada aqui, na renderização do servidor. O CSS só
  // recebe o instante de cada evento em custom properties: nada roda no
  // navegador. A ordem conta a história: o formulário se preenche, o botão
  // é apertado, a chuva começa, o funil acende de cima pra baixo e o CRM
  // recebe os qualificados um a um.
  let t = 0.3;
  const iniciaForm = t;
  t += 0.35;
  const eventosCampos = campos.map((rotulo) => {
    const inicia = t;
    t += 0.22;
    return { rotulo, inicia };
  });
  const iniciaBotao = t;
  // O clique é a largada da chuva: a primeira gota nasce logo depois dele.
  const iniciaClique = iniciaBotao + 0.35;
  t = iniciaClique + 0.55;
  const eventosEstagios = estagios.map((e) => {
    const inicia = t;
    t += 0.5;
    return { ...e, inicia };
  });
  const iniciaCrm = t;
  t += 0.5;
  const eventosLeads = leads.map((l) => {
    const inicia = t;
    t += 0.55;
    return { ...l, inicia, seloEm: inicia + 0.28 };
  });

  return (
    <div className="funil" aria-hidden="true">
      <div className="funil-topo">
        <strong className="funil-nome">Qualificação de leads</strong>
        <span className="funil-vivo">
          <i />
          ao vivo
        </span>
      </div>

      <div className="funil-cena">
        {/* O topo do fluxo: um formulário curto de captação. */}
        <div className="funil-form" style={{ "--inicio": iniciaForm } as React.CSSProperties}>
          <span className="funil-form-titulo">Diagnóstico gratuito</span>
          {eventosCampos.map((c) => (
            <span
              key={c.rotulo}
              className="funil-campo"
              style={{ "--inicio": c.inicia } as React.CSSProperties}
            >
              {c.rotulo}
            </span>
          ))}
          <span
            className="funil-botao"
            style={{ "--inicio": iniciaBotao, "--clique": iniciaClique } as React.CSSProperties}
          >
            Enviar
          </span>
        </div>

        {/* O meio: o funil de três estágios e a chuva de leads caindo. */}
        <div className="funil-afunila">
          <div className="funil-chuva">
            {chuva.map((g, i) => (
              <i
                key={i}
                className="funil-gota"
                style={
                  {
                    "--x": `${g.x}%`,
                    "--queda": g.queda,
                    "--desvio": g.desvio,
                    "--ciclo": g.ciclo,
                    "--inicio": g.inicio,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          {eventosEstagios.map((e, i) => (
            <div
              key={e.nome}
              className={`funil-estagio funil-estagio-${i + 1}`}
              style={{ "--inicio": e.inicia } as React.CSSProperties}
            >
              <span className="funil-estagio-nome">{e.nome}</span>
              <span
                className="funil-estagio-qtd"
                style={{ "--inicio": e.inicia + 0.18 } as React.CSSProperties}
              >
                {e.qtd}
              </span>
            </div>
          ))}
        </div>

        {/* A base: o CRM recebendo só quem atravessou. */}
        <div className="funil-crm" style={{ "--inicio": iniciaCrm } as React.CSSProperties}>
          <div className="funil-crm-topo">
            <i className="funil-crm-marca" />
            <span>CRM · Pipeline</span>
          </div>
          {eventosLeads.map((l) => (
            <div
              key={l.nome}
              className="funil-lead"
              style={{ "--inicio": l.inicia } as React.CSSProperties}
            >
              <span className="funil-avatar">{l.iniciais}</span>
              <span className="funil-lead-nomes">
                <strong>{l.nome}</strong>
                <em>{l.nota}</em>
              </span>
              <span
                className="funil-selo"
                style={{ "--inicio": l.seloEm } as React.CSSProperties}
              >
                Qualificado
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Simulação de uma área de membros com os treinamentos da casa.
 *
 * ILUSTRAÇÃO encenada, não captura de produto real, e escondida de leitor
 * de tela (`aria-hidden`) por isso: narrar uma grade de módulos falsa em voz
 * alta atrapalha quem navega por áudio mais do que ajuda.
 *
 * A cena é uma janela tipo Academy: cabeçalho fino com a marca e o aluno,
 * grade 2x2 de módulos (dois de vendas, dois de Claude) e a linha de
 * continuar assistindo no rodapé. Os módulos de Claude usam o coral da
 * marca (#d97757) e um asterisco desenhado em CSS: uso nominativo da
 * ferramenta que os treinamentos da casa ensinam, por decisão explícita do
 * founder; nenhum arquivo de logo.
 *
 * A mecânica é a mesma das outras simulações: linha do tempo calculada no
 * servidor, custom properties, animações declaradas só sob a aba marcada
 * (a cena reinicia a cada seleção), estado base = estado final. Zero
 * JavaScript no navegador.
 */
function SimulacaoMembros() {
  // A grade da área de membros: dois módulos de vendas, dois de Claude.
  // `progresso` é onde a barra de cada módulo para; o de 100% ganha o selo.
  const modulos: Array<{
    titulo: string;
    aulas: string;
    tema: "vendas" | "claude";
    progresso: number;
  }> = [
    { titulo: "Vendas Consultivas", aulas: "12 de 12 aulas", tema: "vendas", progresso: 100 },
    { titulo: "Fechamento e Objeções", aulas: "8 de 10 aulas", tema: "vendas", progresso: 80 },
    { titulo: "Claude para Vendas", aulas: "5 de 11 aulas", tema: "claude", progresso: 45 },
    { titulo: "Automação com Claude", aulas: "2 de 10 aulas", tema: "claude", progresso: 20 },
  ];

  // Linha do tempo calculada aqui, na renderização do servidor. Os cartões
  // entram escalonados; a barra de cada um começa depois que ele assenta e
  // enche num tempo proporcional ao progresso, então terminam em instantes
  // diferentes, como uma turma de verdade em pontos diferentes da trilha.
  let t = 0.6;
  const cartoes = modulos.map((m) => {
    const entra = t;
    t += 0.35;
    const barra = entra + 0.8;
    const durBarra = 0.4 + (m.progresso / 100) * 0.8;
    return { ...m, entra, barra, durBarra };
  });
  // O selo "Concluído" pinga quando a barra do módulo cheio termina; a linha
  // de continuar assistindo fecha a cena depois da última barra e do selo.
  const cheio = cartoes[0];
  const iniciaSelo = cheio.barra + cheio.durBarra + 0.2;
  const fimBarras = Math.max(...cartoes.map((c) => c.barra + c.durBarra));
  const iniciaRodape = Math.max(fimBarras, iniciaSelo + 0.4) + 0.25;

  return (
    <div className="memb" aria-hidden="true">
      <div className="memb-topo">
        <span className="memb-marca">
          <i className="memb-marca-simbolo" />
          Academy
        </span>
        <span className="memb-aluno">Rafael M.</span>
        <span className="memb-avatar">RM</span>
      </div>

      <div className="memb-grade">
        {cartoes.map((c) => (
          <div
            key={c.titulo}
            className={c.tema === "claude" ? "memb-cartao memb-claude" : "memb-cartao"}
            style={
              {
                "--inicio": c.entra,
                "--barra": c.barra,
                "--dur": c.durBarra,
                "--fim": `${c.progresso}%`,
              } as React.CSSProperties
            }
          >
            <span className="memb-thumb">
              {c.tema === "vendas" ? (
                <i className="memb-play" />
              ) : (
                <i className="memb-asterisco" />
              )}
              {c.progresso === 100 && (
                <span
                  className="memb-selo"
                  style={{ "--selo": iniciaSelo } as React.CSSProperties}
                >
                  Concluído
                </span>
              )}
            </span>
            <span className="memb-corpo">
              <strong className="memb-titulo">{c.titulo}</strong>
              <span className="memb-meta">
                <span>{c.aulas}</span>
                <em className="memb-pct">{c.progresso}%</em>
              </span>
              <span className="memb-trilho">
                <i className="memb-barra" />
              </span>
            </span>
          </div>
        ))}
      </div>

      <div
        className="memb-rodape"
        style={{ "--inicio": iniciaRodape } as React.CSSProperties}
      >
        <i className="memb-rodape-play" />
        <span className="memb-rodape-texto">
          <em>Continuar assistindo</em>
          <strong>Aula 3 · Automação com Claude</strong>
        </span>
        <span className="memb-rodape-seta">›</span>
      </div>
    </div>
  );
}

/**
 * Simulação do sistema de prospecção: as ferramentas reais da operação em
 * balões flutuando em volta do núcleo que as amarra.
 *
 * ILUSTRAÇÃO encenada, não diagrama técnico, e escondida de leitor de tela
 * (`aria-hidden`) de propósito: narrar sete balões flutuando confunde quem
 * usa leitor de tela mais do que ajuda. A identidade REAL de cada ferramenta
 * é decisão explícita do founder, no precedente do n8n rosa e do HubSpot
 * laranja das outras abas: uso nominativo do que a operação usa de verdade,
 * nenhum arquivo de logo, todo ícone é forma desenhada em CSS ou wordmark
 * em texto.
 *
 * A mecânica é a das outras simulações: linha do tempo calculada aqui, na
 * renderização do servidor, entregue ao CSS em custom properties; animações
 * declaradas só sob a aba marcada, então a cena reinicia a cada seleção;
 * estado base = estado FINAL, e quem pede movimento reduzido recebe a cena
 * montada e parada. Zero JavaScript no navegador.
 */
function SimulacaoStack() {
  // As ferramentas da esteira. Posição (x, y, em % do palco) e tamanho (px)
  // espalhados a olho para nenhum balão encostar em outro nem no núcleo, já
  // contando a flutuação de poucos px. `fase` dessincroniza os ciclos (vira
  // delay negativo no CSS), `dura` é a duração do ciclo, `amp` a amplitude.
  const ferramentas: Array<{
    nome: string | null; // null quando o wordmark dentro do balão já é o nome
    classe: string;
    tam: number;
    x: number;
    y: number;
    dura: number;
    fase: number;
    amp: number;
  }> = [
    { nome: null, classe: "n8n", tam: 78, x: 15, y: 46, dura: 5.2, fase: 0, amp: 4 },
    { nome: "Sales Navigator", classe: "salesnav", tam: 92, x: 24, y: 16, dura: 6.3, fase: 1.1, amp: 5 },
    { nome: "Instagram", classe: "instagram", tam: 80, x: 74, y: 13, dura: 4.7, fase: 2.3, amp: 4 },
    { nome: "Python", classe: "python", tam: 84, x: 22, y: 80, dura: 6.9, fase: 0.6, amp: 5 },
    { nome: null, classe: "tavily", tam: 76, x: 84, y: 42, dura: 5.6, fase: 3.4, amp: 3.5 },
    { nome: "WhatsApp", classe: "whatsapp", tam: 72, x: 77, y: 82, dura: 4.4, fase: 1.7, amp: 4.5 },
    { nome: "Claude", classe: "claude", tam: 66, x: 49, y: 10, dura: 6.1, fase: 2.9, amp: 3 },
  ];

  // Geometria dos raios num palco nominal de 370x404 (o cartão no teto dos
  // 372px). Ângulo e comprimento vão ao CSS em custom properties. Se o cartão
  // renderizar mais estreito, a ponta de cada raio continua debaixo do balão
  // correspondente (conferido nas larguras de 272 a 370) e o degradê do raio
  // apaga qualquer sobra: por isso dá para fixar a geometria no servidor.
  const LARGURA = 370;
  const ALTURA = 404;
  const centro = { x: 0.5 * LARGURA, y: 0.47 * ALTURA };

  // Linha do tempo no servidor: o núcleo acende primeiro, cada ferramenta
  // chega em escada (raio primeiro, balão logo atrás) e o selo do rodapé
  // fecha a cena. Nada disso roda no navegador.
  let t = 0.7;
  const baloes = ferramentas.map((f) => {
    const dx = (f.x / 100) * LARGURA - centro.x;
    const dy = (f.y / 100) * ALTURA - centro.y;
    const ang = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) * 10) / 10;
    const comp = Math.round(Math.hypot(dx, dy));
    const iniciaRaio = t;
    const iniciaBalao = t + 0.12;
    t += 0.28;
    return { ...f, ang, comp, iniciaRaio, iniciaBalao };
  });
  const iniciaNucleo = 0.2;
  const iniciaSelo = t + 0.05; // o pop do selo fecha a cena perto dos 3,1s

  return (
    <div className="stack" aria-hidden="true">
      <div className="stack-topo">
        <i className="stack-farol" />
        <strong>Stack de prospecção</strong>
        <span className="stack-estado">em operação</span>
      </div>

      <div className="stack-palco">
        {baloes.map((b) => (
          <i
            key={`raio-${b.classe}`}
            className="stack-raio"
            style={
              {
                "--inicio": b.iniciaRaio,
                "--ang": b.ang,
                "--comp": b.comp,
              } as React.CSSProperties
            }
          />
        ))}

        <div
          className="stack-nucleo"
          style={{ "--inicio": iniciaNucleo } as React.CSSProperties}
        >
          <strong>Prospecção</strong>
          <span>Horizon</span>
        </div>

        {baloes.map((b) => (
          <div
            key={b.classe}
            className={`stack-balao stack-${b.classe}`}
            style={
              {
                "--x": b.x,
                "--y": b.y,
                "--tam": b.tam,
                "--inicio": b.iniciaBalao,
                "--fase": b.fase,
                "--dura": b.dura,
                "--amp": b.amp,
              } as React.CSSProperties
            }
          >
            {/* Três camadas por balão, um transform por camada: o wrapper
                posiciona, a boia flutua em loop, a bola faz o pop de entrada.
                Misturar os três num elemento só faria uma animação atropelar
                a outra, porque todas escrevem em `transform`. */}
            <div className="stack-boia">
              <span className="stack-bola">
                {b.classe === "n8n" && <b className="stack-marca-n8n">n8n</b>}
                {b.classe === "salesnav" && <b className="stack-icone-in">in</b>}
                {b.classe === "instagram" && <b className="stack-icone-insta" />}
                {b.classe === "python" && (
                  <b className="stack-icone-py">
                    <i />
                    <i />
                  </b>
                )}
                {b.classe === "tavily" && <b className="stack-marca-tavily">tavily</b>}
                {b.classe === "whatsapp" && (
                  <b className="stack-icone-zap">
                    <i />
                  </b>
                )}
                {b.classe === "claude" && (
                  <b className="stack-icone-claude">
                    <i />
                    <i />
                  </b>
                )}
                {b.nome && <span className="stack-nome">{b.nome}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="stack-pe">
        <div
          className="stack-selo"
          style={{ "--inicio": iniciaSelo } as React.CSSProperties}
        >
          <i className="stack-ok">✓</i>
          <span>Stack conectada</span>
          <em>{ferramentas.length} ferramentas</em>
        </div>
      </div>
    </div>
  );
}

/**
 * Simulação da inteligência de mercado: o radar de concorrência.
 *
 * ILUSTRAÇÃO encenada, não registro de monitoramento real, e escondida de
 * leitor de tela (`aria-hidden`) por isso. As fontes citadas no feed são as
 * ferramentas reais desse trabalho (Semrush, DataForSEO, SimilarWeb,
 * Ahrefs), com as cores de cada marca no ponto do selo, por decisão
 * explícita do founder no precedente das outras abas: uso nominativo,
 * nenhum logo em arquivo.
 *
 * O detalhe de ofício: cada alvo pinga no radar NO INSTANTE em que o feixe
 * passa por ele. O ângulo do alvo vira delay no servidor
 * (inicio + ang/360 * ciclo), então a primeira volta da varredura "descobre"
 * os alvos um a um, e o alerta correspondente entra no feed logo depois.
 *
 * A mecânica é a das outras simulações: linha do tempo no servidor via
 * custom properties, animações só sob a aba marcada (reinicia a cada
 * seleção), estado base = estado FINAL, movimento reduzido recebe a cena
 * montada. Zero JavaScript no navegador.
 */
function SimulacaoRadar() {
  // A varredura: uma volta completa a cada `ciclo` segundos, começando em
  // `inicio` apontada para cima.
  const varredura = { inicio: 0.5, ciclo: 3.6 };

  // Os alvos no prato do radar. `ang` é o ângulo em graus a partir do topo,
  // em sentido horário; `raio` é a distância do centro (0 a 1). Cada alvo
  // carrega o alerta que ele dispara no feed e a fonte que o interceptou.
  const alvos: Array<{
    rotulo: string;
    ang: number;
    raio: number;
    fonte: string;
    cor: "semrush" | "dataforseo" | "similarweb" | "ahrefs";
    texto: string;
  }> = [
    {
      rotulo: "A",
      ang: 52,
      raio: 0.6,
      fonte: "Semrush",
      cor: "semrush",
      texto: "Concorrente A comprou 'crm com IA' no Google Ads",
    },
    {
      rotulo: "B",
      ang: 128,
      raio: 0.72,
      fonte: "DataForSEO",
      cor: "dataforseo",
      texto: "Você caiu 4 posições em 'automação de vendas'",
    },
    {
      rotulo: "C",
      ang: 217,
      raio: 0.52,
      fonte: "SimilarWeb",
      cor: "similarweb",
      texto: "Tráfego do concorrente C caiu 18% no mês",
    },
    {
      rotulo: "D",
      ang: 305,
      raio: 0.66,
      fonte: "Ahrefs",
      cor: "ahrefs",
      texto: "Concorrente D ganhou 40 backlinks na semana",
    },
  ];

  // Posição no prato e instante da descoberta, ambos derivados do ângulo.
  // Convenção: 0 grau aponta pra cima e cresce em sentido horário, a mesma
  // da varredura em conic-gradient, senão feixe e alvo saem de fase.
  const alvosCalc = alvos.map((a) => {
    const rad = (a.ang * Math.PI) / 180;
    const x = Math.round((50 + a.raio * 50 * Math.sin(rad)) * 10) / 10;
    const y = Math.round((50 - a.raio * 50 * Math.cos(rad)) * 10) / 10;
    const pinga = Math.round((varredura.inicio + (a.ang / 360) * varredura.ciclo) * 100) / 100;
    return { ...a, x, y, pinga, alerta: pinga + 0.35 };
  });

  return (
    <div className="esp" aria-hidden="true">
      <div className="esp-topo">
        <i className="esp-farol" />
        <strong>Radar de concorrência</strong>
        <span className="esp-estado">24/7</span>
      </div>

      <div className="esp-cena">
        <div className="esp-radar">
          <i className="esp-anel esp-anel-1" />
          <i className="esp-anel esp-anel-2" />
          <i className="esp-mira" />
          <i
            className="esp-varredura"
            style={
              {
                "--inicio": varredura.inicio,
                "--ciclo": varredura.ciclo,
              } as React.CSSProperties
            }
          />
          {alvosCalc.map((a) => (
            <span
              key={a.rotulo}
              className="esp-alvo"
              style={
                {
                  "--x": a.x,
                  "--y": a.y,
                  "--pinga": a.pinga,
                } as React.CSSProperties
              }
            >
              <i />
              {a.rotulo}
            </span>
          ))}
        </div>

        <div className="esp-feed">
          <span className="esp-feed-titulo">Sinais interceptados</span>
          {alvosCalc.map((a) => (
            <div
              key={a.rotulo}
              className="esp-alerta"
              style={{ "--inicio": a.alerta } as React.CSSProperties}
            >
              <span className={`esp-fonte esp-fonte-${a.cor}`}>
                <i />
                {a.fonte}
              </span>
              <p>{a.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server Component puro. O único JS autoral da página vive na ilha
// RotacaoAbas, dentro da dobra de abas.
export default function ProvaPage() {
  const { blocos, cta } = conteudoProva;
  const [abertura, ...demais] = blocos;
  const acaoForte = cta.acoes[0];

  return (
    <>
      {/* HERÓI. A fotografia é o argumento antes da primeira palavra: um
          horizonte em hora azul, para uma empresa chamada Horizon. */}
      <header className="prova-heroi" id={abertura.id}>
        {/* A pilha de camadas do herói, cada uma com um trabalho só.
            A fotografia é a base e também o fallback: se o vídeo não tocar
            (dados economizados, movimento reduzido, formato não suportado),
            a cena continua de pé. */}
        <Image
          className="prova-heroi-foto"
          src="/prova/hero-bruma.jpg"
          alt=""
          fill
          priority
          quality={72}
          sizes="100vw"
          aria-hidden="true"
        />

        {/* A neblina em movimento. Fumaça tingida no azul da marca, em loop
            palíndromo para a emenda não aparecer, composta em `screen`: o
            fundo escuro do vídeo some e só a luz da fumaça soma sobre a foto. */}
        <video
          className="prova-heroi-bruma"
          src="/prova/bruma.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div className="prova-heroi-veu" aria-hidden="true" />
        <div className="prova-heroi-veu-topo" aria-hidden="true" />
        <div className="prova-heroi-veu-pe" aria-hidden="true" />

        <nav className="prova-nav" aria-label="Principal">
          {/* O logo real da casa, o mesmo de consultoriahorizon.com.br. O
              arquivo oficial e um lockup VERTICAL numa tela 3300x3300 com
              metade de margem vazia; aqui ele vem recortado e remontado na
              horizontal, que e o que uma barra de navegacao comporta. */}
          <a className="prova-marca" href="/prova" aria-label="Horizon, ir para o topo">
            <Image
              className="prova-marca-simbolo"
              src="/prova/logo-simbolo.png"
              alt=""
              width={39}
              height={38}
              priority
            />
            <Image
              className="prova-marca-palavra"
              src="/prova/logo-palavra.png"
              alt=""
              width={99}
              height={15}
              priority
            />
          </a>

          {/* Cada item aponta para uma seção que EXISTE nesta página. Item de
              menu sem destino é o defeito que a landing oficial tem hoje. */}
          <div className="prova-nav-links">
            <a href="#playbook">O que fazemos</a>
            <a href="#antes-de-assinar">Como funciona</a>
            <a href="#objecoes">Perguntas</a>
          </div>

          {acaoForte && (
            <a className="prova-nav-cta" href={acaoForte.href}>
              {acaoForte.rotulo}
            </a>
          )}
        </nav>

        <div className="prova-heroi-corpo">
          <h1>{abertura.titulo}</h1>
          {abertura.paragrafos[0] && (
            <p className="prova-heroi-sub">{abertura.paragrafos[0]}</p>
          )}
          <div className="prova-heroi-acoes">
            {acaoForte && (
              <a className="prova-acao-forte" href={acaoForte.href}>
                {acaoForte.rotulo}
              </a>
            )}
            <a className="prova-acao-fraca" href={`#${demais[0]?.id ?? "cta"}`}>
              Ver como a gente opera
            </a>
          </div>
        </div>

        <p className="prova-rolar" aria-hidden="true">
          rolar
        </p>
      </header>

      {/* CORPO. A descida: quanto mais desce, mais concreto e mais denso. */}
      <div className="prova-corpo">
        <article>
          {demais.map((bloco, indice) => (
            <Fragment key={bloco.id}>
            <section
              id={bloco.id}
              className={
                bloco.layout === "abas"
                  ? "prova-bloco prova-bloco-centro"
                  : bloco.layout === "cartoes"
                    ? "prova-bloco prova-bloco-centro prova-bloco-cartoes"
                    : bloco.layout === "chamada"
                      ? "prova-bloco prova-bloco-chamada"
                      : bloco.layout === "techs"
                        ? "prova-bloco prova-bloco-centro prova-bloco-techs"
                        : "prova-bloco"
              }
            >
              {bloco.eyebrow && <p className="prova-eyebrow">{bloco.eyebrow}</p>}
              {/* Na banda de chamada o título vive DENTRO da moldura, ao lado
                  do botão; emitir o h2 padrão aqui o duplicaria. */}
              {bloco.layout !== "chamada" && <h2>{bloco.titulo}</h2>}
              {bloco.subtitulo && (
                <p className="prova-subtitulo">{bloco.subtitulo}</p>
              )}

              {bloco.paragrafos.length > 0 && (
                <div className="prova-prosa">
                  {bloco.paragrafos.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {/* Abas em CSS: um grupo de radio com labels. A navegação por
                  setas do teclado vem de graça no grupo de radio, e o painel
                  aparece via :checked ~ . A única ilha de JS é a RotacaoAbas,
                  que gira as abas a cada 12s até o usuário assumir; todo o
                  resto continua sendo o CSS reagindo ao radio marcado. */}
              {bloco.layout === "abas" && bloco.itens && (
                <div
                  className="prova-abas"
                  style={{ "--abas": bloco.itens.length } as React.CSSProperties}
                >
                  <RotacaoAbas grupo={`abas-${bloco.id}`} />
                  {bloco.itens.map((item, i) => (
                    // `display: contents` faz o input, o rótulo e o painel
                    // virarem itens do mesmo grid. Eles continuam irmãos no
                    // DOM, então `input:checked ~ .painel` funciona com UMA
                    // regra só, para qualquer quantidade de abas.
                    <div key={item.nome} className="prova-aba">
                      <input
                        type="radio"
                        name={`abas-${bloco.id}`}
                        id={`aba-${bloco.id}-${i}`}
                        defaultChecked={i === 0}
                      />
                      <label htmlFor={`aba-${bloco.id}-${i}`}>{item.nome}</label>
                      <article
                        className={
                          item.visual
                            ? "prova-aba-painel prova-aba-painel-visual"
                            : "prova-aba-painel"
                        }
                      >
                        <div className="prova-aba-texto">
                          <h3>{item.nome}</h3>
                          <p>{item.descricao}</p>
                        </div>
                        {item.visual === "whatsapp" && <SimulacaoWhatsApp />}
                        {item.visual === "n8n" && <SimulacaoN8N />}
                        {item.visual === "funil" && <SimulacaoFunil />}
                        {item.visual === "membros" && <SimulacaoMembros />}
                        {item.visual === "stack" && <SimulacaoStack />}
                        {item.visual === "radar" && <SimulacaoRadar />}
                      </article>
                    </div>
                  ))}
                </div>
              )}

              {/* Cartões espelhados da referência: glifo desenhado em CSS no
                  tile do topo, título e texto. Os 4 <i> são ganchos que cada
                  variante de glifo posiciona como quiser. */}
              {bloco.layout === "cartoes" && bloco.itens && (
                <div className="prova-cartoes">
                  {bloco.itens.map((item) => (
                    <article key={item.nome} className="prova-cartao">
                      <div
                        className={`prova-cartao-arte prova-arte-${item.icone}`}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <h3>{item.nome}</h3>
                      <p>{item.descricao}</p>
                    </article>
                  ))}
                </div>
              )}

              {/* Banda de conversão espelhada da referência: moldura de
                  janela (pontinhos no topo), fotografia à esquerda e a
                  coluna de título + botão à direita. */}
              {bloco.layout === "chamada" && bloco.acao && (
                <div className="prova-chamada">
                  <div className="prova-chamada-corpo">
                    {/* Composição cinematográfica pedida pelo founder: o
                        retrato de visor azul ancora a direita do palco e a
                        mão robótica entra pela esquerda, apontando pra ela.
                        As duas imagens vieram dele; a mão foi limpa da
                        marca d'água e aparada. */}
                    <div className="prova-chamada-arte" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="prova-chamada-rosto"
                        src="/prova/chamada-rosto.jpg"
                        alt=""
                        width={504}
                        height={825}
                        loading="lazy"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="prova-chamada-mao"
                        src="/prova/chamada-mao.png"
                        alt=""
                        width={761}
                        height={365}
                        loading="lazy"
                      />
                    </div>
                    <div className="prova-chamada-texto">
                      <h2>{bloco.titulo}</h2>
                      <a className="prova-chamada-botao" href={bloco.acao.href}>
                        {bloco.acao.rotulo}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Letreiro infinito de tecnologias: mesma mecânica do de
                  clientes (duas filas, translada -50%, segunda decorativa),
                  itens em texto com o ponto na cor da marca. */}
              {bloco.layout === "techs" && bloco.techs && (
                <div className="techs-faixa">
                  <div className="techs-trilho">
                    {[0, 1].map((copia) => (
                      <ul
                        key={copia}
                        className="techs-fila"
                        aria-hidden={copia === 1 || undefined}
                      >
                        {bloco.techs!.map((t) => (
                          <li key={t.nome}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/prova/techs/${t.arquivo}`}
                              alt=""
                              width={28}
                              height={28}
                              loading="lazy"
                            />
                            {t.nome}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              )}

              {bloco.destaque && (
                <dl className="prova-destaque">
                  <dt>{bloco.destaque.valor}</dt>
                  <dd>
                    {bloco.destaque.legenda}
                    <span className="prova-fonte">Fonte: {bloco.destaque.fonte}</span>
                  </dd>
                </dl>
              )}

              {/* Nas dobras de abas e cartões os itens já foram renderizados
                  acima; sem esta guarda apareceriam duas vezes na seção. */}
              {bloco.itens && !bloco.layout && (
                <dl className="prova-itens">
                  {bloco.itens.map((item) => (
                    <div key={item.nome} className="prova-item">
                      <dt>{item.nome}</dt>
                      <dd>{item.descricao}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {indice === demais.length - 1 && (
                <div className="prova-cta">
                  {cta.acoes.map((acao) => (
                    <a
                      key={acao.rotulo}
                      href={acao.href}
                      className={acao.primaria ? "btn-primary" : "btn-secondary"}
                    >
                      {acao.rotulo}
                    </a>
                  ))}
                </div>
              )}
            </section>
            {/* A faixa de clientes vive ENTRE as dobras, como na referência:
                nao e um bloco de conteudo com titulo, e um respiro de prova
                social entre o Playbook e a dobra de produtos. */}
            {bloco.id === "playbook" && <FaixaClientes clientes={conteudoProva.clientes} />}
            </Fragment>
          ))}
        </article>
      </div>
    </>
  );
}
