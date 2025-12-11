import React, { useState } from 'react';
import { Transaction, TransactionType, BankAccount } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { Plus, Filter } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, accounts, setAccounts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0],
    accountId: accounts[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.accountId) return;

    const tx: Transaction = {
      ...newTx,
      id: `tx_${Date.now()}`,
      amount: Number(newTx.amount)
    } as Transaction;

    // Update transactions list
    setTransactions(prev => [tx, ...prev]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        const change = tx.type === TransactionType.INCOME ? tx.amount : -tx.amount;
        return { ...acc, balance: acc.balance + change };
      }
      return acc;
    }));

    setIsAdding(false);
    setNewTx({
        type: TransactionType.EXPENSE,
        date: new Date().toISOString().split('T')[0],
        accountId: accounts[0]?.id || ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">收支紀錄</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> 新增紀錄
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">日期</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">類別</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">描述</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">帳戶</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map(tx => {
                const account = accounts.find(a => a.id === tx.accountId);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === TransactionType.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{tx.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{account?.name || '未知帳戶'}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
                      tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    目前沒有任何交易紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-xl font-bold mb-4">新增收支</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                  <button
                    type="button"
                    onClick={() => setNewTx({...newTx, type: TransactionType.EXPENSE})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        newTx.type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    支出
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({...newTx, type: TransactionType.INCOME})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        newTx.type === TransactionType.INCOME ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    收入
                  </button>
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input 
                  required
                  type="date" 
                  className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                  value={newTx.date}
                  onChange={e => setNewTx({...newTx, date: e.target.value})}
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">類別</label>
                 <select
                   className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                   value={newTx.category || ''}
                   onChange={e => setNewTx({...newTx, category: e.target.value})}
                 >
                   <option value="" disabled>選擇類別</option>
                   {(newTx.type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                     <option key={c} value={c}>{c}</option>
                   ))}
                 </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                <input 
                  required
                  type="number" 
                  className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                  value={newTx.amount || ''}
                  onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳戶</label>
                <select 
                  required
                  className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                  value={newTx.accountId}
                  onChange={e => setNewTx({...newTx, accountId: e.target.value})}
                >
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500"
                  placeholder="例如: 午餐, 加油"
                  value={newTx.description || ''}
                  onChange={e => setNewTx({...newTx, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200">取消</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700">儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
