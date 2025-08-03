import {
  submitVirtualOfficeForm,
  submitCoworkingForm,
  submitMeetingRoomForm,
  submitAdvertisingForm,
  submitSpecialDealsForm,
} from "@/lib/server-actions"
import jest from "jest"

// Mock the email sending functionality
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
  })),
}))

describe("Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("submitVirtualOfficeForm", () => {
    it("processes valid form data successfully", async () => {
      const formData = new FormData()
      formData.append("companyName", "Test Company")
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")
      formData.append("nip", "1234567890")
      formData.append("businessType", "consulting")
      formData.append("preferredDate", "2024-12-01")
      formData.append("message", "Test message")

      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("wysłany")
    })

    it("rejects invalid form data", async () => {
      const formData = new FormData()
      formData.append("companyName", "")
      formData.append("email", "invalid-email")

      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain("błąd")
    })

    it("handles email sending errors gracefully", async () => {
      // Mock email sending to fail
      const nodemailer = require("nodemailer")
      nodemailer.createTransport.mockReturnValue({
        sendMail: jest.fn().mockRejectedValue(new Error("Email sending failed")),
      })

      const formData = new FormData()
      formData.append("companyName", "Test Company")
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")

      const result = await submitVirtualOfficeForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain("błąd")
    })
  })

  describe("submitCoworkingForm", () => {
    it("processes valid coworking form data", async () => {
      const formData = new FormData()
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")
      formData.append("companyName", "Test Company")
      formData.append("workspaceType", "hot-desk")
      formData.append("duration", "monthly")
      formData.append("startDate", "2024-12-01")
      formData.append("teamSize", "5")

      const result = await submitCoworkingForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("wysłany")
    })
  })

  describe("submitMeetingRoomForm", () => {
    it("processes valid meeting room form data", async () => {
      const formData = new FormData()
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")
      formData.append("companyName", "Test Company")
      formData.append("meetingDate", "2024-12-01")
      formData.append("startTime", "09:00")
      formData.append("endTime", "17:00")
      formData.append("attendees", "10")
      formData.append("roomType", "conference")

      const result = await submitMeetingRoomForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("wysłany")
    })
  })

  describe("submitAdvertisingForm", () => {
    it("processes valid advertising form data", async () => {
      const formData = new FormData()
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")
      formData.append("companyName", "Test Company")
      formData.append("advertisingType", "digital-display")
      formData.append("duration", "3-months")
      formData.append("budget", "5000")
      formData.append("targetAudience", "business-professionals")

      const result = await submitAdvertisingForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("wysłany")
    })
  })

  describe("submitSpecialDealsForm", () => {
    it("processes valid special deals form data", async () => {
      const formData = new FormData()
      formData.append("contactPerson", "Jan Kowalski")
      formData.append("email", "jan@example.com")
      formData.append("phone", "+48 123 456 789")
      formData.append("companyName", "Test Company")
      formData.append("interestedServices", "virtual-office")
      formData.append("interestedServices", "coworking")
      formData.append("companySize", "medium")
      formData.append("timeline", "immediate")
      formData.append("budget", "10000")

      const result = await submitSpecialDealsForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toContain("wysłany")
    })
  })
})
