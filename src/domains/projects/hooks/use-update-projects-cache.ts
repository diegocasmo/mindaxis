import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "./use-projects";
import type { Project } from "@prisma/client";
import type { PaginatedResult } from "@/lib/utils/pagination";

type ProjectsQueryData = {
  pages: PaginatedResult<Project>[];
  pageParams: number[];
};

export function useUpdateProjectsCache() {
  const queryClient = useQueryClient();

  const updateProjectsCache = (
    operation: "upsert" | "delete",
    project: Project
  ) => {
    queryClient.setQueryData<ProjectsQueryData>(
      PROJECTS_LIST_QUERY_KEY,
      (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page, pageIndex) => {
          let newData: Project[];

          if (operation === "upsert") {
            if (pageIndex === 0) {
              const existingIndex = page.data.findIndex(
                (p) => p.id === project.id
              );

              if (existingIndex !== -1) {
                newData = [
                  ...page.data.slice(0, existingIndex),
                  project,
                  ...page.data.slice(existingIndex + 1),
                ];
              } else {
                newData = [project, ...page.data];
                if (newData.length > page.metadata.perPage) {
                  newData.pop();
                }
              }
            } else {
              newData = page.data.map((p) =>
                p.id === project.id ? project : p
              );
            }
          } else if (operation === "delete") {
            newData = page.data.filter((p) => p.id !== project.id);
          }

          return {
            ...page,
            data: newData,
            metadata: {
              ...page.metadata,
              total:
                pageIndex === 0
                  ? operation === "upsert"
                    ? newData.length > page.data.length
                      ? page.metadata.total + 1
                      : page.metadata.total
                    : page.metadata.total - 1
                  : page.metadata.total,
              totalPages: Math.ceil(
                (pageIndex === 0
                  ? operation === "upsert"
                    ? newData.length > page.data.length
                      ? page.metadata.total + 1
                      : page.metadata.total
                    : page.metadata.total - 1
                  : page.metadata.total) / page.metadata.perPage
              ),
            },
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
  };

  return updateProjectsCache;
}
