import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";
import { deleteProjectAction } from "@/app/dashboard/projects/actions/delete-project-action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";

type DeleteProjectDialogProps = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

export function DeleteProjectDialog({
  project,
  isOpen,
  onClose,
}: DeleteProjectDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProjectAction({ projectId: project.id });
        toast({
          title: "Project deleted",
          description: `${project.name} has been successfully deleted.`,
        });
        await queryClient.invalidateQueries({
          queryKey: PROJECTS_LIST_QUERY_KEY,
        });
        router.push("/dashboard");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the project "{project.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
  );
}
