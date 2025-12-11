import React, { useState } from 'react';
import { User } from '../types';
import { Wallet } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onLogin({
      id: `user_${Date.now()}`,
      name: name,
      email: `${name.toLowerCase()}@example.com`,
      avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">歡迎使用 FinTrack Pro</h1>
          <p className="text-gray-500 mt-2">您的個人智能財務管家</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              請輸入您的姓名以開始
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="例如: 王小明"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            進入系統
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Powered by Google Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};
