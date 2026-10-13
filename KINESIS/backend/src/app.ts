import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type Express, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { sendError, sendSuccess } from "@common/api.response";
import { ForbiddenError } from "@common/errors/app-error";
import {
  errorHandler,
  notFoundHandler,
} from "@middlewares/error.middleware";
import { logger } from "@config/logger";
import swaggerSpec from "@config/swagger";
import env from "@config/env";
import authRoutes from "@modules/authentification/auth.routes";

const app: Express = express();
const API_PREFIX = env.API_PREFIX;

app.disable("x-powered-by");
app.use(helmet());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (request) => ({
        id: request.id,
        method: request.method,
        url: request.url?.split("?")[0],
      }),
      res: (response) => ({ statusCode: response.statusCode }),
    },
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new ForbiddenError("Origine non autorisée"));
    },
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "test",
    handler: (_req, res) => {
      return sendError(
        res,
        "RATE_LIMIT_EXCEEDED",
        "Trop de requêtes, veuillez réessayer plus tard",
        429,
      );
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  return sendSuccess(res, { status: "ok" }, "Bienvenue sur l'API KINESIS");
});

app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  return sendSuccess(
    res,
    { status: "ok", environment: env.NODE_ENV },
    "L'API KINESIS fonctionne correctement",
  );
});

app.use(`${API_PREFIX}/auth`, authRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Documentation API KINESIS",
  }),
);
app.get("/api-docs.json", (_req, res) => {
  return res.json(swaggerSpec);
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;