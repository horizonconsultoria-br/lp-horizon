import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono, Syne, Poppins } from "next/font/google";
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

// Fontes da referencia playbooklab, usadas na dobra de abas por instrucao
// explicita do founder ("mesma formatacao e tamanho, so mude as cores").
const syne = Syne({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-syne",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
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
    "Seu time especializado em desenvolvimento, automações e implementação de projetos de Inteligência Artificial. Aumente sua receita com redução de custo operacional.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tecnologia e Inteligência Artificial aplicada a vendas e otimização operacional",
    description:
      "Seu time especializado em desenvolvimento, automações e implementação de projetos de Inteligência Artificial. Aumente sua receita com redução de custo operacional.",
    url: "https://consultoriahorizon.com.br/",
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
      "Seu time especializado em desenvolvimento, automações e implementação de projetos de Inteligência Artificial. Aumente sua receita com redução de custo operacional.",
    images: ["/og-image.png"],
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`theme-v3 ${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} ${syne.variable} ${poppins.variable}`}
    >
      {children}
    </div>
  );
}
