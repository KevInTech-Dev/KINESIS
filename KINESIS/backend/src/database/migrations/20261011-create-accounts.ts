import { DataTypes, type QueryInterface } from "sequelize";
import { USER_ROLES } from "../../modules/authentification/auth.type.js";

export const name = "20261011-create-accounts";

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      "accounts",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(254),
          allowNull: false,
          unique: true,
        },
        phone_number: {
          type: DataTypes.STRING(32),
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(...USER_ROLES),
          allowNull: false,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
      "traveler_profiles",
      {
        account_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          references: { model: "accounts", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        first_name: {
          type: DataTypes.STRING(80),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(80),
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
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable("traveler_profiles", { transaction });
    await queryInterface.dropTable("accounts", { transaction });
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_accounts_role";',
      { transaction },
    );
  });
};
