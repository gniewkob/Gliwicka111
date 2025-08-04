"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Building2, Globe, Menu, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { navTranslations, backTranslations } from "@/lib/i18n"

const translations = {
  pl: {
    nav: navTranslations.pl,
    title: "Polityka Prywatności",
    lastUpdated: "Ostatnia aktualizacja: 3 sierpnia 2024",
    sections: {
      intro: {
        title: "Wprowadzenie",
        content:
          "Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników strony internetowej gliwicka111.pl przez firmę Gliwicka 111 z siedzibą w Tarnowskich Górach.",
      },
      controller: {
        title: "Administrator danych",
        content:
          "Administratorem Państwa danych osobowych jest Gliwicka 111 z siedzibą przy ul. Gliwickiej 111, 42-600 Tarnowskie Góry. W sprawach dotyczących ochrony danych osobowych można kontaktować się pod adresem e-mail: kontakt@gliwicka111.pl lub telefonicznie: +48 791 554 674.",
      },
      purposes: {
        title: "Cele i podstawy prawne przetwarzania danych",
        content: "Przetwarzamy Państwa dane osobowe w następujących celach:",
        list: [
          "Odpowiedzi na zapytania przesłane przez formularz kontaktowy (podstawa prawna: art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes)",
          "Prowadzenie korespondencji handlowej (podstawa prawna: art. 6 ust. 1 lit. b RODO - wykonanie umowy)",
          "Marketing bezpośredni - wyłącznie za zgodą (podstawa prawna: art. 6 ust. 1 lit. a RODO - zgoda)",
          "Wypełnienie obowiązków prawnych (podstawa prawna: art. 6 ust. 1 lit. c RODO)",
        ],
      },
      data: {
        title: "Rodzaje przetwarzanych danych",
        content: "Przetwarzamy następujące kategorie danych osobowych:",
        list: [
          "Dane identyfikacyjne (imię, nazwisko)",
          "Dane kontaktowe (adres e-mail, numer telefonu)",
          "Dane dotyczące korespondencji (treść wiadomości)",
          "Dane techniczne (adres IP, informacje o przeglądarce)",
        ],
      },
      retention: {
        title: "Okres przechowywania danych",
        content: "Dane osobowe przechowujemy przez okres niezbędny do realizacji celów, dla których zostały zebrane:",
        list: [
          "Dane z formularza kontaktowego - do czasu udzielenia odpowiedzi, nie dłużej niż 3 lata",
          "Dane marketingowe - do momentu wycofania zgody",
          "Dane dotyczące umów - przez okres wymagany przepisami prawa (do 10 lat)",
        ],
      },
      rights: {
        title: "Prawa osób, których dane dotyczą",
        content: "Przysługują Państwu następujące prawa:",
        list: [
          "Prawo dostępu do danych osobowych",
          "Prawo do sprostowania danych",
          'Prawo do usunięcia danych ("prawo do bycia zapomnianym")',
          "Prawo do ograniczenia przetwarzania",
          "Prawo do przenoszenia danych",
          "Prawo do sprzeciwu wobec przetwarzania",
          "Prawo do wycofania zgody (w przypadku przetwarzania na podstawie zgody)",
          "Prawo do wniesienia skargi do organu nadzorczego (UODO)",
        ],
      },
      security: {
        title: "Bezpieczeństwo danych",
        content:
          "Stosujemy odpowiednie środki techniczne i organizacyjne w celu zapewnienia bezpieczeństwa przetwarzanych danych osobowych, w tym ochrony przed nieuprawnionym lub niezgodnym z prawem przetwarzaniem oraz przypadkową utratą, zniszczeniem lub uszkodzeniem.",
      },
      cookies: {
        title: "Pliki cookies",
        content:
          "Nasza strona internetowa może wykorzystywać pliki cookies w celu zapewnienia prawidłowego funkcjonowania serwisu oraz analizy ruchu. Użytkownik może w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej przeglądarce.",
      },
      changes: {
        title: "Zmiany w Polityce Prywatności",
        content:
          "Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O wszelkich zmianach będziemy informować na stronie internetowej.",
      },
      contact: {
        title: "Kontakt",
        content:
          "W przypadku pytań dotyczących przetwarzania danych osobowych prosimy o kontakt pod adresem kontakt@gliwicka111.pl lub telefonicznie +48 791 554 674.",
      },
    },
    back: backTranslations.pl,
  },
  en: {
    nav: navTranslations.en,
    title: "Privacy Policy",
    lastUpdated: "Last updated: August 3, 2024",
    sections: {
      intro: {
        title: "Introduction",
        content:
          "This Privacy Policy defines the principles of processing and protecting personal data of users of the gliwicka111.pl website by Gliwicka 111 company based in Tarnowskie Góry.",
      },
      controller: {
        title: "Data Controller",
        content:
          "The controller of your personal data is Gliwicka 111 based at Gliwicka 111 street, 42-600 Tarnowskie Góry. For matters concerning personal data protection, you can contact us at: kontakt@gliwicka111.pl or by phone: +48 791 554 674.",
      },
      purposes: {
        title: "Purposes and legal bases for data processing",
        content: "We process your personal data for the following purposes:",
        list: [
          "Responding to inquiries sent through the contact form (legal basis: Art. 6(1)(f) GDPR - legitimate interest)",
          "Conducting business correspondence (legal basis: Art. 6(1)(b) GDPR - contract performance)",
          "Direct marketing - only with consent (legal basis: Art. 6(1)(a) GDPR - consent)",
          "Fulfilling legal obligations (legal basis: Art. 6(1)(c) GDPR)",
        ],
      },
      data: {
        title: "Types of processed data",
        content: "We process the following categories of personal data:",
        list: [
          "Identification data (name, surname)",
          "Contact data (email address, phone number)",
          "Correspondence data (message content)",
          "Technical data (IP address, browser information)",
        ],
      },
      retention: {
        title: "Data retention period",
        content:
          "We store personal data for the period necessary to achieve the purposes for which they were collected:",
        list: [
          "Contact form data - until response is provided, no longer than 3 years",
          "Marketing data - until consent is withdrawn",
          "Contract-related data - for the period required by law (up to 10 years)",
        ],
      },
      rights: {
        title: "Rights of data subjects",
        content: "You have the following rights:",
        list: [
          "Right of access to personal data",
          "Right to rectification of data",
          'Right to erasure of data ("right to be forgotten")',
          "Right to restriction of processing",
          "Right to data portability",
          "Right to object to processing",
          "Right to withdraw consent (in case of consent-based processing)",
          "Right to lodge a complaint with supervisory authority",
        ],
      },
      security: {
        title: "Data security",
        content:
          "We implement appropriate technical and organizational measures to ensure the security of processed personal data, including protection against unauthorized or unlawful processing and accidental loss, destruction, or damage.",
      },
      cookies: {
        title: "Cookies",
        content:
          "Our website may use cookies to ensure proper functioning of the service and traffic analysis. Users can change cookie settings in their browser at any time.",
      },
      changes: {
        title: "Changes to Privacy Policy",
        content:
          "We reserve the right to make changes to this Privacy Policy. We will inform about any changes on our website.",
      },
      contact: {
        title: "Contact",
        content:
          "For questions regarding personal data processing, please contact us at kontakt@gliwicka111.pl or by phone +48 791 554 674.",
      },
    },
    back: backTranslations.en,
  },
}

export default function PrivacyPage() {
  const { language, toggleLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = translations[language]

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
                  <ul className="space-y-2">
                    {section.list.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-600">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
