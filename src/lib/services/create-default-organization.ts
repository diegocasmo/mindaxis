import { prisma } from "@/lib/prisma";

function getOrganizationName(email: string): string {
  const [name] = email.split("@");
  return name.charAt(0).toUpperCase() + name.slice(1) + "'s Organization";
}

export async function createDefaultOrganization(userId: string, email: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingUserOrg = await tx.userOrganization.findFirst({
        where: { userId },
      });

      if (existingUserOrg) {
        return; // User already has an organization, do nothing
      }

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
    throw error; // Re-throw the error to be handled by the caller
  }
}
