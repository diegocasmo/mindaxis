"use server";

import { emailSchema, type EmailSchema } from "@/lib/schemas/sign-in";
import { signIn } from "@/lib/auth";
import { parseZodErrors, type FieldErrors } from "@/lib/form-utils";

type SignInResult =
  | { success: true }
  | { success: false; errors: FieldErrors<EmailSchema> };

export async function signInAction(formData: FormData): Promise<SignInResult> {
  const result = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!result.success) {
    return { success: false, errors: parseZodErrors(result) };
  }

  try {
    await signIn("resend", { email: result.data.email, redirect: false });
    return { success: true };
  } catch {
    return {
      success: false,
      errors: {
        email: {
          type: "manual",
          message: "Failed to sign in. Please try again.",
        },
      },
    };
  }
}
