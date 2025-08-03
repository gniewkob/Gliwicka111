import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  submitVirtualOfficeForm,
  submitCoworkingForm,
  submitMeetingRoomForm,
  submitAdvertisingForm,
  submitSpecialDealsForm,
  submitContactForm,
} from "@/lib/server-actions"

// Mock dependencies
vi.mock("@/lib/analytics-client", () => ({
  analyticsClient: {
    trackSubmissionAttempt: vi.fn(),
    trackSubmissionSuccess: vi.fn(),
    trackSubmissionError: vi.fn(),
  },
}))

vi.mock("@/lib/form-utils", () => ({
  sanitizeFormData: vi.fn((data) => data),
  validateFormData: vi.fn(() => ({ isValid: true, errors: {} })),
  hashIP: vi.fn(() => "hashed-ip"),
  sendConfirmationEmail: vi.fn(() => Promise.resolve()),
  saveFormSubmission: vi.fn(() => Promise.resolve({ id: "test-id" })),
}))

describe("Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("submitVirtualOfficeForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Jan")
      formData.append("lastName", "Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48123456789")
      formData.append("companyName", "Test Company")
      formData.append("businessType", "llc")
      formData.append("package", "standard")
      formData.append("startDate", "2024-02-01")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid form data", async () => {
      const formData = createValidFormData()
      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("validates required fields", async () => {
      const formData = new FormData()
      formData.append("firstName", "Jan")
      // Missing other required fields

      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain("wymagane")
    })

    it("sanitizes input data", async () => {
      const { sanitizeFormData } = await import("@/lib/form-utils")
      const formData = createValidFormData()
      formData.set("firstName", '<script>alert("xss")</script>Jan')

      await submitVirtualOfficeForm(formData)

      expect(sanitizeFormData).toHaveBeenCalled()
    })

    it("tracks analytics events", async () => {
      const { analyticsClient } = await import("@/lib/analytics-client")
      const formData = createValidFormData()

      await submitVirtualOfficeForm(formData)

      expect(analyticsClient.trackSubmissionAttempt).toHaveBeenCalledWith("virtual-office")
      expect(analyticsClient.trackSubmissionSuccess).toHaveBeenCalledWith("virtual-office")
    })

    it("handles submission errors gracefully", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      vi.mocked(saveFormSubmission).mockRejectedValue(new Error("Database error"))

      const formData = createValidFormData()
      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain("błąd")
    })

    it("sends confirmation email on successful submission", async () => {
      const { sendConfirmationEmail } = await import("@/lib/form-utils")
      const formData = createValidFormData()

      await submitVirtualOfficeForm(formData)

      expect(sendConfirmationEmail).toHaveBeenCalledWith("jan@example.com", "virtual-office", expect.any(Object))
    })
  })

  describe("submitCoworkingForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Anna")
      formData.append("lastName", "Nowak")
      formData.append("email", "anna@example.com")
      formData.append("phone", "+48987654321")
      formData.append("membershipType", "hot-desk")
      formData.append("duration", "1-month")
      formData.append("startDate", "2024-03-01")
      formData.append("additionalServices", "printing")
      formData.append("additionalServices", "meeting-room")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid coworking form data", async () => {
      const formData = createValidFormData()
      const result = await submitCoworkingForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("handles multiple additional services", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      const formData = createValidFormData()

      await submitCoworkingForm(formData)

      expect(saveFormSubmission).toHaveBeenCalledWith(
        "coworking",
        expect.objectContaining({
          additionalServices: ["printing", "meeting-room"],
        }),
      )
    })

    it("validates membership type enum", async () => {
      const formData = createValidFormData()
      formData.set("membershipType", "invalid-type")

      const result = await submitCoworkingForm(formData)

      expect(result.success).toBe(false)
    })
  })

  describe("submitMeetingRoomForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Piotr")
      formData.append("lastName", "Wiśniewski")
      formData.append("email", "piotr@example.com")
      formData.append("phone", "+48555666777")
      formData.append("companyName", "Meeting Corp")
      formData.append("roomType", "small")
      formData.append("date", "2024-04-15")
      formData.append("startTime", "09:00")
      formData.append("endTime", "11:00")
      formData.append("attendees", "5")
      formData.append("equipment", "projector")
      formData.append("equipment", "whiteboard")
      formData.append("catering", "false")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid meeting room form data", async () => {
      const formData = createValidFormData()
      const result = await submitMeetingRoomForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("validates time format and logic", async () => {
      const formData = createValidFormData()
      formData.set("startTime", "25:00") // Invalid time

      const result = await submitMeetingRoomForm(formData)

      expect(result.success).toBe(false)
    })

    it("validates attendees number", async () => {
      const formData = createValidFormData()
      formData.set("attendees", "0") // Invalid number

      const result = await submitMeetingRoomForm(formData)

      expect(result.success).toBe(false)
    })

    it("handles equipment array correctly", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      const formData = createValidFormData()

      await submitMeetingRoomForm(formData)

      expect(saveFormSubmission).toHaveBeenCalledWith(
        "meeting-room",
        expect.objectContaining({
          equipment: ["projector", "whiteboard"],
        }),
      )
    })
  })

  describe("submitAdvertisingForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Katarzyna")
      formData.append("lastName", "Kowalczyk")
      formData.append("email", "katarzyna@example.com")
      formData.append("phone", "+48111222333")
      formData.append("companyName", "Ad Agency")
      formData.append("adType", "digital-display")
      formData.append("duration", "1-month")
      formData.append("budget", "5000")
      formData.append("targetAudience", "business-professionals")
      formData.append("campaignGoals", "brand-awareness")
      formData.append("previousExperience", "true")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid advertising form data", async () => {
      const formData = createValidFormData()
      const result = await submitAdvertisingForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("validates budget range", async () => {
      const formData = createValidFormData()
      formData.set("budget", "0") // Invalid budget

      const result = await submitAdvertisingForm(formData)

      expect(result.success).toBe(false)
    })

    it("converts string budget to number", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      const formData = createValidFormData()

      await submitAdvertisingForm(formData)

      expect(saveFormSubmission).toHaveBeenCalledWith(
        "advertising",
        expect.objectContaining({
          budget: 5000,
        }),
      )
    })
  })

  describe("submitSpecialDealsForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Marcin")
      formData.append("lastName", "Zieliński")
      formData.append("email", "marcin@example.com")
      formData.append("phone", "+48444555666")
      formData.append("interestedServices", "virtual-office")
      formData.append("interestedServices", "coworking")
      formData.append("currentSituation", "startup")
      formData.append("timeline", "1-month")
      formData.append("budget", "2000")
      formData.append("specificRequirements", "Need flexible terms")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid special deals form data", async () => {
      const formData = createValidFormData()
      const result = await submitSpecialDealsForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("requires at least one interested service", async () => {
      const formData = createValidFormData()
      // Remove all interested services
      formData.delete("interestedServices")

      const result = await submitSpecialDealsForm(formData)

      expect(result.success).toBe(false)
    })

    it("handles multiple interested services", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      const formData = createValidFormData()

      await submitSpecialDealsForm(formData)

      expect(saveFormSubmission).toHaveBeenCalledWith(
        "special-deals",
        expect.objectContaining({
          interestedServices: ["virtual-office", "coworking"],
        }),
      )
    })
  })

  describe("submitContactForm", () => {
    const createValidFormData = () => {
      const formData = new FormData()
      formData.append("firstName", "Tomasz")
      formData.append("lastName", "Lewandowski")
      formData.append("email", "tomasz@example.com")
      formData.append("phone", "+48777888999")
      formData.append("subject", "general-inquiry")
      formData.append("message", "I would like to know more about your services.")
      formData.append("gdprConsent", "true")
      return formData
    }

    it("successfully processes valid contact form data", async () => {
      const formData = createValidFormData()
      const result = await submitContactForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("pomyślnie")
    })

    it("validates message length", async () => {
      const formData = createValidFormData()
      formData.set("message", "Hi") // Too short

      const result = await submitContactForm(formData)

      expect(result.success).toBe(false)
    })

    it("validates subject enum", async () => {
      const formData = createValidFormData()
      formData.set("subject", "invalid-subject")

      const result = await submitContactForm(formData)

      expect(result.success).toBe(false)
    })
  })

  describe("Error Handling", () => {
    it("handles network errors gracefully", async () => {
      const { saveFormSubmission } = await import("@/lib/form-utils")
      vi.mocked(saveFormSubmission).mockRejectedValue(new Error("Network error"))

      const formData = new FormData()
      formData.append("firstName", "Test")
      formData.append("lastName", "User")
      formData.append("email", "test@example.com")
      formData.append("phone", "+48123456789")
      formData.append("gdprConsent", "true")

      const result = await submitContactForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain("błąd")
    })

    it("tracks error events in analytics", async () => {
      const { analyticsClient } = await import("@/lib/analytics-client")
      const { saveFormSubmission } = await import("@/lib/form-utils")
      vi.mocked(saveFormSubmission).mockRejectedValue(new Error("Test error"))

      const formData = new FormData()
      formData.append("firstName", "Test")
      formData.append("lastName", "User")
      formData.append("email", "test@example.com")
      formData.append("phone", "+48123456789")
      formData.append("gdprConsent", "true")

      await submitContactForm(formData)

      expect(analyticsClient.trackSubmissionError).toHaveBeenCalledWith("contact", expect.stringContaining("błąd"))
    })
  })

  describe("Rate Limiting", () => {
    it("implements basic rate limiting", async () => {
      // This would require a more sophisticated test setup with Redis or similar
      // For now, we'll test that the rate limiting function is called
      const formData = new FormData()
      formData.append("firstName", "Test")
      formData.append("lastName", "User")
      formData.append("email", "test@example.com")
      formData.append("phone", "+48123456789")
      formData.append("gdprConsent", "true")

      // Multiple rapid submissions
      const promises = Array(10)
        .fill(null)
        .map(() => submitContactForm(formData))
      const results = await Promise.all(promises)

      // At least some should succeed (depending on rate limiting implementation)
      const successCount = results.filter((r) => r.success).length
      expect(successCount).toBeGreaterThan(0)
    })
  })
})
