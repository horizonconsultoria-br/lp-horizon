import Image from "next/image";
import { Fragment } from "react";
import { conteudoProva } from "@/content/prova";

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
 * Mesma natureza da simulação de WhatsApp: ILUSTRAÇÃO encenada, não registro
 * de execução real, e escondida de leitor de tela pelo mesmo motivo. O visual
 * usa o vocabulário do n8n (nós, fios, execução em sequência) nas cores da
 * casa, sem logo nem identidade da ferramenta além do nome.
 *
 * A linha do tempo é calculada aqui, no servidor, e vira custom properties.
 * Quem toca a cena é o CSS, sob a aba marcada, então ela recomeça a cada
 * seleção da aba, como a conversa de WhatsApp. Zero JavaScript no navegador.
 */
function SimulacaoN8N() {
  // Cada passo roda por `dur` segundos; o pulso parte quando o nó termina e
  // chega um pouco antes do próximo acender.
  const passos: Array<{
    titulo: string;
    sub: string;
    icone: "raio" | "mais" | "base";
    dur: number;
  }> = [
    { titulo: "Novo lead", sub: "Chegou pelo formulário do site", icone: "raio", dur: 0.7 },
    { titulo: "Lead score", sub: "Cargo e porte somam +35", icone: "mais", dur: 0.9 },
    { titulo: "CRM atualizado", sub: "Sobe pro topo da fila", icone: "base", dur: 0.8 },
  ];

  let t = 0.5;
  const nos = passos.map((p, i) => {
    const inicio = t;
    const fim = inicio + p.dur;
    const fio = i < passos.length - 1 ? { inicio: fim + 0.05, dur: 0.5 } : null;
    t = fim + 0.6;
    return { ...p, inicio, fim, fio };
  });
  // O cartão só muda depois que o último nó grava: primeiro a barra sobe,
  // depois o número troca, e os selos são o ponto final.
  const iniciaCarta = nos[nos.length - 1].fim + 0.25;

  return (
    <div className="n8n" aria-hidden="true">
      <div className="n8n-topo">
        <span className="n8n-pontos">
          <i />
          <i />
          <i />
        </span>
        <span className="n8n-titulo">n8n · lead score</span>
      </div>

      <div className="n8n-tela">
        {nos.map((no) => (
          <Fragment key={no.titulo}>
            <div
              className="n8n-no"
              style={{ "--inicio": no.inicio, "--dur": no.dur } as React.CSSProperties}
            >
              <span className={`n8n-icone n8n-icone-${no.icone}`} />
              <span className="n8n-info">
                <strong>{no.titulo}</strong>
                <em>{no.sub}</em>
              </span>
              <span className="n8n-status">
                <i className="n8n-spinner" />
                <i className="n8n-check">✓</i>
              </span>
            </div>
            {no.fio && (
              <div
                className="n8n-fio"
                style={{ "--inicio": no.fio.inicio, "--dur": no.fio.dur } as React.CSSProperties}
              >
                <i className="n8n-pulso" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="n8n-card" style={{ "--carta": iniciaCarta } as React.CSSProperties}>
        <span className="n8n-card-selo">CRM</span>
        <div className="n8n-card-topo">
          <span className="n8n-avatar" />
          <span className="n8n-quem">
            <strong>M. Ribeiro</strong>
            <em>Diretora comercial</em>
          </span>
          <span className="n8n-score">
            <span className="n8n-score-rotulo">lead score</span>
            <span className="n8n-score-valor">
              <span className="n8n-score-antes">52</span>
              <span className="n8n-score-depois">87</span>
            </span>
          </span>
        </div>
        <div className="n8n-barra">
          <i className="n8n-barra-fill" />
        </div>
        <div className="n8n-card-pe">
          <span className="n8n-chip">+35 pontos</span>
          <span className="n8n-selo-quente">Lead quente</span>
        </div>
      </div>
    </div>
  );
}

// Server Component puro. Sem "use client", sem estado, sem efeito.
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
            <a href="#como-entramos">O que fazemos</a>
            <a href="#antes-de-assinar">Como funciona</a>
            <a href="#para-outros">Nichos</a>
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
            <section
              key={bloco.id}
              id={bloco.id}
              className={
                bloco.layout === "abas" ? "prova-bloco prova-bloco-centro" : "prova-bloco"
              }
            >
              {bloco.eyebrow && <p className="prova-eyebrow">{bloco.eyebrow}</p>}
              <h2>{bloco.titulo}</h2>
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

              {/* Abas em CSS puro: um grupo de radio com labels. Zero JavaScript
                  de runtime, e a navegação por setas do teclado vem de graça no
                  grupo de radio, coisa que uma aba feita em JS só tem se alguém
                  implementar à mão. O painel aparece via :checked ~ . */}
              {bloco.layout === "abas" && bloco.itens && (
                <div
                  className="prova-abas"
                  style={{ "--abas": bloco.itens.length } as React.CSSProperties}
                >
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
                      </article>
                    </div>
                  ))}
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

              {/* Na dobra de abas os itens já viraram painéis acima; sem esta
                  guarda eles apareceriam duas vezes na mesma seção. */}
              {bloco.itens && bloco.layout !== "abas" && (
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
          ))}
        </article>
      </div>
    </>
  );
}
