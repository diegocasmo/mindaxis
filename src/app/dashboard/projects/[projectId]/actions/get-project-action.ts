"use server";

import { z } from "zod";
import { getProject } from "@/domains/project/services/get-project";
import { auth } from "@/lib/auth";
import type { Project } from "@prisma/client";

const getProjectSchema = z.object({
  projectId: z.string().cuid(),
});

export async function getProjectAction(
  input: z.infer<typeof getProjectSchema>
): Promise<Project | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedInput = getProjectSchema.parse(input);

  try {
    return await getProject({
      projectId: validatedInput.projectId,
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project. Please try again.");
  }
}
