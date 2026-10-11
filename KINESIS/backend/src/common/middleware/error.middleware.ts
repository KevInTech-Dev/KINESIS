import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { sendError } from "../api.response.js";
import { AppError, NotFoundError, ValidationError } from "../errors/app-error.js";
import { logger } from "../../config/logger.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} introuvable`));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const appError =
    error instanceof ZodError
      ? new ValidationError(
          "Les données fournies sont invalides",
          error.issues.map(({ path, message, code }) => ({
            field: path.join("."),
            message,
            code,
          })),
        )
      : error instanceof AppError
        ? error
        : undefined;

  if (!appError || appError.statusCode >= 500) {
    logger.error({ err: error }, "Erreur inattendue pendant le traitement HTTP");
  } else {
    logger.warn(
      { code: appError.code, statusCode: appError.statusCode },
      appError.message,
    );
  }

  sendError(
    res,
    appError?.code ?? "INTERNAL_SERVER_ERROR",
    appError && appError.statusCode < 500
      ? appError.message
      : "Une erreur interne est survenue",
    appError?.statusCode ?? 500,
    appError?.statusCode && appError.statusCode < 500
      ? appError.details
      : undefined,
  );
};

export default errorHandler;
