import type { RequestHandler } from "express";
import { UnauthorizedError } from "../../common/errors/app-error.js";
import { AccountRepository } from "./account.repository.js";
import { verifyAccessToken } from "./token.service.js";

const accountRepository = new AccountRepository();

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authorization = req.get("authorization");
  const token = authorization?.match(/^Bearer ([^\s]+)$/i)?.[1];

  if (!token) {
    next(new UnauthorizedError("Un jeton Bearer est requis"));
    return;
  }

  const tokenUser = verifyAccessToken(token);
  const account = await accountRepository.findById(tokenUser.id);

  if (!account || !account.isActive) {
    throw new UnauthorizedError("Compte inactif ou inexistant");
  }

  req.auth = { id: account.id, role: account.role };
  next();
};

export default authenticate;
