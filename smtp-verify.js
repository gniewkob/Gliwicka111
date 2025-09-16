require(./env-loader);
const nodemailer = require(nodemailer);
(async () => {
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = port === 465; // implicit TLS if 465
    if (!host) throw new Error(SMTP_HOST
