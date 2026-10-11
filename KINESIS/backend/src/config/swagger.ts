import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import env from "./env.js";

const moduleFiles = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../modules/**/*.{ts,js}",
);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "KINESIS API",
      version: "1.0.0",
      description: "API REST de la plateforme KINESIS",
    },
    servers: [{ url: env.API_PREFIX }],
  },
  apis: [moduleFiles],
});

export default swaggerSpec;
