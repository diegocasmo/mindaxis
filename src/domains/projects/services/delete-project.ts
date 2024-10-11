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
  // Check if the user is the owner of the project
  const userProject = await prisma.userProject.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
      role: "OWNER",
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
