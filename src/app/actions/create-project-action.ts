"use server";

import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/lib/schemas/create-project";
import { createProject } from "@/lib/services/create-project";
import { parseZodErrors } from "@/lib/utils/form";
import type { FieldErrors } from "react-hook-form";
import { auth } from "@/lib/auth";
import type { Project } from "@prisma/client";
import { handlePrismaError } from "@/lib/utils/prisma-error-handler";

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

    return {
      success: false,
      errors: parseZodErrors({
        success: false,
        error: handlePrismaError(error),
      }),
    };
  }
}
