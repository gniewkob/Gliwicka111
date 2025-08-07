import { processFailedEmails } from "@/lib/email/retry";

processFailedEmails().catch((err) => {
  console.error("Retry worker encountered an error", err);
  process.exit(1);
});
