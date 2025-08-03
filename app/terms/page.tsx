"use client"

import { useState } from "react"
import { Building2, Globe, Menu, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const translations = {
  pl: {
    nav: {
      home: "Strona główna",
      properties: "Nieruchomości",
      about: "O nas",
      contact: "Kontakt",
    },
    title: "Regulamin",
    lastUpdated: "Ostatnia aktualizacja: 3 sierpnia 2024",
    sections: {
      general: {
        title: "Postanowienia ogólne",
        content:
          "Niniejszy Regulamin określa zasady korzystania ze strony internetowej gliwicka111.pl oraz świadczonych przez firmę Gliwicka 111 usług wynajmu powierzchni komercyjnych i zarządzania nieruchomościami.",
      },
      definitions: {
        title: "Definicje",
        content: "Użyte w Regulaminie pojęcia oznaczają:",
        list: [
          "Usługodawca - Gliwicka 111 z siedzibą przy ul. Gliwickiej 111, 42-600 Tarnowskie Góry",
          "Strona internetowa - serwis internetowy dostępny pod adresem gliwicka111.pl",
          "Użytkownik - osoba fizyczna, prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej korzystająca ze Strony internetowej",
          "Usługi - usługi wynajmu powierzchni komercyjnych, zarządzania nieruchomościami oraz reklamy mobilnej świadczone przez Usługodawcę",
        ],
      },
      services: {
        title: "Zakres usług",
        content: "Usługodawca świadczy następujące usługi:",
        list: [
          "Wynajem hali przemysłowej o powierzchni 110m² z zapleczem socjalnym",
          "Wynajem przestrzeni biurowej o powierzchni 80m² z podwójną toaletą",
          "Wynajem utwardzonego placu o powierzchni 500m² przy głównej drodze",
          "Wynajem przyczepy reklamowej o wymiarach 5m x 3m",
          "Zarządzanie nieruchomościami",
          "Doradztwo w zakresie nieruchomości komercyjnych",
        ],
      },
      usage: {
        title: "Zasady korzystania ze strony internetowej",
        content: "Korzystając ze Strony internetowej, Użytkownik zobowiązuje się do:",
        list: [
          "Używania Strony zgodnie z jej przeznaczeniem i obowiązującym prawem",
          "Niepodejmowania działań mogących zakłócić funkcjonowanie Strony",
          "Niepublikowania treści niezgodnych z prawem, dobrymi obyczajami lub naruszających prawa osób trzecich",
          "Podawania prawdziwych danych w formularzach kontaktowych",
        ],
      },
      rental: {
        title: "Zasady wynajmu",
        content:
          "Wynajem nieruchomości odbywa się na podstawie indywidualnych umów najmu zawieranych między Usługodawcą a Najemcą. Szczegółowe warunki wynajmu, w tym wysokość czynszu, okres najmu i inne postanowienia, są ustalane indywidualnie dla każdej nieruchomości.",
      },
      liability: {
        title: "Odpowiedzialność",
        content:
          "Usługodawca dokłada wszelkich starań, aby informacje zamieszczone na Stronie internetowej były aktualne i prawidłowe, jednak nie ponosi odpowiedzialności za:",
        list: [
          "Szkody wynikające z korzystania lub niemożności korzystania ze Strony internetowej",
          "Szkody spowodowane działaniem osób trzecich",
          "Czasową niedostępność Strony internetowej z przyczyn technicznych",
          "Utratę danych wynikającą z awarii technicznej",
        ],
      },
      intellectual: {
        title: "Własność intelektualna",
        content:
          "Wszystkie materiały zamieszczone na Stronie internetowej, w tym teksty, grafiki, logotypy, zdjęcia, są chronione prawem autorskim i stanowią własność Usługodawcy lub zostały wykorzystane za zgodą właścicieli praw. Kopiowanie, rozpowszechnianie lub inne wykorzystywanie tych materiałów bez zgody jest zabronione.",
      },
      complaints: {
        title: "Reklamacje",
        content: "Reklamacje dotyczące świadczonych usług można składać:",
        list: [
          "Pisemnie na adres: Gliwicka 111, 42-600 Tarnowskie Góry",
          "Drogą elektroniczną na adres: kontakt@gliwicka111.pl",
          "Telefonicznie pod numerem: +48 791 554 674",
        ],
        additional:
          "Reklamacja powinna zawierać opis problemu oraz dane kontaktowe. Usługodawca rozpatruje reklamacje w terminie 14 dni roboczych od daty otrzymania.",
      },
      changes: {
        title: "Zmiany Regulaminu",
        content:
          "Usługodawca zastrzega sobie prawo do wprowadzania zmian w niniejszym Regulaminie. O planowanych zmianach Użytkownicy będą informowani poprzez publikację nowej wersji Regulaminu na Stronie internetowej z co najmniej 7-dniowym wyprzedzeniem.",
      },
      final: {
        title: "Postanowienia końcowe",
        content:
          "W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego. Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy.",
      },
    },
    back: "Powrót do strony głównej",
  },
  en: {
    nav: {
      home: "Home",
      properties: "Properties",
      about: "About",
      contact: "Contact",
    },
    title: "Terms of Service",
    lastUpdated: "Last updated: August 3, 2024",
    sections: {
      general: {
        title: "General provisions",
        content:
          "These Terms of Service define the rules for using the gliwicka111.pl website and services provided by Gliwicka 111 company for commercial space rental and property management.",
      },
      definitions: {
        title: "Definitions",
        content: "Terms used in these Terms of Service mean:",
        list: [
          "Service Provider - Gliwicka 111 based at Gliwicka 111 street, 42-600 Tarnowskie Góry",
          "Website - internet service available at gliwicka111.pl",
          "User - natural person, legal entity or organizational unit without legal personality using the Website",
          "Services - commercial space rental, property management and mobile advertising services provided by the Service Provider",
        ],
      },
      services: {
        title: "Scope of services",
        content: "The Service Provider provides the following services:",
        list: [
          "Rental of 110m² industrial hall with social facilities",
          "Rental of 80m² office space with double toilet",
          "Rental of 500m² paved area by the main road",
          "Rental of 5m x 3m billboard trailer",
          "Property management",
          "Commercial real estate consulting",
        ],
      },
      usage: {
        title: "Website usage rules",
        content: "By using the Website, the User agrees to:",
        list: [
          "Use the Website in accordance with its purpose and applicable law",
          "Not undertake actions that could disrupt the Website's functioning",
          "Not publish content that is unlawful, against good morals, or violates third party rights",
          "Provide truthful information in contact forms",
        ],
      },
      rental: {
        title: "Rental terms",
        content:
          "Property rental is based on individual lease agreements concluded between the Service Provider and the Tenant. Detailed rental conditions, including rent amount, lease period and other provisions, are determined individually for each property.",
      },
      liability: {
        title: "Liability",
        content:
          "The Service Provider makes every effort to ensure that information on the Website is current and correct, however, is not liable for:",
        list: [
          "Damages resulting from using or inability to use the Website",
          "Damages caused by third party actions",
          "Temporary Website unavailability due to technical reasons",
          "Data loss resulting from technical failure",
        ],
      },
      intellectual: {
        title: "Intellectual property",
        content:
          "All materials published on the Website, including texts, graphics, logos, photos, are protected by copyright and are the property of the Service Provider or have been used with the consent of rights holders. Copying, distributing or other use of these materials without consent is prohibited.",
      },
      complaints: {
        title: "Complaints",
        content: "Complaints regarding provided services can be submitted:",
        list: [
          "In writing to: Gliwicka 111, 42-600 Tarnowskie Góry",
          "Electronically to: kontakt@gliwicka111.pl",
          "By phone: +48 791 554 674",
        ],
        additional:
          "The complaint should include a description of the problem and contact details. The Service Provider considers complaints within 14 business days from receipt.",
      },
      changes: {
        title: "Terms of Service changes",
        content:
          "The Service Provider reserves the right to make changes to these Terms of Service. Users will be informed about planned changes by publishing a new version of the Terms of Service on the Website at least 7 days in advance.",
      },
      final: {
        title: "Final provisions",
        content:
          "In matters not regulated by these Terms of Service, Polish law applies, in particular the Civil Code. All disputes will be resolved by the court competent for the Service Provider's registered office.",
      },
    },
    back: "Back to homepage",
  },
}

export default function TermsPage() {
  const [language, setLanguage] = useState<"pl" | "en">("pl")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(language === "pl" ? "en" : "pl")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gliwicka 111</h1>
                <p className="text-xs text-slate-600">Property Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                {t.nav.home}
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                {t.nav.properties}
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                {t.nav.about}
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                {t.nav.contact}
              </Link>

              {/* Language Switcher */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-1 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-1 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-slate-700 hover:text-teal-600 font-medium">
                  {t.nav.home}
                </Link>
                <Link href="/properties" className="text-slate-700 hover:text-teal-600 font-medium">
                  {t.nav.properties}
                </Link>
                <Link href="/about" className="text-slate-700 hover:text-teal-600 font-medium">
                  {t.nav.about}
                </Link>
                <Link href="/contact" className="text-slate-700 hover:text-teal-600 font-medium">
                  {t.nav.contact}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{t.title}</h1>
          <p className="text-slate-600">{t.lastUpdated}</p>
        </div>

        <div className="space-y-8">
          {Object.entries(t.sections).map(([key, section]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{section.content}</p>
                {"list" in section && section.list && (
                  <ul className="space-y-2 mb-4">
                    {section.list.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-600">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {"additional" in section && section.additional && (
                  <p className="text-slate-600 mt-4">{section.additional}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
