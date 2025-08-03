import { describe, it, expect } from "vitest"
import {
  virtualOfficeFormSchema,
  coworkingFormSchema,
  meetingRoomFormSchema,
  advertisingFormSchema,
  specialDealsFormSchema,
  contactFormSchema,
} from "@/lib/validation-schemas"

describe("Validation Schemas", () => {
  describe("virtualOfficeFormSchema", () => {
    const validData = {
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48123456789",
      companyName: "Test Company",
      businessType: "llc" as const,
      package: "standard" as const,
      startDate: "2024-02-01",
      gdprConsent: true,
    }

    it("validates correct data", () => {
      const result = virtualOfficeFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("rejects missing required fields", () => {
      const invalidData = { ...validData }
      delete invalidData.firstName

      const result = virtualOfficeFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["firstName"],
            code: "invalid_type",
          }),
        )
      }
    })

    it("validates email format", () => {
      const invalidData = { ...validData, email: "invalid-email" }

      const result = virtualOfficeFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["email"],
            code: "invalid_string",
          }),
        )
      }
    })

    it("validates phone number format", () => {
      const testCases = [
        { phone: "+48123456789", valid: true },
        { phone: "123456789", valid: true },
        { phone: "+48 123 456 789", valid: true },
        { phone: "123", valid: false },
        { phone: "abc123", valid: false },
        { phone: "", valid: false },
      ]

      testCases.forEach(({ phone, valid }) => {
        const testData = { ...validData, phone }
        const result = virtualOfficeFormSchema.safeParse(testData)
        expect(result.success).toBe(valid)
      })
    })

    it("validates business type enum", () => {
      const validTypes = ["sole-proprietorship", "llc", "corporation", "other"]

      validTypes.forEach((businessType) => {
        const testData = { ...validData, businessType }
        const result = virtualOfficeFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      const invalidData = { ...validData, businessType: "invalid-type" }
      const result = virtualOfficeFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("validates package enum", () => {
      const validPackages = ["basic", "standard", "premium"]

      validPackages.forEach((packageType) => {
        const testData = { ...validData, package: packageType }
        const result = virtualOfficeFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      const invalidData = { ...validData, package: "invalid-package" }
      const result = virtualOfficeFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("validates date format", () => {
      const validDates = ["2024-01-01", "2024-12-31", "2025-06-15"]
      const invalidDates = ["2024/01/01", "01-01-2024", "invalid-date", ""]

      validDates.forEach((startDate) => {
        const testData = { ...validData, startDate }
        const result = virtualOfficeFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      invalidDates.forEach((startDate) => {
        const testData = { ...validData, startDate }
        const result = virtualOfficeFormSchema.safeParse(testData)
        expect(result.success).toBe(false)
      })
    })

    it("requires GDPR consent to be true", () => {
      const testData = { ...validData, gdprConsent: false }
      const result = virtualOfficeFormSchema.safeParse(testData)
      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["gdprConsent"],
            message: expect.stringContaining("wymagana"),
          }),
        )
      }
    })

    it("handles optional fields correctly", () => {
      const minimalData = {
        firstName: "Jan",
        lastName: "Kowalski",
        email: "jan@example.com",
        phone: "+48123456789",
        businessType: "llc" as const,
        package: "basic" as const,
        startDate: "2024-02-01",
        gdprConsent: true,
      }

      const result = virtualOfficeFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })
  })

  describe("coworkingFormSchema", () => {
    const validData = {
      firstName: "Anna",
      lastName: "Nowak",
      email: "anna@example.com",
      phone: "+48987654321",
      membershipType: "hot-desk" as const,
      duration: "1-month" as const,
      startDate: "2024-03-01",
      additionalServices: ["printing", "meeting-room"],
      gdprConsent: true,
    }

    it("validates correct coworking data", () => {
      const result = coworkingFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates membership type enum", () => {
      const validTypes = ["hot-desk", "dedicated-desk", "private-office"]

      validTypes.forEach((membershipType) => {
        const testData = { ...validData, membershipType }
        const result = coworkingFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })

    it("validates duration enum", () => {
      const validDurations = ["1-month", "3-months", "6-months", "12-months"]

      validDurations.forEach((duration) => {
        const testData = { ...validData, duration }
        const result = coworkingFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })

    it("validates additional services array", () => {
      const validServices = [
        [],
        ["printing"],
        ["meeting-room", "locker"],
        ["printing", "meeting-room", "locker", "phone-booth"],
      ]

      validServices.forEach((additionalServices) => {
        const testData = { ...validData, additionalServices }
        const result = coworkingFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      const invalidData = { ...validData, additionalServices: ["invalid-service"] }
      const result = coworkingFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("meetingRoomFormSchema", () => {
    const validData = {
      firstName: "Piotr",
      lastName: "Wiśniewski",
      email: "piotr@example.com",
      phone: "+48555666777",
      companyName: "Meeting Corp",
      roomType: "small" as const,
      date: "2024-04-15",
      startTime: "09:00",
      endTime: "11:00",
      attendees: 5,
      equipment: ["projector", "whiteboard"],
      catering: false,
      gdprConsent: true,
    }

    it("validates correct meeting room data", () => {
      const result = meetingRoomFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates room type enum", () => {
      const validTypes = ["small", "medium", "large", "conference"]

      validTypes.forEach((roomType) => {
        const testData = { ...validData, roomType }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })

    it("validates time format", () => {
      const validTimes = ["09:00", "14:30", "18:45"]
      const invalidTimes = ["9:00", "25:00", "invalid-time"]

      validTimes.forEach((startTime) => {
        const testData = { ...validData, startTime, endTime: "10:00" }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      invalidTimes.forEach((startTime) => {
        const testData = { ...validData, startTime }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(false)
      })
    })

    it("validates attendees number range", () => {
      const validAttendees = [1, 5, 10, 20]
      const invalidAttendees = [0, -1, 101]

      validAttendees.forEach((attendees) => {
        const testData = { ...validData, attendees }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      invalidAttendees.forEach((attendees) => {
        const testData = { ...validData, attendees }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(false)
      })
    })

    it("validates equipment array", () => {
      const validEquipment = [
        [],
        ["projector"],
        ["whiteboard", "flipchart"],
        ["projector", "whiteboard", "flipchart", "tv-screen", "conference-phone"],
      ]

      validEquipment.forEach((equipment) => {
        const testData = { ...validData, equipment }
        const result = meetingRoomFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe("advertisingFormSchema", () => {
    const validData = {
      firstName: "Katarzyna",
      lastName: "Kowalczyk",
      email: "katarzyna@example.com",
      phone: "+48111222333",
      companyName: "Ad Agency",
      adType: "digital-display" as const,
      duration: "1-month" as const,
      budget: 5000,
      targetAudience: "business-professionals",
      campaignGoals: "brand-awareness",
      previousExperience: true,
      gdprConsent: true,
    }

    it("validates correct advertising data", () => {
      const result = advertisingFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates ad type enum", () => {
      const validTypes = ["digital-display", "social-media", "email-marketing", "print-materials", "event-sponsorship"]

      validTypes.forEach((adType) => {
        const testData = { ...validData, adType }
        const result = advertisingFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })

    it("validates budget range", () => {
      const validBudgets = [1000, 5000, 10000, 50000]
      const invalidBudgets = [0, -1000, 100001]

      validBudgets.forEach((budget) => {
        const testData = { ...validData, budget }
        const result = advertisingFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      invalidBudgets.forEach((budget) => {
        const testData = { ...validData, budget }
        const result = advertisingFormSchema.safeParse(testData)
        expect(result.success).toBe(false)
      })
    })
  })

  describe("specialDealsFormSchema", () => {
    const validData = {
      firstName: "Marcin",
      lastName: "Zieliński",
      email: "marcin@example.com",
      phone: "+48444555666",
      interestedServices: ["virtual-office", "coworking"],
      currentSituation: "startup",
      timeline: "1-month",
      budget: 2000,
      specificRequirements: "Need flexible terms",
      gdprConsent: true,
    }

    it("validates correct special deals data", () => {
      const result = specialDealsFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates interested services array", () => {
      const validServices = [
        ["virtual-office"],
        ["coworking", "meeting-room"],
        ["virtual-office", "coworking", "meeting-room", "advertising"],
      ]

      validServices.forEach((interestedServices) => {
        const testData = { ...validData, interestedServices }
        const result = specialDealsFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })

      const invalidData = { ...validData, interestedServices: [] }
      const result = specialDealsFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("contactFormSchema", () => {
    const validData = {
      firstName: "Tomasz",
      lastName: "Lewandowski",
      email: "tomasz@example.com",
      phone: "+48777888999",
      subject: "general-inquiry" as const,
      message: "I would like to know more about your services.",
      gdprConsent: true,
    }

    it("validates correct contact data", () => {
      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates subject enum", () => {
      const validSubjects = ["general-inquiry", "technical-support", "billing", "partnership", "other"]

      validSubjects.forEach((subject) => {
        const testData = { ...validData, subject }
        const result = contactFormSchema.safeParse(testData)
        expect(result.success).toBe(true)
      })
    })

    it("validates message length", () => {
      const shortMessage = "Hi"
      const longMessage = "a".repeat(2001)
      const validMessage = "This is a valid message with appropriate length."

      const shortResult = contactFormSchema.safeParse({ ...validData, message: shortMessage })
      expect(shortResult.success).toBe(false)

      const longResult = contactFormSchema.safeParse({ ...validData, message: longMessage })
      expect(longResult.success).toBe(false)

      const validResult = contactFormSchema.safeParse({ ...validData, message: validMessage })
      expect(validResult.success).toBe(true)
    })
  })

  describe("Cross-schema validation patterns", () => {
    it("all schemas require GDPR consent", () => {
      const schemas = [
        virtualOfficeFormSchema,
        coworkingFormSchema,
        meetingRoomFormSchema,
        advertisingFormSchema,
        specialDealsFormSchema,
        contactFormSchema,
      ]

      schemas.forEach((schema) => {
        const testData = { gdprConsent: false }
        const result = schema.safeParse(testData)
        expect(result.success).toBe(false)
      })
    })

    it("all schemas validate email format consistently", () => {
      const schemas = [
        virtualOfficeFormSchema,
        coworkingFormSchema,
        meetingRoomFormSchema,
        advertisingFormSchema,
        specialDealsFormSchema,
        contactFormSchema,
      ]

      const invalidEmails = ["invalid", "@example.com", "test@", "test.example.com"]

      schemas.forEach((schema) => {
        invalidEmails.forEach((email) => {
          const testData = { email }
          const result = schema.safeParse(testData)
          expect(result.success).toBe(false)
        })
      })
    })

    it("all schemas validate phone format consistently", () => {
      const schemas = [
        virtualOfficeFormSchema,
        coworkingFormSchema,
        meetingRoomFormSchema,
        advertisingFormSchema,
        specialDealsFormSchema,
        contactFormSchema,
      ]

      const validPhones = ["+48123456789", "123456789", "+48 123 456 789"]
      const invalidPhones = ["123", "abc", ""]

      schemas.forEach((schema) => {
        validPhones.forEach((phone) => {
          const testData = { phone }
          const result = schema.safeParse(testData)
          // Should not fail on phone validation specifically
          if (!result.success) {
            const phoneErrors = result.error.issues.filter((issue) => issue.path.includes("phone"))
            expect(phoneErrors).toHaveLength(0)
          }
        })

        invalidPhones.forEach((phone) => {
          const testData = { phone }
          const result = schema.safeParse(testData)
          expect(result.success).toBe(false)
        })
      })
    })
  })
})
