import sequelize from "../../database/sequelize";
import { Account, RefreshSession } from "../../database/models/index";

export class RefreshTokenRepository {
  create(
    accountId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<RefreshSession> {
    return RefreshSession.create({ accountId, tokenHash, expiresAt });
  }

  async rotate(
    tokenHash: string,
    replacementHash: string,
    expiresAt: Date,
  ): Promise<Account | null> {
    return sequelize.transaction(async (transaction) => {
      const session = await RefreshSession.findOne({
        where: { tokenHash },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!session) return null;
      if (session.expiresAt.getTime() <= Date.now()) {
        await session.destroy({ transaction });
        return null;
      }

      const account = await Account.findByPk(session.accountId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!account || !account.isActive) {
        await session.destroy({ transaction });
        return null;
      }

      await session.destroy({ transaction });
      await RefreshSession.create(
        { accountId: account.id, tokenHash: replacementHash, expiresAt },
        { transaction },
      );

      return account;
    });
  }

  async revoke(tokenHash: string): Promise<void> {
    await RefreshSession.destroy({ where: { tokenHash } });
  }
}