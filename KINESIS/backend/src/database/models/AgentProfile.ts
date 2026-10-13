import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { Account } from "./Account";
import { CompanyProfile } from "./CompanyProfile";

export class AgentProfile extends Model<
  InferAttributes<AgentProfile>,
  InferCreationAttributes<AgentProfile>
> {
  declare accountId: string;
  declare companyId: string;
  declare matricule: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initAgentProfileModel = (sequelize: Sequelize): void => {
  AgentProfile.init(
    {
      accountId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: "account_id",
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "company_id",
        references: {
          model: "company_profiles",
          key: "account_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      matricule: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
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
      tableName: "agent_profiles",
      modelName: "AgentProfile",
      timestamps: true,
    },
  );

  Account.hasOne(AgentProfile, {
    as: "agentProfile",
    foreignKey: "accountId",
    onDelete: "CASCADE",
  });
  AgentProfile.belongsTo(Account, {
    as: "account",
    foreignKey: "accountId",
  });
  CompanyProfile.hasMany(AgentProfile, {
    as: "agents",
    foreignKey: "companyId",
    onDelete: "CASCADE",
  });
  AgentProfile.belongsTo(CompanyProfile, {
    as: "company",
    foreignKey: "companyId",
  });
};
