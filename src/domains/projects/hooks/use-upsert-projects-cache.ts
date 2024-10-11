import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "./use-projects";
import type { Project } from "@prisma/client";
import type { PaginatedResult } from "@/lib/utils/pagination";

type ProjectsQueryData = {
  pages: PaginatedResult<Project>[];
  pageParams: number[];
};

export function useUpsertProjectsCache() {
  const queryClient = useQueryClient();

  const upsertProject = (project: Project) => {
    queryClient.setQueryData<ProjectsQueryData>(
      PROJECTS_LIST_QUERY_KEY,
      (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page, pageIndex) => {
          let newData: Project[];

          if (pageIndex === 0) {
            // Check if the project already exists in the first page
            const existingIndex = page.data.findIndex(
              (p) => p.id === project.id
            );

            if (existingIndex !== -1) {
              // Replace the existing project
              newData = [
                ...page.data.slice(0, existingIndex),
                project,
                ...page.data.slice(existingIndex + 1),
              ];
            } else {
              // Add the new project at the beginning
              newData = [project, ...page.data];
              // Remove the last item if we've exceeded the perPage limit
              if (newData.length > page.metadata.perPage) {
                newData.pop();
              }
            }
          } else {
            // For other pages, just replace if the project exists
            newData = page.data.map((p) => (p.id === project.id ? project : p));
          }

          return {
            ...page,
            data: newData,
            metadata: {
              ...page.metadata,
              total:
                pageIndex === 0 && newData.length > page.data.length
                  ? page.metadata.total + 1
                  : page.metadata.total,
              totalPages: Math.ceil(
                (pageIndex === 0 && newData.length > page.data.length
                  ? page.metadata.total + 1
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

  return upsertProject;
}
