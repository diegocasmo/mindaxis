import type { Project } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectActions } from "@/domains/project/components/project-actions";
import Link from "next/link";
import { MouseEvent } from "react";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  // Prevent navigation if the click target is the dropdown or its children
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".project-card-actions")) {
      e.preventDefault();
    }
  };

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="block" passHref>
      <Card className="`w-full h-[180px] cursor-pointer" onClick={handleClick}>
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="font-semibold">{project.name}</h3>
              <div
                className="project-card-actions"
                onClick={(e) => e.preventDefault()}
              >
                <ProjectActions project={project} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
