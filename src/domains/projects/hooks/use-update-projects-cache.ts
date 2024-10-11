import { useUpdateResourceCache } from "@/lib/hooks/use-update-resource-cache";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";
import type { Project } from "@prisma/client";

export const useUpdateProjectsCache = () =>
  useUpdateResourceCache<Project>(PROJECTS_LIST_QUERY_KEY);
