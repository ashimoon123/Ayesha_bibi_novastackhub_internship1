import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CryptoCard = ({ coin }) => {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt={coin.name} className="h-9 w-9 rounded-full" />
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{coin.name}</h4>
            <span className="text-xs uppercase text-slate-400 font-medium">{coin.symbol}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : '0.00'}%</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          ${coin.current_price ? coin.current_price.toLocaleString() : '0.00'}
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            <span className="block text-slate-400">24h High</span>
            <span className="font-medium text-slate-700">${coin.high_24h ? coin.high_24h.toLocaleString() : '-'}</span>
          </div>
          <div>
            <span className="block text-slate-400">24h Low</span>
            <span className="font-medium text-slate-700">${coin.low_24h ? coin.low_24h.toLocaleString() : '-'}</span>
          </div>
          <div className="col-span-2 pt-1 flex justify-between">
            <span className="text-slate-400">Market Cap:</span>
            <span className="font-medium text-slate-700">${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
