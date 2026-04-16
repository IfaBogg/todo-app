import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable for Prisma client");
}

export const prisma =
    globalForPrisma.prisma ?? new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
    });

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;