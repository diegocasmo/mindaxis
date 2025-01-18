"use server";

import { revalidatePath } from "next/cache";
import {
  createListSchema,
  type CreateListSchema,
} from "@/domains/list/schemas/create-list";
import { createList } from "@/domains/list/services/create-list";
import { parseZodErrors, createZodError } from "@/lib/utils/form";
import type { FieldErrors } from "react-hook-form";
import { auth } from "@/lib/auth";
import type { List } from "@prisma/client";
import { transformPrismaErrorToZodError } from "@/lib/utils/prisma-error-handler";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors<CreateListSchema> };

export async function createListAction(
  formData: FormData
): Promise<ActionResult<List>> {
  const result = createListSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    projectId: formData.get("projectId"),
  });

  if (!result.success) {
    return { success: false, errors: parseZodErrors(result) };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const list = await createList({
      name: result.data.name,
      type: result.data.type,
      userId: session.user.id,
      projectId: result.data.projectId,
    });

    revalidatePath(`/projects/${result.data.projectId}`);

    return { success: true, data: list };
  } catch (error) {
    console.error("Error creating list:", error);

    const zodError =
      transformPrismaErrorToZodError(error) ||
      createZodError("An unexpected error occurred. Please try again.", [
        "name",
        "type",
        "projectId",
      ]);

    return {
      success: false,
      errors: parseZodErrors(zodError),
    };
  }
}
