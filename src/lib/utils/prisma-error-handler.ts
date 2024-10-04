import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

type PrismaErrorMapping = {
  [key: string]: (error: PrismaClientKnownRequestError) => z.ZodError;
};

const defaultPrismaErrorMapping: PrismaErrorMapping = {
  P2002: (error) => {
    const field = (error.meta?.target as string[])?.[0] || "unknown";
    return createZodError(`A record with this ${field} already exists`, [
      field,
    ]);
  },
};

function createZodError(
  message: string,
  path: (string | number)[] = []
): z.ZodError {
  return new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      path,
      message,
    },
  ]);
}

export function handlePrismaError(
  error: unknown,
  customMapping: PrismaErrorMapping = {}
): z.ZodError {
  if (error instanceof PrismaClientKnownRequestError) {
    const errorHandler =
      customMapping[error.code] || defaultPrismaErrorMapping[error.code];
    if (errorHandler) {
      return errorHandler(error);
    }
  }

  return createZodError("An unexpected error occurred. Please try again.");
}

export { createZodError };
