import { DataTypes, type QueryInterface } from "sequelize";
import { COMPANY_STATUSES } from "../../modules/compagnie/company.type";

export const name = "20261012-create-company-agent-profiles";

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      "company_profiles",
      {
        account_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          references: { model: "accounts", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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
      { transaction },
    );

    await queryInterface.createTable(
      "agent_profiles",
      {
        account_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          references: { model: "accounts", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        company_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "company_profiles", key: "account_id" },
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
      { transaction },
    );
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable("agent_profiles", { transaction });
    await queryInterface.dropTable("company_profiles", { transaction });
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_company_profiles_status";',
      { transaction },
    );
  });
};
