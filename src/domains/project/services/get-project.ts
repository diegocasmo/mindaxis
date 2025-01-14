import { prisma } from "@/lib/prisma";
import { ProjectWithLists } from "@/types";

type GetProjectParams = {
  projectId: string;
  userId: string;
};

export async function getProject({
  projectId,
  userId,
}: GetProjectParams): Promise<ProjectWithLists | null> {
  try {
    return await prisma.project.findFirst({
      where: {
        id: projectId,
        userProjects: {
          some: {
            userId: userId,
            projectId: projectId,
            role: "OWNER",
          },
        },
      },
      include: {
        lists: {
          where: {
            archivedAt: null,
          },
          orderBy: [
            { type: "asc" }, // Enum sorting based on schema declaration order
            { createdAt: "asc" },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("An error occurred while fetching the project");
  }
}
