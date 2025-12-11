import React from 'react';
import { ViewState, User } from '../types';
import { LayoutDashboard, CreditCard, Receipt, TrendingUp, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: '總覽報表', icon: LayoutDashboard },
    { id: 'ACCOUNTS', label: '銀行帳戶', icon: CreditCard },
    { id: 'TRANSACTIONS', label: '收支紀錄', icon: Receipt },
    { id: 'STOCKS', label: '股市投資', icon: TrendingUp },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400 font-extrabold text-2xl">FinTrack</span>
          <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded text-white">PRO</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 mb-3">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border-2 border-slate-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 p-2 text-sm transition-colors"
        >
          <LogOut size={16} />
          登出
        </button>
      </div>
    </div>
  );
};
