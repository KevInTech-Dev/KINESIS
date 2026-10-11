import {Sequelize} from "sequelize";
import options from "../config/database.js"

const sequelize = new Sequelize(options);

export const testConnection = async (): Promise<void> => {
    await sequelize.authenticate();
};

export const closeConnection = async (): Promise<void> => {
    await sequelize.close();
};

export default sequelize;