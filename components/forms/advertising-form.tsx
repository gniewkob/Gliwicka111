"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/components/ui";
import {
  advertisingFormSchema,
  type AdvertisingFormData,
} from "@/lib/validation-schemas";
import { submitAdvertisingForm } from "@/lib/server-actions";
import { analyticsClient } from "@/lib/analytics-client";
import { useFormAnalytics } from "@/hooks/use-form-analytics";
import { messages } from "@/lib/i18n";
import {
  Megaphone,
  Truck,
  Monitor,
  Target,
  Calendar,
  Shield,
  CheckCircle,
} from "lucide-react";

interface AdvertisingFormProps {
  language?: "pl" | "en";
}

export default function AdvertisingForm({
  language = "pl",
}: AdvertisingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const analytics = useFormAnalytics({
    formType: "advertising",
    enabled: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AdvertisingFormData>({
    resolver: zodResolver(advertisingFormSchema),
    defaultValues: {
      gdprConsent: false,
      marketingConsent: false,
      previousExperience: false,
      campaignGoals: [],
    },
  });

  const content = {
    pl: {
      title: "Reklama Mobilna",
      subtitle: "Mobilny billboard od 350 zł/tydzień",
      description: "Dotrzej do swoich klientów z mobilną kampanią reklamową",
      campaignTypes: {
        "mobile-billboard": {
          name: "Billboard Mobilny",
          price: "350 zł/tydzień",
          description: "Przyczepa reklamowa 5m x 3m poruszająca się po mieście",
          features: [
            "Duża powierzchnia reklamowa",
            "Mobilność",
            "Wysoka widoczność",
            "Elastyczne trasy",
          ],
        },
        "static-billboard": {
          name: "Billboard Stacjonarny",
          price: "200 zł/tydzień",
          description: "Stały billboard przy głównej drodze",
          features: [
            "Stała lokalizacja",
            "24/7 widoczność",
            "Duży ruch",
            "Długoterminowa ekspozycja",
          ],
        },
        digital: {
          name: "Reklama Cyfrowa",
          price: "500 zł/tydzień",
          description: "Ekran LED z możliwością zmiany treści",
          features: [
            "Dynamiczne treści",
            "Pełny kolor",
            "Animacje",
            "Zdalne zarządzanie",
          ],
        },
      },
      fields: {
        firstName: "Imię",
        lastName: "Nazwisko",
        email: "Adres email",
        phone: "Numer telefonu",
        companyName: "Nazwa firmy",
        campaignType: "Typ kampanii",
        duration: "Czas trwania",
        startDate: "Data rozpoczęcia",
        budget: "Budżet",
        targetAudience: "Grupa docelowa",
        campaignGoals: "Cele kampanii",
        previousExperience: "Poprzednie doświadczenia z reklamą",
        message: "Dodatkowe informacje",
        gdprConsent: "Wyrażam zgodę na przetwarzanie moich danych osobowych",
        marketingConsent:
          "Wyrażam zgodę na otrzymywanie informacji marketingowych",
      },
      durations: {
        "1-week": "1 tydzień",
        "2-weeks": "2 tygodnie",
        "1-month": "1 miesiąc",
        "3-months": "3 miesiące",
        "6-months": "6 miesięcy",
      },
      budgets: {
        "under-1000": "Poniżej 1000 zł",
        "1000-5000": "1000 - 5000 zł",
        "5000-10000": "5000 - 10000 zł",
        "over-10000": "Powyżej 10000 zł",
      },
      campaignGoalsList: [
        "Zwiększenie świadomości marki",
        "Promocja nowego produktu",
        "Zwiększenie sprzedaży",
        "Budowanie wizerunku",
        "Promocja wydarzenia",
        "Dotarcie do nowych klientów",
      ],
      submit: "Wyślij zapytanie",
      submitting: "Wysyłanie...",
    },
    en: {
      title: "Mobile Advertising",
      subtitle: "Mobile billboard from 350 PLN/week",
      description: "Reach your customers with mobile advertising campaign",
      campaignTypes: {
        "mobile-billboard": {
          name: "Mobile Billboard",
          price: "350 PLN/week",
          description: "5m x 3m advertising trailer moving around the city",
          features: [
            "Large advertising space",
            "Mobility",
            "High visibility",
            "Flexible routes",
          ],
        },
        "static-billboard": {
          name: "Static Billboard",
          price: "200 PLN/week",
          description: "Fixed billboard on main road",
          features: [
            "Fixed location",
            "24/7 visibility",
            "High traffic",
            "Long-term exposure",
          ],
        },
        digital: {
          name: "Digital Advertising",
          price: "500 PLN/week",
          description: "LED screen with content change capability",
          features: [
            "Dynamic content",
            "Full color",
            "Animations",
            "Remote management",
          ],
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        companyName: "Company Name",
        campaignType: "Campaign Type",
        duration: "Duration",
        startDate: "Start Date",
        budget: "Budget",
        targetAudience: "Target Audience",
        campaignGoals: "Campaign Goals",
        previousExperience: "Previous advertising experience",
        message: "Additional Information",
        gdprConsent: "I consent to the processing of my personal data",
        marketingConsent: "I consent to receiving marketing information",
      },
      durations: {
        "1-week": "1 week",
        "2-weeks": "2 weeks",
        "1-month": "1 month",
        "3-months": "3 months",
        "6-months": "6 months",
      },
      budgets: {
        "under-1000": "Under 1000 PLN",
        "1000-5000": "1000 - 5000 PLN",
        "5000-10000": "5000 - 10000 PLN",
        "over-10000": "Over 10000 PLN",
      },
      campaignGoalsList: [
        "Increase brand awareness",
        "Promote new product",
        "Increase sales",
        "Build brand image",
        "Event promotion",
        "Reach new customers",
      ],
      submit: "Send Inquiry",
      submitting: "Sending...",
    },
  };

  const t = content[language];

  const onSubmit = async (data: AdvertisingFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    analytics.trackSubmissionAttempt();

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append("sessionId", analyticsClient.getSessionId());
      const result = await submitAdvertisingForm(formData);
      const message =
        result.message ??
        (result.success
          ? messages.form.success[language]
          : messages.form.serverError[language]);
      setSubmitResult({ success: result.success, message });
      if (result.success) {
        analytics.trackSubmissionSuccess();
        reset();
      } else {
        analytics.trackSubmissionError(message);
      }
    } catch (error) {
      const errorMessage =
        language === "en"
          ? "An unexpected error occurred"
          : "Wystąpił nieoczekiwany błąd";
      analytics.trackSubmissionError(errorMessage);
      setSubmitResult({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    analytics.trackFieldFocus(fieldName);
    if (!watch("firstName") && fieldName === "firstName") {
      analytics.trackFormStart();
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    analytics.trackFieldBlur(fieldName);
  };

  const handleFieldError = (fieldName: string, error?: string) => {
    if (!error) return;
    analytics.trackFieldError(fieldName, error);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <Megaphone className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-orange-600 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </div>

      {/* Campaign Types */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Object.entries(t.campaignTypes).map(([key, campaign]) => (
          <Card
            key={key}
            className="relative hover:shadow-lg transition-shadow"
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                {key === "mobile-billboard" && (
                  <Truck className="w-6 h-6 text-orange-600" />
                )}
                {key === "static-billboard" && (
                  <Megaphone className="w-6 h-6 text-orange-600" />
                )}
                {key === "digital" && (
                  <Monitor className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <CardTitle className="text-lg">{campaign.name}</CardTitle>
              <div className="text-2xl font-bold text-orange-600">
                {campaign.price}
              </div>
              <CardDescription className="text-sm">
                {campaign.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.features.map((feature, index) => (
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
            <Target className="w-5 h-5 mr-2" />
            Formularz kampanii reklamowej
          </CardTitle>
          <CardDescription>
            Opisz swoją kampanię, a przygotujemy dla Ciebie spersonalizowaną
            ofertę
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitResult && (
            <Alert
              data-testid={
                submitResult.success ? "form-success-alert" : "form-error-alert"
              }
              variant={submitResult.success ? "default" : "destructive"}
            >
              <AlertDescription>{submitResult.message}</AlertDescription>
            </Alert>
          )}
          <form
            noValidate
            data-testid="contact-form-advertising"
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
                    <p
                      data-testid="advertising-firstName-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.firstName.message}
                    </p>
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
                    <p
                      data-testid="advertising-lastName-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.lastName.message}
                    </p>
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
                      data-testid="advertising-email-error"
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
                    <p
                      data-testid="advertising-phone-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.phone.message}
                    </p>
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
                  <p
                    data-testid="advertising-companyName-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.companyName.message}
                  </p>
                </>
              )}
            </div>

            {/* Campaign Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignType">{t.fields.campaignType} *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("campaignType", value as any)
                  }
                >
                  <SelectTrigger
                    className={errors.campaignType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Wybierz typ kampanii" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile-billboard">
                      Billboard Mobilny (350 zł/tydzień)
                    </SelectItem>
                    <SelectItem value="static-billboard">
                      Billboard Stacjonarny (200 zł/tydzień)
                    </SelectItem>
                    <SelectItem value="digital">
                      Reklama Cyfrowa (500 zł/tydzień)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.campaignType && (
                  <>
                    {handleFieldError(
                      "campaignType",
                      errors.campaignType.message,
                    )}
                    <p
                      data-testid="advertising-campaignType-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.campaignType.message}
                    </p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="duration">{t.fields.duration} *</Label>
                <Select
                  onValueChange={(value) => setValue("duration", value as any)}
                >
                  <SelectTrigger
                    className={errors.duration ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Wybierz czas trwania" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.durations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <>
                    {handleFieldError("duration", errors.duration.message)}
                    <p
                      data-testid="advertising-duration-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.duration.message}
                    </p>
                  </>
                )}
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
                {errors.startDate && (
                  <>
                    {handleFieldError("startDate", errors.startDate.message)}
                    <p
                      data-testid="advertising-startDate-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.startDate.message}
                    </p>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="budget">{t.fields.budget} *</Label>
                <Select
                  onValueChange={(value) => setValue("budget", value as any)}
                >
                  <SelectTrigger
                    className={errors.budget ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Wybierz budżet" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.budgets).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.budget && (
                  <>
                    {handleFieldError("budget", errors.budget.message)}
                    <p
                      data-testid="advertising-budget-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.budget.message}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">{t.fields.targetAudience}</Label>
              <Textarea
                id="targetAudience"
                {...register("targetAudience")}
                onFocus={() => handleFieldFocus("targetAudience")}
                onBlur={() => handleFieldBlur("targetAudience")}
                className={errors.targetAudience ? "border-red-500" : ""}
                rows={3}
                placeholder="Opisz swoją grupę docelową: wiek, zainteresowania, lokalizacja..."
              />
              {errors.targetAudience && (
                <>
                  {handleFieldError(
                    "targetAudience",
                    errors.targetAudience.message,
                  )}
                  <p
                    data-testid="advertising-targetAudience-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.targetAudience.message}
                  </p>
                </>
              )}
            </div>

            {/* Campaign Goals */}
            <div>
              <Label>{t.fields.campaignGoals}</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {t.campaignGoalsList.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`goal-${index}`}
                      onCheckedChange={(checked) => {
                        const current = watch("campaignGoals") || [];
                        if (checked) {
                          setValue("campaignGoals", [...current, goal]);
                        } else {
                          setValue(
                            "campaignGoals",
                            current.filter((g) => g !== goal),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`goal-${index}`} className="text-sm">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="previousExperience"
                {...register("previousExperience")}
              />
              <Label htmlFor="previousExperience">
                {t.fields.previousExperience}
              </Label>
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
                placeholder="Opisz swoją kampanię, cele, oczekiwania..."
              />
              {errors.message && (
                <>
                  {handleFieldError("message", errors.message.message)}
                  <p
                    data-testid="advertising-message-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.message.message}
                  </p>
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
                    Zgodnie z RODO, Twoje dane będą przetwarzane w celu
                    realizacji kampanii reklamowej i kontaktu z Tobą.
                  </p>
                </div>
              </div>
              {errors.gdprConsent && (
                <>
                  {handleFieldError("gdprConsent", errors.gdprConsent.message)}
                  <p
                    data-testid="advertising-gdprConsent-error"
                    className="text-red-500 text-sm"
                  >
                    {errors.gdprConsent.message}
                  </p>
                </>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketingConsent"
                  {...register("marketingConsent")}
                />
                <Label htmlFor="marketingConsent" className="text-sm">
                  {t.fields.marketingConsent}
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
