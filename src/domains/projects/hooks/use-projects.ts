import { useInfiniteQuery } from "@tanstack/react-query";
import { listProjectsAction } from "@/app/dashboard/actions/list-projects-action";
import type { PaginatedResult } from "@/lib/utils/pagination";
import type { Project } from "@prisma/client";

type UseProjectsOptions = {
  initialProjects?: PaginatedResult<Project>;
  perPage?: number;
};

export const PROJECTS_LIST_QUERY_KEY = ["projects"];

export function useProjects(options: UseProjectsOptions = {}) {
  const { initialProjects, perPage = 20 } = options;

  return useInfiniteQuery({
    queryKey: PROJECTS_LIST_QUERY_KEY,
    queryFn: async ({ pageParam = 1 }) =>
      listProjectsAction({
        page: typeof pageParam === "number" ? pageParam : 1,
        perPage,
      }),
    initialPageParam: initialProjects ? initialProjects.metadata.page + 1 : 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    ...(initialProjects && {
      initialData: {
        pages: [initialProjects],
        pageParams: [initialProjects.metadata.page],
      },
    }),
  });
}
