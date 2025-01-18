import { z } from "zod";
import { ListType } from "@prisma/client";

export const createListSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(100, "List name must be 100 characters or less")
    .transform((v) => v.trim()),
  type: z.nativeEnum(ListType, {
    errorMap: () => ({ message: "Invalid list type" }),
  }),
  projectId: z.string().min(1, "Project ID is required"),
});

export type CreateListSchema = z.infer<typeof createListSchema>;
