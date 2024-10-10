"use server";

import { z } from "zod";
import { listProjects } from "@/domains/projects/services/list-projects";
import { auth } from "@/lib/auth";
import { MAX_PER_PAGE } from "@/lib/utils/pagination";
import { PaginatedResult } from "@/lib/utils/pagination";
import { Project } from "@prisma/client";

const listProjectsSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(MAX_PER_PAGE),
});

export async function listProjectsAction(
  input: z.infer<typeof listProjectsSchema>
): Promise<PaginatedResult<Project>> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedInput = listProjectsSchema.parse(input);

  return await listProjects({
    userId: session.user.id,
    ...validatedInput,
  });
}
