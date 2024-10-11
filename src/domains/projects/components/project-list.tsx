"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import type { PaginatedResult } from "@/lib/utils/pagination";
import type { Project } from "@prisma/client";
import { CreateProjectForm } from "@/domains/projects/components/create-project-form";
import { useProjects } from "@/domains/projects/hooks/use-projects";
import { ProjectCard } from "@/domains/projects/components/project-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

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

  const projects = data?.pages.flatMap((page) => page.data) || [];
  const hasProjects = projects.length > 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateProjectForm />
        {projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {!hasProjects && status === "success" && (
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>No projects yet</AlertTitle>
          <AlertDescription>
            You haven't created any projects yet. Use the form above to create
            your first project!
          </AlertDescription>
        </Alert>
      )}

      {isFetchingNextPage && (
        <div className="text-center text-muted-foreground mt-4">
          Loading more...
        </div>
      )}

      {status === "error" && error instanceof Error && (
        <Alert variant="destructive" className="mt-4">
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
