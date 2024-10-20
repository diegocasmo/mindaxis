"use client";

import { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProjectActions } from "@/domains/project/components/project-actions";

type ProjectHeaderProps = {
  project: Project;
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-background border-b">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add List
        </Button>
        <ProjectActions project={project} />
      </div>
    </div>
  );
}
