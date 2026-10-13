import jwt from "jsonwebtoken";
import env from "../../config/env";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../common/errors/app-error";
import {
  USER_ROLES,
  type AuthenticatedUser,
  type UserRole,
} from "./auth.type";

const TOKEN_ISSUER = "kinesis-api";
const TOKEN_AUDIENCE = "kinesis";
const userRoles = new Set<string>(USER_ROLES);

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && userRoles.has(value);

export const createAccessToken = (user: AuthenticatedUser): string => {
  if (!user.id.trim() || !isUserRole(user.role)) {
    throw new BadRequestError("Utilisateur invalide pour créer une session");
  }

  return jwt.sign(
    { role: user.role },
    env.JWT_SECRET,
    {
      algorithm: "HS256",
      subject: user.id,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      expiresIn: env.ACCESS_TOKEN_EXPIRY_TIME,
    },
  );
};

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });

    if (
      typeof payload === "string" ||
      !payload.sub ||
      !isUserRole(payload.role)
    ) {
      throw new UnauthorizedError("Jeton d'accès invalide");
    }

    return { id: payload.sub, role: payload.role };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Jeton d'accès invalide ou expiré");
    }

    throw error;
  }
};