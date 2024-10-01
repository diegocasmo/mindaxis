"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailSchema } from "@/lib/schemas/signIn";
import { setFormErrors } from "@/lib/formUtils";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/signInAction";
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

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("email", data.email);
        const result = await signInAction(formData);

        if (result.success) {
          router.push("/api/auth/verify-request");
        } else {
          setFormErrors(form.setError, result.errors);
        }
      } catch {
        form.setError("email", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Continue with email"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
