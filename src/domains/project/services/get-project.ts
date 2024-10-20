import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

type GetProjectParams = {
  projectId: string;
  userId: string;
};

export async function getProject({
  projectId,
  userId,
}: GetProjectParams): Promise<Project> {
  const project = await prisma.project.findFirst({
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
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}
