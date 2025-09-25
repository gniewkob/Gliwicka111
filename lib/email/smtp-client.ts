import nodemailer, {
  type SendMailOptions,
  type SentMessageInfo,
  } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getEnv } from "@/lib/env";

export function buildTransportOptions(params?: {
  insecureTLS?: boolean;
  debug?: boolean;
}): any {
  const smtpPort = Number(getEnv("SMTP_PORT", "587"));
  const smtpUser = getEnv("SMTP_USER", "");
  const smtpHost = getEnv("SMTP_HOST");
  const secure = smtpPort === 465;
  const debugEnv = getEnv("SMTP_DEBUG", "false") === "true";
  const insecureEnv = getEnv("SMTP_TLS_INSECURE", "false") === "true";

  const opts: any = {
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: smtpUser
      ? {
          user: smtpUser,
          pass: getEnv("SMTP_PASS"),
        }
      : undefined,
  };

  if (params?.debug || debugEnv) {
    (opts as any).logger = true;
    (opts as any).debug = true;
  }
  if (params?.insecureTLS || insecureEnv) {
    (opts as any).tls = { ...(opts as any).tls, rejectUnauthorized: false };
  }

  return opts;
}

export function createTransporter(params?: {
  insecureTLS?: boolean;
  debug?: boolean;
}) {
  const options = buildTransportOptions(params);
  const smtpUser = getEnv("SMTP_USER", "");
  const transporter = nodemailer.createTransport(options);
  return { transporter, smtpUser };
}



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
    const { transporter, smtpUser } = createTransporter();
    // Header From remains configurable (e.g., no-reply@...),
    // but the SMTP envelope sender must be the authenticated SMTP_USER.
    const headerFrom = smtpUser
      ? getEnv("SMTP_FROM", smtpUser)
      : getEnv("SMTP_FROM");
    const envelopeFrom = smtpUser || headerFrom;

    const info = await transporter.sendMail({
      from: headerFrom,
      envelope: {
        from: envelopeFrom,
        to: (options as any).to,
      },
      ...options,
    });
    return info;
  } catch (error: any) {
    // If provider rejects the MAIL FROM / header From, retry once using SMTP_USER for header as well
    const msg = String(error?.response || error?.message || "");
    const code = Number(error?.responseCode || 0);
    const isEnvelopeProblem = error?.code === "EENVELOPE" || code === 550 || code === 553 || /not allowed to send e-mails as the domain|Sender address rejected|From address not verified/i.test(msg);
    try {
      const { smtpUser } = createTransporter();
      const retryAllowed = Boolean(smtpUser) && isEnvelopeProblem;
      // Avoid infinite loops and only retry if header was different from smtpUser
      const originalFrom = (options as any).from;
      if (retryAllowed && originalFrom && smtpUser && originalFrom !== smtpUser) {
        console.warn("Email send retry with header From fallback to SMTP_USER");
        const retryOpts: any = {
          ...options,
          from: smtpUser,
          envelope: { from: smtpUser, to: (options as any).to },
        };
        if (!(options as any).replyTo) {
          retryOpts.replyTo = originalFrom;
        }
        const { transporter } = createTransporter();
        const info2 = await transporter.sendMail(retryOpts);
        return info2;
      }
    } catch (retryErr) {
      console.error("Email retry failed", retryErr);
      throw retryErr;
    }
    console.error("Email sending failed", error);
    throw error;
  }
}


async function verifyConnection() {
  if (getEnv("MOCK_EMAIL", "false") === "true") {
    return true;
  }

  try {
    const { transporter } = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("SMTP connection failed", error);
    return false;
  }
}

export const emailClient = { sendEmail, verifyConnection };
export default emailClient;
