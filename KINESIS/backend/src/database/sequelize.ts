import {Sequelize} from "sequelize";
import options from "../config/database.js"

const sequelize = new Sequelize(options);

export const testConnection = async (): Promise<boolean> => {
    try {
        await sequelize.authenticate();
        console.log("La connexion a été établie avec succès.");
        return true;
    } catch (error) {
        console.error("Echec de la connexion à la base de données :", error);
        return false;
    }
};

export const closeConnection = async (): Promise<void> => {
    await sequelize.close();
};

export default sequelize;