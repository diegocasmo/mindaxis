import { z } from "zod";
import { FieldValues, UseFormSetError, FieldError } from "react-hook-form";

export type FieldErrors<T extends FieldValues> = Partial<
  Record<keyof T, FieldError>
>;

export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: FieldErrors<T>
) {
  Object.entries(errors).forEach(([field, error]) => {
    if (error) {
      setError(field as keyof T, error);
    }
  });
}

export function parseZodErrors<T extends z.ZodType>(
  result: z.SafeParseError<z.infer<T>>
): FieldErrors<z.infer<T>> {
  return result.error.issues.reduce((acc, issue) => {
    const path = issue.path.join(".");
    if (path) {
      acc[path as keyof z.infer<T>] = {
        type: "manual",
        message: issue.message,
      };
    }
    return acc;
  }, {} as FieldErrors<z.infer<T>>);
}
