import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "@/domains/projects/schemas/update-project";
import type { UpdateProjectSchema } from "@/domains/projects/schemas/update-project";
import { updateProjectAction } from "@/app/dashboard/actions/update-project-action";
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
import type { Project } from "@prisma/client";
import { useTransition } from "react";
import { setFormErrors } from "@/lib/utils/form";
import { useUpdateProjectsCache } from "@/domains/projects/hooks/use-update-projects-cache";

type UpdateProjectFormProps = {
  project: Project;
  onSuccess: (project: Project) => void;
  onCancel: () => void;
};

export function UpdateProjectForm({
  project,
  onSuccess,
  onCancel,
}: UpdateProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateProjectsCache = useUpdateProjectsCache();

  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("name", data.name);
        const result = await updateProjectAction(project.id, formData);

        if (result.success) {
          updateProjectsCache("upsert", result.data);
          onSuccess(result.data);
        } else {
          setFormErrors(form.setError, result.errors);
        }
      } catch (error) {
        console.error("Project update error:", error);
        form.setError("name", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
