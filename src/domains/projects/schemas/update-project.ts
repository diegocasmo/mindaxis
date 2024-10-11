import { z } from "zod";
import { createProjectSchema } from "@/domains/projects/schemas/create-project";

export const updateProjectSchema = z.object({
  name: createProjectSchema.shape.name,
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
