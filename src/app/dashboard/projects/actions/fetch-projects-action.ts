"use server";

import { z } from "zod";
import { fetchProjects } from "@/domains/projects/services/fetch-projects";
import { auth } from "@/lib/auth";
import { MAX_PER_PAGE } from "@/lib/utils/pagination";
import { PaginatedResult } from "@/lib/utils/pagination";
import { Project } from "@prisma/client";

const fetchProjectsSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(MAX_PER_PAGE),
});

export async function fetchProjectsAction(
  input: z.infer<typeof fetchProjectsSchema>
): Promise<PaginatedResult<Project>> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedInput = fetchProjectsSchema.parse(input);

  return await fetchProjects({
    userId: session.user.id,
    ...validatedInput,
  });
}
