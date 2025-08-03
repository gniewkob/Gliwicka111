import { z } from "zod"

// Common validation patterns
const phoneRegex = /^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3}|\d{2}\s?\d{3}\s?\d{2}\s?\d{2})$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nipRegex = /^\d{10}$/

// Base form schema
const baseFormSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki").max(50, "Imię nie może być dłuższe niż 50 znaków"),
  lastName: z
    .string()
    .min(2, "Nazwisko musi mieć co najmniej 2 znaki")
    .max(50, "Nazwisko nie może być dłuższe niż 50 znaków"),
  email: z.string().regex(emailRegex, "Nieprawidłowy format adresu email"),
  phone: z.string().regex(phoneRegex, "Nieprawidłowy format numeru telefonu"),
  companyName: z
    .string()
    .min(2, "Nazwa firmy musi mieć co najmniej 2 znaki")
    .max(100, "Nazwa firmy nie może być dłuższa niż 100 znaków")
    .optional(),
  message: z.string().max(1000, "Wiadomość nie może być dłuższa niż 1000 znaków").optional(),
  gdprConsent: z.boolean().refine((val) => val === true, "Zgoda na przetwarzanie danych jest wymagana"),
  marketingConsent: z.boolean().optional(),
})

// Virtual Office Form Schema
export const virtualOfficeFormSchema = baseFormSchema.extend({
  package: z.enum(["basic", "standard", "premium"], {
    required_error: "Wybór pakietu jest wymagany",
  }),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  additionalServices: z.array(z.string()).optional(),
  nip: z.string().regex(nipRegex, "NIP musi składać się z 10 cyfr").optional(),
  businessType: z.enum(["sole-proprietorship", "llc", "corporation", "other"], {
    required_error: "Typ działalności jest wymagany",
  }),
})

// Coworking Form Schema
export const coworkingFormSchema = baseFormSchema.extend({
  workspaceType: z.enum(["hot-desk", "dedicated-desk", "private-office"], {
    required_error: "Typ przestrzeni roboczej jest wymagany",
  }),
  duration: z.enum(["daily", "weekly", "monthly", "yearly"], {
    required_error: "Okres wynajmu jest wymagany",
  }),
  startDate: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  teamSize: z.number().min(1, "Wielkość zespołu musi być co najmniej 1").max(50, "Maksymalna wielkość zespołu to 50"),
  specialRequirements: z.string().max(500, "Wymagania specjalne nie mogą być dłuższe niż 500 znaków").optional(),
  trialDay: z.boolean().optional(),
})

// Meeting Room Form Schema
export const meetingRoomFormSchema = baseFormSchema.extend({
  roomType: z.enum(["small", "medium", "large", "conference"], {
    required_error: "Typ sali jest wymagany",
  }),
  date: z.string().min(1, "Data spotkania jest wymagana"),
  startTime: z.string().min(1, "Godzina rozpoczęcia jest wymagana"),
  endTime: z.string().min(1, "Godzina zakończenia jest wymagana"),
  attendees: z
    .number()
    .min(1, "Liczba uczestników musi być co najmniej 1")
    .max(100, "Maksymalna liczba uczestników to 100"),
  equipment: z.array(z.string()).optional(),
  catering: z.boolean().optional(),
  cateringType: z.enum(["coffee", "lunch", "snacks", "full"]).optional(),
  recurring: z.boolean().optional(),
  recurringPattern: z.enum(["weekly", "monthly"]).optional(),
})

// Advertising Form Schema
export const advertisingFormSchema = baseFormSchema.extend({
  campaignType: z.enum(["mobile-billboard", "static-billboard", "digital"], {
    required_error: "Typ kampanii jest wymagany",
  }),
  duration: z.enum(["1-week", "2-weeks", "1-month", "3-months", "6-months"], {
    required_error: "Czas trwania kampanii jest wymagany",
  }),
  startDate: z.string().min(1, "Data rozpoczęcia kampanii jest wymagana"),
  budget: z.enum(["under-1000", "1000-5000", "5000-10000", "over-10000"], {
    required_error: "Budżet jest wymagany",
  }),
  targetAudience: z.string().max(300, "Opis grupy docelowej nie może być dłuższy niż 300 znaków").optional(),
  campaignGoals: z.array(z.string()).optional(),
  previousExperience: z.boolean().optional(),
})

// Special Deals Form Schema
export const specialDealsFormSchema = baseFormSchema.extend({
  dealType: z.enum(["welcome-package", "referral", "student", "startup", "long-term"], {
    required_error: "Typ oferty jest wymagany",
  }),
  interestedServices: z.array(z.string()).min(1, "Wybierz co najmniej jedną usługę"),
  currentSituation: z.enum(["new-business", "expanding", "relocating", "cost-cutting"], {
    required_error: "Obecna sytuacja jest wymagana",
  }),
  timeline: z.enum(["immediate", "1-month", "3-months", "6-months"], {
    required_error: "Harmonogram jest wymagany",
  }),
  referralSource: z.string().max(100, "Źródło polecenia nie może być dłuższe niż 100 znaków").optional(),
  specificNeeds: z.string().max(500, "Szczególne potrzeby nie mogą być dłuższe niż 500 znaków").optional(),
})

// Export all schemas
export { baseFormSchema, phoneRegex, emailRegex, nipRegex }

// Type exports
export type VirtualOfficeFormData = z.infer<typeof virtualOfficeFormSchema>
export type CoworkingFormData = z.infer<typeof coworkingFormSchema>
export type MeetingRoomFormData = z.infer<typeof meetingRoomFormSchema>
export type AdvertisingFormData = z.infer<typeof advertisingFormSchema>
export type SpecialDealsFormData = z.infer<typeof specialDealsFormSchema>
