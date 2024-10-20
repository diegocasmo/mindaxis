import type { Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UpdateProjectParams = {
  projectId: string;
  name: string;
  userId: string;
};

export async function updateProject({
  projectId,
  name,
  userId,
}: UpdateProjectParams): Promise<Project> {
  // Check if the user is the owner of the project
  const userProject = await prisma.userProject.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
      role: "OWNER",
    },
  });

  if (!userProject) {
    throw new Error("User does not have permission to update this project");
  }

  // Update the project
  return prisma.project.update({
    where: { id: projectId },
    data: { name },
  });
}
