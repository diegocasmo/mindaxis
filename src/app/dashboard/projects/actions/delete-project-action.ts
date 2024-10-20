"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteProject } from "@/domains/projects/services/delete-project";
import { auth } from "@/lib/auth";
import type { Project } from "@prisma/client";

const deleteProjectSchema = z.object({
  projectId: z.string().cuid(),
});

export async function deleteProjectAction(
  input: z.infer<typeof deleteProjectSchema>
): Promise<Project> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedInput = deleteProjectSchema.parse(input);

  const deletedProject = deleteProject({
    projectId: validatedInput.projectId,
    userId: session.user.id,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${validatedInput.projectId}`);

  return deletedProject;
}
