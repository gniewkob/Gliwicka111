import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gliwicka 111 - Profesjonalne zarządzanie nieruchomościami | Property Management",
  description:
    "Oferujemy wynajem powierzchni komercyjnych, zarządzanie nieruchomościami oraz usługi reklamowe w Tarnowskich Górach. Hale, biura, place parkingowe i reklama mobilna.",
  keywords:
    "wynajem hali, biuro do wynajęcia, plac parkingowy, reklama mobilna, zarządzanie nieruchomościami, Tarnowskie Góry, powierzchnie komercyjne",
  authors: [{ name: "Gliwicka 111" }],
  creator: "Gliwicka 111",
  publisher: "Gliwicka 111",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gliwicka111.pl"),
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/pl",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Gliwicka 111 - Profesjonalne zarządzanie nieruchomościami",
    description:
      "Oferujemy wynajem powierzchni komercyjnych, zarządzanie nieruchomościami oraz usługi reklamowe w Tarnowskich Górach.",
    url: "https://gliwicka111.pl",
    siteName: "Gliwicka 111",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gliwicka 111 - Property Management",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gliwicka 111 - Profesjonalne zarządzanie nieruchomościami",
    description:
      "Oferujemy wynajem powierzchni komercyjnych, zarządzanie nieruchomościami oraz usługi reklamowe w Tarnowskich Górach.",
    images: ["/og-image.jpg"],
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
