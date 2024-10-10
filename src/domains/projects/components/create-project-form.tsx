"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/lib/schemas/create-project";
import { setFormErrors } from "@/lib/utils/form";
import { useTransition } from "react";
import { createProjectAction } from "@/app/actions/create-project-action";
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
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useFormVisibility } from "@/lib/hooks/use-form-visibility";
import { useQueryClient } from "@tanstack/react-query";
import { PROJECTS_LIST_QUERY_KEY } from "@/domains/projects/hooks/use-projects";

export function CreateProjectForm() {
  const { isFormVisible, setIsFormVisible, cardRef } = useFormVisibility();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("name", data.name);
        const result = await createProjectAction(formData);

        if (result.success) {
          setIsFormVisible(false);
          form.reset();
          await queryClient.invalidateQueries({
            queryKey: PROJECTS_LIST_QUERY_KEY,
          });
        } else {
          setFormErrors(form.setError, result.errors);
        }
      } catch (error) {
        console.error("Project creation error:", error);
        form.setError("name", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  });

  return (
    <Card ref={cardRef} className="w-full">
      <CardContent className="p-6">
        {!isFormVisible ? (
          <Button
            onClick={() => {
              setIsFormVisible(true);
              form.reset();
            }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span>Create New Project</span>
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project name"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
