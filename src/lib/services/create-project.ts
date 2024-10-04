import { Project, UserProjectRole } from "@prisma/client";
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
      where: { userId },
      select: { organizationId: true },
    });

    // Create the project
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          organizationId: userOrganization.organizationId,
          userProjects: {
            create: {
              userId,
              role: UserProjectRole.OWNER,
            },
          },
        },
      });

      return project;
    });
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}
