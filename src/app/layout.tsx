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
    default: 'Vero + MediQuo - Sua saúde na palma da mão',
    template: '%s | Vero + MediQuo'
  },
  description: 'Fale com médicos em até 10 minutos. Cuidar de você, da sua família e do seu pet nunca foi tão fácil, rápido e acessível.',
  keywords: ['consulta médica online', 'receita online', 'médico online', 'telemedicina', 'saúde', 'atendimento médico', 'MediQuo', 'Vero', 'pets', 'veterinário online'],
  authors: [{ name: 'MediQuo' }],
  creator: 'MediQuo',
  publisher: 'MediQuo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Vero + MediQuo - Sua saúde na palma da mão',
    description: 'Fale com médicos em até 10 minutos. Cuidar de você, da sua família e do seu pet nunca foi tão fácil.',
    url: 'https://vero.mediquo.com.br',
    siteName: 'Vero + MediQuo',
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
    title: 'Vero + MediQuo - Sua saúde na palma da mão',
    description: 'Fale com médicos em até 10 minutos. Inclua filhos e pets sem custo extra.',
    images: ['/images/og-image.png'],
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      me: ['contato@mediquo.com.br'],
    },
  },
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "MediQuo",
              "url": "https://vero.mediquo.com.br",
              "logo": "https://vero.mediquo.com.br/logo.svg",
              "description": "Consulta médica online rápida e segura",
              "medicalSpecialty": ["Endocrinology", "InternalMedicine"],
              "availableService": [
                {
                  "@type": "MedicalProcedure",
                  "name": "Consulta Médica Online",
                  "description": "Consulta médica online em até 10 minutos",
                  "procedureType": "Telemedicine"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "Prescrição Médica Online",
                  "description": "Prescrição médica digital com validade em todo Brasil.",
                  "procedureType": "Prescription"
                }
              ],
              "offers": {
                "@type": "Offer",
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2025-12-31"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000"
              }
            })
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
