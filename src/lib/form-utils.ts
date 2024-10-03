import type { z } from "zod";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetError,
  FieldError,
} from "react-hook-form";

export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: FieldErrors<T>
) {
  Object.entries(errors).forEach(([field, error]) => {
    if (error && typeof field === "string") {
      const path = field as Path<T>;
      setError(path, error as FieldError);
    }
  });
}

export function parseZodErrors<T extends z.ZodType>(
  result: z.SafeParseError<z.infer<T>>
): FieldErrors<z.infer<T>> {
  return result.error.issues.reduce((acc, issue) => {
    const path = issue.path.join(".");
    if (path) {
      (acc as Record<string, FieldError>)[path] = {
        type: "manual",
        message: issue.message,
      };
    }
    return acc;
  }, {} as FieldErrors<z.infer<T>>);
}