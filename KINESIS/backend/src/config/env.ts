
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

  if (!Number.isInteger(value) || value <= 0) {
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
  const value = getEnvVar(key, defaultValue).toLowerCase();

  if (value !== "true" && value !== "false") {
    throw new Error(`La variable ${key} doit valoir true ou false.`);
  }

  return value === "true";
};

const env: EnvConfig = {
  NODE_ENV: getNodeEnv(),
  PORT: getEnvVarNumber("PORT", 3000),
  DB_HOST: getEnvVar("DB_HOST", "localhost"),
  DB_PORT: getEnvVarNumber("DB_PORT", 5432),
  DB_USER: getEnvVar("DB_USER"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME"),
  DB_LOGGING: getBoolean("DB_LOGGING", "false"),
};

export default env;