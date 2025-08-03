"use server"

import type { z } from "zod"
import {
  virtualOfficeFormSchema,
  coworkingFormSchema,
  meetingRoomFormSchema,
  advertisingFormSchema,
  specialDealsFormSchema,
} from "./validation-schemas"

// Email service configuration
const EMAIL_CONFIG = {
  from: process.env.SMTP_FROM || "noreply@gliwicka111.pl",
  adminEmail: process.env.ADMIN_EMAIL || "admin@gliwicka111.pl",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number.parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
}

// Database simulation (in production, use proper database)
const submissions: any[] = []

// Generic form submission handler
async function handleFormSubmission<T>(
  formData: FormData,
  schema: z.ZodSchema<T>,
  formType: string,
): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
  try {
    // Convert FormData to object
    const data = Object.fromEntries(formData.entries())

    // Handle checkboxes and arrays
    const processedData = {
      ...data,
      gdprConsent: formData.get("gdprConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
      additionalServices: formData.getAll("additionalServices"),
      equipment: formData.getAll("equipment"),
      campaignGoals: formData.getAll("campaignGoals"),
      interestedServices: formData.getAll("interestedServices"),
    }

    // Validate data
    const validationResult = schema.safeParse(processedData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.errors.forEach((error) => {
        const path = error.path.join(".")
        errors[path] = error.message
      })

      return {
        success: false,
        message: "Formularz zawiera błędy. Sprawdź wprowadzone dane.",
        errors,
      }
    }

    // Sanitize and store submission
    const sanitizedData = sanitizeSubmissionData(validationResult.data)
    const submission = {
      id: generateSubmissionId(),
      formType,
      data: sanitizedData,
      submittedAt: new Date().toISOString(),
      status: "pending",
      ipHash: await hashIP(getClientIP()),
    }

    submissions.push(submission)

    // Send confirmation email
    await sendConfirmationEmail(sanitizedData, formType)

    // Send notification to admin
    await sendAdminNotification(sanitizedData, formType)

    return {
      success: true,
      message: "Formularz został wysłany pomyślnie. Skontaktujemy się z Tobą wkrótce.",
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.",
    }
  }
}

// Virtual Office Form Action
export async function submitVirtualOfficeForm(formData: FormData) {
  return handleFormSubmission(formData, virtualOfficeFormSchema, "virtual-office")
}

// Coworking Form Action
export async function submitCoworkingForm(formData: FormData) {
  return handleFormSubmission(formData, coworkingFormSchema, "coworking")
}

// Meeting Room Form Action
export async function submitMeetingRoomForm(formData: FormData) {
  return handleFormSubmission(formData, meetingRoomFormSchema, "meeting-room")
}

// Advertising Form Action
export async function submitAdvertisingForm(formData: FormData) {
  return handleFormSubmission(formData, advertisingFormSchema, "advertising")
}

// Special Deals Form Action
export async function submitSpecialDealsForm(formData: FormData) {
  return handleFormSubmission(formData, specialDealsFormSchema, "special-deals")
}

// Utility functions
function sanitizeSubmissionData(data: any): any {
  const sanitized = { ...data }

  // Remove sensitive fields that shouldn't be stored
  delete sanitized.gdprConsent
  delete sanitized.marketingConsent

  // Sanitize string fields
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key]
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
    }
  })

  return sanitized
}

function generateSubmissionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto")
  const salt = process.env.IP_SALT || "default-salt"
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 16)
}

function getClientIP(): string {
  // In a real application, you would extract this from headers
  return "127.0.0.1"
}

async function sendConfirmationEmail(data: any, formType: string): Promise<void> {
  // Email sending logic would go here
  // For now, we'll just log it
  console.log(`Sending confirmation email for ${formType}:`, {
    to: data.email,
    subject: getEmailSubject(formType, "pl"),
    template: formType,
  })

  // In production, you would use a service like:
  // - Nodemailer
  // - SendGrid
  // - AWS SES
  // - Resend
}

async function sendAdminNotification(data: any, formType: string): Promise<void> {
  console.log(`Sending admin notification for ${formType}:`, {
    to: EMAIL_CONFIG.adminEmail,
    subject: `Nowe zgłoszenie: ${formType}`,
    data: {
      formType,
      submittedAt: new Date().toISOString(),
      customerEmail: data.email,
      customerName: `${data.firstName} ${data.lastName}`,
    },
  })
}

function getEmailSubject(formType: string, language: "pl" | "en"): string {
  const subjects = {
    pl: {
      "virtual-office": "Potwierdzenie zapytania o biuro wirtualne - Gliwicka 111",
      coworking: "Potwierdzenie zapytania o coworking - Gliwicka 111",
      "meeting-room": "Potwierdzenie rezerwacji sali - Gliwicka 111",
      advertising: "Potwierdzenie zapytania o reklamę - Gliwicka 111",
      "special-deals": "Potwierdzenie zapytania o oferty specjalne - Gliwicka 111",
    },
    en: {
      "virtual-office": "Virtual Office Inquiry Confirmation - Gliwicka 111",
      coworking: "Coworking Inquiry Confirmation - Gliwicka 111",
      "meeting-room": "Meeting Room Booking Confirmation - Gliwicka 111",
      advertising: "Advertising Inquiry Confirmation - Gliwicka 111",
      "special-deals": "Special Deals Inquiry Confirmation - Gliwicka 111",
    },
  }

  return subjects[language][formType as keyof (typeof subjects)[typeof language]] || "Potwierdzenie - Gliwicka 111"
}

// Admin functions
export async function getSubmissions(page = 1, limit = 10) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    submissions: submissions.slice(startIndex, endIndex),
    total: submissions.length,
    page,
    totalPages: Math.ceil(submissions.length / limit),
  }
}

export async function updateSubmissionStatus(id: string, status: "pending" | "contacted" | "completed" | "cancelled") {
  const submission = submissions.find((sub) => sub.id === id)
  if (submission) {
    submission.status = status
    submission.updatedAt = new Date().toISOString()
    return { success: true }
  }
  return { success: false, message: "Submission not found" }
}

export async function deleteSubmission(id: string) {
  const index = submissions.findIndex((sub) => sub.id === id)
  if (index !== -1) {
    submissions.splice(index, 1)
    return { success: true }
  }
  return { success: false, message: "Submission not found" }
}
