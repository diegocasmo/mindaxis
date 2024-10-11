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
import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProjectAction({ projectId: project.id });
        await queryClient.invalidateQueries({
          queryKey: PROJECTS_LIST_QUERY_KEY,
        });
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

  return (
    <Card key={project.id} className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(project.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Updated:{" "}
              {project.updatedAt
                ? new Date(project.updatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
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
      </CardContent>
    </Card>
  );
}
