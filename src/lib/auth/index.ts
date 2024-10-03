import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { createDefaultOrganization } from "@/lib/services/create-default-organization";
import { getResendProvider } from "@/lib/auth/resend-provider";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [getResendProvider()],
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
    signIn: async ({ user, account }) => {
      if (user.id && user.email && account?.provider === "resend") {
        await createDefaultOrganization(user.id, user.email);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
