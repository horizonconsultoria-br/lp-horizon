import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./prova.css";

// next/font baixa e serve local no build. Zero requisição a host de terceiro,
// que é o que a CSP estrita desta rota exige (font-src 'self').
//
// Fraunces é variável e tem eixos próprios além do peso. Usamos WONK (que
// solta as terminações e dá o caráter levemente excêntrico que separa esta
// página de qualquer serif editorial padrão) e opsz (tamanho óptico, para o
// display gigante do herói não ficar com o mesmo desenho do corpo).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-prova",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tecnologia e Inteligência Artificial aplicada a vendas e otimização operacional",
  description:
    "Aumente sua receita e diminua seu custo operacional usando tecnologia, automação e inteligência artificial do jeito certo.",
  alternates: { canonical: "/prova" },
  openGraph: {
    title: "Tecnologia e Inteligência Artificial aplicada a vendas e otimização operacional",
    description:
      "Aumente sua receita e diminua seu custo operacional usando tecnologia, automação e inteligência artificial do jeito certo.",
    url: "https://consultoriahorizon.com.br/prova",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tecnologia e inteligência artificial aplicadas a vendas e operação, pela Horizon.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tecnologia e Inteligência Artificial aplicada a vendas e otimização operacional",
    description:
      "Aumente sua receita e diminua seu custo operacional usando tecnologia, automação e inteligência artificial do jeito certo.",
    images: ["/og-image.png"],
  },
};

export default function ProvaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`theme-v3 ${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </div>
  );
}
