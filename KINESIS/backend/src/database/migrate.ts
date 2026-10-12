import { SequelizeStorage, Umzug } from "umzug";
import { logger } from "../config/logger.js";
import sequelize from "./sequelize.js";
import { down, name, up } from "./migrations/20261011-create-accounts.js";

const migrations = new Umzug({
  migrations: [{ name, up, down }],
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger,
});

try {
  const executed = await migrations.up();
  logger.info(
    { migrations: executed.map((migration) => migration.name) },
    "Migrations exécutées",
  );
} catch (error) {
  logger.fatal({ err: error }, "Échec des migrations de base de données");
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
