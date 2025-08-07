import type React from "react"
import type { Metadata } from 'next'
import { Montserrat } from "next/font/google"
import "../styles/globals.css"
import ClientLayout from "./client-layout"
import GoogleAnalytics from "../components/google-analytics"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vero.mediquo.com.br'),
  title: {
    default: 'MediQuo + Vero | Consulta Médica Online 24h em até 10 minutos - R$ 15,90',
    template: '%s | MediQuo + Vero'
  },
  description: 'Consulta médica online 24 horas por R$ 15,90/mês. Fale com clínicos, pediatras, psicólogos e veterinários em até 10 minutos. Inclua filhos e pets sem custo extra. Atendimento por chat, vídeo ou ligação.',
  keywords: ['consulta médica online 24 horas', 'telemedicina 24h', 'médico online urgente', 'pediatra online 24 horas', 'psicólogo online', 'nutricionista online', 'veterinário online 24h', 'consulta médica R$ 15,90', 'MediQuo', 'Vero', 'receita médica digital', 'atendimento médico imediato', 'saúde familiar online', 'teleconsulta barata'],
  authors: [{ name: 'MediQuo' }],
  creator: 'MediQuo',
  publisher: 'MediQuo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'MediQuo + Vero | Consulta Médica Online 24h - R$ 15,90/mês',
    description: 'Consulta médica online 24h por apenas R$ 15,90. Clínicos, pediatras, psicólogos e veterinários em até 10 minutos. Inclua filhos e pets gratuitamente.',
    url: 'https://vero.mediquo.com.br',
    siteName: 'MediQuo + Vero',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vero + MediQuo - Sua saúde na palma da mão',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediQuo + Vero | Consulta Médica Online 24h - R$ 15,90',
    description: 'Consulta médica online 24 horas. Clínicos, pediatras, psicólogos e veterinários em até 10 min. Inclua filhos e pets grátis.',
    images: ['/images/og-image.png'],
    creator: '@mediquo',
    site: '@mediquo',
  },
  alternates: {
    canonical: 'https://vero.mediquo.com.br',
    languages: {
      'pt-BR': 'https://vero.mediquo.com.br',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/fav-mediquo.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/fav-mediquo.svg'],
    apple: [
      { url: '/fav-mediquo.svg', type: 'image/svg+xml' },
    ],
  },
  verification: {
    google: 'aguardando-codigo-verificacao',
    other: {
      me: ['contato@mediquo.com.br'],
    },
  },
  category: 'health',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NMD7QJ2F');`
        }} />
        {/* End Google Tag Manager */}
        <meta name="generator" content="v0.dev" />
        <link rel="canonical" href="https://vero.mediquo.com.br" />
        <link rel="icon" type="image/svg+xml" href="/fav-mediquo.svg" />
        <link rel="apple-touch-icon" type="image/svg+xml" href="/fav-mediquo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "MedicalOrganization",
                "name": "MediQuo Brasil",
                "alternateName": "MediQuo + Vero",
                "url": "https://vero.mediquo.com.br",
                "logo": "https://vero.mediquo.com.br/logo-mediquo.svg",
                "image": "https://vero.mediquo.com.br/images/og-image.png",
                "description": "Plataforma de telemedicina 24 horas com consultas médicas online em até 10 minutos por R$ 15,90/mês",
                "telephone": "+55-11-0000-0000",
                "email": "contato@mediquo.com.br",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "BR",
                  "addressLocality": "São Paulo",
                  "addressRegion": "SP"
                },
                "sameAs": [
                  "https://www.instagram.com/mediquo",
                  "https://www.facebook.com/mediquo",
                  "https://twitter.com/mediquo"
                ],
                "medicalSpecialty": [
                  "GeneralPractice",
                  "Pediatrics", 
                  "Psychology",
                  "Nutrition",
                  "Dermatology",
                  "Gynecology",
                  "Veterinary"
                ],
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", 
                    "Friday", "Saturday", "Sunday"
                  ],
                  "opens": "00:00",
                  "closes": "23:59"
                },
                "availableService": [
                  {
                    "@type": "MedicalProcedure",
                    "name": "Consulta Médica Online 24h",
                    "description": "Atendimento com clínicos gerais 24 horas em até 10 minutos",
                    "procedureType": "Telemedicine",
                    "howPerformed": "Chat, vídeo ou ligação"
                  },
                  {
                    "@type": "MedicalProcedure",
                    "name": "Consulta Pediátrica Online",
                    "description": "Pediatras disponíveis 24h para atender seu filho",
                    "procedureType": "Telemedicine"
                  },
                  {
                    "@type": "MedicalProcedure",
                    "name": "Psicologia Online",
                    "description": "Sessões com psicólogos especializados",
                    "procedureType": "Telemedicine"
                  },
                  {
                    "@type": "MedicalProcedure",
                    "name": "Nutrição Online",
                    "description": "Acompanhamento nutricional personalizado",
                    "procedureType": "Telemedicine"
                  },
                  {
                    "@type": "MedicalProcedure",
                    "name": "Veterinário Online",
                    "description": "Atendimento veterinário para cães e gatos",
                    "procedureType": "Telemedicine"
                  }
                ],
                "offers": {
                  "@type": "Offer",
                  "name": "Plano Mensal MediQuo",
                  "price": "15.90",
                  "priceCurrency": "BRL",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2025-12-31",
                  "url": "https://vero.mediquo.com.br/cliente/checkout",
                  "description": "Acesso ilimitado a todos os especialistas + dependentes menores de 18 anos + pets"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "5000",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Posso incluir mais de um filho no plano MediQuo?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Sim! Você pode incluir quantos filhos menores de 18 anos quiser, sem limites e sem custo adicional."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Preciso de convênio para agendar especialistas?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Não. Todo o atendimento é feito pelo app MediQuo, sem necessidade de convênio ou burocracia."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Todas as especialidades precisam de agendamento?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Não. Clínico geral, Pediatra, Veterinário e Ginecologista estão disponíveis 24h sem agendamento. Psicólogo, Nutricionista e Educador Físico precisam ser agendados."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Quanto custa o plano MediQuo?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "O plano mensal custa apenas R$ 15,90 e inclui acesso a todos os especialistas, além de poder incluir filhos menores de 18 anos e pets sem custo adicional."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </head>
      <body className={montserrat.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMD7QJ2F"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <GoogleAnalytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
