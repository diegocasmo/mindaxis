import type { Project, ListType } from "@prisma/client";
import { UserProjectRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateProjectParams = {
  name: string;
  userId: string;
};

export async function createProject({
  name,
  userId,
}: CreateProjectParams): Promise<Project> {
  try {
    // Find the user's organization
    const userOrganization = await prisma.userOrganization.findFirstOrThrow({
      where: { userId, role: "OWNER" },
      select: { organizationId: true },
    });

    const lists: { name: string; type: ListType }[] = [
      { name: "To-do", type: "TODO" },
      { name: "Doing", type: "DOING" },
      { name: "Done", type: "DONE" },
    ];

    // Create the project and automatically add lists
    const project = await prisma.project.create({
      data: {
        name,
        organizationId: userOrganization.organizationId,
        userProjects: {
          create: {
            userId,
            role: UserProjectRole.OWNER,
          },
        },
        lists: {
          create: lists,
        },
      },
    });

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}
