export interface IWalletRepository {
  getBalance(userId: string): Promise<number>;
  updateBalance(userId: string, amount: number, type: 'credit' | 'debit'): Promise<void>;
  createTransaction(data: {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
    category: 'deposit' | 'withdraw' | 'prize' | 'entry_fee';
    description: string;
  }): Promise<void>;
}