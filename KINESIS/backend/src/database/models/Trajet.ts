import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { CompanyProfile } from "./CompanyProfile";

export class Trajet extends Model<
  InferAttributes<Trajet>,
  InferCreationAttributes<Trajet>
> {
  declare id: CreationOptional<string>;
  declare companyId: string;
  declare villeDepart: string;
  declare villeArrivee: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initTrajetModel = (sequelize: Sequelize): void => {
  Trajet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "company_id",
        references: {
          model: "company_profiles",
          key: "account_id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      villeDepart: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "ville_depart",
      },
      villeArrivee: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: "ville_arrivee",
        validate: {
          differentFromDeparture(this: Trajet, value: string) {
            if (
              value.trim().toLocaleLowerCase() ===
              this.villeDepart.trim().toLocaleLowerCase()
            ) {
              throw new Error("La ville d'arrivée doit différer du départ.");
            }
          },
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "trajets",
      modelName: "Trajet",
      timestamps: true,
      indexes: [{ fields: ["company_id"] }],
    },
  );

  CompanyProfile.hasMany(Trajet, {
    as: "trajets",
    foreignKey: "companyId",
    onDelete: "RESTRICT",
  });
  Trajet.belongsTo(CompanyProfile, {
    as: "compagnie",
    foreignKey: "companyId",
  });
};
