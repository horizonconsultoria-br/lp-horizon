import { conteudoProva } from "@/content/prova";

// Server Component puro. Sem "use client", sem estado, sem efeito.
export default function ProvaPage() {
  const { blocos, cta } = conteudoProva;

  return (
    <article>
      {blocos.map((bloco, indice) => (
        <section key={bloco.id} id={bloco.id} className="prova-bloco">
          <p className="eyebrow">{bloco.eyebrow}</p>
          {/* Só a abertura é h1. Página sem h1 quebra hierarquia de heading
              pra leitor de tela e perde ponto de SEO no Lighthouse. */}
          {indice === 0 ? <h1>{bloco.titulo}</h1> : <h2>{bloco.titulo}</h2>}

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

          {indice === blocos.length - 1 && (
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
  );
}
