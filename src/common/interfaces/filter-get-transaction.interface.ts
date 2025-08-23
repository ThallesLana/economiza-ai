import { TransactionType } from '../enums/transaction-type.enum';

export interface FilterGetTransaction {
  type?: TransactionType;
  categoryId?: string;
  transactionDate?: string;
  userId?: string;
}
