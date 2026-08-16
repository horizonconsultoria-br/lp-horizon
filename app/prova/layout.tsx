import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import "./prova.css";

// next/font baixa e serve local no build. Zero requisição a host de terceiro,
// que é o que a CSP estrita desta rota exige (font-src 'self').
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A gente roda a própria operação no software que vende",
  description:
    "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon e roda em produção. Veja a operação e os números que ela gerou.",
  alternates: { canonical: "/prova" },
  openGraph: {
    title: "A gente roda a própria operação no software que vende",
    description:
      "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon e roda em produção.",
    url: "https://consultoriahorizon.com.br/prova",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "A Horizon rodando o próprio CRM, o software que ela usa para vender aos clientes.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A gente roda a própria operação no software que vende",
    description:
      "O CRM que a Horizon usa para prospectar, diagnosticar e propor foi construído pela Horizon e roda em produção.",
    images: ["/og-image.png"],
  },
};

export default function ProvaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`theme-v3 ${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <div className="prova-shell">{children}</div>
    </div>
  );
}
