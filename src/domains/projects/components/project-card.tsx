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
    <Card className="w-full" ref={cardRef}>
      <CardContent className="p-6">
        {isFormVisible ? (
          <UpdateProjectForm
            project={project}
            onCancel={() => setIsFormVisible(false)}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-2">{project.name}</h3>
            </div>
            <ProjectCardActions
              project={project}
              onUpdate={() => setIsFormVisible(true)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
