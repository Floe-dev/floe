import { HttpError } from "@floe/lib/http-error";
import * as Sentry from "@sentry/nextjs";
import type { Middleware } from "next-api-middleware";

export const captureErrors: Middleware = async (_req, res, next) => {
  try {
    // Catch any errors that are thrown in remaining
    // middleware and the API route handler
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message, error });
      return;
    }

    /**
     * TODO: Handle other errors here for better error messages.
     * Eg. Zod errors
     */

    /**
     * If we get here, it means that we have an unhandled error
     */
    Sentry.captureException(error);

    res.status(500).json({
      message: `Unhandled error of type '${typeof error}'. Please reach out for our customer support.`,
    });
  }
};
