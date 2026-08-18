"""Gera os icones de aba (favicon) a partir do simbolo oficial da marca.

O simbolo em public/prova/logo-simbolo.png e azul claro sobre transparente:
sozinho ele some numa aba de navegador em tema claro. Por isso o icone e o
simbolo assentado num quadrado arredondado na cor de fundo da propria pagina
(--noite), que le bem nos dois temas de aba.

O simbolo e feito de tracos diagonais finos. Reduzido direto para 16px eles
viram sub-pixel e o icone vira uma mancha, entao a proporcao que o simbolo
ocupa CRESCE conforme o icone encolhe: nos tamanhos pequenos ele quase encosta
nas bordas, que e o que mantem o traco visivel.

Rodar da raiz do repo:  python design/gerar-icones.py
"""

from PIL import Image, ImageDraw

ORIGEM = "public/prova/logo-simbolo.png"
FUNDO = (10, 15, 26, 255)  # --noite, o mesmo fundo da pagina

# tamanho -> fracao do lado que o simbolo ocupa
OCUPACAO = {16: 0.90, 32: 0.84, 48: 0.80, 180: 0.72, 512: 0.70}


def monta(lado: int) -> Image.Image:
    # Desenha em 8x e reduz no fim: bordas arredondadas e tracos diagonais
    # saem suaves em vez de serrilhados.
    escala = 8
    grande = lado * escala

    tela = Image.new("RGBA", (grande, grande), (0, 0, 0, 0))
    mascara = Image.new("L", (grande, grande), 0)
    raio = int(grande * 0.22)
    ImageDraw.Draw(mascara).rounded_rectangle([0, 0, grande - 1, grande - 1], raio, fill=255)
    tela.paste(Image.new("RGBA", (grande, grande), FUNDO), (0, 0), mascara)

    simbolo = Image.open(ORIGEM).convert("RGBA")
    alvo = int(grande * OCUPACAO[lado])
    simbolo = simbolo.resize((alvo, alvo), Image.LANCZOS)
    canto = (grande - alvo) // 2
    tela.paste(simbolo, (canto, canto), simbolo)

    return tela.resize((lado, lado), Image.LANCZOS)


if __name__ == "__main__":
    # app/icon.png e app/apple-icon.png sao convencao do App Router: o Next
    # injeta as tags <link> sozinho em toda rota que ele renderiza.
    monta(512).save("app/icon.png")
    monta(180).save("app/apple-icon.png")
    # favicon.ico cobre o que o Next NAO renderiza: /comercial e o estatico
    # v2, que tem <head> proprio, e qualquer chamada crua a /favicon.ico.
    monta(48).save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[monta(16), monta(32)],
    )
    print("gerados: app/icon.png, app/apple-icon.png, public/favicon.ico")
