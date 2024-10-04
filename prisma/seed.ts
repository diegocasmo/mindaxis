import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createDefaultOrganization } from "@/lib/services/create-default-organization";
import { createProject } from "@/lib/services/create-project";

const prisma = new PrismaClient();

async function main() {
  // Create a new user with verified email
  const user = await prisma.user.create({
    data: {
      email: "foo@bar.com",
      emailVerified: new Date(),
    },
  });

  // Create the default organization for the user
  const organization = await createDefaultOrganization({
    userId: user.id,
    email: user.email,
  });

  if (!organization) {
    throw new Error("Failed to create default organization");
  }

  // Create 10 projects for the user
  for (let i = 0; i < 10; i++) {
    await createProject({
      name: faker.commerce.productName(),
      userId: user.id,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
