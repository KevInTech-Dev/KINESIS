
import dotenv from "dotenv";

dotenv.config();

export type NodeEnv = "development" | "production" | "test";

export interface EnvConfig {
  NODE_ENV: NodeEnv;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_LOGGING: boolean;
  API_PREFIX: string;
  CORS_ORIGINS: string[];
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_TTL_SECONDS: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined || value.trim() === "") {
    throw new Error(`La variable d'environnement ${key} est manquante.`);
  }

  return value;
};

const getEnvVarNumber = (
  key: string,
  defaultValue?: number,
): number => {
  const value = Number(getEnvVar(key, defaultValue?.toString()));

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`La variable ${key} doit être un entier entre 1 et 65535.`);
  }

  return value;
};

const getEnvVarPositiveInteger = (
  key: string,
  defaultValue: number,
): number => {
  const value = Number(getEnvVar(key, defaultValue.toString()));

  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`La variable ${key} doit être un entier positif.`);
  }

  return value;
};

const getNodeEnv = (): NodeEnv => {
  const value = getEnvVar("NODE_ENV", "development");

  if (
    value !== "development" &&
    value !== "production" &&
    value !== "test"
  ) {
    throw new Error("La valeur de NODE_ENV est invalide.");
  }

  return value;
};

const getBoolean = (key: string, defaultValue: string): boolean => {
  const value = getEnvVar(key, defaultValue).trim().toLowerCase();

  if (value !== "true" && value !== "false") {
    throw new Error(`La variable ${key} doit valoir true ou false.`);
  }

  return value === "true";
};

const getCorsOrigins = (): string[] => {
  const origins = getEnvVar("CORS_ORIGINS", "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("La variable CORS_ORIGINS doit contenir au moins une origine.");
  }

  return origins;
};

const getJwtSecret = (): string => {
  const secret = getEnvVar("JWT_SECRET");

  if (
    Buffer.byteLength(secret, "utf8") < 32 ||
    secret.includes("replace_with")
  ) {
    throw new Error("JWT_SECRET doit contenir au moins 32 octets.");
  }

  return secret;
};

const apiPrefix = getEnvVar("API_PREFIX", "/api").trim().replace(/\/+$/, "");

if (!apiPrefix.startsWith("/")) {
  throw new Error("La variable API_PREFIX doit commencer par /.");
}

const env: EnvConfig = {
  NODE_ENV: getNodeEnv(),
  PORT: getEnvVarNumber("PORT", 3000),
  DB_HOST: getEnvVar("DB_HOST", "localhost"),
  DB_PORT: getEnvVarNumber("DB_PORT", 5432),
  DB_USER: getEnvVar("DB_USER"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME"),
  DB_LOGGING: getBoolean("DB_LOGGING", "false"),
  API_PREFIX: apiPrefix,
  CORS_ORIGINS: getCorsOrigins(),
  JWT_SECRET: getJwtSecret(),
  JWT_ACCESS_TOKEN_TTL_SECONDS: getEnvVarPositiveInteger(
    "JWT_ACCESS_TOKEN_TTL_SECONDS",
    900,
  ),
};

export default env;