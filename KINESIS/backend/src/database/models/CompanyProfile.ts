import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import {
  type CompanyStatus,
  COMPANY_STATUSES,
} from "../../modules/compagnie/company.type";
import { Account } from "./Account";

export class CompanyProfile extends Model<
  InferAttributes<CompanyProfile>,
  InferCreationAttributes<CompanyProfile>
> {
  declare accountId: string;
  declare name: string;
  declare address: string;
  declare description: string;
  declare status: CompanyStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initCompanyProfileModel = (sequelize: Sequelize): void => {
  CompanyProfile.init(
    {
      accountId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: "account_id",
      },
      name: {
        type: DataTypes.STRING(160),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...COMPANY_STATUSES),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "company_profiles",
      modelName: "CompanyProfile",
      timestamps: true,
    },
  );

  Account.hasOne(CompanyProfile, {
    as: "companyProfile",
    foreignKey: "accountId",
    onDelete: "CASCADE",
  });
  CompanyProfile.belongsTo(Account, {
    as: "account",
    foreignKey: "accountId",
  });
};
