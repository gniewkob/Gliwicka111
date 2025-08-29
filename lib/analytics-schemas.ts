import { z } from "zod";

// Base analytics event schema
export const analyticsEventSchema = z.object({
  formType: z.enum([
    "virtual-office",
    "coworking",
    "meeting-room",
    "advertising",
    "special-deals",
  ]),
  eventType: z.enum([
    "view",
    "start",
    "field_focus",
    "field_blur",
    "field_error",
    "submission_attempt",
    "submission_success",
    "submission_error",
    "abandonment",
  ]),
  fieldName: z.string().optional(),
  errorMessage: z.string().optional(),
  timestamp: z.number(),
  sessionId: z.string().regex(/^session_[a-zA-Z0-9_-]+$/),
  userAgent: z.string().max(500),
  language: z.string().max(10),
  formVersion: z.string().optional(),
});

// Consent settings schema
export const consentSettingsSchema = z.object({
  necessary: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  timestamp: z.number(),
});

// Form submission schema
export const formSubmissionSchema = z.object({
  id: z.string(),
  formType: z.enum([
    "virtual-office",
    "coworking",
    "meeting-room",
    "advertising",
    "special-deals",
  ]),
  data: z.record(z.any()),
  submittedAt: z.string(),
  status: z.enum(["pending", "contacted", "completed", "cancelled"]),
  ipHash: z.string(),
  sessionId: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Analytics metrics schema
export const analyticsMetricsSchema = z.object({
  totalViews: z.number(),
  totalStarts: z.number(),
  totalCompletions: z.number(),
  conversionRate: z.number(),
  abandonmentRate: z.number(),
  avgCompletionTime: z.number(),
  formBreakdown: z.record(
    z.object({
      views: z.number(),
      starts: z.number(),
      completions: z.number(),
      conversionRate: z.number(),
      avgCompletionTime: z.number(),
    }),
  ),
  fieldAnalytics: z.record(
    z.object({
      focusCount: z.number(),
      errorCount: z.number(),
      errorRate: z.number(),
      avgFocusTime: z.number(),
    }),
  ),
  timeSeriesData: z.array(
    z.object({
      date: z.string(),
      views: z.number(),
      starts: z.number(),
      completions: z.number(),
    }),
  ),
});

// Export request schema
export const exportRequestSchema = z.object({
  format: z.enum(["json", "csv"]).default("json"),
  timeRange: z.enum(["24h", "7d", "30d", "90d"]).default("30d"),
  formType: z.string().optional(),
  includePersonalData: z.boolean().default(false),
});

// Rate limit schema
export const rateLimitSchema = z.object({
  identifier: z.string(),
  count: z.number(),
  resetTime: z.number(),
  limit: z.number().default(100),
  windowMs: z.number().default(60000),
});

// Type exports
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export type ConsentSettings = z.infer<typeof consentSettingsSchema>;
export type FormSubmission = z.infer<typeof formSubmissionSchema>;
export type AnalyticsMetrics = z.infer<typeof analyticsMetricsSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type RateLimit = z.infer<typeof rateLimitSchema>;

// Validation helpers
export function validateAnalyticsEvent(data: unknown): AnalyticsEvent {
  return analyticsEventSchema.parse(data);
}

export function validateConsentSettings(data: unknown): ConsentSettings {
  return consentSettingsSchema.parse(data);
}

export function validateFormSubmission(data: unknown): FormSubmission {
  return formSubmissionSchema.parse(data);
}

export function validateExportRequest(data: unknown): ExportRequest {
  return exportRequestSchema.parse(data);
}

// Privacy-safe event sanitization
export function sanitizeAnalyticsEvent(
  event: AnalyticsEvent,
): Partial<AnalyticsEvent> {
  return {
    formType: event.formType,
    eventType: event.eventType,
    fieldName: event.fieldName,
    timestamp: event.timestamp,
    language: event.language,
    formVersion: event.formVersion,
    // Exclude sessionId, userAgent, and other potentially identifying data
  };
}

// Event aggregation helpers
export function aggregateEventsByType(
  events: AnalyticsEvent[],
): Record<string, number> {
  return events.reduce(
    (acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function aggregateEventsByForm(
  events: AnalyticsEvent[],
): Record<string, number> {
  return events.reduce(
    (acc, event) => {
      acc[event.formType] = (acc[event.formType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function calculateConversionRate(
  starts: number,
  completions: number,
): number {
  return starts > 0 ? (completions / starts) * 100 : 0;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}
