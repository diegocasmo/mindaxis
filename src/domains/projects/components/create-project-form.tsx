"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/domains/projects/schemas/create-project";
import { setFormErrors } from "@/lib/utils/form";
import { useTransition } from "react";
import { createProjectAction } from "@/app/dashboard/projects/actions/create-project-action";
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
  const router = useRouter();

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
          await queryClient.invalidateQueries({
            queryKey: PROJECTS_LIST_QUERY_KEY,
          });
          form.reset();
          router.push(`/dashboard/projects/${result.data.id}`);
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
    <Card ref={cardRef} className="w-full h-[180px]">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        {!isFormVisible ? (
          <Button
            onClick={() => {
              setIsFormVisible(true);
              form.reset();
            }}
            className="w-full h-full flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New</span>
          </Button>
        ) : (
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="h-full flex flex-col justify-between"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Project name..."
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
