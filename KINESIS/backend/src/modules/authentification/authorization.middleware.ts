import type { RequestHandler } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../common/errors/app-error.js";
import type { UserRole } from "./auth.type.js";

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      next(new ForbiddenError("Votre rôle ne permet pas cette opération"));
      return;
    }

    next();
  };
};

export default authorize;
