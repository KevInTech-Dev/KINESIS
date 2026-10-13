import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { Account } from "./Account";

export class TravelerProfile extends Model<
  InferAttributes<TravelerProfile>,
  InferCreationAttributes<TravelerProfile>
> {
  declare accountId: string;
  declare firstName: string;
  declare lastName: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initTravelerProfileModel = (sequelize: Sequelize): void => {
  TravelerProfile.init(
    {
      accountId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: "account_id",
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: "last_name",
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
      tableName: "traveler_profiles",
      modelName: "TravelerProfile",
      timestamps: true,
    },
  );

  Account.hasOne(TravelerProfile, {
    as: "travelerProfile",
    foreignKey: "accountId",
    onDelete: "CASCADE",
  });
  TravelerProfile.belongsTo(Account, {
    as: "account",
    foreignKey: "accountId",
  });
};
