import type { User } from "@prisma/client";
import type { DefaultSession } from "next-auth";

export type AuthenticatedSession = DefaultSession & {
  user: {
    email: string;
  } & DefaultSession["user"];
};

export type { User };
