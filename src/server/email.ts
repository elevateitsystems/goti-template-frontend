import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let mailTransporter: Transporter | undefined;

function getMailTransporter() {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_APP_PASSWORD;

  if (!user || !password) {
    throw new Error("SMTP_USER and SMTP_APP_PASSWORD must be configured");
  }

  mailTransporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    auth: {
      user,
      pass: password,
    },
  });

  return mailTransporter;
}

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const fromEmail = process.env.DEFAULT_FROM_EMAIL ?? process.env.SMTP_USER;
  if (!fromEmail) throw new Error("DEFAULT_FROM_EMAIL or SMTP_USER must be configured");
  const fromName = process.env.DEFAULT_FROM_NAME ?? "PrimeIQ";
  const result = await getMailTransporter().sendMail({
    from: `${fromName} <${fromEmail}>`,
    replyTo: process.env.DEFAULT_REPLY_TO_EMAIL || undefined,
    to,
    subject,
    text,
    html,
  });

  return result.messageId;
}

export function otpEmail(code: number, purpose: string, expiresAt: Date) {
  const expiry = expiresAt.toISOString();
  return {
    subject: `PrimeIQ ${purpose} code`,
    text: `Your PrimeIQ ${purpose} code is ${code}. It expires at ${expiry}.`,
    html: `<main style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>PrimeIQ</h1><p>Your ${purpose} code is:</p><p style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires at ${expiry}.</p></main>`,
  };
}
