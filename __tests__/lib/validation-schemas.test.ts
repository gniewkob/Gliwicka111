import {
  virtualOfficeSchema,
  coworkingSchema,
  meetingRoomSchema,
  advertisingSchema,
  specialDealsSchema,
} from "@/lib/validation-schemas"

describe.skip("Validation Schemas", () => {
  describe("virtualOfficeSchema", () => {
    it("validates correct virtual office data", () => {
      const validData = {
        companyName: "Test Company",
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        nip: "1234567890",
        businessType: "consulting",
        preferredDate: "2024-12-01",
        message: "Test message",
      }

      const result = virtualOfficeSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("rejects invalid email", () => {
      const invalidData = {
        companyName: "Test Company",
        contactPerson: "Jan Kowalski",
        email: "invalid-email",
        phone: "+48 123 456 789",
      }

      const result = virtualOfficeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("email"))).toBe(true)
      }
    })

    it("rejects invalid phone number", () => {
      const invalidData = {
        companyName: "Test Company",
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "123",
      }

      const result = virtualOfficeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("phone"))).toBe(true)
      }
    })

    it("rejects invalid NIP when provided", () => {
      const invalidData = {
        companyName: "Test Company",
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        nip: "123",
      }

      const result = virtualOfficeSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("nip"))).toBe(true)
      }
    })

    it("accepts empty NIP", () => {
      const validData = {
        companyName: "Test Company",
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        nip: "",
      }

      const result = virtualOfficeSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("coworkingSchema", () => {
    it("validates correct coworking data", () => {
      const validData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        companyName: "Test Company",
        workspaceType: "hot-desk",
        duration: "monthly",
        startDate: "2024-12-01",
        teamSize: 5,
        message: "Test message",
      }

      const result = coworkingSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates team size constraints", () => {
      const invalidData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        teamSize: 0,
      }

      const result = coworkingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("teamSize"))).toBe(true)
      }
    })
  })

  describe("meetingRoomSchema", () => {
    it("validates correct meeting room data", () => {
      const validData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        companyName: "Test Company",
        meetingDate: "2024-12-01",
        startTime: "09:00",
        endTime: "17:00",
        attendees: 10,
        roomType: "conference",
        equipment: ["projector", "whiteboard"],
        catering: true,
        message: "Test message",
      }

      const result = meetingRoomSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates attendee count constraints", () => {
      const invalidData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        attendees: 0,
      }

      const result = meetingRoomSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("attendees"))).toBe(true)
      }
    })

    it("validates time format", () => {
      const invalidData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        startTime: "25:00",
      }

      const result = meetingRoomSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("startTime"))).toBe(true)
      }
    })
  })

  describe("advertisingSchema", () => {
    it("validates correct advertising data", () => {
      const validData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        companyName: "Test Company",
        advertisingType: "digital-display",
        duration: "3-months",
        budget: 5000,
        targetAudience: "business-professionals",
        campaignGoals: ["brand-awareness", "lead-generation"],
        previousExperience: true,
        message: "Test message",
      }

      const result = advertisingSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("validates budget constraints", () => {
      const invalidData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        budget: -100,
      }

      const result = advertisingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("budget"))).toBe(true)
      }
    })
  })

  describe("specialDealsSchema", () => {
    it("validates correct special deals data", () => {
      const validData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        companyName: "Test Company",
        interestedServices: ["virtual-office", "coworking"],
        companySize: "medium",
        timeline: "immediate",
        budget: 10000,
        message: "Test message",
      }

      const result = specialDealsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it("requires at least one interested service", () => {
      const invalidData = {
        contactPerson: "Jan Kowalski",
        email: "jan@example.com",
        phone: "+48 123 456 789",
        interestedServices: [],
      }

      const result = specialDealsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.includes("interestedServices"))).toBe(true)
      }
    })
  })
})
