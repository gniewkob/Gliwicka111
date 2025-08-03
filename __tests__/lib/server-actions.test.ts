import {
  submitVirtualOfficeForm,
  submitCoworkingForm,
  submitMeetingRoomForm,
  submitAdvertisingForm,
  submitSpecialDealsForm,
} from "@/lib/server-actions";
import { vi } from "vitest";

// Mock email client and database
vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: {
    sendEmail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    verifyConnection: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  },
}));

describe("Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitVirtualOfficeForm", () => {
    it("processes valid form data successfully", async () => {
      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("companyName", "Test Company");
      formData.append("package", "basic");
      formData.append("startDate", "2024-12-01");
      formData.append("businessType", "sole-proprietorship");
      formData.append("message", "Test message");

      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
    });

    it("rejects invalid form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "");
      formData.append("email", "invalid-email");

      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("błęd");
    });

    it("handles email sending errors gracefully", async () => {
      const { emailClient } = await import("@/lib/email/smtp-client");
      (emailClient.sendEmail as any).mockRejectedValue(
        new Error("Email sending failed"),
      );

      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("package", "basic");
      formData.append("startDate", "2024-12-01");
      formData.append("businessType", "sole-proprietorship");

      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("błąd");
    });
  });

  describe("submitCoworkingForm", () => {
    it("processes valid coworking form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("workspaceType", "hot-desk");
      formData.append("duration", "monthly");
      formData.append("startDate", "2024-12-01");
      formData.append("teamSize", "5");

      const result = await submitCoworkingForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
    });
  });

  describe("submitMeetingRoomForm", () => {
    it("processes valid meeting room form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("companyName", "Test Company");
      formData.append("date", "2024-12-01");
      formData.append("startTime", "09:00");
      formData.append("endTime", "17:00");
      formData.append("attendees", "10");
      formData.append("roomType", "conference");

      const result = await submitMeetingRoomForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
    });
  });

  describe("submitAdvertisingForm", () => {
    it("processes valid advertising form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("companyName", "Test Company");
      formData.append("campaignType", "digital");
      formData.append("duration", "3-months");
      formData.append("budget", "5000");

      const result = await submitAdvertisingForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
    });
  });

  describe("submitSpecialDealsForm", () => {
    it("processes valid special deals form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "Jan");
      formData.append("lastName", "Kowalski");
      formData.append("email", "jan@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("companyName", "Test Company");
      formData.append("interestedServices", "virtual-office");
      formData.append("interestedServices", "coworking");
      formData.append("companySize", "medium");
      formData.append("timeline", "immediate");
      formData.append("budget", "10000");

      const result = await submitSpecialDealsForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
    });
  });
});
