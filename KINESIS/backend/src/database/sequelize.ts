import {Sequelize} from "sequelize";
import options from "../config/database"
import {
    initAgentProfileModel,
    initAccountModel,
    initCompanyProfileModel,
    initRefreshSessionModel,
    initTrajetModel,
    initTravelerProfileModel,
    initVoyageModel,
} from "./models/index";

const sequelize = new Sequelize(options);

initAccountModel(sequelize);
initTravelerProfileModel(sequelize);
initCompanyProfileModel(sequelize);
initAgentProfileModel(sequelize);
initRefreshSessionModel(sequelize);
initTrajetModel(sequelize);
initVoyageModel(sequelize);

export const testConnection = async (): Promise<void> => {
    await sequelize.authenticate();
};

export const closeConnection = async (): Promise<void> => {
    await sequelize.close();
};

export default sequelize;