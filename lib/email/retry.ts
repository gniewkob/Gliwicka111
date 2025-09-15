import {
  getPendingFailedEmails,
  markEmailFailed,
  markEmailSent,
} from "./failed-email-store";
import {
  sendConfirmationEmail,
  sendAdminNotification,
} from "@/lib/server-actions";
import { emailClient } from "./smtp-client";
import { getEnv } from "@/lib/env";

export async function processFailedEmails() {
  const MAX_RETRIES = Number(getEnv("EMAIL_MAX_RETRIES", "3"));
  const ADMIN_EMAIL = getEnv("ADMIN_EMAIL", "admin@gliwicka111.pl");
  const failures = await getPendingFailedEmails();
  for (const failure of failures) {
    try {
      const { data, formType, language } = failure.payload;
      if (failure.email_type === "confirmation") {
        await sendConfirmationEmail(data, formType, language);
      } else {
        await sendAdminNotification(data, formType, language, ADMIN_EMAIL);
      }
      await markEmailSent(failure.id);
    } catch (error) {
      const result = await markEmailFailed(failure.id, error, MAX_RETRIES);
      if (result.retry_count >= MAX_RETRIES && result.status === "failed") {
        console.error(
          `Email ${failure.id} failed after ${result.retry_count} attempts`,
          error,
        );
        try {
          await emailClient.sendEmail({
            to: ADMIN_EMAIL,
            subject: `Email retry failed: ${failure.email_type}`,
            text: `Email with ID ${failure.id} failed after ${result.retry_count} attempts. Last error: ${String(error)}`,
          });
        } catch (alertError) {
          console.error("Failed to send alert email", alertError);
        }
      }
    }
  }
}

export default processFailedEmails;
