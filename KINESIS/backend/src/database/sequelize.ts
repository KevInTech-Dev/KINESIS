import {Sequelize} from "sequelize";
import options from "../config/database.js"
import { initAccountModel, initTravelerProfileModel } from "./models/index.js";

const sequelize = new Sequelize(options);

initAccountModel(sequelize);
initTravelerProfileModel(sequelize);

export const testConnection = async (): Promise<void> => {
    await sequelize.authenticate();
};

export const closeConnection = async (): Promise<void> => {
    await sequelize.close();
};

export default sequelize;