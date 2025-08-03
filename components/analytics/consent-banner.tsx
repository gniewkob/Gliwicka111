"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Cookie, BarChart3, X, Settings } from "lucide-react"

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("analytics-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem(
      "analytics-consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
      }),
    )
    setIsVisible(false)
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem(
      "analytics-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      }),
    )
    setIsVisible(false)
  }

  const handleCustomize = () => {
    setShowDetails(!showDetails)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto border-2 border-blue-200 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ochrona prywatności / Privacy Protection</h3>
                <Badge variant="outline" className="mt-1">
                  GDPR/RODO Compliant
                </Badge>
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
            <p className="text-gray-700">
              <strong>PL:</strong> Używamy plików cookie i podobnych technologii do analizy ruchu na stronie oraz
              poprawy funkcjonalności. Twoje dane są anonimizowane i przetwarzane zgodnie z RODO.
            </p>
            <p className="text-gray-700">
              <strong>EN:</strong> We use cookies and similar technologies to analyze website traffic and improve
              functionality. Your data is anonymized and processed in compliance with GDPR.
            </p>

            {showDetails && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cookie className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Niezbędne / Necessary</span>
                    <Badge variant="secondary">Zawsze aktywne / Always active</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Pliki cookie niezbędne do działania strony / Cookies necessary for website functionality
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Analityczne / Analytics</span>
                    <Badge variant="outline">Opcjonalne / Optional</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Anonimowe dane o korzystaniu z formularzy / Anonymous form usage data
                </p>
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
