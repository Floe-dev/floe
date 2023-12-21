import { HttpError } from "@floe/lib/http-error";
import { ZodError } from "zod";
import type { z, AnyZodObject } from "zod";
import { fromZodError } from "zod-validation-error";

export function zParse<T extends AnyZodObject>(
  schema: T,
  query: Record<string, unknown>
): z.infer<T> {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError({
        message: fromZodError(error).message,
        statusCode: 400,
      });
    }
    throw new HttpError({
      message: JSON.stringify(error),
      statusCode: 500,
    });
  }
}
