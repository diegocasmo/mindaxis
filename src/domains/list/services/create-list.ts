import type { List, ListType } from "@prisma/client";
import { UserProjectRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateListParams = {
  name: string;
  type: ListType;
  userId: string;
  projectId: string;
};

export async function createList({
  name,
  type,
  userId,
  projectId,
}: CreateListParams): Promise<List> {
  try {
    // Check if the user is the owner of the project
    await prisma.userProject.findFirstOrThrow({
      where: {
        userId,
        projectId,
        role: UserProjectRole.OWNER,
      },
    });

    // Create the new list
    const list = await prisma.list.create({
      data: {
        name,
        type,
        projectId,
      },
    });

    return list;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}
