
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ✅ GET todos (per user)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json([], { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const todos = await prisma.todo.findMany({
    where: { userId: user!.id },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(todos);
}

// ✅ POST todo
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: user!.id,
    },
  });

  return NextResponse.json(todo);
}

// ✅ DELETE todo (secure)
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 🔒 Ensure user owns the todo
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo || todo.userId !== user!.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

// ✅ PATCH todo (toggle/update)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, completed } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 🔒 Ensure user owns the todo
  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo || todo.userId !== user!.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(updated);
}