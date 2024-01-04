import { HttpError } from "@floe/lib/http-error";
import * as Sentry from "@sentry/nextjs";
import type { Middleware } from "next-api-middleware";

export const captureErrors: Middleware = async (_req, res, next) => {
  try {
    // Catch any errors that are thrown in remaining
    // middleware and the API route handler
    await next();
  } catch (error) {
    Sentry.captureException(error);

    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message, error });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({ message: error.message, error });
      return;
    }

    res.status(400).json({ message: "Something went wrong", error });
  }
};
