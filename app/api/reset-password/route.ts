import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.json({ valid: false, error: "Reset token required." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return Response.json({ valid: false, error: "Invalid or expired reset token." }, { status: 400 });
  }

  return Response.json({ valid: true, email: user.email });
}

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "A valid token and a secure password are required." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return Response.json({ error: "Invalid or expired reset token." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    },
  });

  return Response.json({ message: "Password reset successfully. You can now sign in." });
}
