import React, { useState, useEffect } from 'react';
import { User, ViewState, BankAccount, Transaction, StockHolding, TransactionType } from './types';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Accounts } from './components/Accounts';
import { Transactions } from './components/Transactions';
import { StockPortfolio } from './components/StockPortfolio';
import { dbService } from './services/dbService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isLoading, setIsLoading] = useState(false);
  
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<StockHolding[]>([]);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  // Fetch Data when user logs in
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await dbService.initializeUser(user);
          const data = await dbService.fetchAllData(user.id);
          setAccounts(data.accounts);
          setTransactions(data.transactions);
          setStocks(data.stocks);
        } catch (error) {
          console.error("Failed to load data", error);
          alert("讀取資料失敗，請檢查 Firebase 設定或網路連線。");
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('fintrack_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setAccounts([]);
    setTransactions([]);
    setStocks([]);
    localStorage.removeItem('fintrack_user');
  };

  // Wrapper handlers to sync with Firebase
  const handleSetAccounts = (action: React.SetStateAction<BankAccount[]>) => {
    setAccounts(prev => {
      const newAccounts = typeof action === 'function' ? action(prev) : action;
      // Identify changes and sync (Simple strategy: Save all modified/added)
      // For a robust app, we should pass specific add/update/delete actions, but here we sync on effect or direct calls.
      // Better approach for this demo: direct DB calls in components or specialized handlers below.
      return newAccounts;
    });
  };
  
  // Specific Handlers to pass to components that do both State update AND DB update
  const updateAccountWrapper = async (updatedAccounts: React.SetStateAction<BankAccount[]>) => {
     // This is a simplified compatibility layer. ideally components call service directly.
     // To keep component changes minimal, we intercept the setState.
     
     // However, since setState is sync/batch in React logic but DB is async, 
     // we will modify the Components to call App's specific async methods or simple sync.
     // For this refactor, let's keep setState but add a side effect to save.
     
     // actually, let's just pass the setState, but also trigger a save for the specific item in the component?
     // No, easier to intercept in the component. 
     // For this "Senior Engineer" refactor, I will pass the standard setAccounts, 
     // but I will add a useEffect to watch for changes? No, that's circular.
     
     // Let's modify the props logic slightly.
     // Since the user asked for "System" changes, we will update the setAccounts logic 
     // inside the child components to also call DB.
     setAccounts(updatedAccounts);
  };

  // Improved Handlers that Components will use
  const handleUpdateAccount = async (newAccounts: BankAccount[]) => {
      // Find diff (naive approach for demo)
      setAccounts(newAccounts);
      // In a real app, we'd know exactly which ID changed. 
      // We will rely on the component calling specific save methods if we wanted granular control.
      // For now, we update local state. The Component (Accounts.tsx) needs to be slightly smarter or we inject a saver.
  };

  // Re-inject DB logic into components by wrapping the setters
  const customSetAccounts = (action: React.SetStateAction<BankAccount[]>) => {
      setAccounts(prev => {
          const next = typeof action === 'function' ? action(prev) : action;
          // Fire and forget save for the items (optimized for demo)
          next.forEach(acc => {
              const old = prev.find(p => p.id === acc.id);
              if (old !== acc) dbService.saveAccount(user!.id, acc);
          });
          // Check deletions
          prev.forEach(old => {
              if (!next.find(n => n.id === old.id)) dbService.deleteAccount(user!.id, old.id);
          });
          return next;
      });
  };

  const customSetTransactions = (action: React.SetStateAction<Transaction[]>) => {
      setTransactions(prev => {
          const next = typeof action === 'function' ? action(prev) : action;
          // Detect new transaction
          const newTx = next.find(n => !prev.includes(n));
          if (newTx && user) {
             dbService.saveTransaction(user.id, newTx);
             // Update account balance if needed
             const acc = accounts.find(a => a.id === newTx.accountId);
             if (acc) {
                const change = newTx.type === TransactionType.INCOME ? newTx.amount : -newTx.amount;
                const newBal = acc.balance + change;
                dbService.updateAccountBalance(user.id, acc.id, newBal);
                // Also update local account state
                setAccounts(curr => curr.map(a => a.id === acc.id ? {...a, balance: newBal} : a));
             }
          }
          return next;
      });
  };

  const customSetStocks = (action: React.SetStateAction<StockHolding[]>) => {
      setStocks(prev => {
          const next = typeof action === 'function' ? action(prev) : action;
          next.forEach(s => {
             const old = prev.find(p => p.id === s.id);
             if (old !== s) dbService.saveStock(user!.id, s);
          });
          return next;
      });
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>正在同步雲端資料庫...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={user} 
        onLogout={handleLogout}
      />

      <main className="flex-1 md:ml-64 p-6 md:p-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {currentView === 'DASHBOARD' && (
            <Dashboard 
              accounts={accounts} 
              transactions={transactions} 
              stocks={stocks}
            />
          )}
          {currentView === 'ACCOUNTS' && (
            <Accounts 
              accounts={accounts} 
              setAccounts={customSetAccounts} 
            />
          )}
          {currentView === 'TRANSACTIONS' && (
            <Transactions 
              transactions={transactions} 
              setTransactions={customSetTransactions}
              accounts={accounts}
              setAccounts={setAccounts} // Transactions component updates accounts locally, we let it, but DB sync happens inside customSetTransactions logic
            />
          )}
          {currentView === 'STOCKS' && (
             <StockPortfolio 
               stocks={stocks}
               setStocks={customSetStocks}
             />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
