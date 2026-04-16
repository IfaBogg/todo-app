import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

//Get all Todos
export async function GET() {
    const todos = await prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
}

//Post a new Todo
export async function POST(req: Request) {
    const body = await req.json();

    const todo = await prisma.todo.create({
        data: { 
            title: body.title
        },
    });
    return NextResponse.json(todo);
}

//Delete a Todo
export async function DELETE(req: Request) {
    const { id } = await req.json();

    await prisma.todo.delete({
        where: { id },
    });
    return NextResponse.json({ message: "Todo deleted" });
}

//Update Toggle a Todo
export async function PATCH(req: Request) {
    const { id, completed } = await req.json();

    const todo = await prisma.todo.update({
        where: { id },
        data: { completed },
    });
    return NextResponse.json(todo);
}
