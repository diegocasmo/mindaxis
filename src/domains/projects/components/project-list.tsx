"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import type { PaginatedResult } from "@/lib/utils/pagination";
import type { Project } from "@prisma/client";
import { CreateProjectForm } from "@/domains/projects/components/create-project-form";
import { useProjects } from "@/domains/projects/hooks/use-projects";
import { ProjectCard } from "@/domains/projects/components/project-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ProjectListProps = {
  initialProjects: PaginatedResult<Project>;
};

export function ProjectList({ initialProjects }: ProjectListProps) {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useProjects({ initialProjects });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateProjectForm />
        {data?.pages
          .flatMap((page) => page.data)
          .map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </div>

      {isFetchingNextPage && (
        <div className="text-center text-muted-foreground">Loading more...</div>
      )}

      {status === "error" && error instanceof Error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <div ref={ref} className="h-10" />
    </>
  );
}
