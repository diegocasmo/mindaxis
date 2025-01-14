import { prisma } from "@/lib/prisma";
import type { List } from "@prisma/client";

type ArchiveListParams = {
  listId: string;
  userId: string;
};

export async function archiveList({
  listId,
  userId,
}: ArchiveListParams): Promise<List> {
  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      project: {
        userProjects: {
          some: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
    },
  });

  if (!list) {
    throw new Error("User does not have permission to archive this list");
  }

  if (list.archivedAt) {
    throw new Error("List is already archived");
  }

  return await prisma.list.update({
    where: {
      id: listId,
      archivedAt: null,
    },
    data: {
      archivedAt: new Date(),
    },
  });
}
