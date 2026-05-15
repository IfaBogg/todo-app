import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String((body as { email?: string })?.email || "").trim().toLowerCase();

  if (!email || !emailRegex.test(email)) {
    return Response.json({ error: "Valid email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpires: expires,
      },
    });

    try {
      await sendResetPasswordEmail(email, token);
    } catch (err) {
      console.error("Failed to send reset email:", err);
    }
  }

  return Response.json({
    message: "If that email exists, a reset link has been queued. Check your inbox shortly.",
  });
}
