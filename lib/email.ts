import nodemailer from "nodemailer";

const host = process.env.EMAIL_SERVER_HOST;
const port = process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : undefined;
const secure = process.env.EMAIL_SERVER_SECURE === "true";
const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;

const defaultFrom = (() => {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;

  try {
    const url = new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000");
    return `noreply@${url.hostname}`;
  } catch {
    return "noreply@example.com";
  }
})();

const transporter = host && port && user && pass
  ? nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })
  : null;

export async function sendResetPasswordEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password/${token}`;

  const subject = "Reset your password";
  const text = `You requested a password reset. Open this link to update your password: ${resetUrl}`;
  const html = `
    <div style="font-family:system-ui, sans-serif; line-height:1.6; color:#0f172a;">
      <h1 style="font-size:24px; margin-bottom:16px;">Reset your password</h1>
      <p style="font-size:16px; margin-bottom:24px;">Click the button below to set a new password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block; padding:14px 24px; border-radius:12px; background:#2563eb; color:#fff; text-decoration:none; font-weight:600;">Reset password</a>
      <p style="margin-top:24px; font-size:14px; color:#475569;">If the button does not work, copy and paste this URL into your browser:</p>
      <p style="font-size:14px; word-break:break-all;">${resetUrl}</p>
    </div>
  `;

  if (!transporter) {
    console.warn("EMAIL NOT SENT: SMTP not configured. Reset link:", resetUrl);
    return;
  }

  await transporter.sendMail({
    from: defaultFrom,
    to: email,
    subject,
    text,
    html,
  });
}
