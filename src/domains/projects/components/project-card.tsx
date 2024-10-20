import type { Project } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UpdateProjectForm } from "@/domains/projects/components/update-project-form";
import { useFormVisibility } from "@/lib/hooks/use-form-visibility";
import { ProjectCardActions } from "@/domains/projects/components/project-card-actions";

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

  return (
    <Card className="w-full h-[250px]" ref={cardRef}>
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
              <ProjectCardActions
                project={project}
                onUpdate={() => setIsFormVisible(true)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
