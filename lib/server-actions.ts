"use server";

import type { z } from "zod";
import {
  virtualOfficeFormSchema,
  coworkingFormSchema,
  meetingRoomFormSchema,
  advertisingFormSchema,
  specialDealsFormSchema,
} from "./validation-schemas";
import { db } from "./database/connection-pool";
import { emailClient } from "./email/smtp-client";

// Email service configuration
const EMAIL_CONFIG = {
  from: process.env.SMTP_FROM || "noreply@gliwicka111.pl",
  adminEmail: process.env.ADMIN_EMAIL || "admin@gliwicka111.pl",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number.parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

// Generic form submission handler
async function handleFormSubmission<T>(
  formData: FormData,
  schema: z.ZodSchema<T>,
  formType: string,
  language: "pl" | "en" = "pl",
): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}> {
  try {
    // Convert FormData to object
    const data = Object.fromEntries(formData.entries());
    const sessionId = typeof data.sessionId === "string" ? data.sessionId : null;
    delete (data as any).sessionId;

    // Handle checkboxes and arrays
    const processedData = {
      ...data,
      gdprConsent: formData.get("gdprConsent") === "on",
      marketingConsent: formData.get("marketingConsent") === "on",
      additionalServices: formData.getAll("additionalServices"),
      equipment: formData.getAll("equipment"),
      campaignGoals: formData.getAll("campaignGoals"),
      interestedServices: formData.getAll("interestedServices"),
    };

    ["teamSize", "attendees", "budget"].forEach((field) => {
      if (
        processedData[field] !== undefined &&
        !Number.isNaN(Number(processedData[field]))
      ) {
        processedData[field] = Number(processedData[field]);
      }
    });

    // Validate data
    const validationResult = schema.safeParse(processedData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      return {
        success: false,
        message: "Formularz zawiera błędy. Sprawdź wprowadzone dane.",
        errors,
      };
    }

    // Sanitize and store submission
    const sanitizedData = sanitizeSubmissionData(validationResult.data);
    const submission = {
      id: generateSubmissionId(),
      formType,
      data: sanitizedData,
      submittedAt: new Date().toISOString(),
      status: "pending",
      ipHash: await hashIP(getClientIP()),
      sessionId,
    };

    await db.query(
      `INSERT INTO form_submissions (id, form_type, data, status, ip_hash, session_id) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        submission.id,
        formType,
        JSON.stringify(sanitizedData),
        submission.status,
        submission.ipHash,
        submission.sessionId,
      ],
    );

    // Attempt to send emails without affecting user response
    const emailResults = await Promise.allSettled([
      sendConfirmationEmail(sanitizedData, formType, language),
      sendAdminNotification(sanitizedData, formType, language),
    ]);

    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const type = index === 0 ? "confirmation" : "admin";
        console.error(`Failed to send ${type} email:`, result.reason);
        void enqueueFailedEmail(type, sanitizedData, result.reason);
      }
    });

    return {
      success: true,
      message:
        "Formularz został wysłany pomyślnie. Skontaktujemy się z Tobą wkrótce.",
    };
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.",
    };
  }
}

// Virtual Office Form Action
export async function submitVirtualOfficeForm(
  formData: FormData,
  language: "pl" | "en" = "pl",
) {
  return handleFormSubmission(
    formData,
    virtualOfficeFormSchema,
    "virtual-office",
    language,
  );
}

// Coworking Form Action
export async function submitCoworkingForm(
  formData: FormData,
  language: "pl" | "en" = "pl",
) {
  return handleFormSubmission(
    formData,
    coworkingFormSchema,
    "coworking",
    language,
  );
}

// Meeting Room Form Action
export async function submitMeetingRoomForm(
  formData: FormData,
  language: "pl" | "en" = "pl",
) {
  return handleFormSubmission(
    formData,
    meetingRoomFormSchema,
    "meeting-room",
    language,
  );
}

// Advertising Form Action
export async function submitAdvertisingForm(
  formData: FormData,
  language: "pl" | "en" = "pl",
) {
  return handleFormSubmission(
    formData,
    advertisingFormSchema,
    "advertising",
    language,
  );
}

// Special Deals Form Action
export async function submitSpecialDealsForm(
  formData: FormData,
  language: "pl" | "en" = "pl",
) {
  return handleFormSubmission(
    formData,
    specialDealsFormSchema,
    "special-deals",
    language,
  );
}

// Utility functions
function sanitizeSubmissionData(data: any): any {
  const sanitized = { ...data };

  // Remove sensitive fields that shouldn't be stored
  delete sanitized.gdprConsent;
  delete sanitized.marketingConsent;

  // Sanitize string fields
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key]
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "");
    }
  });

  return sanitized;
}

function generateSubmissionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto");
  const salt = process.env.IP_SALT || "default-salt";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 16);
}

function getClientIP(): string {
  // In a real application, you would extract this from headers
  return "127.0.0.1";
}

async function sendConfirmationEmail(
  data: any,
  formType: string,
  language: "pl" | "en",
): Promise<void> {
  await emailClient.sendEmail({
    to: data.email,
    subject: getEmailSubject(formType, language),
    text: getEmailBody(formType, language),
  });
}

async function sendAdminNotification(
  data: any,
  formType: string,
  language: "pl" | "en",
): Promise<void> {
  const subject =
    language === "en"
      ? `New submission: ${formType}`
      : `Nowe zgłoszenie: ${formType}`;
  const text =
    language === "en"
      ? `New submission from ${data.email} regarding ${formType}.`
      : `Nowe zgłoszenie od ${data.email} dotyczące ${formType}.`;
  await emailClient.sendEmail({
    to: EMAIL_CONFIG.adminEmail,
    subject,
    text,
  });
}

async function enqueueFailedEmail(
  type: "confirmation" | "admin",
  data: any,
  error: unknown,
): Promise<void> {
  console.log(`Enqueuing ${type} email for retry`, { data, error });
}

function getEmailSubject(formType: string, language: "pl" | "en"): string {
  const subjects = {
    pl: {
      "virtual-office":
        "Potwierdzenie zapytania o biuro wirtualne - Gliwicka 111",
      coworking: "Potwierdzenie zapytania o coworking - Gliwicka 111",
      "meeting-room": "Potwierdzenie rezerwacji sali - Gliwicka 111",
      advertising: "Potwierdzenie zapytania o reklamę - Gliwicka 111",
      "special-deals":
        "Potwierdzenie zapytania o oferty specjalne - Gliwicka 111",
    },
    en: {
      "virtual-office": "Virtual Office Inquiry Confirmation - Gliwicka 111",
      coworking: "Coworking Inquiry Confirmation - Gliwicka 111",
      "meeting-room": "Meeting Room Booking Confirmation - Gliwicka 111",
      advertising: "Advertising Inquiry Confirmation - Gliwicka 111",
      "special-deals": "Special Deals Inquiry Confirmation - Gliwicka 111",
    },
  };

  return (
    subjects[language][formType as keyof (typeof subjects)[typeof language]] ||
    "Potwierdzenie - Gliwicka 111"
  );
}

function getEmailBody(formType: string, language: "pl" | "en"): string {
  const bodies = {
    pl: {
      "virtual-office":
        "Dziękujemy za zgłoszenie dotyczące biura wirtualnego. Skontaktujemy się wkrótce.",
      coworking:
        "Dziękujemy za zgłoszenie dotyczące coworkingu. Skontaktujemy się wkrótce.",
      "meeting-room":
        "Dziękujemy za rezerwację sali. Skontaktujemy się wkrótce.",
      advertising:
        "Dziękujemy za zapytanie o reklamę. Skontaktujemy się wkrótce.",
      "special-deals":
        "Dziękujemy za zapytanie o oferty specjalne. Skontaktujemy się wkrótce.",
    },
    en: {
      "virtual-office":
        "Thank you for your virtual office inquiry. We will contact you soon.",
      coworking:
        "Thank you for your coworking inquiry. We will contact you soon.",
      "meeting-room":
        "Thank you for your meeting room booking. We will contact you soon.",
      advertising:
        "Thank you for your advertising inquiry. We will contact you soon.",
      "special-deals":
        "Thank you for your special deals inquiry. We will contact you soon.",
    },
  };

  return (
    bodies[language][formType as keyof (typeof bodies)[typeof language]] ||
    (language === "en"
      ? "Thank you for your submission. We will contact you soon."
      : "Dziękujemy za zgłoszenie. Skontaktujemy się wkrótce.")
  );
}

// Admin functions
export async function getSubmissions(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const result = await db.query(
    `SELECT id, form_type as "formType", data, status, created_at as "submittedAt" FROM form_submissions ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const countResult = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text as count FROM form_submissions`,
  );
  const total = Number.parseInt(countResult.rows[0]?.count || "0");
  return {
    submissions: result.rows.map((row) => ({
      ...row,
      data: typeof row.data === "string" ? JSON.parse(row.data) : row.data,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateSubmissionStatus(
  id: string,
  status: "pending" | "contacted" | "completed" | "cancelled",
) {
  const result = await db.query(
    `UPDATE form_submissions SET status=$1, updated_at=NOW() WHERE id=$2`,
    [status, id],
  );
  if (result.rowCount > 0) {
    return { success: true };
  }
  return { success: false, message: "Submission not found" };
}

export async function deleteSubmission(id: string) {
  const result = await db.query(`DELETE FROM form_submissions WHERE id=$1`, [
    id,
  ]);
  if (result.rowCount > 0) {
    return { success: true };
  }
  return { success: false, message: "Submission not found" };
}
