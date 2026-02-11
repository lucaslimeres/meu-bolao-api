import { IWalletRepository } from "@/domain/repositories";
import { Knex } from "knex";

export class WalletRepository implements IWalletRepository {
  constructor(private db: Knex) {}

  async getBalance(userId: string): Promise<number> {
    const row = await this.db("wallets").where({ user_id: userId }).first();
    return row ? Number(row.balance) : 0;
  }

  async updateBalance(userId: string, amount: number, type: 'credit' | 'debit'): Promise<void> {
    const currentBalance = await this.getBalance(userId);
    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;

    await this.db("wallets")
      .where({ user_id: userId })
      .update({ balance: newBalance });
  }

  async createTransaction(data: any): Promise<void> {
    await this.db("wallet_transactions").insert({
      wallet_id: data.userId,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description
    });
  }
}