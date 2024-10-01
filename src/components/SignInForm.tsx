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
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Submitting..." : "Continue with email"}
      </button>
    </form>
  );
}
