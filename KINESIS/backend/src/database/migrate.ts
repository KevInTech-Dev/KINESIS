import { SequelizeStorage, Umzug } from "umzug";
import { logger } from "../config/logger.js";
import sequelize from "./sequelize.js";
import {
  down as downAccounts,
  name as accountsName,
  up as upAccounts,
} from "./migrations/20261011-create-accounts.js";
import {
  down as downRefreshSessions,
  name as refreshSessionsName,
  up as upRefreshSessions,
} from "./migrations/20261012-create-refresh-sessions.js";
import {
  down as downCompanyAgentProfiles,
  name as companyAgentProfilesName,
  up as upCompanyAgentProfiles,
} from "./migrations/20261012-create-company-agent-profiles.js";

const migrations = new Umzug({
  migrations: [
    { name: accountsName, up: upAccounts, down: downAccounts },
    {
      name: refreshSessionsName,
      up: upRefreshSessions,
      down: downRefreshSessions,
    },
    {
      name: companyAgentProfilesName,
      up: upCompanyAgentProfiles,
      down: downCompanyAgentProfiles,
    },
  ],
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
