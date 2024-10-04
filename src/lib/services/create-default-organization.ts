import { prisma } from "@/lib/prisma";
import { Organization } from "@prisma/client";

function getOrganizationName(email: string): string {
  const [name] = email.split("@");
  return name.charAt(0).toUpperCase() + name.slice(1) + "'s Organization";
}

type CreateDefaultOrganizationParams = {
  userId: string;
  email: string;
};

export async function createDefaultOrganization({
  userId,
  email,
}: CreateDefaultOrganizationParams): Promise<Organization | undefined> {
  try {
    const existingUserOrg = await prisma.userOrganization.findFirst({
      where: { userId },
    });

    // User already has an organization, do nothing
    if (existingUserOrg) return;

    // Create the default organization
    return prisma.$transaction(async (tx) => {
      const newOrg = await tx.organization.create({
        data: {
          name: getOrganizationName(email),
          userOrganizations: {
            create: {
              userId,
              role: "OWNER",
            },
          },
        },
      });

      return newOrg;
    });
  } catch (error) {
    console.error("Error creating default organization:", error);
    throw error;
  }
}
