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
  Alert,
  AlertDescription,
} from "@/components/ui"
import { virtualOfficeFormSchema, type VirtualOfficeFormData } from "@/lib/validation-schemas"
import { submitVirtualOfficeForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { useFormAnalytics } from "@/hooks/use-form-analytics"
import { Building2, Phone, Mail, FileText, Calendar, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface VirtualOfficeFormProps {
  language?: "pl" | "en"
}

export default function VirtualOfficeForm({ language = "pl" }: VirtualOfficeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const analytics = useFormAnalytics({
    formType: "virtual-office",
    enabled: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VirtualOfficeFormData>({
    resolver: zodResolver(virtualOfficeFormSchema),
    defaultValues: {
      package: "basic",
      businessType: "sole-proprietorship",
      startDate: new Date().toISOString().split("T")[0],
      gdprConsent: false,
      marketingConsent: false,
      additionalServices: [],
    },
  })

  const content = {
    pl: {
      title: "Biuro Wirtualne",
      subtitle: "Prestiżowy adres biznesowy od 99 zł/miesiąc",
      description: "Uzyskaj profesjonalny adres dla swojej firmy z pełnym wsparciem administracyjnym",
      packages: {
        basic: {
          name: "Pakiet Podstawowy",
          price: "99 zł/miesiąc",
          features: ["Adres do rejestracji firmy", "Odbiór korespondencji", "Powiadomienia SMS/email"],
        },
        standard: {
          name: "Pakiet Standard",
          price: "149 zł/miesiąc",
          features: [
            "Wszystko z pakietu podstawowego",
            "Przekazywanie połączeń",
            "2h sali konferencyjnej/miesiąc",
            "Skanowanie dokumentów",
          ],
        },
        premium: {
          name: "Pakiet Premium",
          price: "249 zł/miesiąc",
          features: [
            "Wszystko z pakietu standard",
            "Dedykowany numer telefonu",
            "5h sali konferencyjnej/miesiąc",
            "Obsługa sekretarska",
            "Magazynowanie dokumentów",
          ],
        },
      },
      fields: {
        firstName: "Imię",
        lastName: "Nazwisko",
        email: "Adres email",
        phone: "Numer telefonu",
        companyName: "Nazwa firmy",
        nip: "NIP (opcjonalnie)",
        businessType: "Typ działalności",
        package: "Wybierz pakiet",
        startDate: "Data rozpoczęcia",
        additionalServices: "Usługi dodatkowe",
        message: "Dodatkowe informacje",
        gdprConsent: "Wyrażam zgodę na przetwarzanie moich danych osobowych",
        marketingConsent: "Wyrażam zgodę na otrzymywanie informacji marketingowych",
      },
      businessTypes: {
        "sole-proprietorship": "Działalność gospodarcza",
        llc: "Spółka z o.o.",
        corporation: "Spółka akcyjna",
        other: "Inne",
      },
      additionalServicesList: [
        "Dodatkowe godziny sali konferencyjnej",
        "Obsługa księgowa",
        "Doradztwo prawne",
        "Tłumaczenia",
        "Usługi kurierskie",
        "Magazynowanie dokumentów",
      ],
      submit: "Wyślij zapytanie",
      submitting: "Wysyłanie...",
    },
    en: {
      title: "Virtual Office",
      subtitle: "Prestigious business address from 99 PLN/month",
      description: "Get a professional address for your company with full administrative support",
      packages: {
        basic: {
          name: "Basic Package",
          price: "99 PLN/month",
          features: ["Company registration address", "Mail collection", "SMS/email notifications"],
        },
        standard: {
          name: "Standard Package",
          price: "149 PLN/month",
          features: [
            "Everything from basic package",
            "Call forwarding",
            "2h conference room/month",
            "Document scanning",
          ],
        },
        premium: {
          name: "Premium Package",
          price: "249 PLN/month",
          features: [
            "Everything from standard package",
            "Dedicated phone number",
            "5h conference room/month",
            "Secretary service",
            "Document storage",
          ],
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        companyName: "Company Name",
        nip: "Tax ID (optional)",
        businessType: "Business Type",
        package: "Choose Package",
        startDate: "Start Date",
        additionalServices: "Additional Services",
        message: "Additional Information",
        gdprConsent: "I consent to the processing of my personal data",
        marketingConsent: "I consent to receiving marketing information",
      },
      businessTypes: {
        "sole-proprietorship": "Sole Proprietorship",
        llc: "Limited Liability Company",
        corporation: "Corporation",
        other: "Other",
      },
      additionalServicesList: [
        "Additional conference room hours",
        "Accounting services",
        "Legal consulting",
        "Translation services",
        "Courier services",
        "Document storage",
      ],
      submit: "Send Inquiry",
      submitting: "Sending...",
    },
  }

  const t = content[language]

  const onSubmit = async (data: VirtualOfficeFormData) => {
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
      const result = await submitVirtualOfficeForm(formData)
      setSubmitResult(result)

      if (result.success) {
        analytics.trackSubmissionSuccess()
        reset()
      } else {
        analytics.trackSubmissionError(result.message)
      }
    } catch (error) {
      const errorMessage =
        language === "en" ? "An unexpected error occurred" : "Wystąpił nieoczekiwany błąd"
      setSubmitResult({ success: false, message: errorMessage })
      analytics.trackSubmissionError(errorMessage)
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

  const handleFieldError = (fieldName: string, error: string) => {
    analytics.trackFieldError(fieldName, error)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-blue-600 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </div>

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(t.packages).map(([key, pkg]) => (
          <Card key={key} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <div className="text-2xl font-bold text-blue-600">{pkg.price}</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
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

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Formularz zapytania
          </CardTitle>
          <CardDescription>Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            data-testid="contact-form-virtual-office"
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
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    onFocus={() => handleFieldFocus("email")}
                    onBlur={() => handleFieldBlur("email")}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    data-testid="email-error"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">{t.fields.phone} *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    onFocus={() => handleFieldFocus("phone")}
                    onBlur={() => handleFieldBlur("phone")}
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="+48 123 456 789"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Company Information */}
            <div className="grid md:grid-cols-2 gap-4">
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

              <div>
                <Label htmlFor="nip">{t.fields.nip}</Label>
                <Input
                  id="nip"
                  {...register("nip")}
                  onFocus={() => handleFieldFocus("nip")}
                  onBlur={() => handleFieldBlur("nip")}
                  className={errors.nip ? "border-red-500" : ""}
                  placeholder="1234567890"
                />
                {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessType">{t.fields.businessType} *</Label>
                <Select onValueChange={(value) => setValue("businessType", value as any)}>
                  <SelectTrigger
                    id="businessType"
                    data-testid="businessType-select"
                    className={errors.businessType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Wybierz typ działalności" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.businessTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>}
              </div>

              <div>
                <Label htmlFor="package">{t.fields.package} *</Label>
                <Select onValueChange={(value) => setValue("package", value as any)}>
                  <SelectTrigger
                    id="package"
                    data-testid="package-select"
                    className={errors.package ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Wybierz pakiet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Pakiet Podstawowy (99 zł/miesiąc)</SelectItem>
                    <SelectItem value="standard">Pakiet Standard (149 zł/miesiąc)</SelectItem>
                    <SelectItem value="premium">Pakiet Premium (249 zł/miesiąc)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.package && <p className="text-red-500 text-sm mt-1">{errors.package.message}</p>}
              </div>
            </div>

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

            {/* Additional Services */}
            <div>
              <Label>{t.fields.additionalServices}</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {t.additionalServicesList.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${index}`}
                      onCheckedChange={(checked) => {
                        const current = watch("additionalServices") || []
                        if (checked) {
                          setValue("additionalServices", [...current, service])
                        } else {
                          setValue(
                            "additionalServices",
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
                placeholder="Opisz swoje potrzeby, zadaj pytania..."
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

            {/* Submit Result */}
            {submitResult && (
              <Alert
                data-testid={
                  submitResult.success ? "form-success-alert" : "form-error-alert"
                }
                className={
                  submitResult.success
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }
              >
                {submitResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={submitResult.success ? "text-green-800" : "text-red-800"}>
                  {submitResult.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
