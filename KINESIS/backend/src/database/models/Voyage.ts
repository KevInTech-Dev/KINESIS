import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { VOYAGE_STATUSES, type VoyageStatus } from "@enums/VoyageStatus";
import { Trajet } from "./Trajet";

export class Voyage extends Model<
  InferAttributes<Voyage>,
  InferCreationAttributes<Voyage>
> {
  declare id: CreationOptional<string>;
  declare trajetId: string;
  declare dateDepart: string;
  declare heureDepart: string;
  declare placesTotales: number;
  declare placesDisponibles: number;
  declare prix: string;
  declare statut: VoyageStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initVoyageModel = (sequelize: Sequelize): void => {
  Voyage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      trajetId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "trajet_id",
        references: {
          model: "trajets",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      dateDepart: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "date_depart",
      },
      heureDepart: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "heure_depart",
      },
      placesTotales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "places_totales",
        validate: { min: 1 },
      },
      placesDisponibles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "places_disponibles",
        validate: { min: 0 },
      },
      prix: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      statut: {
        type: DataTypes.ENUM(...VOYAGE_STATUSES),
        allowNull: false,
        defaultValue: "EN_ATTENTE",
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "voyages",
      modelName: "Voyage",
      timestamps: true,
      validate: {
        availableSeatsDoNotExceedTotal(this: Voyage) {
          if (this.placesDisponibles > this.placesTotales) {
            throw new Error(
              "Le nombre de places disponibles ne peut pas dépasser le nombre total de places.",
            );
          }
        },
      },
      indexes: [
        { fields: ["trajet_id", "date_depart"] },
        { fields: ["statut", "date_depart"] },
      ],
    },
  );

  Trajet.hasMany(Voyage, {
    as: "voyages",
    foreignKey: "trajetId",
    onDelete: "RESTRICT",
  });
  Voyage.belongsTo(Trajet, {
    as: "trajet",
    foreignKey: "trajetId",
  });
};
