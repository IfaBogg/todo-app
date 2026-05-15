import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session: any = await getServerSession(authOptions as any);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email } = body;

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });
    return NextResponse.json({ user: { id: updated.id, name: updated.name, email: updated.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update" }, { status: 500 });
  }
}
