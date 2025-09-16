export class FinancialSummaryDto {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTransactions: number;
  year?: string;
  period?: {
    startDate: string;
    endDate: string;
  };

  constructor(
    totalIncome: number,
    totalExpense: number,
    totalTransactions: number,
    year: string,
    period?: { startDate: string; endDate: string },
  ) {
    this.totalIncome = Number(totalIncome) || 0;
    this.totalExpense = Number(totalExpense) || 0;
    this.balance = this.totalIncome - this.totalExpense;
    this.totalTransactions = totalTransactions;
    this.year = year;
    this.period = period;
  }
}
