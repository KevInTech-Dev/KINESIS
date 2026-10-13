import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { USER_ROLES, type UserRole } from "../../modules/authentification/auth.type";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare phoneNumber: string;
  declare passwordHash: string;
  declare role: UserRole;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initAccountModel = (sequelize: Sequelize): void => {
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phoneNumber: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        field: "phone_number",
      },
      passwordHash: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: "password_hash",
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "accounts",
      modelName: "Account",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["passwordHash"] },
      },
      scopes: {
        withPasswordHash: { attributes: { include: ["passwordHash"] } },
      },
    },
  );
};
