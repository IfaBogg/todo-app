import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Allow any role string
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}