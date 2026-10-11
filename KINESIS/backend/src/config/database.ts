
import type { Options } from "sequelize";
import env from "./env.js";

const options: Options = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  dialect: "postgres",
  logging: env.DB_LOGGING
    ? (message) => {
        console.log(`[SQL] ${new Date().toISOString()} ${message}`);
      }
    : false,
};

export default options;