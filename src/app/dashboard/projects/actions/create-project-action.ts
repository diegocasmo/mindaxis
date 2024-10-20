"use server";

import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/domains/projects/schemas/create-project";
import { createProject } from "@/domains/projects/services/create-project";
import { parseZodErrors, createZodError } from "@/lib/utils/form";
import type { FieldErrors } from "react-hook-form";
import { auth } from "@/lib/auth";
import type { Project } from "@prisma/client";
import { transformPrismaErrorToZodError } from "@/lib/utils/prisma-error-handler";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors<CreateProjectSchema> };

export async function createProjectAction(
  formData: FormData
): Promise<ActionResult<Project>> {
  const result = createProjectSchema.safeParse({
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

    const project = await createProject({
      name: result.data.name,
      userId: session.user.id,
    });

    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);

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
