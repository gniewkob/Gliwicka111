export interface AnalyticsEventRow {
  formType: string
  eventType: string
  fieldName?: string | null
  errorMessage?: string | null
  timestamp: number
  sessionId?: string | null
  userAgent?: string | null
  language?: string | null
  formVersion?: string | null
  ipHash?: string | null
  receivedAt?: string | Date | null
}
