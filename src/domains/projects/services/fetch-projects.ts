import { prisma } from "@/lib/prisma";
import { Project } from "@prisma/client";
import {
  PaginationParams,
  PaginatedResult,
  getPaginationParams,
  calculatePaginationMetadata,
} from "@/lib/utils/pagination";

type FetchProjectsParams = PaginationParams & {
  userId: string;
};

export async function fetchProjects({
  userId,
  ...paginationParams
}: FetchProjectsParams): Promise<PaginatedResult<Project>> {
  const { page, perPage } = getPaginationParams(paginationParams);

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where: {
        userProjects: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.project.count({
      where: {
        userProjects: {
          some: {
            userId,
          },
        },
      },
    }),
  ]);

  return {
    data: projects,
    metadata: calculatePaginationMetadata(total, { page, perPage }),
  };
}
