import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Resend from "next-auth/providers/resend";
import { createDefaultOrganization } from "@/lib/services/create-default-organization";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  events: {
    // Create a default organization for users signing in with the resend
    // provider, if they don't already have one
    signIn: async ({ user, account }) => {
      if (user.id && user.email && account?.provider === "resend") {
        await createDefaultOrganization(user.id, user.email);
      }
    },
  },
});
