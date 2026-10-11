import app from "./app.js";
import { logger } from "./config/logger.js";
import env from "./config/env.js";
import { closeConnection, testConnection } from "./database/sequelize.js";

const startServer = async () => {
  await testConnection();

  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, environment: env.NODE_ENV },
      `Serveur KINESIS démarré sur http://localhost:${env.PORT}`,
    );
  });

  const shutdown = (signal: string): void => {
    logger.info({ signal }, "Arrêt gracieux du serveur demandé");
    server.close((error) => {
      if (error) {
        logger.error({ err: error }, "Erreur lors de l'arrêt du serveur HTTP");
        process.exitCode = 1;
      }

      void closeConnection().catch((databaseError: unknown) => {
        logger.error(
          { err: databaseError },
          "Erreur lors de la fermeture de la connexion à la base",
        );
        process.exitCode = 1;
      });
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

void startServer().catch((error: unknown) => {
  logger.fatal({ err: error }, "Impossible de démarrer le serveur KINESIS");
  process.exitCode = 1;
});
