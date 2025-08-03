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
  Users,
  Calendar,
  Megaphone,
  Gift,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

const translations = {
  pl: {
    nav: {
      home: "Strona główna",
      offer: "Nasza oferta",
      virtualOffice: "Biuro wirtualne",
      coworking: "Coworking i biura",
      meetingRooms: "Sale spotkań",
      advertising: "Reklama zewnętrzna",
      specialDeals: "Oferty specjalne",
      about: "O nas",
      contact: "Kontakt",
    },
    hero: {
      title: "Profesjonalne zarządzanie nieruchomościami",
      subtitle: "Gliwicka 111",
      description:
        "Kompleksowe rozwiązania biznesowe w centrum Tarnowskich Gór. Od biura wirtualnego po coworking - wszystko w jednym miejscu.",
      cta: "Zobacz naszą ofertę",
      contact: "Skontaktuj się",
      trustBadge: "Obsługujemy przedsiębiorców od 2024",
    },
    offer: {
      title: "Nasza oferta",
      subtitle: "Kompleksowe rozwiązania dla Twojego biznesu",
      description: "Wybierz usługę dopasowaną do Twoich potrzeb i rozwijaj biznes w profesjonalnym środowisku",
    },
    services: {
      virtualOffice: {
        title: "Biuro wirtualne",
        subtitle: "Prestiżowy adres od 99 zł/miesiąc",
        description: "Profesjonalny adres biznesowy z pełną obsługą korespondencji",
        benefits: [
          "Adres do rejestracji firmy",
          "Odbiór i przekazywanie korespondencji",
          "Powiadomienia SMS/email",
          "Możliwość spotkań w recepcji",
        ],
        targetCustomer: "Idealne dla freelancerów, firm online i startupów",
        useCase: "Firma IT z Katowic używa naszego adresu do rejestracji i odbioru dokumentów urzędowych",
        pricing: {
          basic: {
            name: "Podstawowy",
            price: "99 zł/miesiąc",
            features: ["Adres biznesowy", "Odbiór poczty", "Powiadomienia"],
          },
          standard: {
            name: "Standard",
            price: "149 zł/miesiąc",
            features: ["Wszystko z podstawowego", "Przekazywanie połączeń", "2h sali/miesiąc"],
          },
          premium: {
            name: "Premium",
            price: "249 zł/miesiąc",
            features: ["Wszystko ze standard", "Dedykowany telefon", "5h sali/miesiąc"],
          },
        },
      },
      coworking: {
        title: "Coworking i biura",
        subtitle: "Elastyczne przestrzenie od 25 zł/dzień",
        description: "Nowoczesne stanowiska pracy w inspirującym środowisku",
        benefits: [
          "Szybki internet i Wi-Fi",
          "Dostęp do sal konferencyjnych",
          "Kawa i herbata bez limitu",
          "Społeczność przedsiębiorców",
        ],
        targetCustomer: "Dla freelancerów, małych zespołów i firm w rozwoju",
        useCase: "Zespół marketingowy wynajmuje dedicated desk na 6 miesięcy podczas realizacji dużego projektu",
        pricing: {
          hotDesk: {
            name: "Hot Desk",
            price: "25 zł/dzień",
            features: ["Elastyczne miejsce", "Wi-Fi", "Kawa/herbata", "Sala konferencyjna"],
          },
          dedicatedDesk: {
            name: "Dedicated Desk",
            price: "350 zł/miesiąc",
            features: ["Stałe miejsce", "Szafka", "Wszystko z Hot Desk", "Personalizacja"],
          },
          privateOffice: {
            name: "Prywatne biuro",
            price: "800 zł/miesiąc",
            features: ["Zamknięte biuro", "Do 4 osób", "Własne wyposażenie", "Recepcja"],
          },
        },
      },
      meetingRooms: {
        title: "Sale spotkań / Wydarzenia",
        subtitle: "Profesjonalne sale od 30 zł/godzinę",
        description: "W pełni wyposażone sale konferencyjne z obsługą techniczną",
        benefits: ["Profesjonalny sprzęt AV", "Szybki internet", "Flipchart i projektor", "Możliwość cateringu"],
        targetCustomer: "Dla firm organizujących spotkania, szkolenia i prezentacje",
        useCase: "Kancelaria prawna organizuje comiesięczne spotkania partnerów w naszej sali średniej",
        pricing: {
          small: {
            name: "Sala mała (2-6 osób)",
            price: "30 zł/h",
            features: ["Projektor", "Flipchart", "Wi-Fi", "Klimatyzacja"],
          },
          medium: {
            name: "Sala średnia (6-12 osób)",
            price: "50 zł/h",
            features: ["Duży ekran", "System audio", "Telekonferencje", "Catering"],
          },
          large: {
            name: "Sala duża (12-20 osób)",
            price: "80 zł/h",
            features: ["Profesjonalny AV", "Streaming", "Tłumaczenia", "Obsługa"],
          },
          conference: {
            name: "Sala konferencyjna (20-50 osób)",
            price: "150 zł/h",
            features: ["Pełne wyposażenie", "Obsługa eventów", "Premium catering", "Parking VIP"],
          },
        },
      },
      advertising: {
        title: "Reklama zewnętrzna",
        subtitle: "Billboard mobilny od 350 zł/tydzień",
        description: "Skuteczna reklama mobilna docierająca do tysięcy potencjalnych klientów",
        benefits: [
          "Duża powierzchnia reklamowa 5m x 3m",
          "Mobilność - dotarcie do różnych lokalizacji",
          "Wysoka widoczność",
          "Elastyczne trasy",
        ],
        targetCustomer: "Dla firm chcących zwiększyć rozpoznawalność marki lokalnie",
        useCase: "Salon samochodowy promuje nowe modele podczas targów i eventów w regionie",
        pricing: {
          mobile: {
            name: "Billboard mobilny",
            price: "350 zł/tydzień",
            features: ["Przyczepa 5m x 3m", "Elastyczne trasy", "Wysoka widoczność", "Pełna obsługa"],
          },
          static: {
            name: "Billboard stacjonarny",
            price: "200 zł/tydzień",
            features: ["Stała lokalizacja", "24/7 widoczność", "Główna droga", "Długoterminowa ekspozycja"],
          },
          digital: {
            name: "Reklama cyfrowa",
            price: "500 zł/tydzień",
            features: ["Ekran LED", "Dynamiczne treści", "Pełny kolor", "Zdalne zarządzanie"],
          },
        },
      },
      specialDeals: {
        title: "Oferty specjalne",
        subtitle: "Promocje i rabaty do -50%",
        description: "Wyjątkowe oferty dla nowych klientów i długoterminowych partnerów",
        benefits: [
          "Pakiety powitalne z rabatem -30%",
          "Program poleceń -25%",
          "Oferta studencka -40%",
          "Umowy długoterminowe -50%",
        ],
        targetCustomer: "Dla wszystkich nowych klientów i firm planujących długoterminową współpracę",
        useCase: "Startup skorzystał z pakietu powitalnego i zaoszczędził 2000 zł w pierwszym roku",
        deals: {
          welcome: {
            name: "Pakiet powitalny",
            discount: "-30%",
            description: "Rabat dla nowych klientów na pierwsze 3 miesiące",
          },
          referral: { name: "Program poleceń", discount: "-25%", description: "Rabat za polecenie nowego klienta" },
          student: {
            name: "Oferta studencka",
            discount: "-40%",
            description: "Specjalne ceny dla studentów i absolwentów",
          },
          longTerm: {
            name: "Umowa długoterminowa",
            discount: "-50%",
            description: "Największe oszczędności przy umowach rocznych",
          },
        },
      },
    },
    testimonials: {
      title: "Opinie naszych klientów",
      subtitle: "Zobacz, co mówią o nas przedsiębiorcy",
      items: [
        {
          name: "Anna Kowalska",
          company: "Digital Marketing Pro",
          text: "Biuro wirtualne w Gliwicka 111 to strzał w dziesiątkę. Profesjonalna obsługa, szybkie przekazywanie korespondencji i świetna lokalizacja.",
          rating: 5,
        },
        {
          name: "Marcin Nowak",
          company: "Tech Solutions Sp. z o.o.",
          text: "Coworking idealny dla naszego zespołu. Świetna atmosfera, szybki internet i możliwość organizowania spotkań w salach konferencyjnych.",
          rating: 5,
        },
        {
          name: "Katarzyna Wiśniewska",
          company: "Legal Consulting",
          text: "Regularnie wynajmujemy sale konferencyjne. Profesjonalne wyposażenie, obsługa na najwyższym poziomie. Polecam!",
          rating: 5,
        },
      ],
    },
    cta: {
      title: "Gotowy na rozwój swojego biznesu?",
      subtitle: "Skontaktuj się z nami już dziś i skorzystaj z bezpłatnej konsultacji",
      freeConsultation: "Bezpłatna konsultacja",
      visitUs: "Odwiedź nas",
      freeDay: "Wypróbuj coworking za darmo",
    },
    faq: {
      title: "Często zadawane pytania",
      virtualOffice: {
        title: "Biuro wirtualne - FAQ",
        items: [
          {
            question: "Czy mogę zarejestrować firmę na Waszym adresie?",
            answer:
              "Tak, nasz adres można wykorzystać do rejestracji działalności gospodarczej i spółek. Zapewniamy wszystkie niezbędne dokumenty.",
          },
          {
            question: "Jak szybko otrzymam informację o korespondencji?",
            answer: "Powiadomienia wysyłamy natychmiast po otrzymaniu przesyłki - SMS i email w ciągu 15 minut.",
          },
          {
            question: "Czy mogę odbierać gości w recepcji?",
            answer:
              "Tak, recepcja jest dostępna w godzinach 8:00-18:00. Goście mogą czekać w wygodnej strefie oczekiwania.",
          },
        ],
      },
      coworking: {
        title: "Coworking - FAQ",
        items: [
          {
            question: "Czy mogę skorzystać z dnia próbnego?",
            answer:
              "Tak, oferujemy bezpłatny dzień próbny dla wszystkich nowych klientów. Wystarczy umówić się telefonicznie.",
          },
          {
            question: "Jakie są godziny dostępu?",
            answer: "Coworking jest dostępny 24/7 dla posiadaczy kart dostępu. Recepcja czynna 8:00-18:00.",
          },
          {
            question: "Czy mogę drukować dokumenty?",
            answer: "Tak, mamy drukarki, skanery i kserokopiarkę. Opłata według cennika - 0,50 zł za stronę A4.",
          },
        ],
      },
    },
    footer: {
      company: "Gliwicka 111",
      description: "Profesjonalne zarządzanie nieruchomościami i kompleksowe usługi biznesowe.",
      quickLinks: "Szybkie linki",
      services: "Usługi",
      contact: "Kontakt",
      legal: "Informacje prawne",
      privacy: "Polityka prywatności",
      terms: "Regulamin",
      rights: "Wszystkie prawa zastrzeżone.",
      workingHours: "Godziny pracy",
      mondayFriday: "Pon-Pt: 8:00-18:00",
      saturday: "Sob: 9:00-14:00",
      sunday: "Nie: zamknięte",
    },
  },
  en: {
    nav: {
      home: "Home",
      offer: "Our Offer",
      virtualOffice: "Virtual Office",
      coworking: "Coworking & Offices",
      meetingRooms: "Meeting Rooms",
      advertising: "Outdoor Advertising",
      specialDeals: "Special Deals",
      about: "About",
      contact: "Contact",
    },
    hero: {
      title: "Professional Property Management",
      subtitle: "Gliwicka 111",
      description:
        "Comprehensive business solutions in the center of Tarnowskie Góry. From virtual office to coworking - everything in one place.",
      cta: "View Our Offer",
      contact: "Contact Us",
      trustBadge: "Serving entrepreneurs since 2024",
    },
    offer: {
      title: "Our Offer",
      subtitle: "Comprehensive solutions for your business",
      description: "Choose a service tailored to your needs and grow your business in a professional environment",
    },
    services: {
      virtualOffice: {
        title: "Virtual Office",
        subtitle: "Prestigious address from 99 PLN/month",
        description: "Professional business address with full mail handling service",
        benefits: [
          "Company registration address",
          "Mail collection and forwarding",
          "SMS/email notifications",
          "Reception meeting possibility",
        ],
        targetCustomer: "Perfect for freelancers, online companies and startups",
        useCase: "IT company from Katowice uses our address for registration and official document collection",
        pricing: {
          basic: {
            name: "Basic",
            price: "99 PLN/month",
            features: ["Business address", "Mail collection", "Notifications"],
          },
          standard: {
            name: "Standard",
            price: "149 PLN/month",
            features: ["Everything from basic", "Call forwarding", "2h room/month"],
          },
          premium: {
            name: "Premium",
            price: "249 PLN/month",
            features: ["Everything from standard", "Dedicated phone", "5h room/month"],
          },
        },
      },
      coworking: {
        title: "Coworking & Offices",
        subtitle: "Flexible spaces from 25 PLN/day",
        description: "Modern workstations in an inspiring environment",
        benefits: [
          "High-speed internet and Wi-Fi",
          "Access to conference rooms",
          "Unlimited coffee and tea",
          "Entrepreneur community",
        ],
        targetCustomer: "For freelancers, small teams and growing companies",
        useCase: "Marketing team rents dedicated desk for 6 months during a major project implementation",
        pricing: {
          hotDesk: {
            name: "Hot Desk",
            price: "25 PLN/day",
            features: ["Flexible workspace", "Wi-Fi", "Coffee/tea", "Conference room"],
          },
          dedicatedDesk: {
            name: "Dedicated Desk",
            price: "350 PLN/month",
            features: ["Fixed workspace", "Locker", "Everything from Hot Desk", "Personalization"],
          },
          privateOffice: {
            name: "Private Office",
            price: "800 PLN/month",
            features: ["Closed office", "Up to 4 people", "Own equipment", "Reception"],
          },
        },
      },
      meetingRooms: {
        title: "Meeting Rooms / Events",
        subtitle: "Professional rooms from 30 PLN/hour",
        description: "Fully equipped conference rooms with technical support",
        benefits: [
          "Professional AV equipment",
          "High-speed internet",
          "Flipchart and projector",
          "Catering possibility",
        ],
        targetCustomer: "For companies organizing meetings, training and presentations",
        useCase: "Law firm organizes monthly partner meetings in our medium room",
        pricing: {
          small: {
            name: "Small room (2-6 people)",
            price: "30 PLN/h",
            features: ["Projector", "Flipchart", "Wi-Fi", "Air conditioning"],
          },
          medium: {
            name: "Medium room (6-12 people)",
            price: "50 PLN/h",
            features: ["Large screen", "Audio system", "Video conferencing", "Catering"],
          },
          large: {
            name: "Large room (12-20 people)",
            price: "80 PLN/h",
            features: ["Professional AV", "Streaming", "Translation", "Support"],
          },
          conference: {
            name: "Conference hall (20-50 people)",
            price: "150 PLN/h",
            features: ["Full equipment", "Event management", "Premium catering", "VIP parking"],
          },
        },
      },
      advertising: {
        title: "Outdoor Advertising",
        subtitle: "Mobile billboard from 350 PLN/week",
        description: "Effective mobile advertising reaching thousands of potential customers",
        benefits: [
          "Large advertising space 5m x 3m",
          "Mobility - reach different locations",
          "High visibility",
          "Flexible routes",
        ],
        targetCustomer: "For companies wanting to increase local brand recognition",
        useCase: "Car dealership promotes new models during fairs and events in the region",
        pricing: {
          mobile: {
            name: "Mobile billboard",
            price: "350 PLN/week",
            features: ["5m x 3m trailer", "Flexible routes", "High visibility", "Full service"],
          },
          static: {
            name: "Static billboard",
            price: "200 PLN/week",
            features: ["Fixed location", "24/7 visibility", "Main road", "Long-term exposure"],
          },
          digital: {
            name: "Digital advertising",
            price: "500 PLN/week",
            features: ["LED screen", "Dynamic content", "Full color", "Remote management"],
          },
        },
      },
      specialDeals: {
        title: "Special Deals",
        subtitle: "Promotions and discounts up to -50%",
        description: "Exceptional offers for new clients and long-term partners",
        benefits: [
          "Welcome packages with -30% discount",
          "Referral program -25%",
          "Student offer -40%",
          "Long-term contracts -50%",
        ],
        targetCustomer: "For all new clients and companies planning long-term cooperation",
        useCase: "Startup used welcome package and saved 2000 PLN in the first year",
        deals: {
          welcome: {
            name: "Welcome package",
            discount: "-30%",
            description: "Discount for new clients for the first 3 months",
          },
          referral: { name: "Referral program", discount: "-25%", description: "Discount for referring a new client" },
          student: {
            name: "Student offer",
            discount: "-40%",
            description: "Special prices for students and graduates",
          },
          longTerm: {
            name: "Long-term contract",
            discount: "-50%",
            description: "Biggest savings with annual contracts",
          },
        },
      },
    },
    testimonials: {
      title: "Customer Reviews",
      subtitle: "See what entrepreneurs say about us",
      items: [
        {
          name: "Anna Kowalska",
          company: "Digital Marketing Pro",
          text: "Virtual office at Gliwicka 111 is a bullseye. Professional service, quick mail forwarding and great location.",
          rating: 5,
        },
        {
          name: "Marcin Nowak",
          company: "Tech Solutions Ltd.",
          text: "Coworking perfect for our team. Great atmosphere, fast internet and possibility to organize meetings in conference rooms.",
          rating: 5,
        },
        {
          name: "Katarzyna Wiśniewska",
          company: "Legal Consulting",
          text: "We regularly rent conference rooms. Professional equipment, top-level service. I recommend!",
          rating: 5,
        },
      ],
    },
    cta: {
      title: "Ready to grow your business?",
      subtitle: "Contact us today and take advantage of a free consultation",
      freeConsultation: "Free Consultation",
      visitUs: "Visit Us",
      freeDay: "Try coworking for free",
    },
    faq: {
      title: "Frequently Asked Questions",
      virtualOffice: {
        title: "Virtual Office - FAQ",
        items: [
          {
            question: "Can I register my company at your address?",
            answer:
              "Yes, our address can be used for business registration and companies. We provide all necessary documents.",
          },
          {
            question: "How quickly will I receive information about correspondence?",
            answer: "We send notifications immediately after receiving mail - SMS and email within 15 minutes.",
          },
          {
            question: "Can I receive guests at the reception?",
            answer: "Yes, reception is available from 8:00-18:00. Guests can wait in the comfortable waiting area.",
          },
        ],
      },
      coworking: {
        title: "Coworking - FAQ",
        items: [
          {
            question: "Can I use a trial day?",
            answer: "Yes, we offer a free trial day for all new clients. Just make an appointment by phone.",
          },
          {
            question: "What are the access hours?",
            answer: "Coworking is available 24/7 for access card holders. Reception open 8:00-18:00.",
          },
          {
            question: "Can I print documents?",
            answer:
              "Yes, we have printers, scanners and photocopier. Fee according to price list - 0.50 PLN per A4 page.",
          },
        ],
      },
    },
    footer: {
      company: "Gliwicka 111",
      description: "Professional property management and comprehensive business services.",
      quickLinks: "Quick Links",
      services: "Services",
      contact: "Contact",
      legal: "Legal Information",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved.",
      workingHours: "Working Hours",
      mondayFriday: "Mon-Fri: 8:00-18:00",
      saturday: "Sat: 9:00-14:00",
      sunday: "Sun: closed",
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

  const ServiceCard = ({ service, icon: Icon, href }: { service: any; icon: any; href: string }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-200">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-teal-600" />
        </div>
        <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
        <Badge variant="secondary" className="mx-auto">
          {service.subtitle}
        </Badge>
        <CardDescription className="mt-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm text-gray-700">
            {language === "pl" ? "Kluczowe korzyści:" : "Key benefits:"}
          </h4>
          <ul className="space-y-1">
            {service.benefits.slice(0, 3).map((benefit: string, index: number) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600 mb-3">
            <strong>{language === "pl" ? "Dla kogo:" : "Target:"}</strong> {service.targetCustomer}
          </p>
          <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
            <Link href={href}>
              {language === "pl" ? "Zobacz szczegóły" : "View Details"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const PricingCard = ({ plan, isPopular = false }: { plan: any; isPopular?: boolean }) => (
    <Card className={`relative ${isPopular ? "border-2 border-teal-500 shadow-lg" : ""}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-teal-600 text-white px-4 py-1">
            {language === "pl" ? "Najpopularniejszy" : "Most Popular"}
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-teal-600">{plan.price}</div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

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
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                {t.nav.home}
              </Link>
              <div className="relative group">
                <button className="text-slate-700 hover:text-teal-600 font-medium transition-colors flex items-center">
                  {t.nav.offer}
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:rotate-90 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link
                      href="#virtual-office"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded"
                    >
                      {t.nav.virtualOffice}
                    </Link>
                    <Link
                      href="#coworking"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded"
                    >
                      {t.nav.coworking}
                    </Link>
                    <Link
                      href="#meeting-rooms"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded"
                    >
                      {t.nav.meetingRooms}
                    </Link>
                    <Link
                      href="#advertising"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded"
                    >
                      {t.nav.advertising}
                    </Link>
                    <Link
                      href="#special-deals"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded"
                    >
                      {t.nav.specialDeals}
                    </Link>
                  </div>
                </div>
              </div>
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
            <div className="lg:hidden flex items-center space-x-2">
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
            <div className="lg:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-slate-700 hover:text-teal-600 font-medium">
                  {t.nav.home}
                </Link>
                <Link href="#virtual-office" className="text-slate-700 hover:text-teal-600 font-medium pl-4">
                  {t.nav.virtualOffice}
                </Link>
                <Link href="#coworking" className="text-slate-700 hover:text-teal-600 font-medium pl-4">
                  {t.nav.coworking}
                </Link>
                <Link href="#meeting-rooms" className="text-slate-700 hover:text-teal-600 font-medium pl-4">
                  {t.nav.meetingRooms}
                </Link>
                <Link href="#advertising" className="text-slate-700 hover:text-teal-600 font-medium pl-4">
                  {t.nav.advertising}
                </Link>
                <Link href="#special-deals" className="text-slate-700 hover:text-teal-600 font-medium pl-4">
                  {t.nav.specialDeals}
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
              <div className="flex items-center mb-4">
                <Badge variant="outline" className="mr-3">
                  <Award className="w-3 h-3 mr-1" />
                  {t.hero.trustBadge}
                </Badge>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">{t.hero.title}</h2>
              <h3 className="text-2xl lg:text-3xl font-semibold text-teal-600 mb-6">{t.hero.subtitle}</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">{t.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Link href="#offer">
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
                  src="/placeholder.svg?height=500&width=500&text=Gliwicka+111+Building"
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

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center text-white">
            <Gift className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {language === "pl"
                ? "🎉 Pakiet powitalny -30% dla nowych klientów! Bezpłatna konsultacja i dzień próbny coworkingu!"
                : "🎉 Welcome package -30% for new clients! Free consultation and coworking trial day!"}
            </span>
          </div>
        </div>
      </section>

      {/* Our Offer Section */}
      <section id="offer" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.offer.title}</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">{t.offer.subtitle}</p>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.offer.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard service={t.services.virtualOffice} icon={MapPin} href="#virtual-office" />
            <ServiceCard service={t.services.coworking} icon={Users} href="#coworking" />
            <ServiceCard service={t.services.meetingRooms} icon={Calendar} href="#meeting-rooms" />
            <ServiceCard service={t.services.advertising} icon={Megaphone} href="#advertising" />
            <div className="md:col-span-2 lg:col-span-1">
              <ServiceCard service={t.services.specialDeals} icon={Gift} href="#special-deals" />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Office Section */}
      <section id="virtual-office" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{t.services.virtualOffice.title}</h2>
                  <p className="text-blue-600 font-medium">{t.services.virtualOffice.subtitle}</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">{t.services.virtualOffice.description}</p>

              <div className="space-y-4 mb-6">
                {t.services.virtualOffice.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">{language === "pl" ? "Przykład użycia:" : "Use Case Example:"}</h4>
                <p className="text-sm text-slate-700">{t.services.virtualOffice.useCase}</p>
              </div>

              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  {language === "pl" ? "Zamów biuro wirtualne" : "Order Virtual Office"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Virtual+Office"
                  alt="Virtual Office"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Virtual Office Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard plan={t.services.virtualOffice.pricing.basic} />
            <PricingCard plan={t.services.virtualOffice.pricing.standard} isPopular={true} />
            <PricingCard plan={t.services.virtualOffice.pricing.premium} />
          </div>
        </div>
      </section>

      {/* Coworking Section */}
      <section id="coworking" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Coworking+Space"
                  alt="Coworking Space"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{t.services.coworking.title}</h2>
                  <p className="text-green-600 font-medium">{t.services.coworking.subtitle}</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">{t.services.coworking.description}</p>

              <div className="space-y-4 mb-6">
                {t.services.coworking.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">{language === "pl" ? "Przykład użycia:" : "Use Case Example:"}</h4>
                <p className="text-sm text-slate-700">{t.services.coworking.useCase}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/contact">
                    {language === "pl" ? "Zarezerwuj miejsce" : "Book Workspace"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">{t.cta.freeDay}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Coworking Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard plan={t.services.coworking.pricing.hotDesk} />
            <PricingCard plan={t.services.coworking.pricing.dedicatedDesk} isPopular={true} />
            <PricingCard plan={t.services.coworking.pricing.privateOffice} />
          </div>
        </div>
      </section>

      {/* Meeting Rooms Section */}
      <section id="meeting-rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{t.services.meetingRooms.title}</h2>
                  <p className="text-purple-600 font-medium">{t.services.meetingRooms.subtitle}</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">{t.services.meetingRooms.description}</p>

              <div className="space-y-4 mb-6">
                {t.services.meetingRooms.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">{language === "pl" ? "Przykład użycia:" : "Use Case Example:"}</h4>
                <p className="text-sm text-slate-700">{t.services.meetingRooms.useCase}</p>
              </div>

              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/contact">
                  {language === "pl" ? "Zarezerwuj salę" : "Book Room"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Meeting+Room"
                  alt="Meeting Room"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Meeting Rooms Pricing */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PricingCard plan={t.services.meetingRooms.pricing.small} />
            <PricingCard plan={t.services.meetingRooms.pricing.medium} isPopular={true} />
            <PricingCard plan={t.services.meetingRooms.pricing.large} />
            <PricingCard plan={t.services.meetingRooms.pricing.conference} />
          </div>
        </div>
      </section>

      {/* Advertising Section */}
      <section id="advertising" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Mobile+Billboard"
                  alt="Mobile Billboard"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <Megaphone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{t.services.advertising.title}</h2>
                  <p className="text-orange-600 font-medium">{t.services.advertising.subtitle}</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">{t.services.advertising.description}</p>

              <div className="space-y-4 mb-6">
                {t.services.advertising.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">{language === "pl" ? "Przykład użycia:" : "Use Case Example:"}</h4>
                <p className="text-sm text-slate-700">{t.services.advertising.useCase}</p>
              </div>

              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/contact">
                  {language === "pl" ? "Zamów kampanię" : "Order Campaign"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Advertising Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard plan={t.services.advertising.pricing.mobile} isPopular={true} />
            <PricingCard plan={t.services.advertising.pricing.static} />
            <PricingCard plan={t.services.advertising.pricing.digital} />
          </div>
        </div>
      </section>

      {/* Special Deals Section */}
      <section id="special-deals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Gift className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{t.services.specialDeals.title}</h2>
                <p className="text-red-600 font-medium">{t.services.specialDeals.subtitle}</p>
              </div>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">{t.services.specialDeals.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(t.services.specialDeals.deals).map(([key, deal]: [string, any]) => (
              <Card key={key} className="relative border-2 border-red-200 hover:border-red-300 transition-colors">
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-red-600 text-white px-3 py-1 text-lg font-bold">{deal.discount}</Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">{deal.name}</CardTitle>
                  <CardDescription className="text-sm">{deal.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold mb-2">{language === "pl" ? "Przykład oszczędności:" : "Savings Example:"}</h4>
            <p className="text-slate-700">{t.services.specialDeals.useCase}</p>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/contact">
                {language === "pl" ? "Sprawdź oferty specjalne" : "Check Special Offers"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.testimonials.title}</h2>
            <p className="text-lg text-slate-600">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.faq.title}</h2>
          </div>

          <Tabs defaultValue="virtual-office" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="virtual-office">{t.nav.virtualOffice}</TabsTrigger>
              <TabsTrigger value="coworking">{t.nav.coworking}</TabsTrigger>
            </TabsList>

            <TabsContent value="virtual-office" className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">{t.faq.virtualOffice.title}</h3>
              {t.faq.virtualOffice.items.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-slate-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="coworking" className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">{t.faq.coworking.title}</h3>
              {t.faq.coworking.items.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-slate-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                {t.cta.freeConsultation}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              <Link href="/contact">
                <MapPin className="w-4 h-4 mr-2" />
                {t.cta.visitUs}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              <Link href="/contact">
                <Users className="w-4 h-4 mr-2" />
                {t.cta.freeDay}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
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

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.services}</h4>
              <nav className="space-y-2">
                <Link href="#virtual-office" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.virtualOffice}
                </Link>
                <Link href="#coworking" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.coworking}
                </Link>
                <Link href="#meeting-rooms" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.meetingRooms}
                </Link>
                <Link href="#advertising" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.advertising}
                </Link>
                <Link href="#special-deals" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.specialDeals}
                </Link>
              </nav>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h4>
              <nav className="space-y-2">
                <Link href="/" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
                <Link href="/about" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.about}
                </Link>
                <Link href="/contact" className="block text-slate-400 hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
                <Link href="/forms" className="block text-slate-400 hover:text-white transition-colors">
                  {language === "pl" ? "Formularze" : "Forms"}
                </Link>
              </nav>
            </div>

            {/* Working Hours & Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.workingHours}</h4>
              <div className="space-y-2 text-slate-400 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t.footer.mondayFriday}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t.footer.saturday}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t.footer.sunday}</span>
                </div>
              </div>

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
