import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import { authRateLimit } from "./auth.rate-limit.js";
import { AuthController } from "./auth.controller.js";
import {
  loginSchema,
  registerTravelerSchema,
} from "./auth.schema.js";

const router: Router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Créer un compte voyageur
 *     tags: [Authentification]
 */
router.post(
  "/register",
  authRateLimit,
  validate({ body: registerTravelerSchema }),
  authController.registerTraveler,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Ouvrir une session
 *     tags: [Authentification]
 */
router.post(
  "/login",
  authRateLimit,
  validate({ body: loginSchema }),
  authController.login,
);

export default router;