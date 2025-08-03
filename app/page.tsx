"use client"

import { useState } from "react"
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Globe,
  ChevronRight,
  Square,
  Car,
  BarcodeIcon as Billboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const translations = {
  pl: {
    nav: {
      home: "Strona główna",
      properties: "Nieruchomości",
      about: "O nas",
      contact: "Kontakt",
    },
    hero: {
      title: "Profesjonalne zarządzanie nieruchomościami",
      subtitle: "Gliwicka 111",
      description:
        "Oferujemy wynajem powierzchni komercyjnych, zarządzanie nieruchomościami oraz usługi reklamowe w doskonałej lokalizacji w Tarnowskich Górach.",
      cta: "Zobacz ofertę",
      contact: "Skontaktuj się",
    },
    services: {
      title: "Nasze usługi",
      subtitle: "Kompleksowe rozwiązania dla Twojego biznesu",
      hall: {
        title: "Hala 110m²",
        description: "Przestronna hala z zapleczem socjalnym: kuchnia, łazienka i biuro",
      },
      office: {
        title: "Biuro 80m²",
        description: "Nowoczesna przestrzeń biurowa z podwójną toaletą",
      },
      parking: {
        title: "Plac 500m²",
        description: "Utwardzona powierzchnia przy głównej drodze - parking, ekspozycja, kontenery biurowe",
      },
      billboard: {
        title: "Reklama mobilna",
        description: "Wynajem przyczepy reklamowej 5m x 3m",
      },
    },
    features: {
      title: "Dlaczego Gliwicka 111?",
      location: {
        title: "Doskonała lokalizacja",
        description: "Strategiczne położenie w Tarnowskich Górach przy głównej arterii komunikacyjnej",
      },
      flexible: {
        title: "Elastyczne warunki",
        description: "Dostosowujemy ofertę do indywidualnych potrzeb każdego klienta",
      },
      professional: {
        title: "Profesjonalna obsługa",
        description: "Doświadczony zespół zapewnia kompleksową opiekę nad nieruchomościami",
      },
    },
    contact: {
      title: "Skontaktuj się z nami",
      description: "Jesteśmy gotowi odpowiedzieć na wszystkie pytania dotyczące naszej oferty",
    },
    footer: {
      company: "Gliwicka 111",
      description: "Profesjonalne zarządzanie nieruchomościami i wynajem powierzchni komercyjnych.",
      quickLinks: "Szybkie linki",
      contact: "Kontakt",
      legal: "Informacje prawne",
      privacy: "Polityka prywatności",
      terms: "Regulamin",
      rights: "Wszystkie prawa zastrzeżone.",
    },
  },
  en: {
    nav: {
      home: "Home",
      properties: "Properties",
      about: "About",
      contact: "Contact",
    },
    hero: {
      title: "Professional Property Management",
      subtitle: "Gliwicka 111",
      description:
        "We offer commercial space rentals, property management services, and advertising solutions in an excellent location in Tarnowskie Góry.",
      cta: "View Offer",
      contact: "Contact Us",
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive solutions for your business",
      hall: {
        title: "110m² Hall",
        description: "Spacious hall with social facilities: kitchen, bathroom, and office",
      },
      office: {
        title: "80m² Office",
        description: "Modern office space with double toilet facilities",
      },
      parking: {
        title: "500m² Area",
        description: "Paved area by the main road - parking, product display, or container offices",
      },
      billboard: {
        title: "Mobile Advertising",
        description: "Billboard trailer rental 5m x 3m",
      },
    },
    features: {
      title: "Why Gliwicka 111?",
      location: {
        title: "Excellent Location",
        description: "Strategic location in Tarnowskie Góry on the main communication artery",
      },
      flexible: {
        title: "Flexible Terms",
        description: "We adapt our offer to the individual needs of each client",
      },
      professional: {
        title: "Professional Service",
        description: "Experienced team provides comprehensive property care",
      },
    },
    contact: {
      title: "Contact Us",
      description: "We are ready to answer all questions about our offer",
    },
    footer: {
      company: "Gliwicka 111",
      description: "Professional property management and commercial space rentals.",
      quickLinks: "Quick Links",
      contact: "Contact",
      legal: "Legal Information",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved.",
    },
  },
}

export default function HomePage() {
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">{t.hero.title}</h2>
              <h3 className="text-2xl lg:text-3xl font-semibold text-teal-600 mb-6">{t.hero.subtitle}</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">{t.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/properties">
                    {t.hero.cta}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">{t.hero.contact}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Gliwicka 111 Building"
                  width={500}
                  height={500}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.services.title}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <Square className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t.services.hall.title}</h3>
                <p className="text-slate-600">{t.services.hall.description}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <Building2 className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t.services.office.title}</h3>
                <p className="text-slate-600">{t.services.office.description}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <Car className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t.services.parking.title}</h3>
                <p className="text-slate-600">{t.services.parking.description}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <Billboard className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{t.services.billboard.title}</h3>
                <p className="text-slate-600">{t.services.billboard.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.features.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.location.title}</h3>
              <p className="text-slate-600">{t.features.location.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChevronRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.flexible.title}</h3>
              <p className="text-slate-600">{t.features.flexible.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.professional.title}</h3>
              <p className="text-slate-600">{t.features.professional.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.contact.title}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">{t.contact.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                {t.nav.contact}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              <a href="tel:+48791554674">
                <Phone className="w-4 h-4 mr-2" />
                +48 791 554 674
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.footer.company}</h3>
                  <p className="text-sm text-slate-400">Property Management</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">{t.footer.description}</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>Gliwicka 111, 42-600 Tarnowskie Góry</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+48 791 554 674</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>kontakt@gliwicka111.pl</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
              <nav className="space-y-2">
                <Link href="/" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
                <Link href="/properties" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.properties}
                </Link>
                <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
                <Link href="/contact" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.legal}</h4>
              <nav className="space-y-2">
                <Link href="/privacy" className="block text-slate-400 hover:text-white transition-colors">
                  {t.footer.privacy}
                </Link>
                <Link href="/terms" className="block text-slate-400 hover:text-white transition-colors">
                  {t.footer.terms}
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Gliwicka 111. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
