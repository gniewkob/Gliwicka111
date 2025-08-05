import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/email/failed-email-store", () => ({
  getPendingFailedEmails: vi.fn(),
  markEmailSent: vi.fn(),
  markEmailFailed: vi.fn(),
}));

vi.mock("@/lib/server-actions", () => ({
  sendConfirmationEmail: vi.fn(),
  sendAdminNotification: vi.fn(),
}));

vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: { sendEmail: vi.fn() },
}));

process.env.EMAIL_MAX_RETRIES = "3";
process.env.ADMIN_EMAIL = "admin@test.com";

import { processFailedEmails } from "@/lib/email/retry";
import {
  getPendingFailedEmails,
  markEmailFailed,
  markEmailSent,
} from "@/lib/email/failed-email-store";
import { sendConfirmationEmail } from "@/lib/server-actions";
import { emailClient } from "@/lib/email/smtp-client";

describe("processFailedEmails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increments retry count when sending fails", async () => {
    (getPendingFailedEmails as any).mockResolvedValue([
      {
        id: 1,
        email_type: "confirmation",
        payload: { data: {}, formType: "test", language: "en" },
        error: "",
        retry_count: 0,
        status: "pending",
      },
    ]);
    (sendConfirmationEmail as any).mockRejectedValue(new Error("fail"));
    (markEmailFailed as any).mockResolvedValue({
      retry_count: 1,
      status: "pending",
    });

    await processFailedEmails();

    expect(markEmailFailed).toHaveBeenCalledTimes(1);
    await expect((markEmailFailed as any).mock.results[0].value).resolves.toEqual({
      retry_count: 1,
      status: "pending",
    });
    expect(markEmailSent).not.toHaveBeenCalled();
    expect(emailClient.sendEmail).not.toHaveBeenCalled();
  });

  it("records failure and sends alert after max retries", async () => {
    (getPendingFailedEmails as any).mockResolvedValue([
      {
        id: 1,
        email_type: "confirmation",
        payload: { data: {}, formType: "test", language: "en" },
        error: "",
        retry_count: 2,
        status: "pending",
      },
    ]);
    (sendConfirmationEmail as any).mockRejectedValue(new Error("fail"));
    (markEmailFailed as any).mockResolvedValue({
      retry_count: 3,
      status: "failed",
    });

    await processFailedEmails();

    expect(markEmailFailed).toHaveBeenCalledWith(1, expect.any(Error), 3);
    expect(emailClient.sendEmail).toHaveBeenCalledWith({
      to: "admin@test.com",
      subject: "Email retry failed: confirmation",
      text: expect.stringContaining("Email with ID 1 failed after 3 attempts."),
    });
    expect(markEmailSent).not.toHaveBeenCalled();
  });
});
