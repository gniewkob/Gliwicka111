import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { LanguageProvider } from "@/components/language-provider"
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
  params,
}: {
  children: React.ReactNode
  params?: { lang?: string }
}) {
  const cookieStore = cookies()
  const cookieLang = cookieStore.get("lang")?.value === "en" ? "en" : "pl"
  const currentLanguage =
    params?.lang === "en" || params?.lang === "pl"
      ? params.lang
      : cookieLang

  return (
    <html lang={currentLanguage}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Matomo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
              _paq.push(["setCookieDomain", "*.gliwicka111.pl"]);
              _paq.push(["setDomains", ["*.gliwicka111.pl"]]);
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//stats0.mydevil.net/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '589']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
          }}
        />
        {/* End Matomo Code */}
      </head>
      <body className={inter.className}>
        <LanguageProvider initialLanguage={currentLanguage}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
