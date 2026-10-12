import rateLimit from "express-rate-limit";
import { sendError } from "../../common/api.response.js";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) =>
    sendError(
      res,
      "AUTH_RATE_LIMIT_EXCEEDED",
      "Trop de tentatives. Veuillez réessayer plus tard.",
      429,
    ),
});
