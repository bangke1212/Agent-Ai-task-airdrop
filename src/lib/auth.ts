import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
export const { handlers, auth, signIn, signOut } = NextAuth({ adapter: PrismaAdapter(prisma), providers: [ GitHub({ clientId: process.env.AUTH_GITHUB_ID || "dummy", clientSecret: process.env.AUTH_GITHUB_SECRET || "dummy" }), Google({ clientId: process.env.AUTH_GOOGLE_ID || "dummy", clientSecret: process.env.AUTH_GOOGLE_SECRET || "dummy" }) ], pages: { signIn: "/login" }, callbacks: { session({ session, user }) { if (session.user) { (session.user as any).id = user.id; } return session; } } });
