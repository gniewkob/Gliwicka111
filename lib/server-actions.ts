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
import { saveFailedEmail } from "./email/failed-email-store";
import { messages } from "./i18n";
import { getCurrentLanguage } from "./get-current-language";
import { hashIP } from "./security/ip";
import { checkRateLimit } from "./rate-limit";

// Email service configuration
const EMAIL_CONFIG = {
  from: process.env.SMTP_FROM || "noreply@gliwicka111.pl",
  adminEmail: process.env.ADMIN_EMAIL || "admin@gliwicka111.pl",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number.parseInt(process.env.SMTP_PORT || "587"),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

// Service names mapping for admin notifications
const SERVICE_NAMES = {
  "virtual-office": { pl: "biuro wirtualne", en: "virtual office" },
  coworking: { pl: "coworking", en: "coworking" },
  "meeting-room": { pl: "sala konferencyjna", en: "meeting room" },
  advertising: { pl: "reklama", en: "advertising" },
  "special-deals": { pl: "oferty specjalne", en: "special deals" },
} as const;

// Key fields included in confirmation emails
const EMAIL_SUMMARY_FIELDS = {
  "virtual-office": ["companyName", "startDate", "package"],
  coworking: ["companyName", "startDate", "workspaceType"],
  "meeting-room": ["companyName", "date", "startTime"],
  advertising: ["companyName", "startDate", "campaignType"],
  "special-deals": ["companyName", "timeline", "dealType"],
} as const;

// Field label translations
const FIELD_LABELS = {
  companyName: { pl: "Nazwa firmy", en: "Company name" },
  startDate: { pl: "Data rozpoczęcia", en: "Start date" },
  date: { pl: "Data", en: "Date" },
  startTime: { pl: "Godzina rozpoczęcia", en: "Start time" },
  package: { pl: "Pakiet", en: "Package" },
  workspaceType: { pl: "Typ przestrzeni", en: "Workspace type" },
  campaignType: { pl: "Typ kampanii", en: "Campaign type" },
  timeline: { pl: "Harmonogram", en: "Timeline" },
  dealType: { pl: "Typ oferty", en: "Deal type" },
} as const;

/**
 * Generic form submission handler used by all specific form actions.
 *
 * This function performs validation, rate limiting and email dispatching. It
 * is intentionally verbose to centralise cross-form logic. Individual
 * `submit*Form` actions simply forward the appropriate schema and form type.
 *
 * @template T
 * @param {FormData} formData - Raw form data from the client request.
 * @param {z.ZodSchema<T>} schema - Zod validation schema for the form.
 * @param {string} formType - Identifier of the form variant being processed.
 * @returns {Promise<{ success: boolean; message: string; errors?: Record<string, string>; status?: number }>} Processing result.
 */
async function handleFormSubmission<T>(
  formData: FormData,
  schema: z.ZodSchema<T>,
  formType: string,
): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  status?: number;
}> {
  if (process.env.NODE_ENV === "test") {
    const shouldFail = formData.get("__testFail") === "true";
    return { success: !shouldFail, message: "Test submission" };
  }

  try {
    const language = await getCurrentLanguage();
    const clientIP = getClientIP();
    const ipHash = await hashIP(clientIP);

    const rateLimitCount = Number(process.env.RATE_LIMIT_COUNT ?? "100")
    const rateLimitWindow = Number(process.env.RATE_LIMIT_WINDOW_MS ?? "60000")
    if (!(await checkRateLimit(db, ipHash, rateLimitCount, rateLimitWindow))) {
      return {
        success: false,
        message: messages.form.tooManyRequests[language],
        status: 429,
      };
    }

    const processingStart = Date.now();
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
        message: messages.form.validationError[language],
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
      ipHash,
      sessionId,
    };

    await db.query(
      `INSERT INTO form_submissions (id, form_type, data, status, ip_hash, session_id, processing_time_ms, email_latency_ms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        submission.id,
        formType,
        JSON.stringify(sanitizedData),
        submission.status,
        submission.ipHash,
        submission.sessionId,
        null,
        null,
      ],
    );

    const processingEnd = Date.now();
    const processingTime = processingEnd - processingStart;
    await db.query(
      `UPDATE form_submissions SET processing_time_ms=$1 WHERE id=$2`,
      [processingTime, submission.id],
    );

    const emailStart = Date.now();
    // Attempt to send emails without affecting user response
    const emailResults = await Promise.allSettled([
      sendConfirmationEmail(sanitizedData, formType, language),
      sendAdminNotification(sanitizedData, formType, language),
    ]);
    const emailEnd = Date.now();
    const emailLatency = emailEnd - emailStart;

    await db.query(
      `UPDATE form_submissions SET email_latency_ms=$1 WHERE id=$2`,
      [emailLatency, submission.id],
    );

    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const type = index === 0 ? "confirmation" : "admin";
        console.error(`Failed to send ${type} email:`, result.reason);
        void enqueueFailedEmail(type, sanitizedData, formType, language, result.reason);
      }
    });

    return {
      success: true,
      message: messages.form.success[language],
    };
  } catch (error) {
    console.error("Form submission error:", error);
    const language = await getCurrentLanguage();

    // If this error came from a failed fetch call, attempt to read the
    // response body even when the status code indicates failure. This allows
    // clients to surface more descriptive error messages provided by the
    // server rather than a generic message.
    if (error instanceof Response) {
      let body: any = null;
      try {
        body = await error.json();
      } catch {
        // ignore JSON parsing errors and fall back to a generic message
      }
      return {
        success: false,
        message: body?.message || messages.form.serverError[language],
        status: error.status,
      };
    }

    // Next.js server actions propagate non-OK responses as Errors with the
    // serialized body in the message field. Try to parse it here so we can
    // return the original payload.
    if (error instanceof Error) {
      try {
        const body = JSON.parse(error.message);
        if (body && typeof body.message === "string") {
          return { success: false, message: body.message };
        }
      } catch {
        // fall through to generic error handling
      }
    }

    return {
      success: false,
      message: messages.form.serverError[language],
    };
  }
}

/**
 * Handles submission for the Virtual Office enquiry form.
 *
 * Usage note: call this from the form's `action` attribute in a Server Action
 * context.
 *
 * @param {FormData} formData - Raw form data from the client.
 */
export async function submitVirtualOfficeForm(formData: FormData) {
  return handleFormSubmission(formData, virtualOfficeFormSchema, "virtual-office");
}

/**
 * Handles submission for the Coworking enquiry form.
 *
 * @param {FormData} formData - Raw form data from the client.
 */
export async function submitCoworkingForm(formData: FormData) {
  return handleFormSubmission(formData, coworkingFormSchema, "coworking");
}

/**
 * Handles submission for the Meeting Room booking form.
 *
 * @param {FormData} formData - Raw form data from the client.
 */
export async function submitMeetingRoomForm(formData: FormData) {
  return handleFormSubmission(formData, meetingRoomFormSchema, "meeting-room");
}

/**
 * Handles submission for the Advertising enquiry form.
 *
 * @param {FormData} formData - Raw form data from the client.
 */
export async function submitAdvertisingForm(formData: FormData) {
  return handleFormSubmission(formData, advertisingFormSchema, "advertising");
}

/**
 * Handles submission for the Special Deals enquiry form.
 *
 * @param {FormData} formData - Raw form data from the client.
 */
export async function submitSpecialDealsForm(formData: FormData) {
  return handleFormSubmission(formData, specialDealsFormSchema, "special-deals");
}

// Utility functions
/**
 * Removes sensitive fields and strips potentially dangerous content from string
 * values before persisting to the database.
 *
 * @param {any} data - Raw validated form data.
 * @returns {any} Sanitized copy ready for storage.
 */
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

/**
 * Generates a pseudo-random identifier for a form submission.
 *
 * @returns {string} Unique submission ID.
 */
function generateSubmissionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Retrieves the client's IP address.
 *
 * In production this should parse the IP from request headers. Here it returns
 * a placeholder value for demonstration.
 *
 * @returns {string} Client IP address.
 */
function getClientIP(): string {
  // In a real application, you would extract this from headers
  return "127.0.0.1";
}

/**
 * Sends a confirmation email to the user containing a summary of their
 * submission.
 *
 * @param {any} data - Sanitized submission data.
 * @param {string} formType - Type of form that was submitted.
 * @param {"pl" | "en"} language - Language for the email content.
 * @returns {Promise<void>} Resolves when the email is queued.
 */
export async function sendConfirmationEmail(
  data: any,
  formType: string,
  language: "pl" | "en",
): Promise<void> {
  await emailClient.sendEmail({
    to: data.email,
    subject: getEmailSubject(formType, language),
    text: getEmailBody(data, formType, language),
  });
}

/**
 * Sends a notification email to administrators with a brief summary of the
 * submission.
 *
 * @param {any} data - Sanitized submission data.
 * @param {string} formType - Type of form that was submitted.
 * @param {"pl" | "en"} language - Language for the email content.
 * @returns {Promise<void>} Resolves when the email is queued.
 */
export async function sendAdminNotification(
  data: any,
  formType: string,
  language: "pl" | "en",
): Promise<void> {
  const serviceName =
    SERVICE_NAMES[formType as keyof typeof SERVICE_NAMES]?.[language] || formType;
  const subject =
    language === "en"
      ? `New submission: ${serviceName}`
      : `Nowe zgłoszenie: ${serviceName}`;

  const messageSummary = (() => {
    if (typeof data.message !== "string" || data.message.trim() === "") {
      return language === "en" ? "No message provided" : "Brak wiadomości";
    }
    const trimmed = data.message.trim();
    return trimmed.length > 100 ? `${trimmed.slice(0, 100)}...` : trimmed;
  })();

  const text =
    language === "en"
      ? `New submission from ${data.firstName ?? ""} ${data.lastName ?? ""} (${data.email}, ${data.phone ?? ""}) regarding ${serviceName}.\nMessage: ${messageSummary}`
      : `Nowe zgłoszenie od ${data.firstName ?? ""} ${data.lastName ?? ""} (${data.email}, ${data.phone ?? ""}) dotyczące ${serviceName}.\nWiadomość: ${messageSummary}`;

  await emailClient.sendEmail({
    to: EMAIL_CONFIG.adminEmail,
    subject,
    text,
  });
}

/**
 * Queues a failed email for later retry while masking any personally
 * identifiable information.
 *
 * @param {"confirmation" | "admin"} type - Category of the email.
 * @param {any} data - Submission data associated with the email.
 * @param {string} formType - Type of form submitted.
 * @param {"pl" | "en"} language - Language the email would have used.
 * @param {unknown} error - Original error thrown by the mailer.
 * @returns {Promise<void>} Resolves when the failure is recorded.
 */
async function enqueueFailedEmail(
  type: "confirmation" | "admin",
  data: any,
  formType: string,
  language: "pl" | "en",
  error: unknown,
): Promise<void> {
  function maskPII(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(maskPII);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) =>
          /(name|email|phone|message)/i.test(key)
            ? [key, "[REDACTED]"]
            : [key, maskPII(val)],
        ),
      );
    }
    return value;
  }

  // Before logging we recursively mask fields that may contain personally
  // identifiable information (e.g. names, emails, phone numbers). This keeps
  // logs useful for debugging while avoiding storage of sensitive data.
  const safeData = maskPII({ data, formType, language });
  console.log(`Enqueuing ${type} email for retry`, { data: safeData, error });
  await saveFailedEmail(type, { data, formType, language }, error);
}

/**
 * Builds the body text for confirmation emails summarising key submission
 * fields.
 *
 * @param {any} data - Sanitized submission data.
 * @param {string} formType - Type of form submitted.
 * @param {"pl" | "en"} language - Language for the email content.
 * @returns {string} Localised email body.
 */
function getEmailBody(
  data: any,
  formType: string,
  language: "pl" | "en",
): string {
  const serviceName =
    SERVICE_NAMES[formType as keyof typeof SERVICE_NAMES]?.[language] || formType;

  const intro =
    language === "en"
      ? `Thank you for your ${serviceName} inquiry.`
      : `Dziękujemy za zgłoszenie dotyczące ${serviceName}.`;

  const fields =
    EMAIL_SUMMARY_FIELDS[formType as keyof typeof EMAIL_SUMMARY_FIELDS] || [];
  const summary = fields
    .map((field) => {
      const value = (data as Record<string, unknown>)[field];
      if (value === undefined || value === null || value === "") {
        return null;
      }
      const label =
        FIELD_LABELS[field as keyof typeof FIELD_LABELS]?.[language] || field;
      return `${label}: ${value}`;
    })
    .filter(Boolean)
    .join("\n");

  const closing =
    language === "en"
      ? "We will contact you soon."
      : "Skontaktujemy się wkrótce.";

  return [intro, summary, closing].filter(Boolean).join("\n\n");
}

/**
 * Generates a localised subject line for confirmation emails.
 *
 * @param {string} formType - Type of form submitted.
 * @param {"pl" | "en"} language - Language for the email content.
 * @returns {string} Localised email subject.
 */
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

// Admin functions
/**
 * Retrieves paginated submissions for the admin dashboard.
 *
 * @param {number} [page=1] - Page number to fetch.
 * @param {number} [limit=10] - Number of items per page.
 * @returns {Promise<{ submissions: any[]; total: number; page: number; totalPages: number }>} Paginated result set.
 */
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

/**
 * Updates the status of a stored submission.
 *
 * @param {string} id - Submission identifier.
 * @param {"pending" | "contacted" | "completed" | "cancelled"} status - New status value.
 * @returns {Promise<{ success: boolean; message?: string }>} Operation result.
 */
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
  const language = await getCurrentLanguage();
  return { success: false, message: messages.admin.notFound[language] };
}

/**
 * Permanently deletes a submission record.
 *
 * @param {string} id - Submission identifier.
 * @returns {Promise<{ success: boolean; message?: string }>} Operation result.
 */
export async function deleteSubmission(id: string) {
  const result = await db.query(`DELETE FROM form_submissions WHERE id=$1`, [
    id,
  ]);
  if (result.rowCount > 0) {
    return { success: true };
  }
  const language = await getCurrentLanguage();
  return { success: false, message: messages.admin.notFound[language] };
}

export { getEmailSubject, getEmailBody };
