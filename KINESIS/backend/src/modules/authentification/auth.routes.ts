import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import { authRateLimit } from "./auth.rate-limit";
import { AuthController } from "./auth.controller";
import {
  loginSchema,
  registerTravelerSchema,
} from "./auth.schema";

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

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Renouveler une session avec le cookie HTTP-only
 *     tags: [Authentification]
 *     security:
 *       - refreshCookie: []
 */
router.post("/refresh", authRateLimit, authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Révoquer la session et supprimer le cookie de renouvellement
 *     tags: [Authentification]
 *     security:
 *       - refreshCookie: []
 */
router.post("/logout", authController.logout);

export default router;