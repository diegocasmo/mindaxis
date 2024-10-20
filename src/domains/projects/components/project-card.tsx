import type { Project } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UpdateProjectForm } from "@/domains/projects/components/update-project-form";
import { useFormVisibility } from "@/lib/hooks/use-form-visibility";
import { ProjectCardActions } from "@/domains/projects/components/project-card-actions";
import Link from "next/link";
import { MouseEvent } from "react";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();
  const { isFormVisible, setIsFormVisible, cardRef } = useFormVisibility();

  const handleSuccess = async (nextProject: Project) => {
    setIsFormVisible(false);

    toast({
      title: "Project updated",
      description: `${nextProject.name} has been successfully updated.`,
    });
  };

  // Prevent navigation if the click target is the dropdown or its children
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".project-card-actions")) {
      e.preventDefault();
    }
  };

  const Children = (
    <Card
      className={`w-full h-[180px] ${!isFormVisible ? "cursor-pointer" : ""}`}
      ref={cardRef}
      onClick={handleClick}
    >
      <CardContent className="p-6 h-full flex flex-col justify-between">
        {isFormVisible ? (
          <UpdateProjectForm
            project={project}
            onCancel={() => setIsFormVisible(false)}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="flex flex-col justify-between h-full">
            <div className="flex justify-between items-start w-full">
              <h3 className="font-semibold">{project.name}</h3>
              <div
                className="project-card-actions"
                onClick={(e) => e.preventDefault()}
              >
                <ProjectCardActions
                  project={project}
                  onUpdate={() => setIsFormVisible(true)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return isFormVisible ? (
    Children
  ) : (
    <Link href={`/dashboard/projects/${project.id}`} className="block" passHref>
      {Children}
    </Link>
  );
}
