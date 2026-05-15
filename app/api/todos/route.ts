import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let todos;

  if (session.user.role === "ADMIN") {
    // 👑 Admin sees all todos
    todos = await prisma.todo.findMany({
      orderBy: { id: "desc" },
    });
  } else {
    // 👤 User sees only their todos
    todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" },
    });
  }

  return Response.json(todos);
}

// ➕ POST Todo
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, dueDate } = await req.json();

  const todo = await prisma.todo.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
    },
  });

  return Response.json(todo);
}

// ❌ DELETE Todo
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted" });
}

// ✔ PATCH (toggle complete)
export async function PATCH(req: Request) {
  const { id, completed } = await req.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(updated);
}