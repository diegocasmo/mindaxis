"use client";

import { useTransition } from "react";
import type { Project } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { deleteProjectAction } from "@/app/dashboard/actions/delete-project-action";
import { useToast } from "@/hooks/use-toast";
import { UpdateProjectForm } from "@/domains/projects/components/update-project-form";
import { useFormVisibility } from "@/lib/hooks/use-form-visibility";
import { useUpdateProjectsCache } from "@/domains/projects/hooks/use-update-projects-cache";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const updateProjectsCache = useUpdateProjectsCache();
  const { isFormVisible, setIsFormVisible, cardRef } = useFormVisibility();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProjectAction({ projectId: project.id });
        updateProjectsCache("delete", project);
        toast({
          title: "Project deleted",
          description: `${project.name} has been successfully deleted.`,
        });
      } catch (error) {
        console.error("Project deletion error:", error);
        toast({
          title: "Error",
          description: "Failed to delete the project. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onSelect={() => setIsFormVisible(true)}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                    onClick={handleDelete}
                    disabled={isPending}
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive cursor-pointer"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
