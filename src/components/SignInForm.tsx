"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailSchema } from "@/lib/schemas/signIn";
import { setFormErrors } from "@/lib/formUtils";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/signInAction";

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("email", data.email);
        const result = await signInAction(formData);

        if (result.success) {
          router.push("/api/auth/verify-request");
        } else {
          setFormErrors(setError, result.errors);
        }
      } catch {
        setError("email", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className={`w-full px-3 py-2 bg-input text-foreground border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.email ? "border-destructive" : "border-input"
          }`}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div
            id="email-error"
            className="p-3 mt-2 text-sm font-medium text-white bg-destructive/50 rounded-md"
            role="alert"
          >
            {errors.email.message}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        aria-busy={isPending}
      >
        {isPending ? "Submitting..." : "Continue with email"}
      </button>
    </form>
  );
}
