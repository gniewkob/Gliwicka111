"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  toast,
} from "@/components/ui"
import { specialDealsFormSchema, type SpecialDealsFormData } from "@/lib/validation-schemas"
import { submitSpecialDealsForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { useFormAnalytics } from "@/hooks/use-form-analytics"
import { messages } from "@/lib/i18n"
import { Gift, Percent, Star, Shield, CheckCircle } from "lucide-react"

interface SpecialDealsFormProps {
  language?: "pl" | "en"
}

export default function SpecialDealsForm({ language = "pl" }: SpecialDealsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const analytics = useFormAnalytics({
    formType: "special-deals",
    enabled: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SpecialDealsFormData>({
    resolver: zodResolver(specialDealsFormSchema),
    defaultValues: {
      gdprConsent: false,
      marketingConsent: false,
      interestedServices: [],
    },
  })

  const content = {
    pl: {
      title: "Oferty Specjalne",
      subtitle: "Promocje i rabaty do -50%",
      description: "Skorzystaj z naszych wyjątkowych ofert i zaoszczędź na usługach biznesowych",
      dealTypes: {
        "welcome-package": {
          name: "Pakiet Powitalny",
          discount: "-30%",
          description: "Rabat dla nowych klientów na pierwsze 3 miesiące",
          features: ["30% rabatu", "Bezpłatna konsultacja", "Elastyczne warunki", "Wsparcie 24/7"],
        },
        referral: {
          name: "Program Poleceń",
          discount: "-25%",
          description: "Rabat za polecenie nowego klienta",
          features: ["25% rabatu", "Bonus za polecenie", "Dodatkowe korzyści", "Długoterminowe oszczędności"],
        },
        student: {
          name: "Oferta Studencka",
          discount: "-40%",
          description: "Specjalne ceny dla studentów i absolwentów",
          features: ["40% rabatu", "Elastyczne płatności", "Dodatkowe usługi", "Wsparcie startupów"],
        },
        startup: {
          name: "Pakiet Startup",
          discount: "-35%",
          description: "Wsparcie dla młodych firm i przedsiębiorców",
          features: ["35% rabatu", "Mentoring biznesowy", "Networking", "Elastyczne warunki"],
        },
        "long-term": {
          name: "Umowa Długoterminowa",
          discount: "-50%",
          description: "Największe oszczędności przy umowach rocznych",
          features: ["50% rabatu", "Gwarancja ceny", "Priorytetowe wsparcie", "Dodatkowe usługi"],
        },
      },
      fields: {
        firstName: "Imię",
        lastName: "Nazwisko",
        email: "Adres email",
        phone: "Numer telefonu",
        companyName: "Nazwa firmy",
        dealType: "Typ oferty",
        interestedServices: "Interesujące usługi",
        currentSituation: "Obecna sytuacja",
        timeline: "Harmonogram",
        referralSource: "Źródło polecenia",
        specificNeeds: "Szczególne potrzeby",
        message: "Dodatkowe informacje",
        gdprConsent: "Wyrażam zgodę na przetwarzanie moich danych osobowych",
        marketingConsent: "Wyrażam zgodę na otrzymywanie informacji marketingowych",
      },
      servicesList: [
        "Biuro wirtualne",
        "Coworking",
        "Sale konferencyjne",
        "Reklama mobilna",
        "Obsługa księgowa",
        "Doradztwo prawne",
      ],
      currentSituations: {
        "new-business": "Nowa firma",
        expanding: "Rozwijam biznes",
        relocating: "Przeprowadzka",
        "cost-cutting": "Optymalizacja kosztów",
      },
      timelines: {
        immediate: "Natychmiast",
        "1-month": "W ciągu miesiąca",
        "3-months": "W ciągu 3 miesięcy",
        "6-months": "W ciągu 6 miesięcy",
      },
      submit: "Wyślij zapytanie",
      submitting: "Wysyłanie...",
    },
    en: {
      title: "Special Deals",
      subtitle: "Promotions and discounts up to -50%",
      description: "Take advantage of our exceptional offers and save on business services",
      dealTypes: {
        "welcome-package": {
          name: "Welcome Package",
          discount: "-30%",
          description: "Discount for new clients for the first 3 months",
          features: ["30% discount", "Free consultation", "Flexible terms", "24/7 support"],
        },
        referral: {
          name: "Referral Program",
          discount: "-25%",
          description: "Discount for referring a new client",
          features: ["25% discount", "Referral bonus", "Additional benefits", "Long-term savings"],
        },
        student: {
          name: "Student Offer",
          discount: "-40%",
          description: "Special prices for students and graduates",
          features: ["40% discount", "Flexible payments", "Additional services", "Startup support"],
        },
        startup: {
          name: "Startup Package",
          discount: "-35%",
          description: "Support for young companies and entrepreneurs",
          features: ["35% discount", "Business mentoring", "Networking", "Flexible terms"],
        },
        "long-term": {
          name: "Long-term Contract",
          discount: "-50%",
          description: "Biggest savings with annual contracts",
          features: ["50% discount", "Price guarantee", "Priority support", "Additional services"],
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        companyName: "Company Name",
        dealType: "Deal Type",
        interestedServices: "Interested Services",
        currentSituation: "Current Situation",
        timeline: "Timeline",
        referralSource: "Referral Source",
        specificNeeds: "Specific Needs",
        message: "Additional Information",
        gdprConsent: "I consent to the processing of my personal data",
        marketingConsent: "I consent to receiving marketing information",
      },
      servicesList: [
        "Virtual office",
        "Coworking",
        "Conference rooms",
        "Mobile advertising",
        "Accounting services",
        "Legal consulting",
      ],
      currentSituations: {
        "new-business": "New business",
        expanding: "Expanding business",
        relocating: "Relocating",
        "cost-cutting": "Cost optimization",
      },
      timelines: {
        immediate: "Immediately",
        "1-month": "Within a month",
        "3-months": "Within 3 months",
        "6-months": "Within 6 months",
      },
      submit: "Send Inquiry",
      submitting: "Sending...",
    },
  }

  const t = content[language]

  const onSubmit = async (data: SpecialDealsFormData) => {
    setIsSubmitting(true)
    analytics.trackSubmissionAttempt()

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item))
        } else {
          formData.append(key, String(value))
        }
      })

      formData.append("sessionId", analyticsClient.getSessionId())
      const result = await submitSpecialDealsForm(formData)
      const message =
        result.message ??
        (result.success
          ? messages.form.success[language]
          : messages.form.serverError[language])
      if (result.success) {
        analytics.trackSubmissionSuccess()
        toast.success(message)
        reset()
      } else {
        analytics.trackSubmissionError(message)
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        language === "en" ? "An unexpected error occurred" : "Wystąpił nieoczekiwany błąd"
      analytics.trackSubmissionError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldFocus = (fieldName: string) => {
    analytics.trackFieldFocus(fieldName)
    if (!watch("firstName") && fieldName === "firstName") {
      analytics.trackFormStart()
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    analytics.trackFieldBlur(fieldName)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <Gift className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-red-600 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </div>

      {/* Deal Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(t.dealTypes).map(([key, deal]) => (
          <Card key={key} className="relative hover:shadow-lg transition-shadow border-2 hover:border-red-200">
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-red-600 text-white px-3 py-1 text-lg font-bold">{deal.discount}</Badge>
            </div>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Percent className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">{deal.name}</CardTitle>
              <CardDescription className="text-sm">{deal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {deal.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Formularz oferty specjalnej
          </CardTitle>
          <CardDescription>Wypełnij formularz, a przygotujemy dla Ciebie spersonalizowaną ofertę</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            data-testid="contact-form-special-deals"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t.fields.firstName} *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  onFocus={() => handleFieldFocus("firstName")}
                  onBlur={() => handleFieldBlur("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">{t.fields.lastName} *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  onFocus={() => handleFieldFocus("lastName")}
                  onBlur={() => handleFieldBlur("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t.fields.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  onFocus={() => handleFieldFocus("email")}
                  onBlur={() => handleFieldBlur("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email?.message && (
                  <p
                    data-testid="special-deals-email-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">{t.fields.phone} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  onFocus={() => handleFieldFocus("phone")}
                  onBlur={() => handleFieldBlur("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                  placeholder="+48 123 456 789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="companyName">{t.fields.companyName}</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                onFocus={() => handleFieldFocus("companyName")}
                onBlur={() => handleFieldBlur("companyName")}
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>

            {/* Deal Configuration */}
            <div>
              <Label htmlFor="dealType">{t.fields.dealType} *</Label>
              <Select onValueChange={(value) => setValue("dealType", value as any)}>
                <SelectTrigger className={errors.dealType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Wybierz typ oferty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome-package">Pakiet Powitalny (-30%)</SelectItem>
                  <SelectItem value="referral">Program Poleceń (-25%)</SelectItem>
                  <SelectItem value="student">Oferta Studencka (-40%)</SelectItem>
                  <SelectItem value="startup">Pakiet Startup (-35%)</SelectItem>
                  <SelectItem value="long-term">Umowa Długoterminowa (-50%)</SelectItem>
                </SelectContent>
              </Select>
              {errors.dealType && <p className="text-red-500 text-sm mt-1">{errors.dealType.message}</p>}
            </div>

            {/* Interested Services */}
            <div>
              <Label>{t.fields.interestedServices} *</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {t.servicesList.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${index}`}
                      onCheckedChange={(checked) => {
                        const current = watch("interestedServices") || []
                        if (checked) {
                          setValue("interestedServices", [...current, service])
                        } else {
                          setValue(
                            "interestedServices",
                            current.filter((s) => s !== service),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`service-${index}`} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.interestedServices && (
                <p className="text-red-500 text-sm mt-1">{errors.interestedServices.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentSituation">{t.fields.currentSituation} *</Label>
                <Select onValueChange={(value) => setValue("currentSituation", value as any)}>
                  <SelectTrigger className={errors.currentSituation ? "border-red-500" : ""}>
                    <SelectValue placeholder="Wybierz sytuację" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.currentSituations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currentSituation && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentSituation.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeline">{t.fields.timeline} *</Label>
                <Select onValueChange={(value) => setValue("timeline", value as any)}>
                  <SelectTrigger className={errors.timeline ? "border-red-500" : ""}>
                    <SelectValue placeholder="Wybierz harmonogram" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.timelines).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="referralSource">{t.fields.referralSource}</Label>
              <Input
                id="referralSource"
                {...register("referralSource")}
                onFocus={() => handleFieldFocus("referralSource")}
                onBlur={() => handleFieldBlur("referralSource")}
                className={errors.referralSource ? "border-red-500" : ""}
                placeholder="Skąd dowiedziałeś się o nas?"
              />
              {errors.referralSource && <p className="text-red-500 text-sm mt-1">{errors.referralSource.message}</p>}
            </div>

            <div>
              <Label htmlFor="specificNeeds">{t.fields.specificNeeds}</Label>
              <Textarea
                id="specificNeeds"
                {...register("specificNeeds")}
                onFocus={() => handleFieldFocus("specificNeeds")}
                onBlur={() => handleFieldBlur("specificNeeds")}
                className={errors.specificNeeds ? "border-red-500" : ""}
                rows={3}
                placeholder="Opisz swoje szczególne potrzeby i oczekiwania..."
              />
              {errors.specificNeeds && <p className="text-red-500 text-sm mt-1">{errors.specificNeeds.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">{t.fields.message}</Label>
              <Textarea
                id="message"
                {...register("message")}
                onFocus={() => handleFieldFocus("message")}
                onBlur={() => handleFieldBlur("message")}
                className={errors.message ? "border-red-500" : ""}
                rows={4}
                placeholder="Dodatkowe informacje, pytania..."
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* GDPR Consent */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdprConsent"
                  data-testid="gdpr-checkbox"
                  {...register("gdprConsent")}
                  className={errors.gdprConsent ? "border-red-500" : ""}
                />
                <div className="flex-1">
                  <Label htmlFor="gdprConsent" className="text-sm">
                    <Shield className="w-4 h-4 inline mr-1" />
                    {t.fields.gdprConsent} *
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Zgodnie z RODO, Twoje dane będą przetwarzane w celu przygotowania oferty i kontaktu z Tobą.
                  </p>
                </div>
              </div>
              {errors.gdprConsent && <p className="text-red-500 text-sm">{errors.gdprConsent.message}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox id="marketingConsent" {...register("marketingConsent")} />
                <Label htmlFor="marketingConsent" className="text-sm">
                  {t.fields.marketingConsent}
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
