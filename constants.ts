import { BankAccount, Transaction, TransactionType, StockHolding } from './types';

export const EXPENSE_CATEGORIES = [
  '飲食', '交通', '居住', '娛樂', '購物', '醫療', '教育', '保險', '雜支'
];

export const INCOME_CATEGORIES = [
  '薪資', '獎金', '投資收益', '兼職', '其他'
];

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_1',
    name: '薪資帳戶',
    type: 'Checking',
    balance: 158000,
    currency: 'TWD',
    bankName: '中國信託'
  },
  {
    id: 'acc_2',
    name: '生活預備金',
    type: 'Savings',
    balance: 500000,
    currency: 'TWD',
    bankName: '國泰世華'
  },
  {
    id: 'acc_3',
    name: '美股投資戶',
    type: 'Investment',
    balance: 12000,
    currency: 'USD',
    bankName: 'Firstrade'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    accountId: 'acc_1',
    date: new Date().toISOString().split('T')[0],
    amount: 55000,
    type: TransactionType.INCOME,
    category: '薪資',
    description: '十月薪資'
  },
  {
    id: 'tx_2',
    accountId: 'acc_1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    amount: 120,
    type: TransactionType.EXPENSE,
    category: '飲食',
    description: '午餐便當'
  },
  {
    id: 'tx_3',
    accountId: 'acc_1',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    amount: 1280,
    type: TransactionType.EXPENSE,
    category: '交通',
    description: '高鐵票'
  },
  {
    id: 'tx_4',
    accountId: 'acc_2',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    amount: 3000,
    type: TransactionType.EXPENSE,
    category: '居住',
    description: '水電費'
  }
];

export const INITIAL_STOCKS: StockHolding[] = [
  {
    id: 'st_1',
    symbol: '2330',
    name: '台積電',
    quantity: 1000,
    avgCost: 600,
    currentPrice: 1050,
    currency: 'TWD',
    market: 'TW'
  },
  {
    id: 'st_2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    avgCost: 150,
    currentPrice: 225,
    currency: 'USD',
    market: 'US'
  },
  {
    id: 'st_3',
    symbol: '0050',
    name: '元大台灣50',
    quantity: 2000,
    avgCost: 120,
    currentPrice: 185,
    currency: 'TWD',
    market: 'TW'
  }
];
