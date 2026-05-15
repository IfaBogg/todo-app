import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
         CredentialsProvider({
            name: "Credentials",
            credentials: {
            email: {},
            password: {},
            },
            async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing credentials");
            }

            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
            });

            if (!user || !user.password) {
                throw new Error("User not found");
            }

            const isValid = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isValid) {
                throw new Error("Invalid password");
            }

            return user;
            },
        }),
    ],

    session: {
        strategy: "jwt", // 🔥 IMPORTANT for role
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // Normalize role to uppercase
                token.role = ((user as { role?: string }).role || "USER").toUpperCase();
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "USER" | "ADMIN"; // 👈 FIX
            }
            return session;
        },
        async redirect({ baseUrl }) {
            return baseUrl + "/dashboard"; // ✅ ALWAYS go here
        },

        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
                });

                if (existingUser) {
                // ✅ Link Google account to existing user
                await prisma.account.upsert({
                    where: {
                    provider_providerAccountId: {
                        provider: "google",
                        providerAccountId: account.providerAccountId,
                    },
                    },
                    update: {},
                    create: {
                    userId: existingUser.id,
                    type: "oauth",
                    provider: "google",
                    providerAccountId: account.providerAccountId,
                    },
                });
                }
            }

            return true;
            }

    },


    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/auth/signin",
    },
};