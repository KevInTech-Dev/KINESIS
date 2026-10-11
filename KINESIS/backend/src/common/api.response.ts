import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export interface PaginationMeta extends Record<string, unknown> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Opération réussie",
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = { success: true, data, message };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = "Ressource créée",
): Response<ApiResponse<T>> => sendSuccess(res, data, message, 201);

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = "Données récupérées",
): Response<ApiResponse<T[]>> => {
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return sendSuccess(res, data, message, 200, meta);
};

export const sendNoContent = (res: Response): Response => res.status(204).send();

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number,
  details?: unknown,
): Response<ApiResponse> => {
  const error: NonNullable<ApiResponse["error"]> = { code, message };
  if (details !== undefined) error.details = details;

  return res.status(statusCode).json({ success: false, error });
};
