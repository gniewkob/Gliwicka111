import { vi } from "vitest";

vi.mock("@/lib/get-current-language", () => ({
  getCurrentLanguage: vi.fn(),
}));

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

vi.mock("@/lib/email/failed-email-store", () => ({
  saveFailedEmail: vi.fn().mockResolvedValue(undefined),
}));

import {
  submitVirtualOfficeForm,
  submitCoworkingForm,
  submitMeetingRoomForm,
  submitAdvertisingForm,
  submitSpecialDealsForm,
} from "@/lib/server-actions";
import { getCurrentLanguage } from "@/lib/get-current-language";
import { messages } from "@/lib/i18n";
import { emailClient } from "@/lib/email/smtp-client";
import { db } from "@/lib/database/connection-pool";
import { saveFailedEmail } from "@/lib/email/failed-email-store";

const originalNodeEnv = process.env.NODE_ENV;

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
  expectedUserSubject: string,
  expectedUserText: string,
) {
  const { emailClient } = await import("@/lib/email/smtp-client");
  const serviceName = SERVICE_NAMES[formType][language];
  const expectedAdminSubject =
    language === "en"
      ? `New submission: ${serviceName}`
      : `Nowe zgłoszenie: ${serviceName}`;
  const messageSummary = (() => {
    if (!data.message) {
      return language === "en" ? "No message provided" : "Brak wiadomości";
    }
    const trimmed = data.message.trim();
    return trimmed.length > 100 ? `${trimmed.slice(0, 100)}...` : trimmed;
  })();
  const expectedAdminText =
    language === "en"
      ? `New submission from ${data.firstName} ${data.lastName} (${data.email}, ${data.phone}) regarding ${serviceName}.\nMessage: ${messageSummary}`
      : `Nowe zgłoszenie od ${data.firstName} ${data.lastName} (${data.email}, ${data.phone}) dotyczące ${serviceName}.\nWiadomość: ${messageSummary}`;

  const calls = (emailClient.sendEmail as any).mock.calls;
  const userCall = calls.find((c: any) => c[0].to === data.email)?.[0];
  const adminCall = calls.find(
    (c: any) => c[0].to === "admin@gliwicka111.pl",
  )?.[0];

  expect(userCall.subject).toBe(expectedUserSubject);
  expect(userCall.text.replace(/\r\n/g, "\n")).toBe(expectedUserText);
  expect(adminCall.subject).toBe(expectedAdminSubject);
  expect(adminCall.text.replace(/\r\n/g, "\n")).toBe(expectedAdminText);
  expect(calls).toHaveLength(2);
}

describe("Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "development";
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
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

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: "Test message",
          companyName: "Test Company",
          package: "basic",
          startDate: "2024-12-01",
        },
        "virtual-office",
        "pl",
        "Potwierdzenie zapytania o biuro wirtualne - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące biuro wirtualne.\n\nNazwa firmy: Test Company\nData rozpoczęcia: 2024-12-01\nPakiet: basic\n\nSkontaktujemy się wkrótce.",
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

      (getCurrentLanguage as any).mockResolvedValue("en");
      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(true);
      await expectEmailCalls(
        {
          firstName: "John",
          lastName: "Smith",
          email: "john@example.com",
          phone: "+48 123 456 789",
          message: "Test message",
          companyName: "Test Company",
          package: "basic",
          startDate: "2024-12-01",
        },
        "virtual-office",
        "en",
        "Virtual Office Inquiry Confirmation - Gliwicka 111",
        "Thank you for your virtual office inquiry.\n\nCompany name: Test Company\nStart date: 2024-12-01\nPackage: basic\n\nWe will contact you soon.",
      );
    });

    it("rejects invalid form data", async () => {
      const formData = new FormData();
      formData.append("firstName", "");
      formData.append("email", "invalid-email");

      (getCurrentLanguage as any).mockResolvedValue("pl");
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
      formData.append("companyName", "Test Company");
      formData.append("package", "basic");
      formData.append("startDate", "2024-12-01");
      formData.append("businessType", "sole-proprietorship");

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitVirtualOfficeForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: undefined,
          companyName: "Test Company",
          package: "basic",
          startDate: "2024-12-01",
        },
        "virtual-office",
        "pl",
        "Potwierdzenie zapytania o biuro wirtualne - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące biuro wirtualne.\n\nNazwa firmy: Test Company\nData rozpoczęcia: 2024-12-01\nPakiet: basic\n\nSkontaktujemy się wkrótce.",
      );

      const { saveFailedEmail } = await import(
        "@/lib/email/failed-email-store"
      );
      expect(saveFailedEmail).toHaveBeenCalledTimes(2);
      expect(saveFailedEmail).toHaveBeenCalledWith(
        "confirmation",
        expect.any(Object),
        expect.any(Error),
      );
      expect(saveFailedEmail).toHaveBeenCalledWith(
        "admin",
        expect.any(Object),
        expect.any(Error),
      );
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

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitCoworkingForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: undefined,
          startDate: "2024-12-01",
          workspaceType: "hot-desk",
        },
        "coworking",
        "pl",
        "Potwierdzenie zapytania o coworking - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące coworking.\n\nData rozpoczęcia: 2024-12-01\nTyp przestrzeni: hot-desk\n\nSkontaktujemy się wkrótce.",
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

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitMeetingRoomForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: undefined,
          companyName: "Test Company",
          date: "2024-12-01",
          startTime: "09:00",
        },
        "meeting-room",
        "pl",
        "Potwierdzenie rezerwacji sali - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące sala konferencyjna.\n\nNazwa firmy: Test Company\nData: 2024-12-01\nGodzina rozpoczęcia: 09:00\n\nSkontaktujemy się wkrótce.",
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

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitAdvertisingForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: undefined,
          companyName: "Test Company",
          startDate: "2024-12-01",
          campaignType: "digital",
        },
        "advertising",
        "pl",
        "Potwierdzenie zapytania o reklamę - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące reklama.\n\nNazwa firmy: Test Company\nData rozpoczęcia: 2024-12-01\nTyp kampanii: digital\n\nSkontaktujemy się wkrótce.",
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

      (getCurrentLanguage as any).mockResolvedValue("pl");
      const result = await submitSpecialDealsForm(formData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("wysłany");
      await expectEmailCalls(
        {
          firstName: "Jan",
          lastName: "Kowalski",
          email: "jan@example.com",
          phone: "+48 123 456 789",
          message: undefined,
          companyName: "Test Company",
          timeline: "immediate",
          dealType: "welcome-package",
        },
        "special-deals",
        "pl",
        "Potwierdzenie zapytania o oferty specjalne - Gliwicka 111",
        "Dziękujemy za zgłoszenie dotyczące oferty specjalne.\n\nNazwa firmy: Test Company\nHarmonogram: immediate\nTyp oferty: welcome-package\n\nSkontaktujemy się wkrótce.",
      );
    });
  });

  describe("mock environment shortcut", () => {
    it("returns success message without side effects", async () => {
      process.env.MOCK_DB = "true";
      (getCurrentLanguage as any).mockResolvedValue("pl");
      const formData = new FormData();
      const result = await submitVirtualOfficeForm(formData);
      expect(result).toEqual({
        success: true,
        message: messages.form.success.pl,
      });
      expect(emailClient.sendEmail).not.toHaveBeenCalled();
      expect(db.query).not.toHaveBeenCalled();
      expect(saveFailedEmail).not.toHaveBeenCalled();
      delete process.env.MOCK_DB;
    });

    it("returns server error when forced error flag is set", async () => {
      process.env.MOCK_DB = "true";
      process.env.FORCED_FORM_ERROR = "true";
      (getCurrentLanguage as any).mockResolvedValue("en");
      const formData = new FormData();
      const result = await submitVirtualOfficeForm(formData);
      expect(result).toEqual({
        success: false,
        message: messages.form.serverError.en,
      });
      expect(emailClient.sendEmail).not.toHaveBeenCalled();
      expect(db.query).not.toHaveBeenCalled();
      expect(saveFailedEmail).not.toHaveBeenCalled();
      delete process.env.MOCK_DB;
      delete process.env.FORCED_FORM_ERROR;
    });
  });
});
