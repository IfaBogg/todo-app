import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
        },
    });

    return Response.json(user);
}