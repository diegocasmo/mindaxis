"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { archiveList } from "@/domains/list/services/archive-list";
import { auth } from "@/lib/auth";
import type { List } from "@prisma/client";

const archiveListSchema = z.object({
  listId: z.string().cuid(),
});

export async function archiveListAction({
  input,
}: {
  input: z.infer<typeof archiveListSchema>;
}): Promise<List> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const validatedInput = archiveListSchema.parse(input);

  const archivedList = await archiveList({
    listId: validatedInput.listId,
    userId: session.user.id,
  });

  revalidatePath(`/dashboard/projects/${archivedList.projectId}`);

  return archivedList;
}
