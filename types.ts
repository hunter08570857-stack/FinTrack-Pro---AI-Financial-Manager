export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Credit' | 'Investment' | 'Cash';
  balance: number;
  currency: string;
  bankName: string;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

export interface StockHolding {
  id: string;
  symbol: string; // e.g., 2330.TW, AAPL
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: 'TWD' | 'USD';
  market: 'TW' | 'US';
}

export type ViewState = 'DASHBOARD' | 'ACCOUNTS' | 'TRANSACTIONS' | 'STOCKS' | 'SETTINGS';

export interface AIAnalysisResult {
  markdown: string;
  timestamp: number;
}
