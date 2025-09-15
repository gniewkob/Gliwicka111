import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email/failed-email-store", () => ({
  getPendingFailedEmails: vi.fn(),
  markEmailFailed: vi.fn(),
  markEmailSent: vi.fn(),
}));

vi.mock("@/lib/server-actions", () => ({
  sendConfirmationEmail: vi.fn(),
  sendAdminNotification: vi.fn(),
}));

vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: { sendEmail: vi.fn() },
}));

import { processFailedEmails } from "@/lib/email/retry";
import {
  getPendingFailedEmails,
  markEmailFailed,
  markEmailSent,
} from "@/lib/email/failed-email-store";
import {
  sendConfirmationEmail,
  sendAdminNotification,
} from "@/lib/server-actions";
import { emailClient } from "@/lib/email/smtp-client";

describe("processFailedEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.EMAIL_MAX_RETRIES = "3";
    process.env.ADMIN_EMAIL = "admin@example.com";
  });

  it("sends confirmation emails", async () => {
    (getPendingFailedEmails as any).mockResolvedValue([
      {
        id: 1,
        email_type: "confirmation",
        payload: { data: {}, formType: "virtual-office", language: "pl" },
      },
    ]);
    await processFailedEmails();
    expect(sendConfirmationEmail).toHaveBeenCalled();
    expect(markEmailSent).toHaveBeenCalledWith(1);
  });

  it("alerts admin after max retries", async () => {
    process.env.EMAIL_MAX_RETRIES = "1";
    (getPendingFailedEmails as any).mockResolvedValue([
      {
        id: 2,
        email_type: "admin",
        payload: { data: {}, formType: "coworking", language: "pl" },
      },
    ]);
    (sendAdminNotification as any).mockRejectedValue(new Error("fail"));
    (markEmailFailed as any).mockResolvedValue({ retry_count: 1, status: "failed" });
    await processFailedEmails();
    expect(emailClient.sendEmail).toHaveBeenCalled();
    expect(markEmailSent).not.toHaveBeenCalled();
  });
});
