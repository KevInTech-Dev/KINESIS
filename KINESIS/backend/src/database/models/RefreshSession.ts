import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class RefreshSession extends Model<
  InferAttributes<RefreshSession>,
  InferCreationAttributes<RefreshSession>
> {
  declare id: CreationOptional<string>;
  declare accountId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initRefreshSessionModel = (sequelize: Sequelize): void => {
  RefreshSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "account_id",
        references: { model: "accounts", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tokenHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        field: "token_hash",
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "refresh_sessions",
      modelName: "RefreshSession",
      timestamps: true,
    },
  );
};
