import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

type DeleteProjectParams = {
  projectId: string;
  userId: string;
};

export async function deleteProject({
  projectId,
  userId,
}: DeleteProjectParams): Promise<Project> {
  // First, check if the user has permission to delete the project
  const userProject = await prisma.userProject.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  if (!userProject) {
    throw new Error("User does not have permission to delete this project");
  }

  // If the user has permission, delete the project
  return await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}
