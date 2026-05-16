import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session: any = await getServerSession(authOptions as any);
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, emailVerified: true },
            take: 50,
            orderBy: { email: "asc" },
        });
        return NextResponse.json({ users });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
