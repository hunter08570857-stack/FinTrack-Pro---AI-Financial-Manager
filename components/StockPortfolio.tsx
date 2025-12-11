import React, { useState } from 'react';
import { StockHolding } from '../types';
import { RefreshCw, Search, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { getMarketUpdate } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface StockPortfolioProps {
  stocks: StockHolding[];
  setStocks: React.Dispatch<React.SetStateAction<StockHolding[]>>;
}

export const StockPortfolio: React.FC<StockPortfolioProps> = ({ stocks, setStocks }) => {
  const [marketInfo, setMarketInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStock, setNewStock] = useState<Partial<StockHolding>>({ market: 'TW', currency: 'TWD' });
  const [isAdding, setIsAdding] = useState(false);

  const handleSimulateUpdate = () => {
    // Simulate minor price fluctuations for demo purposes
    const updated = stocks.map(stock => {
      const changePercent = (Math.random() - 0.5) * 0.05; // +/- 2.5%
      const newPrice = Math.round(stock.currentPrice * (1 + changePercent) * 100) / 100;
      return { ...stock, currentPrice: newPrice };
    });
    setStocks(updated);
  };

  const handleAIUpdate = async () => {
    setIsLoading(true);
    const info = await getMarketUpdate(stocks);
    setMarketInfo(info);
    setIsLoading(false);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStock.symbol || !newStock.quantity || !newStock.avgCost) return;

    const stock: StockHolding = {
        ...newStock,
        id: `st_${Date.now()}`,
        currentPrice: newStock.avgCost, // Init with cost
        name: newStock.symbol?.toUpperCase(), // Placeholder name
    } as StockHolding;

    setStocks(prev => [...prev, stock]);
    setIsAdding(false);
    setNewStock({ market: 'TW', currency: 'TWD' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">投資組合</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleSimulateUpdate}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} /> 模擬報價跳動
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <TrendingUp size={16} /> 新增持股
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock List */}
        <div className="lg:col-span-2 space-y-4">
          {stocks.map(stock => {
             const gain = (stock.currentPrice - stock.avgCost) * stock.quantity;
             const gainPercent = ((stock.currentPrice - stock.avgCost) / stock.avgCost) * 100;
             const isPositive = gain >= 0;

             return (
               <div key={stock.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                 <div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${stock.market === 'TW' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {stock.market}
                        </span>
                        <h3 className="font-bold text-lg text-gray-800">{stock.name} <span className="text-gray-400 text-sm font-normal">({stock.symbol})</span></h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        持有 {stock.quantity} 股 • 成本 ${stock.avgCost}
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">${stock.currentPrice.toLocaleString()}</p>
                    <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(gain).toLocaleString()} ({gainPercent.toFixed(2)}%)</span>
                        <span className="text-xs text-gray-400 ml-1">(台股紅漲綠跌)</span>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>

        {/* AI Market Insight */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Search size={18} className="text-blue-500"/> 市場情報搜查
                </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                使用 Google Search Grounding 查詢您持股的最新市場新聞與趨勢。
            </p>
            <button 
                onClick={handleAIUpdate}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 mb-4 flex justify-center items-center gap-2"
            >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : '獲取 AI 市場分析'}
            </button>
            
            {marketInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 max-h-[400px] overflow-y-auto border border-gray-200">
                    <ReactMarkdown className="prose prose-sm">{marketInfo}</ReactMarkdown>
                </div>
            )}
        </div>
      </div>

       {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">新增持股紀錄</h3>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">市場</label>
                    <select 
                        className="w-full border rounded-lg p-2.5 outline-none"
                        value={newStock.market}
                        onChange={e => setNewStock({...newStock, market: e.target.value as any})}
                    >
                        <option value="TW">台股 (TW)</option>
                        <option value="US">美股 (US)</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">幣別</label>
                    <select 
                        className="w-full border rounded-lg p-2.5 outline-none"
                        value={newStock.currency}
                        onChange={e => setNewStock({...newStock, currency: e.target.value as any})}
                    >
                        <option value="TWD">TWD</option>
                        <option value="USD">USD</option>
                    </select>
                  </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">代號 (Symbol)</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. 2330, AAPL"
                  className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newStock.symbol || ''}
                  onChange={e => setNewStock({...newStock, symbol: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">數量 (股)</label>
                    <input 
                    required
                    type="number" 
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    value={newStock.quantity || ''}
                    onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">平均成本</label>
                    <input 
                    required
                    type="number" 
                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    value={newStock.avgCost || ''}
                    onChange={e => setNewStock({...newStock, avgCost: Number(e.target.value)})}
                    />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200">取消</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700">新增</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
