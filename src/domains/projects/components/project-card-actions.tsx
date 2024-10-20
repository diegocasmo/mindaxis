import { useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { deleteProjectAction } from "@/app/dashboard/projects/actions/delete-project-action";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";

interface ProjectCardActionsProps {
  project: Project;
  onUpdate: () => void;
}

export function ProjectCardActions({
  project,
  onUpdate,
}: ProjectCardActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

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
        setIsDeleteDialogOpen(false);
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="cursor-pointer" onSelect={onUpdate}>
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this project?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              project "{project.name}" and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
