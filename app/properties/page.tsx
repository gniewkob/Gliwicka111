"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Globe,
  Square,
  Car,
  BarcodeIcon as Billboard,
  ArrowLeft,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { navTranslations, backTranslations } from "@/lib/i18n";

const translations = {
  pl: {
    nav: navTranslations.pl,
    header: {
      title: "Nasze nieruchomości",
      subtitle: "Odkryj idealne rozwiązania dla Twojego biznesu",
      description:
        "Oferujemy różnorodne powierzchnie komercyjne w doskonałej lokalizacji w Tarnowskich Górach.",
    },
    properties: {
      hall: {
        title: "Hala przemysłowa 110m²",
        description:
          "Przestronna hala z kompletnym zapleczem socjalnym idealnym dla działalności produkcyjnej, magazynowej lub usługowej.",
        features: [
          "Powierzchnia: 110m²",
          "Kuchnia wyposażona",
          "Łazienka",
          "Biuro",
          "Dostęp samochodowy",
          "Parking",
        ],
        price: "Cena do uzgodnienia",
        available: "Dostępne",
      },
      office: {
        title: "Przestrzeń biurowa 80m²",
        description:
          "Nowoczesne biuro z doskonałym standardem wykończenia, idealne dla firm usługowych i administracyjnych.",
        features: [
          "Powierzchnia: 80m²",
          "Podwójna toaleta",
          "Klimatyzacja",
          "Internet światłowodowy",
          "Parking",
          "Recepcja",
        ],
        price: "Cena do uzgodnienia",
        available: "Dostępne",
      },
      area: {
        title: "Plac utwardzony 500m²",
        description:
          "Duża utwardzona powierzchnia przy głównej drodze, idealna na parking, ekspozycję produktów lub kontenery biurowe.",
        features: [
          "Powierzchnia: 500m²",
          "Utwardzona nawierzchnia",
          "Przy głównej drodze",
          "Dostęp 24/7",
          "Ogrodzenie",
          "Oświetlenie",
        ],
        price: "Cena do uzgodnienia",
        available: "Dostępne",
      },
      billboard: {
        title: "Przyczepa reklamowa 5m x 3m",
        description:
          "Mobilna reklama o dużych wymiarach, idealna do promocji wydarzeń, produktów i usług w różnych lokalizacjach.",
        features: [
          "Wymiary: 5m x 3m",
          "Mobilność",
          "Dwustronna reklama",
          "Oświetlenie LED",
          "Montaż grafik",
          "Serwis",
        ],
        price: "Od 200 zł/dzień",
        available: "Dostępne",
      },
    },
    cta: {
      title: "Zainteresowany?",
      description:
        "Skontaktuj się z nami, aby omówić szczegóły i warunki wynajmu.",
      contact: "Skontaktuj się",
      call: "Zadzwoń teraz",
    },
    back: backTranslations.pl,
  },
  en: {
    nav: navTranslations.en,
    header: {
      title: "Our Properties",
      subtitle: "Discover perfect solutions for your business",
      description:
        "We offer various commercial spaces in an excellent location in Tarnowskie Góry.",
    },
    properties: {
      hall: {
        title: "Industrial Hall 110m²",
        description:
          "Spacious hall with complete social facilities, ideal for production, warehouse, or service activities.",
        features: [
          "Area: 110m²",
          "Equipped kitchen",
          "Bathroom",
          "Office",
          "Vehicle access",
          "Parking",
        ],
        price: "Price negotiable",
        available: "Available",
      },
      office: {
        title: "Office Space 80m²",
        description:
          "Modern office with excellent finishing standard, ideal for service and administrative companies.",
        features: [
          "Area: 80m²",
          "Double toilet",
          "Air conditioning",
          "Fiber internet",
          "Parking",
          "Reception",
        ],
        price: "Price negotiable",
        available: "Available",
      },
      area: {
        title: "Paved Area 500m²",
        description:
          "Large paved area by the main road, ideal for parking, product display, or container offices.",
        features: [
          "Area: 500m²",
          "Paved surface",
          "Main road location",
          "24/7 access",
          "Fencing",
          "Lighting",
        ],
        price: "Price negotiable",
        available: "Available",
      },
      billboard: {
        title: "Billboard Trailer 5m x 3m",
        description:
          "Large mobile advertising solution, ideal for promoting events, products, and services in various locations.",
        features: [
          "Dimensions: 5m x 3m",
          "Mobility",
          "Double-sided advertising",
          "LED lighting",
          "Graphics installation",
          "Service",
        ],
        price: "From 200 PLN/day",
        available: "Available",
      },
    },
    cta: {
      title: "Interested?",
      description: "Contact us to discuss details and rental conditions.",
      contact: "Contact Us",
      call: "Call Now",
    },
    back: backTranslations.en,
  },
};

export default function PropertiesPage() {
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[language];

  const properties = [
    {
      id: "hall",
      icon: Square,
      image: "/placeholder.svg?height=300&width=400",
      ...t.properties.hall,
    },
    {
      id: "office",
      icon: Building2,
      image: "/placeholder.svg?height=300&width=400",
      ...t.properties.office,
    },
    {
      id: "area",
      icon: Car,
      image: "/placeholder.svg?height=300&width=400",
      ...t.properties.area,
    },
    {
      id: "billboard",
      icon: Billboard,
      image: "/placeholder.svg?height=300&width=400",
      ...t.properties.billboard,
    },
  ];

  return (
    <ErrorBoundary fallback={<p>Unable to load properties.</p>}>
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
                  <h1 className="text-xl font-bold text-slate-900">
                    Gliwicka 111
                  </h1>
                  <p className="text-xs text-slate-600">Property Management</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
                >
                  {t.nav.home}
                </Link>
                <Link href="/properties" className="text-teal-600 font-medium">
                  {t.nav.properties}
                </Link>
                <Link
                  href="/about"
                  className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
                >
                  {t.nav.about}
                </Link>
                <Link
                  href="/contact"
                  className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
                >
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="text-slate-700 hover:text-teal-600 font-medium"
                  >
                    {t.nav.home}
                  </Link>
                  <Link
                    href="/properties"
                    className="text-teal-600 font-medium"
                  >
                    {t.nav.properties}
                  </Link>
                  <Link
                    href="/about"
                    className="text-slate-700 hover:text-teal-600 font-medium"
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    href="/contact"
                    className="text-slate-700 hover:text-teal-600 font-medium"
                  >
                    {t.nav.contact}
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Button asChild variant="ghost" className="mb-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.back}</span>
                </Link>
              </Button>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                {t.header.title}
              </h1>
              <p className="text-xl text-teal-600 mb-6">{t.header.subtitle}</p>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                {t.header.description}
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {properties.map((property, index) => {
                const IconComponent = property.icon;
                return (
                  <Card
                    key={property.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {property.available}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-900">
                            {property.title}
                          </CardTitle>
                          <p className="text-lg font-semibold text-teal-600">
                            {property.price}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {property.description}
                      </p>
                      <div className="space-y-2 mb-6">
                        {property.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm text-slate-600"
                          >
                            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="flex-1 bg-teal-600 hover:bg-teal-700"
                        >
                          <Link href="/contact">
                            <Mail className="w-4 h-4 mr-2" />
                            {t.cta.contact}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          <a href="tel:+48791554674">
                            <Phone className="w-4 h-4 mr-2" />
                            {t.cta.call}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t.cta.title}
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  {t.cta.contact}
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
                    <h3 className="text-xl font-bold">Gliwicka 111</h3>
                    <p className="text-sm text-slate-400">
                      Property Management
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 max-w-md">
                  {language === "pl"
                    ? "Profesjonalne zarządzanie nieruchomościami i wynajem powierzchni komercyjnych."
                    : "Professional property management and commercial space rentals."}
                </p>
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
                <h4 className="text-lg font-semibold mb-4">
                  {language === "pl" ? "Szybkie linki" : "Quick Links"}
                </h4>
                <nav className="space-y-2">
                  <Link
                    href="/"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {t.nav.home}
                  </Link>
                  <Link
                    href="/properties"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {t.nav.properties}
                  </Link>
                  <Link
                    href="/about"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {t.nav.about}
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {t.nav.contact}
                  </Link>
                </nav>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {language === "pl"
                    ? "Informacje prawne"
                    : "Legal Information"}
                </h4>
                <nav className="space-y-2">
                  <Link
                    href="/privacy"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {language === "pl"
                      ? "Polityka prywatności"
                      : "Privacy Policy"}
                  </Link>
                  <Link
                    href="/terms"
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {language === "pl" ? "Regulamin" : "Terms of Service"}
                  </Link>
                </nav>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
              <p>
                &copy; 2024 Gliwicka 111.{" "}
                {language === "pl"
                  ? "Wszystkie prawa zastrzeżone."
                  : "All rights reserved."}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
