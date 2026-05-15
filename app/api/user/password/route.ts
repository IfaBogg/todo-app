/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
    const session: any = await getServerSession(authOptions as any);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || !user.password) return NextResponse.json({ error: "No password set" }, { status: 400 });

        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return NextResponse.json({ error: "Invalid current password" }, { status: 403 });

        const hash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update password" }, { status: 500 });
    }
}
