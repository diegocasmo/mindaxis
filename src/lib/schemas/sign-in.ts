import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((v) => v.trim()),
});

export type EmailSchema = z.infer<typeof emailSchema>;
