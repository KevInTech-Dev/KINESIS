import { DataTypes, type QueryInterface } from "sequelize";
import { VOYAGE_STATUSES } from "../../enums/VoyageStatus";

export const name = "20261012-create-trajets-voyages";

export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      "trajets",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        company_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "company_profiles", key: "account_id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        ville_depart: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        ville_arrivee: {
          type: DataTypes.STRING(120),
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
      "voyages",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        trajet_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: "trajets", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        date_depart: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        heure_depart: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        places_totales: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        places_disponibles: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        prix: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        statut: {
          type: DataTypes.ENUM(...VOYAGE_STATUSES),
          allowNull: false,
          defaultValue: "EN_ATTENTE",
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

    await queryInterface.sequelize.query(
      `ALTER TABLE "trajets"
       ADD CONSTRAINT "trajets_distinct_cities"
       CHECK (lower(btrim("ville_depart")) <> lower(btrim("ville_arrivee")));`,
      { transaction },
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE "voyages"
       ADD CONSTRAINT "voyages_valid_seat_capacity"
       CHECK ("places_totales" > 0 AND "places_disponibles" >= 0
         AND "places_disponibles" <= "places_totales"),
       ADD CONSTRAINT "voyages_non_negative_price"
       CHECK ("prix" >= 0);`,
      { transaction },
    );
    await queryInterface.addIndex("trajets", ["company_id"], {
      name: "trajets_company_id_idx",
      transaction,
    });
    await queryInterface.addIndex("voyages", ["trajet_id", "date_depart"], {
      name: "voyages_route_date_idx",
      transaction,
    });
    await queryInterface.addIndex("voyages", ["statut", "date_depart"], {
      name: "voyages_status_date_idx",
      transaction,
    });
  });
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}): Promise<void> => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable("voyages", { transaction });
    await queryInterface.dropTable("trajets", { transaction });
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_voyages_statut";',
      { transaction },
    );
  });
};
