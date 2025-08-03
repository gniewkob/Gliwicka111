"use client"

interface AnalyticsEvent {
  formType: string
  eventType:
    | "view"
    | "start"
    | "field_focus"
    | "field_blur"
    | "field_error"
    | "submission_attempt"
    | "submission_success"
    | "submission_error"
    | "abandonment"
  fieldName?: string
  errorMessage?: string
  timestamp: number
  sessionId: string
  userAgent: string
  language: string
  formVersion?: string
}

interface ConsentSettings {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

class AnalyticsClient {
  private sessionId: string
  private consentSettings: ConsentSettings | null = null
  private eventQueue: AnalyticsEvent[] = []
  private isInitialized = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadConsentSettings()
    this.initializeAnalytics()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadConsentSettings(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("analytics-consent")
      if (stored) {
        try {
          this.consentSettings = JSON.parse(stored)
        } catch (error) {
          console.warn("Failed to parse consent settings:", error)
        }
      }
    }
  }

  private initializeAnalytics(): void {
    if (typeof window !== "undefined") {
      this.isInitialized = true
      this.processEventQueue()
    }
  }

  private hasAnalyticsConsent(): boolean {
    return this.consentSettings?.analytics === true
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.hasAnalyticsConsent()) {
      return
    }

    try {
      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.status}`)
      }
    } catch (error) {
      console.warn("Failed to send analytics event:", error)
      // In production, you might want to retry or queue for later
    }
  }

  private createBaseEvent(formType: string, eventType: AnalyticsEvent["eventType"]): AnalyticsEvent {
    return {
      formType,
      eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
      language: typeof window !== "undefined" ? window.navigator.language : "en",
      formVersion: "1.0.0",
    }
  }

  private processEventQueue(): void {
    if (!this.isInitialized || !this.hasAnalyticsConsent()) {
      return
    }

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        this.sendEvent(event)
      }
    }
  }

  private queueOrSendEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || !this.hasAnalyticsConsent()) {
      this.eventQueue.push(event)
      return
    }

    this.sendEvent(event)
  }

  // Public API methods
  trackFormView(formType: string): void {
    const event = this.createBaseEvent(formType, "view")
    this.queueOrSendEvent(event)
  }

  trackFormStart(formType: string): void {
    const event = this.createBaseEvent(formType, "start")
    this.queueOrSendEvent(event)
  }

  trackFieldFocus(formType: string, fieldName: string): void {
    const event = {
      ...this.createBaseEvent(formType, "field_focus"),
      fieldName,
    }
    this.queueOrSendEvent(event)
  }

  trackFieldBlur(formType: string, fieldName: string): void {
    const event = {
      ...this.createBaseEvent(formType, "field_blur"),
      fieldName,
    }
    this.queueOrSendEvent(event)
  }

  trackFieldError(formType: string, fieldName: string, errorMessage: string): void {
    const event = {
      ...this.createBaseEvent(formType, "field_error"),
      fieldName,
      errorMessage,
    }
    this.queueOrSendEvent(event)
  }

  trackSubmissionAttempt(formType: string): void {
    const event = this.createBaseEvent(formType, "submission_attempt")
    this.queueOrSendEvent(event)
  }

  trackSubmissionSuccess(formType: string): void {
    const event = this.createBaseEvent(formType, "submission_success")
    this.queueOrSendEvent(event)
  }

  trackSubmissionError(formType: string, errorMessage: string): void {
    const event = {
      ...this.createBaseEvent(formType, "submission_error"),
      errorMessage,
    }
    this.queueOrSendEvent(event)
  }

  trackAbandonment(formType: string): void {
    const event = this.createBaseEvent(formType, "abandonment")
    this.queueOrSendEvent(event)
  }

  updateConsent(settings: ConsentSettings): void {
    this.consentSettings = settings
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics-consent", JSON.stringify(settings))
    }

    if (settings.analytics) {
      this.processEventQueue()
    } else {
      this.eventQueue = [] // Clear queue if analytics consent is withdrawn
    }
  }

  getSessionId(): string {
    return this.sessionId
  }

  hasConsent(): boolean {
    return this.hasAnalyticsConsent()
  }
}

// Export singleton instance
export const analyticsClient = new AnalyticsClient()

// Export types for use in other files
export type { AnalyticsEvent, ConsentSettings }
