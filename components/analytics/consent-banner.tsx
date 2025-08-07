"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  Badge,
  Checkbox,
  Label,
} from "@/components/ui"
import { Shield, Cookie, BarChart3, X, Settings, CheckCircle } from "lucide-react"

/**
 * Renders a GDPR-compliant consent banner allowing users to control analytics
 * tracking. The banner persists the user's choice in `localStorage` and emits a
 * `consentUpdated` event for analytics initialization.
 *
 * @returns {JSX.Element | null} A consent UI or `null` if consent was already
 * granted.
 */
export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const storedConsent = localStorage.getItem("analytics-consent")
    if (!storedConsent) {
      setIsVisible(true)
    } else {
      try {
        const parsed = JSON.parse(storedConsent)
        if (parsed.timestamp && Date.now() - parsed.timestamp > 365 * 24 * 60 * 60 * 1000) {
          // Consent expired after 1 year
          localStorage.removeItem("analytics-consent")
          setIsVisible(true)
        }
      } catch (error) {
        setIsVisible(true)
      }
    }
  }, [])

  const saveConsent = (consentData: typeof consent) => {
    const consentWithTimestamp = {
      ...consentData,
      timestamp: Date.now(),
    }
    localStorage.setItem("analytics-consent", JSON.stringify(consentWithTimestamp))
    setIsVisible(false)

    // Dispatch custom event for analytics initialization
    window.dispatchEvent(new CustomEvent("consentUpdated", { detail: consentData }))
  }

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: false, // We don't use marketing cookies
    }
    saveConsent(fullConsent)
  }

  const handleAcceptNecessary = () => {
    const essentialConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    saveConsent(essentialConsent)
  }

  const handleCustomConsent = () => {
    saveConsent(consent)
  }

  const handleCustomize = () => {
    setShowDetails(!showDetails)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto border-2 border-blue-200 shadow-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ochrona prywatności / Privacy Protection</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    GDPR/RODO Compliant
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Privacy-First Analytics
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700">
                  <strong>🇵🇱 Polski:</strong> Używamy plików cookie i podobnych technologii do analizy ruchu na stronie
                  oraz poprawy funkcjonalności. Twoje dane są anonimizowane i przetwarzane zgodnie z RODO.
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>🇬🇧 English:</strong> We use cookies and similar technologies to analyze website traffic and
                  improve functionality. Your data is anonymized and processed in compliance with GDPR.
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="necessary" checked={consent.necessary} disabled={true} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="necessary" className="flex items-center font-medium">
                          <Cookie className="w-4 h-4 mr-2 text-green-600" />
                          Niezbędne / Necessary
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Pliki cookie niezbędne do działania strony / Cookies necessary for website functionality
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Zawsze aktywne / Always active
                    </Badge>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="analytics"
                        checked={consent.analytics}
                        onCheckedChange={(checked) =>
                          setConsent((prev) => ({ ...prev, analytics: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="analytics" className="flex items-center font-medium">
                          <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                          Analityczne / Analytics
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Anonimowe dane o korzystaniu z formularzy / Anonymous form usage data
                        </p>
                        <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                          <li>Czas wypełniania formularzy / Form completion time</li>
                          <li>Współczynniki konwersji / Conversion rates</li>
                          <li>Błędy walidacji (bez danych osobowych) / Validation errors (no personal data)</li>
                        </ul>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Opcjonalne / Optional
                    </Badge>
                  </div>

                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-blue-900">Gwarancje prywatności / Privacy Guarantees:</p>
                        <ul className="text-blue-800 mt-1 space-y-1">
                          <li>• Adresy IP są hashowane z solą / IP addresses are hashed with salt</li>
                          <li>• Brak śledzenia między stronami / No cross-site tracking</li>
                          <li>• Dane przechowywane max. 90 dni / Data stored max. 90 days</li>
                          <li>• Możliwość usunięcia danych na żądanie / Data deletion on request</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Akceptuj wszystkie / Accept All
              </Button>
              <Button onClick={handleAcceptNecessary} variant="outline">
                Tylko niezbędne / Necessary Only
              </Button>
              <Button onClick={handleCustomize} variant="ghost">
                <Settings className="w-4 h-4 mr-2" />
                {showDetails ? "Ukryj szczegóły / Hide Details" : "Dostosuj / Customize"}
              </Button>
              {showDetails && (
                <Button onClick={handleCustomConsent} variant="secondary">
                  Zapisz wybór / Save Choice
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>
                Więcej informacji w naszej{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Polityce Prywatności
                </a>{" "}
                / More information in our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
