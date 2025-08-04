import {
  submitVirtualOfficeForm,
  submitCoworkingForm,
  submitMeetingRoomForm,
  submitAdvertisingForm,
  submitSpecialDealsForm,
  getEmailSubject,
  getEmailBody,
} from "@/lib/server-actions";
import { vi } from "vitest";

// Mock email client and database
vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: {
    sendEmail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    verifyConnection: vi.fn(),
  },
}));

vi.mock("@/lib/database/connection-pool", () => ({
  db: {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  },
}));

const SERVICE_NAMES = {
  "virtual-office": { pl: "biuro wirtualne", en: "virtual office" },
  coworking: { pl: "coworking", en: "coworking" },
  "meeting-room": { pl: "sala konferencyjna", en: "meeting room" },
  advertising: { pl: "reklama", en: "advertising" },
  "special-deals": { pl: "oferty specjalne", en: "special deals" },
} as const;

async function expectEmailCalls(
  data: any,
  formType: keyof typeof SERVICE_NAMES,
  language: "pl" | "en",
) {
  const { emailClient } = await import("@/lib/email/smtp-client");
  const expectedUserSubject = getEmailSubject(formType, language);
  const expectedUserText = getEmailBody(data, formType, language);
  const serviceName = SERVICE_NAMES[formType][language];
  const expectedAdminSubject =
    language === "en"
      ? `New submission: ${serviceName}`
      : `Nowe zgłoszenie: ${serviceName}`;
  const expectedAdminText =
    language === "en"
      ? `New submission from ${data.email} regarding ${serviceName}.`
      : `Nowe zgłoszenie od ${data.email} dotyczące ${serviceName}.`;

  expect(emailClient.sendEmail).toHaveBeenCalledWith({
    to: data.email,
    subject: expectedUserSubject,
    text: expectedUserText,
  });
  expect(emailClient.sendEmail).toHaveBeenCalledWith({
    to: "admin@gliwicka111.pl",
    subject: expectedAdminSubject,
    text: expectedAdminText,
  });
  expect(emailClient.sendEmail).toHaveBeenCalledTimes(2);
}

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

      const result = await submitVirtualOfficeForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          email: "jan@example.com",
          companyName: "Test Company",
          package: "basic",
          startDate: "2024-12-01",
        },
        "virtual-office",
        "pl",
      );
    });

    it("sends English emails when language is en", async () => {
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "Smith");
      formData.append("email", "john@example.com");
      formData.append("phone", "+48 123 456 789");
      formData.append("gdprConsent", "on");
      formData.append("companyName", "Test Company");
      formData.append("package", "basic");
      formData.append("startDate", "2024-12-01");
      formData.append("businessType", "sole-proprietorship");
      formData.append("message", "Test message");

      const result = await submitVirtualOfficeForm(formData, "en");

      expect(result.success).toBe(true);
      await expectEmailCalls(
        {
          email: "john@example.com",
          companyName: "Test Company",
          package: "basic",
          startDate: "2024-12-01",
        },
        "virtual-office",
        "en",
      );
    });

    it("rejects invalid form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "");
      formData.append("email", "invalid-email");

      const result = await submitVirtualOfficeForm(formData, "pl");

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

      const result = await submitVirtualOfficeForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
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

      const result = await submitCoworkingForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          email: "jan@example.com",
          startDate: "2024-12-01",
          workspaceType: "hot-desk",
        },
        "coworking",
        "pl",
      );
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

      const result = await submitMeetingRoomForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          email: "jan@example.com",
          companyName: "Test Company",
          date: "2024-12-01",
          startTime: "09:00",
        },
        "meeting-room",
        "pl",
      );
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
      formData.append("startDate", "2024-12-01");
      formData.append("budget", "5000-10000");

      const result = await submitAdvertisingForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          email: "jan@example.com",
          companyName: "Test Company",
          startDate: "2024-12-01",
          campaignType: "digital",
        },
        "advertising",
        "pl",
      );
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
      formData.append("dealType", "welcome-package");
      formData.append("currentSituation", "new-business");
      formData.append("timeline", "immediate");
      formData.append("budget", "5000-10000");

      const result = await submitSpecialDealsForm(formData, "pl");

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          email: "jan@example.com",
          companyName: "Test Company",
          timeline: "immediate",
          dealType: "welcome-package",
        },
        "special-deals",
        "pl",
      );
    });
  });
});
