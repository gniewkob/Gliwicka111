import nodemailer, { type SendMailOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

async function sendEmail(options: SendMailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
