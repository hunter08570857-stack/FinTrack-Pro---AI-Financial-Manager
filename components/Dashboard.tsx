import React, { useState } from 'react';
import { BankAccount, Transaction, TransactionType, StockHolding } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BrainCircuit, Loader2, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { analyzeFinances } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  stocks: StockHolding[];
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, stocks }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calculate Totals
  const totalBalanceTWD = accounts.reduce((sum, acc) => {
    return acc.currency === 'TWD' ? sum + acc.balance : sum + (acc.balance * 32); // Mock rate
  }, 0);

  const totalStockValueTWD = stocks.reduce((sum, stock) => {
    const value = stock.quantity * stock.currentPrice;
    return stock.currency === 'TWD' ? sum + value : sum + (value * 32);
  }, 0);

  const netWorth = totalBalanceTWD + totalStockValueTWD;

  // Chart Data Preparation
  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeFinances(transactions, accounts, stocks);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">財務總覽</h2>
        <p className="text-gray-500">歡迎回來，這是您的即時財務狀況。</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">總資產 (TWD估算)</p>
            <p className="text-2xl font-bold text-gray-800">${netWorth.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-xl text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">銀行總餘額</p>
            <p className="text-2xl font-bold text-gray-800">${totalBalanceTWD.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">證券現值</p>
            <p className="text-2xl font-bold text-gray-800">${totalStockValueTWD.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">支出類別分布</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <BrainCircuit size={20} />
              AI 財務顧問
            </h3>
            <button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : '分析我的財務'}
            </button>
          </div>
          
          <div className="flex-1 bg-white/60 rounded-xl p-4 overflow-y-auto max-h-[300px] text-sm text-gray-700 leading-relaxed border border-indigo-50/50">
            {analysis ? (
              <ReactMarkdown className="prose prose-sm prose-indigo">{analysis}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BrainCircuit size={48} className="mb-2 opacity-20" />
                <p>點擊上方按鈕，讓 Gemini 為您分析財務狀況。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
