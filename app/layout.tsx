import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ChatbotProvider } from "@/app/_features/chatbot/ChatbotContext"
import { ChatbotWidget } from "@/app/_features/chatbot/ChatbotWidget"
import { GoogleAnalytics } from "@/components/google-analytics"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "CPTS Ouest Gironde - Communauté Professionnelle Territoriale de Santé",
  description: "La CPTS Ouest Gironde réunit les professionnels de santé de votre territoire pour améliorer l'accès aux soins. Découvrez nos services et actualités santé.",
  keywords: ["CPTS", "santé", "Gironde", "médecins", "soins", "territoire", "professionnels de santé"],
  authors: [{ name: "CPTS Ouest Gironde" }],
  creator: "CPTS Ouest Gironde",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "CPTS Ouest Gironde",
    description: "Une santé accessible pour tous",
    siteName: "CPTS Ouest Gironde",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPTS Ouest Gironde",
    description: "Une santé accessible pour tous",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        {/* GA4 Consent Mode v2 — doit s'exécuter avant gtag.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable} ${GeistMono.variable} antialiased`}>
        <ChatbotProvider>
          {children}
          <ChatbotWidget />
        </ChatbotProvider>
        <Analytics />
        <GoogleAnalytics />
        <CookieConsentBanner />
      </body>
    </html>
  )
}
