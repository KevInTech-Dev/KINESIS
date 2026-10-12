import bcrypt from "bcryptjs";
import { BadRequestError } from "../../common/errors/app-error.js";

const BCRYPT_ROUNDS = 12;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const assertSupportedPasswordLength = (
  password: string,
  requireMinimumLength = false,
): void => {
  if (requireMinimumLength && Array.from(password).length < 8) {
    throw new BadRequestError(
      "Le mot de passe doit contenir au moins 8 caractères",
    );
  }

  if (Buffer.byteLength(password, "utf8") > MAX_BCRYPT_PASSWORD_BYTES) {
    throw new BadRequestError(
      "Le mot de passe ne peut pas dépasser 72 octets",
    );
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  assertSupportedPasswordLength(password, true);
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  assertSupportedPasswordLength(password);
  return bcrypt.compare(password, passwordHash);
};
