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
        <Image
          src="/prova/hero.jpg"
          alt=""
          fill
          priority
          quality={72}
          sizes="100vw"
          aria-hidden="true"
        />

        <nav className="prova-nav" aria-label="Principal">
          <a className="prova-marca" href="/prova">
            Horiz<span>on</span>
          </a>
          {acaoForte && (
            <a className="prova-nav-cta" href={acaoForte.href}>
              {acaoForte.rotulo}
            </a>
          )}
        </nav>

        <div className="prova-heroi-corpo">
          <p className="prova-eyebrow">{abertura.eyebrow}</p>
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
            <section key={bloco.id} id={bloco.id} className="prova-bloco">
              <p className="prova-eyebrow">{bloco.eyebrow}</p>
              <h2>{bloco.titulo}</h2>

              <div className="prova-prosa">
                {bloco.paragrafos.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {bloco.destaque && (
                <dl className="prova-destaque">
                  <dt>{bloco.destaque.valor}</dt>
                  <dd>
                    {bloco.destaque.legenda}
                    <span className="prova-fonte">Fonte: {bloco.destaque.fonte}</span>
                  </dd>
                </dl>
              )}

              {bloco.itens && (
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
