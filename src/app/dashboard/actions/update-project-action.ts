"use server";

import { updateProjectSchema } from "@/domains/projects/schemas/update-project";
import type { UpdateProjectSchema } from "@/domains/projects/schemas/update-project";
import { updateProject } from "@/domains/projects/services/update-project";
import { parseZodErrors, createZodError } from "@/lib/utils/form";
import type { FieldErrors } from "react-hook-form";
import { auth } from "@/lib/auth";
import type { Project } from "@prisma/client";
import { transformPrismaErrorToZodError } from "@/lib/utils/prisma-error-handler";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors<UpdateProjectSchema> };

export async function updateProjectAction(
  projectId: string,
  formData: FormData
): Promise<ActionResult<Project>> {
  const result = updateProjectSchema.safeParse({
    name: formData.get("name"),
  });

  if (!result.success) {
    return { success: false, errors: parseZodErrors(result) };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const project = await updateProject({
      projectId: projectId,
      name: result.data.name,
      userId: session.user.id,
    });

    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);

    const zodError =
      transformPrismaErrorToZodError(error) ||
      createZodError("An unexpected error occurred. Please try again.", [
        "name",
      ]);

    return {
      success: false,
      errors: parseZodErrors(zodError),
    };
  }
}
