import { Op, UniqueConstraintError } from "sequelize";
import sequelize from "../../database/sequelize.js";
import { Account, TravelerProfile } from "../../database/models/index.js";
import type { RegisterTravelerInput } from "./auth.schema.js";

export class AccountRepository {
  async findById(id: string): Promise<Account | null> {
    return Account.findByPk(id);
  }

  async findByIdentifier(identifier: string): Promise<Account | null> {
    return Account.unscoped().findOne({
      where: {
        [Op.or]: [
          { email: identifier.trim().toLowerCase() },
          { phoneNumber: identifier.trim() },
        ],
      },
    });
  }

  async createTraveler(
    input: RegisterTravelerInput,
    passwordHash: string,
  ): Promise<{ account: Account; profile: TravelerProfile }> {
    return sequelize.transaction(async (transaction) => {
      const account = await Account.create(
        {
          email: input.email,
          phoneNumber: input.phoneNumber,
          passwordHash,
          role: "voyageur",
        },
        { transaction },
      );

      const profile = await TravelerProfile.create(
        {
          accountId: account.id,
          firstName: input.firstName,
          lastName: input.lastName,
        },
        { transaction },
      );

      return { account, profile };
    });
  }
}

export { UniqueConstraintError };
