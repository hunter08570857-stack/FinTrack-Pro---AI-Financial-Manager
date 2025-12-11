import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, Landmark } from 'lucide-react';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

export const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Partial<BankAccount>>({});

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除此帳戶嗎？')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAccount.id) {
      // Edit
      setAccounts(prev => prev.map(a => a.id === currentAccount.id ? { ...a, ...currentAccount } as BankAccount : a));
    } else {
      // Add
      const newAccount: BankAccount = {
        ...currentAccount,
        id: `acc_${Date.now()}`,
        balance: Number(currentAccount.balance || 0)
      } as BankAccount;
      setAccounts(prev => [...prev, newAccount]);
    }
    setIsEditing(false);
    setCurrentAccount({});
  };

  const openModal = (account?: BankAccount) => {
    setCurrentAccount(account || { type: 'Checking', currency: 'TWD', balance: 0 });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">帳戶管理</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> 新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Landmark size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(account)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(account.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800">{account.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{account.bankName} • {account.type}</p>
            
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {account.currency} ${account.balance.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{currentAccount.id ? '編輯帳戶' : '新增帳戶'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳戶名稱</label>
                <input 
                  required
                  type="text" 
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentAccount.name || ''}
                  onChange={e => setCurrentAccount({...currentAccount, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">銀行名稱</label>
                <input 
                  required
                  type="text" 
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentAccount.bankName || ''}
                  onChange={e => setCurrentAccount({...currentAccount, bankName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">幣別</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none"
                    value={currentAccount.currency}
                    onChange={e => setCurrentAccount({...currentAccount, currency: e.target.value})}
                  >
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
                  <select 
                    className="w-full border rounded-lg p-2.5 outline-none"
                    value={currentAccount.type}
                    onChange={e => setCurrentAccount({...currentAccount, type: e.target.value as any})}
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">當前餘額</label>
                <input 
                  required
                  type="number" 
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentAccount.balance}
                  onChange={e => setCurrentAccount({...currentAccount, balance: Number(e.target.value)})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200">取消</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700">儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
