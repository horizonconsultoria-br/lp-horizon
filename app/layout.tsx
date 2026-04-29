import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://consultoriahorizon.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HorizonConsultoria — IA-native ou ser engolido pela concorrência",
    template: "%s · HorizonConsultoria",
  },
  description:
    "Software house que constrói IA dentro do seu produto. Squad em 7 dias, blueprints testados, preço 5–10× menor que big consulting.",
  keywords: [
    "software house IA",
    "consultoria IA Brasil",
    "squad de desenvolvimento",
    "agentes Claude",
    "MCPs",
    "AI-OS",
    "IA vertical",
  ],
  authors: [{ name: "HorizonConsultoria", url: siteUrl }],
  creator: "HorizonConsultoria",
  publisher: "HorizonConsultoria",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IA-native ou ser engolido. Você escolhe.",
    description:
      "Bancas estão sendo trocadas por legaltechs de 2 anos. Clínicas pequenas batem rede grande no WhatsApp com IA. A Horizon constrói essa camada antes que seu concorrente faça primeiro.",
    url: siteUrl,
    siteName: "HorizonConsultoria",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HorizonConsultoria — IA-native ou ser engolido pela concorrência",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA-native ou ser engolido. Você escolhe.",
    description:
      "Software house que constrói IA dentro do seu produto. Squad em 7 dias, preço 5-10× menor que big consulting.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

// Schema.org structured data — Organization + Service x4 + FAQPage + WebSite
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: "HorizonConsultoria",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      sameAs: [
        // TODO: founder fornecer URL exata do LinkedIn do Rodrigo
        "https://www.linkedin.com/in/rodrigo-almeida-gustavo/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contato@consultoriahorizon.com.br",
        contactType: "Customer Support",
        availableLanguage: ["Portuguese"],
      },
      taxID: "37.111.839/0001-07",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "HorizonConsultoria",
      publisher: { "@id": `${siteUrl}/#org` },
      inLanguage: "pt-BR",
    },
    {
      "@type": "Service",
      name: "Squad Retainer",
      provider: { "@id": `${siteUrl}/#org` },
      description: "2-3 profissionais alocados no produto do cliente por 3-6 meses. Spin-up em 7 dias.",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 15000,
          maxPrice: 40000,
          priceCurrency: "BRL",
          unitText: "MONTH",
        },
      },
    },
    {
      "@type": "Service",
      name: "Projeto Fechado",
      provider: { "@id": `${siteUrl}/#org` },
      description: "Escopo + prazo definidos. MVPs e IAs verticais. Pago por entregável, não por hora.",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 50000,
          maxPrice: 200000,
          priceCurrency: "BRL",
        },
      },
    },
    {
      "@type": "Service",
      name: "IA Vertical Customizada",
      provider: { "@id": `${siteUrl}/#org` },
      description: "Construção de agentes/IAs específicos do domínio do cliente — prompt engineering, RAG, fine-tuning, evals próprios.",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 80000,
          maxPrice: 250000,
          priceCurrency: "BRL",
        },
      },
    },
    {
      "@type": "Service",
      name: "AI-OS as a Service",
      provider: { "@id": `${siteUrl}/#org` },
      description: "Implantação customizada de sistema AI-OS (Paperclip + MCPs + agentes orquestrados) na operação do cliente.",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 150000,
          maxPrice: 500000,
          priceCurrency: "BRL",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quanto custa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Squad Retainer começa em R$15K/mês com commitment de 3 meses. Projeto fechado começa em R$50K com escopo + prazo definidos. Auditoria técnica + UX inicial: R$5-10K (ou grátis se virar contrato em 60 dias).",
          },
        },
        {
          "@type": "Question",
          name: "Quanto tempo demora?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Spin-up de squad: 7 dias após assinatura. MVP de IA vertical: 60-120 dias. AI-OS completo: 120-240 dias. Auditoria: 5 dias úteis.",
          },
        },
        {
          "@type": "Question",
          name: "Vocês entregam código ou consultoria?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Código rodando em produção, sempre. Consultoria pura não fazemos — porque é onde 80% dos projetos morrem.",
          },
        },
        {
          "@type": "Question",
          name: "Funciona pra empresa pequena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Funciona pra empresa que tem pelo menos 1 produto rodando e dor clara onde IA pode mover métrica. A partir de Series Pre-Seed/Seed com produto em produção, faz sentido conversar.",
          },
        },
        {
          "@type": "Question",
          name: "Qual a diferença pra agência digital?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Agência digital faz site, marketing, funil. A gente faz software com IA por dentro do produto.",
          },
        },
        {
          "@type": "Question",
          name: "Vocês fazem manutenção depois?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Squad Retainer é o modelo natural pra continuar evoluindo. Em Projeto Fechado, oferecemos contrato de manutenção mensal (3-15% do valor do projeto, dependendo do SLA).",
          },
        },
        {
          "@type": "Question",
          name: "Como sei se preciso de IA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pergunta inversa: alguma das suas métricas vai mexer se você automatizar uma tarefa repetitiva, classificar texto/imagem, ou personalizar saída por usuário? Se sim, você precisa.",
          },
        },
        {
          "@type": "Question",
          name: "Posso começar com a auditoria gratuita?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pode. Auditoria de 5 dias úteis com 10-15 recomendações priorizadas: R$5-10K ou grátis se virar contrato de Squad Retainer ou Projeto Fechado em até 60 dias.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} data-theme="dark">
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-hzn-bg-base text-hzn-text-primary antialiased">
        <a href="#main" className="skip-link">Pular para o conteúdo principal</a>
        <main id="main">{children}</main>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
