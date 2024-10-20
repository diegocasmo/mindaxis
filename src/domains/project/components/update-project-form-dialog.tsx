import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setFormErrors } from "@/lib/utils/form";
import {
  updateProjectSchema,
  UpdateProjectSchema,
} from "@/domains/projects/schemas/update-project";
import { updateProjectAction } from "@/app/dashboard/projects/actions/update-project-action";
import { Project } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";

type UpdateProjectFormDialogProps = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

export function UpdateProjectFormDialog({
  project,
  isOpen,
  onClose,
}: UpdateProjectFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("name", data.name);
        const result = await updateProjectAction({
          projectId: project.id,
          formData,
        });

        if (result.success) {
          await queryClient.invalidateQueries({
            queryKey: PROJECTS_LIST_QUERY_KEY,
          });
          toast({
            title: "Project updated",
            description: `${result.data.name} has been successfully updated.`,
          });
          onClose();
        } else {
          setFormErrors(form.setError, result.errors);
        }
      } catch (error) {
        console.error("Project update error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription className="sr-only">
            Change the name of your project. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
