"use client";

interface AnalyticsEvent {
  formType: string;
  eventType:
    | "view"
    | "start"
    | "field_focus"
    | "field_blur"
    | "field_error"
    | "submission_attempt"
    | "submission_success"
    | "submission_error"
    | "abandonment";
  fieldName?: string;
  errorMessage?: string;
  timestamp: number;
  sessionId: string;
  userAgent: string;
  language: string;
  formVersion?: string;
  metadata?: Record<string, any>;
}

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

class AnalyticsClient {
  private sessionId: string;
  private consentSettings: ConsentSettings | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private formStartTimes: Map<string, number> = new Map();
  private flushTimer: any = null;
  private readonly FLUSH_INTERVAL_MS = 250;
  private readonly MAX_SENDS_PER_SECOND = 10;
  private lastSendAt = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadConsentSettings();
    this.initializeAnalytics();
    this.setupConsentListener();
    this.startScheduler();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadConsentSettings(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("analytics-consent");
      if (stored) {
        try {
          this.consentSettings = JSON.parse(stored);
        } catch (error) {
          console.warn("Failed to parse consent settings:", error);
        }
      }
    }
  }

  private setupConsentListener(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("consentUpdated", (event: any) => {
        this.consentSettings = {
          ...event.detail,
          timestamp: Date.now(),
        };
        this.processEventQueue();
      });
    }
  }

  private initializeAnalytics(): void {
    if (typeof window !== "undefined") {
      this.isInitialized = true;
      this.processEventQueue();
    }
  }

  private hasAnalyticsConsent(): boolean {
    return this.consentSettings?.analytics === true;
  }

  private getCsrfToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/csrf-token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.hasAnalyticsConsent()) {
      return;
    }

    try {
      const csrfToken = this.getCsrfToken();
      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ANALYTICS_TOKEN || "dev-token"}`,
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.status}`);
      }
    } catch (error) {
      console.warn("Failed to send analytics event:", error);
      // In production, you might want to retry or queue for later
    }
  }

  private createBaseEvent(
    formType: string,
    eventType: AnalyticsEvent["eventType"],
  ): AnalyticsEvent {
    return {
      formType,
      eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent:
        typeof window !== "undefined"
          ? this.anonymizeUserAgent(window.navigator.userAgent)
          : "",
      language:
        typeof window !== "undefined" ? window.navigator.language : "en",
      formVersion: "2.0.0",
    };
  }

  private anonymizeUserAgent(userAgent: string): string {
    // Extract only browser and OS info, remove detailed version numbers
    const browserMatch = userAgent.match(
      /(Chrome|Firefox|Safari|Edge)\/[\d.]+/,
    );
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);

    const browser = browserMatch ? browserMatch[1] : "Unknown";
    const os = osMatch ? osMatch[1] : "Unknown";

    return `${browser}_${os}`;
  }

  private processEventQueue(): void {
    // No-op; sending is handled by the scheduler to avoid bursty traffic.
  }

  private queueOrSendEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
  }

  private startScheduler() {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(async () => {
      if (!this.isInitialized || !this.hasAnalyticsConsent()) return;
      if (this.eventQueue.length === 0) return;
      const now = Date.now();
      const minGap = 1000 / this.MAX_SENDS_PER_SECOND;
      if (now - this.lastSendAt < minGap) return;
      const next = this.eventQueue.shift();
      if (!next) return;
      try {
        await this.sendEvent(next);
      } finally {
        this.lastSendAt = Date.now();
      }
    }, this.FLUSH_INTERVAL_MS);
  }

  // Public API methods
  trackFormView(formType: string): void {
    const event = {
      ...this.createBaseEvent(formType, "view"),
      metadata: {
        referrer: typeof window !== "undefined" ? document.referrer : "",
        url: typeof window !== "undefined" ? window.location.pathname : "",
      },
    };
    this.queueOrSendEvent(event);
  }

  trackFormStart(formType: string): void {
    this.formStartTimes.set(formType, Date.now());
    const event = this.createBaseEvent(formType, "start");
    this.queueOrSendEvent(event);
  }

  trackFieldFocus(formType: string, fieldName: string): void {
    const event = {
      ...this.createBaseEvent(formType, "field_focus"),
      fieldName,
    };
    this.queueOrSendEvent(event);
  }

  trackFieldBlur(formType: string, fieldName: string): void {
    const event = {
      ...this.createBaseEvent(formType, "field_blur"),
      fieldName,
    };
    this.queueOrSendEvent(event);
  }

  trackFieldError(
    formType: string,
    fieldName: string,
    errorMessage: string,
  ): void {
    const event = {
      ...this.createBaseEvent(formType, "field_error"),
      fieldName,
      errorMessage: this.sanitizeErrorMessage(errorMessage),
    };
    this.queueOrSendEvent(event);
  }

  trackSubmissionAttempt(formType: string): void {
    const event = this.createBaseEvent(formType, "submission_attempt");
    this.queueOrSendEvent(event);
  }

  trackSubmissionSuccess(formType: string): void {
    const startTime = this.formStartTimes.get(formType);
    const completionTime = startTime ? Date.now() - startTime : null;

    const event = {
      ...this.createBaseEvent(formType, "submission_success"),
      metadata: {
        completionTime,
      },
    };
    this.queueOrSendEvent(event);
    this.formStartTimes.delete(formType);
  }

  trackSubmissionError(formType: string, errorMessage: string): void {
    const event = {
      ...this.createBaseEvent(formType, "submission_error"),
      errorMessage: this.sanitizeErrorMessage(errorMessage),
    };
    this.queueOrSendEvent(event);
  }

  trackAbandonment(formType: string, fieldsCompleted: string[] = []): void {
    const startTime = this.formStartTimes.get(formType);
    const timeSpent = startTime ? Date.now() - startTime : null;

    const event = {
      ...this.createBaseEvent(formType, "abandonment"),
      metadata: {
        timeSpent,
        fieldsCompleted: fieldsCompleted.length,
        completionPercentage: this.calculateCompletionPercentage(
          formType,
          fieldsCompleted,
        ),
      },
    };
    this.queueOrSendEvent(event);
    this.formStartTimes.delete(formType);
  }

  private sanitizeErrorMessage(errorMessage: string): string {
    // Remove any potential personal data from error messages
    return errorMessage
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[EMAIL]",
      )
      .replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g, "[PHONE]")
      .replace(/\b\d{10}\b/g, "[NIP]");
  }

  private calculateCompletionPercentage(
    formType: string,
    fieldsCompleted: string[],
  ): number {
    const totalFields = {
      "virtual-office": 8,
      coworking: 9,
      "meeting-room": 11,
      advertising: 10,
      "special-deals": 8,
    };

    const total = totalFields[formType as keyof typeof totalFields] || 8;
    return Math.round((fieldsCompleted.length / total) * 100);
  }

  updateConsent(settings: ConsentSettings): void {
    this.consentSettings = settings;
    if (typeof window !== "undefined") {
      localStorage.setItem("analytics-consent", JSON.stringify(settings));
    }

    if (settings.analytics) {
      this.processEventQueue();
    } else {
      this.eventQueue = []; // Clear queue if analytics consent is withdrawn
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  hasConsent(): boolean {
    return this.hasAnalyticsConsent();
  }

  // Method to clear all stored data (for GDPR compliance)
  clearAllData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("analytics-consent");
      sessionStorage.clear();
    }
    this.eventQueue = [];
    this.formStartTimes.clear();
    this.consentSettings = null;
  }
}

// Export singleton instance
export const analyticsClient = new AnalyticsClient();

// Export types for use in other files
export type { AnalyticsEvent, ConsentSettings };
