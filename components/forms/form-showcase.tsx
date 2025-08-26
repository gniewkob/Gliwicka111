"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@/components/ui"
import VirtualOfficeForm from "./virtual-office-form"
import CoworkingForm from "./coworking-form"
import MeetingRoomForm from "./meeting-room-form"
import AdvertisingForm from "./advertising-form"
import SpecialDealsForm from "./special-deals-form"
import { ConsentBanner } from "@/components/analytics"
import { Globe, MapPin, Users, Calendar, Megaphone, Gift, BarChart3, Shield } from "lucide-react"

const AnalyticsDashboard = dynamic(
  () =>
    import("@/components/analytics/analytics-dashboard").then(
      (m) => m.default
    ),
  { ssr: false }
)

export default function FormShowcase() {
  const [language, setLanguage] = useState<"pl" | "en">("pl")
  const showAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true"

  const toggleLanguage = () => {
    setLanguage(language === "pl" ? "en" : "pl")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {language === "pl" ? "Formularze kontaktowe Gliwicka 111" : "Gliwicka 111 Contact Forms"}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleLanguage}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Globe className="w-4 h-4" />
                <span>{language === "pl" ? "EN" : "PL"}</span>
              </Button>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language === "pl"
              ? "GDPR-compliant contact forms with comprehensive analytics tracking. Each form includes privacy-first analytics and user consent management."
              : "GDPR-compliant contact forms with comprehensive analytics tracking. Each form includes privacy-first analytics and user consent management."}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>{language === "pl" ? "RODO Compliant" : "GDPR Compliant"}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>{language === "pl" ? "Analityka Privacy-First" : "Privacy-First Analytics"}</span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="virtual-office" className="w-full" data-testid="forms-tabs">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger
                value="virtual-office"
                className="flex items-center space-x-2"
                data-testid="tab-virtual-office"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pl" ? "Biuro wirtualne" : "Virtual Office"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="coworking"
                className="flex items-center space-x-2"
                data-testid="tab-coworking"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Coworking</span>
              </TabsTrigger>
              <TabsTrigger
                value="meeting-rooms"
                className="flex items-center space-x-2"
                data-testid="tab-meeting-room"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pl" ? "Sale" : "Rooms"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="advertising"
                className="flex items-center space-x-2"
                data-testid="tab-advertising"
              >
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pl" ? "Reklama" : "Advertising"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="special-deals"
                className="flex items-center space-x-2"
                data-testid="tab-special-deals"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pl" ? "Promocje" : "Deals"}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="virtual-office" className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {language === "pl" ? "Biuro wirtualne" : "Virtual Office"}
                </Badge>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "pl"
                    ? "Prestiżowy adres biznesowy od 99 zł/miesiąc"
                    : "Prestigious business address from 99 PLN/month"}
                </h2>
                <p className="text-gray-600">
                  {language === "pl"
                    ? "Formularz zapytania o usługi biura wirtualnego z wyborem pakietów i opcji dodatkowych"
                    : "Virtual office inquiry form with package selection and additional options"}
                </p>
              </div>
              <VirtualOfficeForm language={language} />
            </TabsContent>

            <TabsContent value="coworking" className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {language === "pl" ? "Coworking i biura" : "Coworking & Offices"}
                </Badge>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "pl"
                    ? "Elastyczne przestrzenie pracy od 25 zł/dzień"
                    : "Flexible workspaces from 25 PLN/day"}
                </h2>
                <p className="text-gray-600">
                  {language === "pl"
                    ? "Rezerwacja hot desk, dedicated desk lub prywatnego biura z opcją bezpłatnego dnia próbnego"
                    : "Book hot desk, dedicated desk or private office with free trial day option"}
                </p>
              </div>
              <CoworkingForm language={language} />
            </TabsContent>

            <TabsContent value="meeting-rooms" className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {language === "pl" ? "Sale spotkań" : "Meeting Rooms"}
                </Badge>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "pl" ? "Profesjonalne sale od 30 zł/godzinę" : "Professional rooms from 30 PLN/hour"}
                </h2>
                <p className="text-gray-600">
                  {language === "pl"
                    ? "Rezerwacja sal konferencyjnych z pełnym wyposażeniem AV i opcjami cateringu"
                    : "Conference room booking with full AV equipment and catering options"}
                </p>
              </div>
              <MeetingRoomForm language={language} />
            </TabsContent>

            <TabsContent value="advertising" className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {language === "pl" ? "Reklama zewnętrzna" : "Outdoor Advertising"}
                </Badge>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "pl" ? "Mobilny billboard od 350 zł/tydzień" : "Mobile billboard from 350 PLN/week"}
                </h2>
                <p className="text-gray-600">
                  {language === "pl"
                    ? "Zamówienie kampanii reklamowej z mobilną przyczepą i pełną obsługą"
                    : "Order advertising campaign with mobile trailer and full service"}
                </p>
              </div>
              <AdvertisingForm language={language} />
            </TabsContent>

            <TabsContent value="special-deals" className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="secondary" className="mb-2">
                  {language === "pl" ? "Oferty specjalne" : "Special Deals"}
                </Badge>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "pl" ? "Promocje i rabaty do -50%" : "Promotions and discounts up to -50%"}
                </h2>
                <p className="text-gray-600">
                  {language === "pl"
                    ? "Skorzystaj z pakietów powitalnych, programu poleceń i innych promocji"
                    : "Take advantage of welcome packages, referral program and other promotions"}
                </p>
              </div>
              <SpecialDealsForm language={language} />
            </TabsContent>
        </Tabs>
        {showAnalytics && <AnalyticsDashboard />}

        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>{language === "pl" ? "Funkcje GDPR/RODO i Analityka" : "GDPR/RODO Features & Analytics"}</span>
            </CardTitle>
            <CardDescription className="text-center">
              {language === "pl"
                ? "Wszystkie formularze są w pełni zgodne z przepisami o ochronie danych osobowych i zawierają zaawansowaną analitykę"
                : "All forms are fully compliant with personal data protection regulations and include advanced analytics"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <h4 className="font-medium mb-1">{language === "pl" ? "Wymagana zgoda" : "Required consent"}</h4>
                <p className="text-sm text-gray-600">
                  {language === "pl"
                    ? "Obowiązkowa zgoda na przetwarzanie danych"
                    : "Mandatory consent for data processing"}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-1">
                  {language === "pl" ? "Analityka Privacy-First" : "Privacy-First Analytics"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "pl" ? "Anonimizowane śledzenie wydajności" : "Anonymized performance tracking"}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">🔒</span>
                </div>
                <h4 className="font-medium mb-1">{language === "pl" ? "Bezpieczne dane" : "Secure data"}</h4>
                <p className="text-sm text-gray-600">
                  {language === "pl" ? "Szyfrowane przesyłanie danych" : "Encrypted data transmission"}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-amber-600 font-bold">🌐</span>
                </div>
                <h4 className="font-medium mb-1">{language === "pl" ? "Dwujęzyczne" : "Bilingual"}</h4>
                <p className="text-sm text-gray-600">
                  {language === "pl" ? "Pełne wsparcie PL/EN" : "Full PL/EN support"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Consent Banner */}
      <ConsentBanner />
    </div>
  )
}
