"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
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
  Shield,
  Zap,
  Target,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { ConsentBanner } from "@/components/analytics";
import Link from "next/link";
import Image from "next/image";
import PageNav from "@/components/page-nav";
import { navTranslations } from "@/lib/i18n";

const translations = {
  pl: {
    nav: {
      ...navTranslations.pl,
      offer: "Nasza oferta",
      virtualOffice: "Biuro wirtualne",
      coworking: "Coworking i biura",
      meetingRooms: "Sale spotkań",
      advertising: "Reklama zewnętrzna",
      specialDeals: "Oferty specjalne",
    },
    hero: {
      title: "Profesjonalne zarządzanie nieruchomościami",
      subtitle: "Gliwicka 111",
      description:
        "Kompleksowe rozwiązania biznesowe w centrum Tarnowskich Gór. Od biura wirtualnego po coworking - wszystko w jednym miejscu.",
      cta: "Zobacz naszą ofertę",
      contact: "Skontaktuj się",
      trustBadge: "Obsługujemy przedsiębiorców od 2024",
      stats: {
        clients: "150+ zadowolonych klientów",
        spaces: "5 różnych przestrzeni",
        support: "24/7 wsparcie techniczne",
      },
    },
    offer: {
      title: "Nasza oferta",
      subtitle: "Kompleksowe rozwiązania dla Twojego biznesu",
      description:
        "Wybierz usługę dopasowaną do Twoich potrzeb i rozwijaj biznes w profesjonalnym środowisku",
    },
    services: {
      virtualOffice: {
        title: "Biuro wirtualne",
        subtitle: "Prestiżowy adres od 99 zł/miesiąc",
        description:
          "Profesjonalny adres biznesowy z pełną obsługą korespondencji",
        benefits: [
          "Adres do rejestracji firmy",
          "Odbiór i przekazywanie korespondencji",
          "Powiadomienia SMS/email w czasie rzeczywistym",
          "Możliwość spotkań w recepcji",
          "Skanowanie dokumentów na żądanie",
          "Profesjonalna obsługa telefoniczna",
        ],
        targetCustomer: "Idealne dla freelancerów, firm online i startupów",
        useCase:
          "Firma IT z Katowic używa naszego adresu do rejestracji i odbioru dokumentów urzędowych",
        pricing: {
          basic: {
            name: "Podstawowy",
            price: "99 zł/miesiąc",
            originalPrice: "129 zł",
            features: [
              "Adres biznesowy",
              "Odbiór poczty",
              "Powiadomienia SMS/email",
              "Recepcja 8-18",
            ],
            popular: false,
          },
          standard: {
            name: "Standard",
            price: "149 zł/miesiąc",
            originalPrice: "199 zł",
            features: [
              "Wszystko z podstawowego",
              "Przekazywanie połączeń",
              "2h sali konferencyjnej/miesiąc",
              "Skanowanie dokumentów",
            ],
            popular: true,
          },
          premium: {
            name: "Premium",
            price: "249 zł/miesiąc",
            originalPrice: "329 zł",
            features: [
              "Wszystko ze standard",
              "Dedykowany numer telefonu",
              "5h sali konferencyjnej/miesiąc",
              "Obsługa sekretarska",
              "Magazynowanie dokumentów",
            ],
            popular: false,
          },
        },
      },
      coworking: {
        title: "Coworking i biura",
        subtitle: "Elastyczne przestrzenie od 25 zł/dzień",
        description: "Nowoczesne stanowiska pracy w inspirującym środowisku",
        benefits: [
          "Szybki internet 1Gb/s i Wi-Fi",
          "Dostęp do sal konferencyjnych",
          "Kawa, herbata i przekąski bez limitu",
          "Społeczność 150+ przedsiębiorców",
          "Drukarki i skanery",
          "Dostęp 24/7 z kartą",
        ],
        targetCustomer: "Dla freelancerów, małych zespołów i firm w rozwoju",
        useCase:
          "Zespół marketingowy wynajmuje dedicated desk na 6 miesięcy podczas realizacji dużego projektu",
        pricing: {
          hotDesk: {
            name: "Hot Desk",
            price: "25 zł/dzień",
            monthlyPrice: "450 zł/miesiąc",
            features: [
              "Elastyczne miejsce",
              "Wi-Fi 1Gb/s",
              "Kawa/herbata",
              "Sala konferencyjna",
              "Drukarki",
            ],
            popular: false,
          },
          dedicatedDesk: {
            name: "Dedicated Desk",
            price: "350 zł/miesiąc",
            originalPrice: "450 zł",
            features: [
              "Stałe miejsce pracy",
              "Szafka na dokumenty",
              "Wszystko z Hot Desk",
              "Personalizacja przestrzeni",
              "Monitor na życzenie",
            ],
            popular: true,
          },
          privateOffice: {
            name: "Prywatne biuro",
            price: "800 zł/miesiąc",
            originalPrice: "1000 zł",
            features: [
              "Zamknięte biuro do 4 osób",
              "Własne wyposażenie",
              "Wszystko z Dedicated Desk",
              "Recepcja i obsługa",
              "Parking dedykowany",
            ],
            popular: false,
          },
        },
      },
      meetingRooms: {
        title: "Sale spotkań / Wydarzenia",
        subtitle: "Profesjonalne sale od 30 zł/godzinę",
        description:
          "W pełni wyposażone sale konferencyjne z obsługą techniczną",
        benefits: [
          "Profesjonalny sprzęt AV 4K",
          "Szybki internet i Wi-Fi",
          "Flipchart i projektor",
          "Możliwość cateringu premium",
          "Obsługa techniczna",
          "Klimatyzacja i oświetlenie LED",
        ],
        targetCustomer:
          "Dla firm organizujących spotkania, szkolenia i prezentacje",
        useCase:
          "Kancelaria prawna organizuje comiesięczne spotkania partnerów w naszej sali średniej",
        pricing: {
          small: {
            name: "Sala mała (2-6 osób)",
            price: "30 zł/h",
            dayPrice: "200 zł/dzień",
            features: [
              "Projektor 4K",
              "Flipchart",
              "Wi-Fi",
              "Klimatyzacja",
              "Kawa/herbata",
            ],
            popular: false,
          },
          medium: {
            name: "Sala średnia (6-12 osób)",
            price: "50 zł/h",
            dayPrice: "350 zł/dzień",
            features: [
              'Duży ekran 65"',
              "System audio",
              "Telekonferencje",
              "Catering",
              "Tablica interaktywna",
            ],
            popular: true,
          },
          large: {
            name: "Sala duża (12-20 osób)",
            price: "80 zł/h",
            dayPrice: "550 zł/dzień",
            features: [
              "Profesjonalny AV",
              "Streaming HD",
              "Tłumaczenia symultaniczne",
              "Obsługa techniczna",
              "Premium catering",
            ],
            popular: false,
          },
          conference: {
            name: "Sala konferencyjna (20-50 osób)",
            price: "150 zł/h",
            dayPrice: "1000 zł/dzień",
            features: [
              "Pełne wyposażenie AV",
              "Obsługa eventów",
              "Premium catering",
              "Parking VIP",
              "Hostessa",
            ],
            popular: false,
          },
        },
      },
      advertising: {
        title: "Reklama zewnętrzna",
        subtitle: "Billboard mobilny od 350 zł/tydzień",
        description:
          "Skuteczna reklama mobilna docierająca do tysięcy potencjalnych klientów",
        benefits: [
          "Duża powierzchnia reklamowa 5m x 3m",
          "Mobilność - dotarcie do różnych lokalizacji",
          "Wysoka widoczność w ruchu miejskim",
          "Elastyczne trasy i harmonogramy",
          "Profesjonalny montaż reklam",
          "Raportowanie tras GPS",
        ],
        targetCustomer:
          "Dla firm chcących zwiększyć rozpoznawalność marki lokalnie",
        useCase:
          "Salon samochodowy promuje nowe modele podczas targów i eventów w regionie",
        pricing: {
          mobile: {
            name: "Billboard mobilny",
            price: "350 zł/tydzień",
            monthlyPrice: "1200 zł/miesiąc",
            features: [
              "Przyczepa 5m x 3m",
              "Elastyczne trasy",
              "Wysoka widoczność",
              "Pełna obsługa",
              "Raportowanie GPS",
            ],
            popular: true,
          },
          static: {
            name: "Billboard stacjonarny",
            price: "200 zł/tydzień",
            monthlyPrice: "700 zł/miesiąc",
            features: [
              "Stała lokalizacja",
              "24/7 widoczność",
              "Główna droga",
              "Długoterminowa ekspozycja",
              "Oświetlenie LED",
            ],
            popular: false,
          },
          digital: {
            name: "Reklama cyfrowa",
            price: "500 zł/tydzień",
            monthlyPrice: "1800 zł/miesiąc",
            features: [
              "Ekran LED Full HD",
              "Dynamiczne treści",
              "Pełny kolor",
              "Zdalne zarządzanie",
              "Animacje i video",
            ],
            popular: false,
          },
        },
      },
      specialDeals: {
        title: "Oferty specjalne",
        subtitle: "Promocje i rabaty do -50%",
        description:
          "Wyjątkowe oferty dla nowych klientów i długoterminowych partnerów",
        benefits: [
          "Pakiety powitalne z rabatem -30%",
          "Program poleceń -25%",
          "Oferta studencka -40%",
          "Umowy długoterminowe -50%",
          "Bezpłatny dzień próbny",
          "Elastyczne warunki płatności",
        ],
        targetCustomer:
          "Dla wszystkich nowych klientów i firm planujących długoterminową współpracę",
        useCase:
          "Startup skorzystał z pakietu powitalnego i zaoszczędził 2000 zł w pierwszym roku",
        deals: {
          welcome: {
            name: "Pakiet powitalny",
            discount: "-30%",
            description: "Rabat dla nowych klientów na pierwsze 3 miesiące",
            validUntil: "31.03.2024",
          },
          referral: {
            name: "Program poleceń",
            discount: "-25%",
            description: "Rabat za polecenie nowego klienta + bonus 200 zł",
            validUntil: "Stała oferta",
          },
          student: {
            name: "Oferta studencka",
            discount: "-40%",
            description: "Specjalne ceny dla studentów i absolwentów",
            validUntil: "30.06.2024",
          },
          longTerm: {
            name: "Umowa długoterminowa",
            discount: "-50%",
            description: "Największe oszczędności przy umowach rocznych",
            validUntil: "Stała oferta",
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
          position: "CEO & Founder",
          text: "Biuro wirtualne w Gliwicka 111 to strzał w dziesiątkę. Profesjonalna obsługa, szybkie przekazywanie korespondencji i świetna lokalizacja. Oszczędzam 3000 zł miesięcznie w porównaniu do wynajmu tradycyjnego biura.",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
        {
          name: "Marcin Nowak",
          company: "Tech Solutions Sp. z o.o.",
          position: "CTO",
          text: "Coworking idealny dla naszego zespołu. Świetna atmosfera, szybki internet 1Gb/s i możliwość organizowania spotkań w salach konferencyjnych. Nasz zespół jest bardziej produktywny niż kiedykolwiek.",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
        {
          name: "Katarzyna Wiśniewska",
          company: "Legal Consulting",
          position: "Partner",
          text: "Regularnie wynajmujemy sale konferencyjne. Profesjonalne wyposażenie, obsługa na najwyższym poziomie. Nasi klienci są pod wrażeniem jakości i standardu sal. Polecam każdemu prawnikowi!",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
      ],
    },
    stats: {
      title: "Gliwicka 111 w liczbach",
      items: [
        { number: "150+", label: "Zadowolonych klientów", icon: Users },
        { number: "99.9%", label: "Dostępność usług", icon: Zap },
        { number: "24/7", label: "Wsparcie techniczne", icon: Shield },
        { number: "5", label: "Różnych przestrzeni", icon: Building2 },
      ],
    },
    cta: {
      title: "Gotowy na rozwój swojego biznesu?",
      subtitle:
        "Skontaktuj się z nami już dziś i skorzystaj z bezpłatnej konsultacji",
      freeConsultation: "Bezpłatna konsultacja",
      visitUs: "Odwiedź nas",
      freeDay: "Wypróbuj coworking za darmo",
      bookTour: "Umów wizytę",
    },
    faq: {
      title: "Często zadawane pytania",
      virtualOffice: {
        title: "Biuro wirtualne - FAQ",
        items: [
          {
            question: "Czy mogę zarejestrować firmę na Waszym adresie?",
            answer:
              "Tak, nasz adres można wykorzystać do rejestracji działalności gospodarczej i spółek. Zapewniamy wszystkie niezbędne dokumenty i potwierdzenia wymagane przez KRS i CEIDG.",
          },
          {
            question: "Jak szybko otrzymam informację o korespondencji?",
            answer:
              "Powiadomienia wysyłamy natychmiast po otrzymaniu przesyłki - SMS i email w ciągu 15 minut. Dodatkowo oferujemy skanowanie ważnych dokumentów i przesyłanie ich drogą elektroniczną.",
          },
          {
            question: "Czy mogę odbierać gości w recepcji?",
            answer:
              "Tak, recepcja jest dostępna w godzinach 8:00-18:00. Goście mogą czekać w wygodnej strefie oczekiwania. Oferujemy również obsługę spotkań biznesowych w naszych salach konferencyjnych.",
          },
          {
            question:
              "Jakie dokumenty potrzebuję do założenia biura wirtualnego?",
            answer:
              "Potrzebujesz tylko dowodu osobistego i wypełnionej umowy. Proces zajmuje maksymalnie 24 godziny, a adres jest dostępny natychmiast po podpisaniu umowy.",
          },
        ],
      },
      coworking: {
        title: "Coworking - FAQ",
        items: [
          {
            question: "Czy mogę skorzystać z dnia próbnego?",
            answer:
              "Tak, oferujemy bezpłatny dzień próbny dla wszystkich nowych klientów. Wystarczy umówić się telefonicznie lub przez formularz online. Dzień próbny obejmuje dostęp do wszystkich udogodnień.",
          },
          {
            question: "Jakie są godziny dostępu?",
            answer:
              "Coworking jest dostępny 24/7 dla posiadaczy kart dostępu. Recepcja czynna 8:00-18:00. Po godzinach dostęp przez kartę magnetyczną z systemem bezpieczeństwa.",
          },
          {
            question: "Czy mogę drukować dokumenty?",
            answer:
              "Tak, mamy drukarki laserowe, skanery i kserokopiarkę. Opłata według cennika - 0,50 zł za stronę A4 czarno-białą, 2 zł za kolorową. Pierwsze 50 stron miesięcznie gratis dla stałych klientów.",
          },
          {
            question: "Czy jest możliwość parkowania?",
            answer:
              "Tak, mamy bezpłatny parking dla klientów coworkingu. Dodatkowo oferujemy miejsca parkingowe z ładowarkami do samochodów elektrycznych.",
          },
        ],
      },
    },
    partnerships: {
      title: "Nasi partnerzy biznesowi",
      subtitle: "Współpracujemy z najlepszymi firmami w regionie",
      items: [
        {
          name: "Kancelaria Prawna Kowalski & Partnerzy",
          service: "Obsługa prawna",
          discount: "15% rabatu dla klientów Gliwicka 111",
        },
        {
          name: "Biuro Rachunkowe ProFin",
          service: "Księgowość i podatki",
          discount: "20% rabatu na pierwsze 6 miesięcy",
        },
        {
          name: "Agencja Rekrutacyjna TalentHub",
          service: "Rekrutacja IT i biznes",
          discount: "Bezpłatna konsultacja + 10% rabatu",
        },
      ],
    },
    footer: {
      company: "Gliwicka 111",
      description:
        "Profesjonalne zarządzanie nieruchomościami i kompleksowe usługi biznesowe.",
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
      emergency: "Kontakt awaryjny: +48 791 554 674",
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
      properties: "Properties",
    },
    hero: {
      title: "Professional Property Management",
      subtitle: "Gliwicka 111",
      description:
        "Comprehensive business solutions in the center of Tarnowskie Góry. From virtual office to coworking - everything in one place.",
      cta: "View Our Offer",
      contact: "Contact Us",
      trustBadge: "Serving entrepreneurs since 2024",
      stats: {
        clients: "150+ satisfied clients",
        spaces: "5 different spaces",
        support: "24/7 technical support",
      },
    },
    offer: {
      title: "Our Offer",
      subtitle: "Comprehensive solutions for your business",
      description:
        "Choose a service tailored to your needs and grow your business in a professional environment",
    },
    services: {
      virtualOffice: {
        title: "Virtual Office",
        subtitle: "Prestigious address from 99 PLN/month",
        description:
          "Professional business address with full mail handling service",
        benefits: [
          "Company registration address",
          "Mail collection and forwarding",
          "Real-time SMS/email notifications",
          "Reception meeting possibility",
          "Document scanning on demand",
          "Professional phone service",
        ],
        targetCustomer:
          "Perfect for freelancers, online companies and startups",
        useCase:
          "IT company from Katowice uses our address for registration and official document collection",
        pricing: {
          basic: {
            name: "Basic",
            price: "99 PLN/month",
            originalPrice: "129 PLN",
            features: [
              "Business address",
              "Mail collection",
              "SMS/email notifications",
              "Reception 8-18",
            ],
            popular: false,
          },
          standard: {
            name: "Standard",
            price: "149 PLN/month",
            originalPrice: "199 PLN",
            features: [
              "Everything from basic",
              "Call forwarding",
              "2h conference room/month",
              "Document scanning",
            ],
            popular: true,
          },
          premium: {
            name: "Premium",
            price: "249 PLN/month",
            originalPrice: "329 PLN",
            features: [
              "Everything from standard",
              "Dedicated phone number",
              "5h conference room/month",
              "Secretary service",
              "Document storage",
            ],
            popular: false,
          },
        },
      },
      coworking: {
        title: "Coworking & Offices",
        subtitle: "Flexible spaces from 25 PLN/day",
        description: "Modern workstations in an inspiring environment",
        benefits: [
          "High-speed 1Gb/s internet and Wi-Fi",
          "Access to conference rooms",
          "Unlimited coffee, tea and snacks",
          "Community of 150+ entrepreneurs",
          "Printers and scanners",
          "24/7 access with card",
        ],
        targetCustomer: "For freelancers, small teams and growing companies",
        useCase:
          "Marketing team rents dedicated desk for 6 months during a major project implementation",
        pricing: {
          hotDesk: {
            name: "Hot Desk",
            price: "25 PLN/day",
            monthlyPrice: "450 PLN/month",
            features: [
              "Flexible workspace",
              "1Gb/s Wi-Fi",
              "Coffee/tea",
              "Conference room",
              "Printers",
            ],
            popular: false,
          },
          dedicatedDesk: {
            name: "Dedicated Desk",
            price: "350 PLN/month",
            originalPrice: "450 PLN",
            features: [
              "Fixed workspace",
              "Document locker",
              "Everything from Hot Desk",
              "Space personalization",
              "Monitor on request",
            ],
            popular: true,
          },
          privateOffice: {
            name: "Private Office",
            price: "800 PLN/month",
            originalPrice: "1000 PLN",
            features: [
              "Closed office for up to 4 people",
              "Own equipment",
              "Everything from Dedicated Desk",
              "Reception and service",
              "Dedicated parking",
            ],
            popular: false,
          },
        },
      },
      meetingRooms: {
        title: "Meeting Rooms / Events",
        subtitle: "Professional rooms from 30 PLN/hour",
        description: "Fully equipped conference rooms with technical support",
        benefits: [
          "Professional 4K AV equipment",
          "High-speed internet and Wi-Fi",
          "Flipchart and projector",
          "Premium catering possibility",
          "Technical support",
          "Air conditioning and LED lighting",
        ],
        targetCustomer:
          "For companies organizing meetings, training and presentations",
        useCase:
          "Law firm organizes monthly partner meetings in our medium room",
        pricing: {
          small: {
            name: "Small room (2-6 people)",
            price: "30 PLN/h",
            dayPrice: "200 PLN/day",
            features: [
              "4K Projector",
              "Flipchart",
              "Wi-Fi",
              "Air conditioning",
              "Coffee/tea",
            ],
            popular: false,
          },
          medium: {
            name: "Medium room (6-12 people)",
            price: "50 PLN/h",
            dayPrice: "350 PLN/day",
            features: [
              '65" Large screen',
              "Audio system",
              "Video conferencing",
              "Catering",
              "Interactive board",
            ],
            popular: true,
          },
          large: {
            name: "Large room (12-20 people)",
            price: "80 PLN/h",
            dayPrice: "550 PLN/day",
            features: [
              "Professional AV",
              "HD Streaming",
              "Simultaneous translation",
              "Technical support",
              "Premium catering",
            ],
            popular: false,
          },
          conference: {
            name: "Conference hall (20-50 people)",
            price: "150 PLN/h",
            dayPrice: "1000 PLN/day",
            features: [
              "Full AV equipment",
              "Event management",
              "Premium catering",
              "VIP parking",
              "Hostess",
            ],
            popular: false,
          },
        },
      },
      advertising: {
        title: "Outdoor Advertising",
        subtitle: "Mobile billboard from 350 PLN/week",
        description:
          "Effective mobile advertising reaching thousands of potential customers",
        benefits: [
          "Large advertising space 5m x 3m",
          "Mobility - reach different locations",
          "High visibility in city traffic",
          "Flexible routes and schedules",
          "Professional ad installation",
          "GPS route reporting",
        ],
        targetCustomer:
          "For companies wanting to increase local brand recognition",
        useCase:
          "Car dealership promotes new models during fairs and events in the region",
        pricing: {
          mobile: {
            name: "Mobile billboard",
            price: "350 PLN/week",
            monthlyPrice: "1200 PLN/month",
            features: [
              "5m x 3m trailer",
              "Flexible routes",
              "High visibility",
              "Full service",
              "GPS reporting",
            ],
            popular: true,
          },
          static: {
            name: "Static billboard",
            price: "200 PLN/week",
            monthlyPrice: "700 PLN/month",
            features: [
              "Fixed location",
              "24/7 visibility",
              "Main road",
              "Long-term exposure",
              "LED lighting",
            ],
            popular: false,
          },
          digital: {
            name: "Digital advertising",
            price: "500 PLN/week",
            monthlyPrice: "1800 PLN/month",
            features: [
              "Full HD LED screen",
              "Dynamic content",
              "Full color",
              "Remote management",
              "Animations and video",
            ],
            popular: false,
          },
        },
      },
      specialDeals: {
        title: "Special Deals",
        subtitle: "Promotions and discounts up to -50%",
        description:
          "Exceptional offers for new clients and long-term partners",
        benefits: [
          "Welcome packages with -30% discount",
          "Referral program -25%",
          "Student offer -40%",
          "Long-term contracts -50%",
          "Free trial day",
          "Flexible payment terms",
        ],
        targetCustomer:
          "For all new clients and companies planning long-term cooperation",
        useCase:
          "Startup used welcome package and saved 2000 PLN in the first year",
        deals: {
          welcome: {
            name: "Welcome package",
            discount: "-30%",
            description: "Discount for new clients for the first 3 months",
            validUntil: "31.03.2024",
          },
          referral: {
            name: "Referral program",
            discount: "-25%",
            description: "Discount for referring a new client + 200 PLN bonus",
            validUntil: "Permanent offer",
          },
          student: {
            name: "Student offer",
            discount: "-40%",
            description: "Special prices for students and graduates",
            validUntil: "30.06.2024",
          },
          longTerm: {
            name: "Long-term contract",
            discount: "-50%",
            description: "Biggest savings with annual contracts",
            validUntil: "Permanent offer",
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
          position: "CEO & Founder",
          text: "Virtual office at Gliwicka 111 is a bullseye. Professional service, quick mail forwarding and great location. I save 3000 PLN monthly compared to renting a traditional office.",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
        {
          name: "Marcin Nowak",
          company: "Tech Solutions Ltd.",
          position: "CTO",
          text: "Coworking perfect for our team. Great atmosphere, 1Gb/s fast internet and possibility to organize meetings in conference rooms. Our team is more productive than ever.",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
        {
          name: "Katarzyna Wiśniewska",
          company: "Legal Consulting",
          position: "Partner",
          text: "We regularly rent conference rooms. Professional equipment, top-level service. Our clients are impressed by the quality and standard of the rooms. I recommend to every lawyer!",
          rating: 5,
          avatar: "/placeholder-user.jpg",
          verified: true,
        },
      ],
    },
    stats: {
      title: "Gliwicka 111 in numbers",
      items: [
        { number: "150+", label: "Satisfied clients", icon: Users },
        { number: "99.9%", label: "Service availability", icon: Zap },
        { number: "24/7", label: "Technical support", icon: Shield },
        { number: "5", label: "Different spaces", icon: Building2 },
      ],
    },
    cta: {
      title: "Ready to grow your business?",
      subtitle: "Contact us today and take advantage of a free consultation",
      freeConsultation: "Free Consultation",
      visitUs: "Visit Us",
      freeDay: "Try coworking for free",
      bookTour: "Book a tour",
    },
    faq: {
      title: "Frequently Asked Questions",
      virtualOffice: {
        title: "Virtual Office - FAQ",
        items: [
          {
            question: "Can I register my company at your address?",
            answer:
              "Yes, our address can be used for business registration and companies. We provide all necessary documents and confirmations required by KRS and CEIDG.",
          },
          {
            question:
              "How quickly will I receive information about correspondence?",
            answer:
              "We send notifications immediately after receiving mail - SMS and email within 15 minutes. Additionally, we offer scanning of important documents and sending them electronically.",
          },
          {
            question: "Can I receive guests at the reception?",
            answer:
              "Yes, reception is available from 8:00-18:00. Guests can wait in the comfortable waiting area. We also offer business meeting service in our conference rooms.",
          },
          {
            question: "What documents do I need to set up a virtual office?",
            answer:
              "You only need an ID and a completed contract. The process takes a maximum of 24 hours, and the address is available immediately after signing the contract.",
          },
        ],
      },
      coworking: {
        title: "Coworking - FAQ",
        items: [
          {
            question: "Can I use a trial day?",
            answer:
              "Yes, we offer a free trial day for all new clients. Just make an appointment by phone or through the online form. The trial day includes access to all amenities.",
          },
          {
            question: "What are the access hours?",
            answer:
              "Coworking is available 24/7 for access card holders. Reception open 8:00-18:00. After hours access through magnetic card with security system.",
          },
          {
            question: "Can I print documents?",
            answer:
              "Yes, we have laser printers, scanners and photocopier. Fee according to price list - 0.50 PLN per black and white A4 page, 2 PLN for color. First 50 pages monthly free for regular clients.",
          },
          {
            question: "Is parking available?",
            answer:
              "Yes, we have free parking for coworking clients. Additionally, we offer parking spaces with electric car chargers.",
          },
        ],
      },
    },
    partnerships: {
      title: "Our business partners",
      subtitle: "We cooperate with the best companies in the region",
      items: [
        {
          name: "Law Firm Kowalski & Partners",
          service: "Legal services",
          discount: "15% discount for Gliwicka 111 clients",
        },
        {
          name: "Accounting Office ProFin",
          service: "Accounting and taxes",
          discount: "20% discount for the first 6 months",
        },
        {
          name: "Recruitment Agency TalentHub",
          service: "IT and business recruitment",
          discount: "Free consultation + 10% discount",
        },
      ],
    },
    footer: {
      company: "Gliwicka 111",
      description:
        "Professional property management and comprehensive business services.",
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
      emergency: "Emergency contact: +48 791 554 674",
    },
  },
};

export default function HomePage() {
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ServiceCard = ({
    service,
    icon: Icon,
    href,
  }: {
    service: any;
    icon: any;
    href: string;
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-200 h-full">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-teal-600" />
        </div>
        <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
        <Badge variant="secondary" className="mx-auto">
          {service.subtitle}
        </Badge>
        <CardDescription className="mt-2">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">
            {language === "pl" ? "Kluczowe korzyści:" : "Key benefits:"}
          </h4>
          <ul className="space-y-1">
            {service.benefits
              .slice(0, 3)
              .map((benefit: string, index: number) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
          </ul>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600 mb-3">
            <strong>{language === "pl" ? "Dla kogo:" : "Target:"}</strong>{" "}
            {service.targetCustomer}
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
  );

  const PricingCard = ({
    plan,
    isPopular = false,
  }: {
    plan: any;
    isPopular?: boolean;
  }) => (
    <Card
      className={`relative h-full ${isPopular ? "border-2 border-teal-500 shadow-lg scale-105" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-teal-600 text-white px-4 py-1">
            {language === "pl" ? "Najpopularniejszy" : "Most Popular"}
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-teal-600">{plan.price}</div>
          {plan.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {plan.originalPrice}
            </div>
          )}
          {plan.monthlyPrice && (
            <div className="text-sm text-gray-600">({plan.monthlyPrice})</div>
          )}
          {plan.dayPrice && (
            <div className="text-sm text-gray-600">({plan.dayPrice})</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="w-full mt-6 bg-teal-600 hover:bg-teal-700">
          <Link href="/contact">
            {language === "pl" ? "Wybierz plan" : "Choose Plan"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          {testimonial.verified && (
            <Badge variant="outline" className="ml-2 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              {language === "pl" ? "Zweryfikowana" : "Verified"}
            </Badge>
          )}
        </div>
        <blockquote className="text-slate-700 mb-4 italic flex-1">
          &ldquo;{testimonial.text}&rdquo;
        </blockquote>
        <div className="flex items-center">
          <Image
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full mr-3"
          />
          <div>
            <p className="font-semibold text-slate-900">{testimonial.name}</p>
            <p className="text-sm text-slate-600">{testimonial.position}</p>
            <p className="text-sm text-slate-500">{testimonial.company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <PageNav nav={t.nav} current="home" />


      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Badge
                  variant="outline"
                  className="mr-3 bg-teal-50 border-teal-200"
                >
                  <Award className="w-3 h-3 mr-1 text-teal-600" />
                  {t.hero.trustBadge}
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                {t.hero.title}
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-teal-600 mb-6">
                {t.hero.subtitle}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t.hero.description}
              </p>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">150+</div>
                  <div className="text-sm text-slate-600">
                    {language === "pl" ? "Klientów" : "Clients"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">99.9%</div>
                  <div className="text-sm text-slate-600">
                    {language === "pl" ? "Dostępność" : "Uptime"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">24/7</div>
                  <div className="text-sm text-slate-600">
                    {language === "pl" ? "Wsparcie" : "Support"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 shadow-lg"
                >
                  <Link href="#offer">
                    {t.hero.cta}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 bg-transparent"
                >
                  <Link href="/contact">{t.hero.contact}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div
                className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl overflow-hidden relative"
                data-testid="hero-image-placeholder"
              >
                <Image
                  src="/hala1.webp"
                  alt="Gliwicka 111 Building"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                  priority
                  data-testid="hero-image"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    {language === "pl" ? "Dostępne teraz" : "Available now"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-center text-white">
            <Gift className="w-5 h-5 mr-2 animate-bounce" />
            <span className="font-medium">
              {language === "pl"
                ? "🎉 Pakiet powitalny -30% dla nowych klientów! Bezpłatna konsultacja i dzień próbny coworkingu!"
                : "🎉 Welcome package -30% for new clients! Free consultation and coworking trial day!"}
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.stats.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {t.stats.items.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-teal-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Offer Section */}
      <section id="offer" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t.offer.title}
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
              {t.offer.subtitle}
            </p>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t.offer.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              service={t.services.virtualOffice}
              icon={MapPin}
              href="#virtual-office"
            />
            <ServiceCard
              service={t.services.coworking}
              icon={Users}
              href="#coworking"
            />
            <ServiceCard
              service={t.services.meetingRooms}
              icon={Calendar}
              href="#meeting-rooms"
            />
            <ServiceCard
              service={t.services.advertising}
              icon={Megaphone}
              href="#advertising"
            />
            <div className="md:col-span-2 lg:col-span-1">
              <ServiceCard
                service={t.services.specialDeals}
                icon={Gift}
                href="#special-deals"
              />
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
                  <h2 className="text-3xl font-bold text-slate-900">
                    {t.services.virtualOffice.title}
                  </h2>
                  <p className="text-blue-600 font-medium">
                    {t.services.virtualOffice.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                {t.services.virtualOffice.description}
              </p>

              <div className="space-y-3 mb-6">
                {t.services.virtualOffice.benefits.map(
                  (benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-600" />
                  {language === "pl" ? "Przykład użycia:" : "Use Case Example:"}
                </h4>
                <p className="text-sm text-slate-700">
                  {t.services.virtualOffice.useCase}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/contact">
                    {language === "pl"
                      ? "Zamów biuro wirtualne"
                      : "Order Virtual Office"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    {language === "pl"
                      ? "Bezpłatna konsultacja"
                      : "Free Consultation"}
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
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
            <PricingCard
              plan={t.services.virtualOffice.pricing.standard}
              isPopular={true}
            />
            <PricingCard plan={t.services.virtualOffice.pricing.premium} />
          </div>
        </div>
      </section>

      {/* Coworking Section */}
      <section id="coworking" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
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
                  <h2 className="text-3xl font-bold text-slate-900">
                    {t.services.coworking.title}
                  </h2>
                  <p className="text-green-600 font-medium">
                    {t.services.coworking.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                {t.services.coworking.description}
              </p>

              <div className="space-y-3 mb-6">
                {t.services.coworking.benefits.map(
                  (benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-600" />
                  {language === "pl" ? "Przykład użycia:" : "Use Case Example:"}
                </h4>
                <p className="text-sm text-slate-700">
                  {t.services.coworking.useCase}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Link href="/contact">
                    {language === "pl"
                      ? "Zarezerwuj miejsce"
                      : "Book Workspace"}
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
            <PricingCard
              plan={t.services.coworking.pricing.dedicatedDesk}
              isPopular={true}
            />
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
                  <h2 className="text-3xl font-bold text-slate-900">
                    {t.services.meetingRooms.title}
                  </h2>
                  <p className="text-purple-600 font-medium">
                    {t.services.meetingRooms.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                {t.services.meetingRooms.description}
              </p>

              <div className="space-y-3 mb-6">
                {t.services.meetingRooms.benefits.map(
                  (benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-purple-600" />
                  {language === "pl" ? "Przykład użycia:" : "Use Case Example:"}
                </h4>
                <p className="text-sm text-slate-700">
                  {t.services.meetingRooms.useCase}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/contact">
                    {language === "pl" ? "Zarezerwuj salę" : "Book Room"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">{t.cta.bookTour}</Link>
                </Button>
              </div>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
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
            <PricingCard
              plan={t.services.meetingRooms.pricing.medium}
              isPopular={true}
            />
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
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
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
                  <h2 className="text-3xl font-bold text-slate-900">
                    {t.services.advertising.title}
                  </h2>
                  <p className="text-orange-600 font-medium">
                    {t.services.advertising.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                {t.services.advertising.description}
              </p>

              <div className="space-y-3 mb-6">
                {t.services.advertising.benefits.map(
                  (benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-orange-600" />
                  {language === "pl" ? "Przykład użycia:" : "Use Case Example:"}
                </h4>
                <p className="text-sm text-slate-700">
                  {t.services.advertising.useCase}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Link href="/contact">
                  {language === "pl" ? "Zamów kampanię" : "Order Campaign"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Advertising Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              plan={t.services.advertising.pricing.mobile}
              isPopular={true}
            />
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
                <h2 className="text-3xl font-bold text-slate-900">
                  {t.services.specialDeals.title}
                </h2>
                <p className="text-red-600 font-medium">
                  {t.services.specialDeals.subtitle}
                </p>
              </div>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
              {t.services.specialDeals.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(t.services.specialDeals.deals).map(
              ([key, deal]: [string, any]) => (
                <Card
                  key={key}
                  className="relative border-2 border-red-200 hover:border-red-300 transition-colors h-full"
                >
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-red-600 text-white px-3 py-1 text-lg font-bold">
                      {deal.discount}
                    </Badge>
                  </div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">{deal.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {deal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {language === "pl" ? "Ważne do:" : "Valid until:"}{" "}
                        {deal.validUntil}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>

          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-red-600" />
              {language === "pl"
                ? "Przykład oszczędności:"
                : "Savings Example:"}
            </h4>
            <p className="text-slate-700">{t.services.specialDeals.useCase}</p>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/contact">
                {language === "pl"
                  ? "Sprawdź oferty specjalne"
                  : "Check Special Offers"}
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
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-lg text-slate-600">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial: any, index: number) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.partnerships.title}
            </h2>
            <p className="text-lg text-slate-600">{t.partnerships.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.partnerships.items.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{partner.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {partner.service}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {partner.discount}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t.faq.title}
            </h2>
          </div>

          <Tabs defaultValue="virtual-office" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="virtual-office"
                data-testid="tab-faq-virtual-office"
              >
                {t.nav.virtualOffice}
              </TabsTrigger>
              <TabsTrigger value="coworking" data-testid="tab-faq-coworking">
                {t.nav.coworking}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="virtual-office" className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">
                {t.faq.virtualOffice.title}
              </h3>
              {t.faq.virtualOffice.items.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {item.question}
                    </h4>
                    <p className="text-slate-600 pl-6">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="coworking" className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">
                {t.faq.coworking.title}
              </h3>
              {t.faq.coworking.items.map((item: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {item.question}
                    </h4>
                    <p className="text-slate-600 pl-6">{item.answer}</p>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
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
              <div className="mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  aria-label="Gliwicka 111 — Property Management"
                >
                  <Image
                    src="/gliwicka111w.svg"
                    alt="Gliwicka 111 — Property Management"
                    width={200}
                    height={200}
                  />
                </Link>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                {t.footer.description}
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
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>{t.footer.emergency}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t.footer.services}
              </h4>
              <nav className="space-y-2">
                <Link
                  href="#virtual-office"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.virtualOffice}
                </Link>
                <Link
                  href="#coworking"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.coworking}
                </Link>
                <Link
                  href="#meeting-rooms"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.meetingRooms}
                </Link>
                <Link
                  href="#advertising"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.advertising}
                </Link>
                <Link
                  href="#special-deals"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.specialDeals}
                </Link>
              </nav>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t.footer.quickLinks}
              </h4>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.home}
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
                <Link
                  href="/forms"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {language === "pl" ? "Formularze" : "Forms"}
                </Link>
              </nav>
            </div>

            {/* Working Hours & Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t.footer.workingHours}
              </h4>
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
                <Link
                  href="/privacy"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.footer.privacy}
                </Link>
                <Link
                  href="/terms"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
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

      {/* Consent Banner */}
      <ConsentBanner />
    </div>
  );
}
