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
  toast,
} from "@/components/ui"
import { coworkingFormSchema, type CoworkingFormData } from "@/lib/validation-schemas"
import { submitCoworkingForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { useFormAnalytics } from "@/hooks/use-form-analytics"
import { messages } from "@/lib/i18n"
import { Users, Coffee, Calendar, Shield, CheckCircle, MapPin } from "lucide-react"

interface CoworkingFormProps {
  language?: "pl" | "en"
}

export default function CoworkingForm({ language = "pl" }: CoworkingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const analytics = useFormAnalytics({
    formType: "coworking",
    enabled: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CoworkingFormData>({
    resolver: zodResolver(coworkingFormSchema),
    defaultValues: {
      gdprConsent: false,
      marketingConsent: false,
      trialDay: false,
      teamSize: 1,
    },
  })

  const content = {
    pl: {
      title: "Coworking & Biura",
      subtitle: "Elastyczne przestrzenie pracy od 25 zł/dzień",
      description: "Znajdź idealne miejsce do pracy - od hot desk po prywatne biuro",
      workspaceTypes: {
        "hot-desk": {
          name: "Hot Desk",
          price: "25 zł/dzień",
          description: "Elastyczne stanowisko pracy w otwartej przestrzeni",
          features: ["Dostęp do internetu", "Kawa/herbata", "Sala konferencyjna", "Parking"],
        },
        "dedicated-desk": {
          name: "Dedicated Desk",
          price: "350 zł/miesiąc",
          description: "Twoje stałe miejsce w przestrzeni coworkingowej",
          features: ["Własne biurko", "Szafka na dokumenty", "Wszystko z Hot Desk", "Możliwość personalizacji"],
        },
        "private-office": {
          name: "Prywatne Biuro",
          price: "800 zł/miesiąc",
          description: "Zamknięta przestrzeń dla Twojego zespołu",
          features: ["Prywatność", "Własne wyposażenie", "Sala konferencyjna", "Recepcja"],
        },
      },
      fields: {
        firstName: "Imię",
        lastName: "Nazwisko",
        email: "Adres email",
        phone: "Numer telefonu",
        companyName: "Nazwa firmy",
        workspaceType: "Typ przestrzeni",
        duration: "Okres wynajmu",
        startDate: "Data rozpoczęcia",
        teamSize: "Wielkość zespołu",
        specialRequirements: "Wymagania specjalne",
        trialDay: "Bezpłatny dzień próbny",
        message: "Dodatkowe informacje",
        gdprConsent: "Wyrażam zgodę na przetwarzanie moich danych osobowych",
        marketingConsent: "Wyrażam zgodę na otrzymywanie informacji marketingowych",
      },
      durations: {
        daily: "Dziennie",
        weekly: "Tygodniowo",
        monthly: "Miesięcznie",
        yearly: "Rocznie",
      },
      submit: "Wyślij zapytanie",
      submitting: "Wysyłanie...",
      trialDayInfo: "Skorzystaj z bezpłatnego dnia próbnego, aby przetestować nasze przestrzenie",
    },
    en: {
      title: "Coworking & Offices",
      subtitle: "Flexible workspaces from 25 PLN/day",
      description: "Find the perfect place to work - from hot desk to private office",
      workspaceTypes: {
        "hot-desk": {
          name: "Hot Desk",
          price: "25 PLN/day",
          description: "Flexible workspace in open area",
          features: ["Internet access", "Coffee/tea", "Conference room", "Parking"],
        },
        "dedicated-desk": {
          name: "Dedicated Desk",
          price: "350 PLN/month",
          description: "Your permanent place in coworking space",
          features: ["Own desk", "Document locker", "Everything from Hot Desk", "Personalization options"],
        },
        "private-office": {
          name: "Private Office",
          price: "800 PLN/month",
          description: "Closed space for your team",
          features: ["Privacy", "Own equipment", "Conference room", "Reception"],
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        companyName: "Company Name",
        workspaceType: "Workspace Type",
        duration: "Rental Period",
        startDate: "Start Date",
        teamSize: "Team Size",
        specialRequirements: "Special Requirements",
        trialDay: "Free trial day",
        message: "Additional Information",
        gdprConsent: "I consent to the processing of my personal data",
        marketingConsent: "I consent to receiving marketing information",
      },
      durations: {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly",
      },
      submit: "Send Inquiry",
      submitting: "Sending...",
      trialDayInfo: "Take advantage of a free trial day to test our spaces",
    },
  }

  const t = content[language]

  const onSubmit = async (data: CoworkingFormData) => {
    setSubmitResult(null)
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
      const result = await submitCoworkingForm(formData)
      const message =
        result.message ??
        (result.success
          ? messages.form.success[language]
          : messages.form.serverError[language])
      if (result.success) {
        analytics.trackSubmissionSuccess()
        toast.success(message)
        setSubmitResult({ success: true, message })
        reset()
      } else {
        analytics.trackSubmissionError(message)
        toast.error(message)
        setSubmitResult({ success: false, message })
      }
    } catch (error) {
      const errorMessage =
        language === "en" ? "An unexpected error occurred" : "Wystąpił nieoczekiwany błąd"
      analytics.trackSubmissionError(errorMessage)
      toast.error(errorMessage)
      setSubmitResult({ success: false, message: errorMessage })
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
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-green-600 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </div>

      {/* Workspace Types */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(t.workspaceTypes).map(([key, workspace]) => (
          <Card key={key} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{workspace.name}</CardTitle>
              <div className="text-2xl font-bold text-green-600">{workspace.price}</div>
              <CardDescription className="text-sm">{workspace.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {workspace.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trial Day Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Coffee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Bezpłatny dzień próbny</h3>
              <p className="text-green-700 text-sm">{t.trialDayInfo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Formularz rezerwacji
          </CardTitle>
          <CardDescription>Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            data-testid="contact-form-coworking"
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
                    data-testid="coworking-email-error"
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

            {/* Workspace Configuration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workspaceType">{t.fields.workspaceType} *</Label>
                <Select onValueChange={(value) => setValue("workspaceType", value as any)}>
                  <SelectTrigger
                    id="workspaceType"
                    className={errors.workspaceType ? "border-red-500" : ""}
                    data-testid="workspaceType-select"
                  >
                    <SelectValue placeholder="Wybierz typ przestrzeni" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot-desk">Hot Desk (25 zł/dzień)</SelectItem>
                    <SelectItem value="dedicated-desk">Dedicated Desk (350 zł/miesiąc)</SelectItem>
                    <SelectItem value="private-office">Prywatne Biuro (800 zł/miesiąc)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workspaceType && <p className="text-red-500 text-sm mt-1">{errors.workspaceType.message}</p>}
              </div>

              <div>
                <Label htmlFor="duration">{t.fields.duration} *</Label>
                <Select onValueChange={(value) => setValue("duration", value as any)}>
                  <SelectTrigger
                    id="duration"
                    className={errors.duration ? "border-red-500" : ""}
                    data-testid="duration-select"
                  >
                    <SelectValue placeholder="Wybierz okres" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.durations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">{t.fields.startDate} *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    onFocus={() => handleFieldFocus("startDate")}
                    onBlur={() => handleFieldBlur("startDate")}
                    className={`pl-10 ${errors.startDate ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
              </div>

              <div>
                <Label htmlFor="teamSize">{t.fields.teamSize} *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    max="50"
                    {...register("teamSize", { valueAsNumber: true })}
                    onFocus={() => handleFieldFocus("teamSize")}
                    onBlur={() => handleFieldBlur("teamSize")}
                    className={`pl-10 ${errors.teamSize ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequirements">{t.fields.specialRequirements}</Label>
              <Textarea
                id="specialRequirements"
                {...register("specialRequirements")}
                onFocus={() => handleFieldFocus("specialRequirements")}
                onBlur={() => handleFieldBlur("specialRequirements")}
                className={errors.specialRequirements ? "border-red-500" : ""}
                rows={3}
                placeholder="Opisz specjalne wymagania, np. dostęp 24/7, dodatkowe wyposażenie..."
              />
              {errors.specialRequirements && (
                <p className="text-red-500 text-sm mt-1">{errors.specialRequirements.message}</p>
              )}
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

            {/* Trial Day Option */}
            <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg">
              <Checkbox id="trialDay" {...register("trialDay")} />
              <Label htmlFor="trialDay" className="text-sm">
                <Coffee className="w-4 h-4 inline mr-1" />
                {t.fields.trialDay}
              </Label>
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
                    Zgodnie z RODO, Twoje dane będą przetwarzane w celu realizacji zapytania i kontaktu z Tobą.
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
            <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
          {submitResult && (
            <p data-testid="submit-result">{submitResult.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
