import Image from "next/image";
import { conteudoProva } from "@/content/prova";

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
                      <article className="prova-aba-painel">
                        <h3>{item.nome}</h3>
                        <p>{item.descricao}</p>
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
