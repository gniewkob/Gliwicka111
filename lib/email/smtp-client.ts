import nodemailer, {
  type SendMailOptions,
  type SentMessageInfo,
} from "nodemailer";
import { getEnv } from "@/lib/env";

const smtpPort = Number(getEnv("SMTP_PORT", "587"));
const smtpUser = getEnv("SMTP_USER", "");

const transporter = nodemailer.createTransport({
  host: getEnv("SMTP_HOST"),
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser
    ? {
        user: smtpUser,
        pass: getEnv("SMTP_PASS"),
      }
    : undefined,
});

async function sendEmail(options: SendMailOptions): Promise<SentMessageInfo> {
  if (getEnv("MOCK_EMAIL", "false") === "true") {
    return {
      envelope: {},
      messageId: "mocked-message-id",
      accepted: [],
      rejected: [],
      pending: [],
      response: "MOCK_EMAIL=true",
    } as SentMessageInfo;
  }

  try {
    const from = smtpUser
      ? getEnv("SMTP_FROM", smtpUser)
      : getEnv("SMTP_FROM");

    const info = await transporter.sendMail({
      from,
      ...options,
    });
    return info;
  } catch (error) {
    console.error("Email sending failed", error);
    throw error;
  }
}

async function verifyConnection() {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("SMTP connection failed", error);
    return false;
  }
}

export const emailClient = { sendEmail, verifyConnection };
export default emailClient;
