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
} from "@/components/ui"
import { toast } from "@/components/ui/sonner"
import { meetingRoomFormSchema, type MeetingRoomFormData } from "@/lib/validation-schemas"
import { submitMeetingRoomForm } from "@/lib/server-actions"
import { analyticsClient } from "@/lib/analytics-client"
import { useFormAnalytics } from "@/hooks/use-form-analytics"
import { messages } from "@/lib/i18n"
import { Calendar, Clock, Users, Coffee, Shield, CheckCircle } from "lucide-react"

interface MeetingRoomFormProps {
  language?: "pl" | "en"
}

export default function MeetingRoomForm({ language = "pl" }: MeetingRoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const analytics = useFormAnalytics({
    formType: "meeting-room",
    enabled: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MeetingRoomFormData>({
    resolver: zodResolver(meetingRoomFormSchema),
    defaultValues: {
      gdprConsent: false,
      marketingConsent: false,
      catering: false,
      recurring: false,
      equipment: [],
      attendees: 1,
    },
  })

  const content = {
    pl: {
      title: "Sale Konferencyjne",
      subtitle: "Profesjonalne sale od 30 zł/godzinę",
      description: "Zarezerwuj w pełni wyposażoną salę konferencyjną dla swojego zespołu",
      roomTypes: {
        small: {
          name: "Sala Mała",
          capacity: "2-6 osób",
          price: "30 zł/h",
          features: ["Projektor", "Flipchart", "Wi-Fi", "Klimatyzacja"],
        },
        medium: {
          name: "Sala Średnia",
          capacity: "6-12 osób",
          price: "50 zł/h",
          features: ["Duży ekran", "System audio", "Telekonferencje", "Catering"],
        },
        large: {
          name: "Sala Duża",
          capacity: "12-20 osób",
          price: "80 zł/h",
          features: ["Profesjonalny sprzęt AV", "Streaming", "Tłumaczenia", "Obsługa techniczna"],
        },
        conference: {
          name: "Sala Konferencyjna",
          capacity: "20-50 osób",
          price: "150 zł/h",
          features: ["Pełne wyposażenie", "Obsługa eventów", "Catering premium", "Parking VIP"],
        },
      },
      fields: {
        firstName: "Imię",
        lastName: "Nazwisko",
        email: "Adres email",
        phone: "Numer telefonu",
        companyName: "Nazwa firmy",
        roomType: "Typ sali",
        date: "Data spotkania",
        startTime: "Godzina rozpoczęcia",
        endTime: "Godzina zakończenia",
        attendees: "Liczba uczestników",
        equipment: "Dodatkowe wyposażenie",
        catering: "Catering",
        cateringType: "Typ cateringu",
        recurring: "Spotkanie cykliczne",
        recurringPattern: "Częstotliwość",
        message: "Dodatkowe informacje",
        gdprConsent: "Wyrażam zgodę na przetwarzanie moich danych osobowych",
        marketingConsent: "Wyrażam zgodę na otrzymywanie informacji marketingowych",
      },
      equipmentList: [
        "Dodatkowy projektor",
        "System nagłośnienia",
        "Mikrofony bezprzewodowe",
        "Kamera do streamingu",
        "Tablica interaktywna",
        "Laptop do prezentacji",
      ],
      cateringTypes: {
        coffee: "Kawa i herbata",
        snacks: "Przekąski",
        lunch: "Lunch",
        full: "Pełny catering",
      },
      recurringPatterns: {
        weekly: "Tygodniowo",
        monthly: "Miesięcznie",
      },
      submit: "Zarezerwuj salę",
      submitting: "Rezerwowanie...",
    },
    en: {
      title: "Conference Rooms",
      subtitle: "Professional rooms from 30 PLN/hour",
      description: "Book a fully equipped conference room for your team",
      roomTypes: {
        small: {
          name: "Small Room",
          capacity: "2-6 people",
          price: "30 PLN/h",
          features: ["Projector", "Flipchart", "Wi-Fi", "Air conditioning"],
        },
        medium: {
          name: "Medium Room",
          capacity: "6-12 people",
          price: "50 PLN/h",
          features: ["Large screen", "Audio system", "Video conferencing", "Catering"],
        },
        large: {
          name: "Large Room",
          capacity: "12-20 people",
          price: "80 PLN/h",
          features: ["Professional AV equipment", "Streaming", "Translation", "Technical support"],
        },
        conference: {
          name: "Conference Hall",
          capacity: "20-50 people",
          price: "150 PLN/h",
          features: ["Full equipment", "Event management", "Premium catering", "VIP parking"],
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        companyName: "Company Name",
        roomType: "Room Type",
        date: "Meeting Date",
        startTime: "Start Time",
        endTime: "End Time",
        attendees: "Number of Attendees",
        equipment: "Additional Equipment",
        catering: "Catering",
        cateringType: "Catering Type",
        recurring: "Recurring Meeting",
        recurringPattern: "Frequency",
        message: "Additional Information",
        gdprConsent: "I consent to the processing of my personal data",
        marketingConsent: "I consent to receiving marketing information",
      },
      equipmentList: [
        "Additional projector",
        "Sound system",
        "Wireless microphones",
        "Streaming camera",
        "Interactive whiteboard",
        "Presentation laptop",
      ],
      cateringTypes: {
        coffee: "Coffee and tea",
        snacks: "Snacks",
        lunch: "Lunch",
        full: "Full catering",
      },
      recurringPatterns: {
        weekly: "Weekly",
        monthly: "Monthly",
      },
      submit: "Book Room",
      submitting: "Booking...",
    },
  }

  const t = content[language]

  const onSubmit = async (data: MeetingRoomFormData) => {
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
      const result = await submitMeetingRoomForm(formData)
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

  const handleFieldError = (fieldName: string, error: string) => {
    analytics.trackFieldError(fieldName, error)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-purple-600 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </div>

      {/* Room Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(t.roomTypes).map(([key, room]) => (
          <Card key={key} className="relative hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <div className="text-sm text-gray-600">{room.capacity}</div>
              <div className="text-2xl font-bold text-purple-600">{room.price}</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {room.features.map((feature, index) => (
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
            <Calendar className="w-5 h-5 mr-2" />
            Formularz rezerwacji
          </CardTitle>
          <CardDescription>Zarezerwuj salę konferencyjną dostosowaną do Twoich potrzeb</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            data-testid="contact-form-meeting-room"
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
                {errors.firstName && (
                  <>
                    {handleFieldError("firstName", errors.firstName.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  </>
                )}
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
                {errors.lastName && (
                  <>
                    {handleFieldError("lastName", errors.lastName.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  </>
                )}
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
                  <>
                    {handleFieldError("email", errors.email.message)}
                    <p
                      data-testid="meeting-room-email-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.email.message}
                    </p>
                  </>
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
                {errors.phone && (
                  <>
                    {handleFieldError("phone", errors.phone.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  </>
                )}
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
              {errors.companyName && (
                <>
                  {handleFieldError("companyName", errors.companyName.message)}
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                </>
              )}
            </div>

            {/* Meeting Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomType">{t.fields.roomType} *</Label>
                <Select onValueChange={(value) => setValue("roomType", value as any)}>
                  <SelectTrigger
                    id="roomType"
                    className={errors.roomType ? "border-red-500" : ""}
                    data-testid="roomType-select"
                  >
                    <SelectValue placeholder="Wybierz typ sali" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Sala Mała (2-6 osób) - 30 zł/h</SelectItem>
                    <SelectItem value="medium">Sala Średnia (6-12 osób) - 50 zł/h</SelectItem>
                    <SelectItem value="large">Sala Duża (12-20 osób) - 80 zł/h</SelectItem>
                    <SelectItem value="conference">Sala Konferencyjna (20-50 osób) - 150 zł/h</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roomType && (
                  <>
                    {handleFieldError("roomType", errors.roomType.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.roomType.message}</p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="attendees">{t.fields.attendees} *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="attendees"
                    type="number"
                    min="1"
                    max="100"
                    {...register("attendees", { valueAsNumber: true })}
                    onFocus={() => handleFieldFocus("attendees")}
                    onBlur={() => handleFieldBlur("attendees")}
                    className={`pl-10 ${errors.attendees ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.attendees && (
                  <>
                    {handleFieldError("attendees", errors.attendees.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.attendees.message}</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">{t.fields.date} *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    {...register("date")}
                    onFocus={() => handleFieldFocus("date")}
                    onBlur={() => handleFieldBlur("date")}
                    className={`pl-10 ${errors.date ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.date && (
                  <>
                    {handleFieldError("date", errors.date.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="startTime">{t.fields.startTime} *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime")}
                    onFocus={() => handleFieldFocus("startTime")}
                    onBlur={() => handleFieldBlur("startTime")}
                    className={`pl-10 ${errors.startTime ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.startTime && (
                  <>
                    {handleFieldError("startTime", errors.startTime.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">{t.fields.endTime} *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="endTime"
                    type="time"
                    {...register("endTime")}
                    onFocus={() => handleFieldFocus("endTime")}
                    onBlur={() => handleFieldBlur("endTime")}
                    className={`pl-10 ${errors.endTime ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.endTime && (
                  <>
                    {handleFieldError("endTime", errors.endTime.message)}
                    <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                  </>
                )}
              </div>
            </div>

            {/* Additional Equipment */}
            <div>
              <Label>{t.fields.equipment}</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {t.equipmentList.map((equipment, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`equipment-${index}`}
                      onCheckedChange={(checked) => {
                        const current = watch("equipment") || []
                        if (checked) {
                          setValue("equipment", [...current, equipment])
                        } else {
                          setValue(
                            "equipment",
                            current.filter((e) => e !== equipment),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`equipment-${index}`} className="text-sm">
                      {equipment}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Catering Options */}
            <div className="space-y-4">
              <Label
                htmlFor="catering"
                className="cursor-pointer"
              >
                <Checkbox id="catering" {...register("catering")} />
                <span className="flex items-center">
                  <Coffee className="w-4 h-4 mr-1 pointer-events-none" />
                  {t.fields.catering}
                </span>
              </Label>

              {watch("catering") && (
                <div>
                  <Label htmlFor="cateringType">{t.fields.cateringType}</Label>
                  <Select onValueChange={(value) => setValue("cateringType", value as any)}>
                    <SelectTrigger
                      id="cateringType"
                      data-testid="cateringType-select"
                    >
                      <SelectValue placeholder="Wybierz typ cateringu" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.cateringTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Recurring Meeting */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="recurring" {...register("recurring")} />
                <Label htmlFor="recurring">{t.fields.recurring}</Label>
              </div>

              {watch("recurring") && (
                <div>
                  <Label htmlFor="recurringPattern">{t.fields.recurringPattern}</Label>
                  <Select onValueChange={(value) => setValue("recurringPattern", value as any)}>
                    <SelectTrigger
                      id="recurringPattern"
                      data-testid="recurringPattern-select"
                    >
                      <SelectValue placeholder="Wybierz częstotliwość" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.recurringPatterns).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                placeholder="Dodatkowe wymagania, agenda spotkania..."
              />
              {errors.message && (
                <>
                  {handleFieldError("message", errors.message.message)}
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                </>
              )}
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
                    Zgodnie z RODO, Twoje dane będą przetwarzane w celu realizacji rezerwacji i kontaktu z Tobą.
                  </p>
                </div>
              </div>
              {errors.gdprConsent && (
                <>
                  {handleFieldError("gdprConsent", errors.gdprConsent.message)}
                  <p className="text-red-500 text-sm">{errors.gdprConsent.message}</p>
                </>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox id="marketingConsent" {...register("marketingConsent")} />
                <Label htmlFor="marketingConsent" className="text-sm">
                  {t.fields.marketingConsent}
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
