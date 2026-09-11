import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({ data = [], coinName = 'Bitcoin', currentPrice = 0, change24h = 0 }) => {
  const [timeframe, setTimeframe] = useState('1D');

  const formattedData = data.map((item) => ({
    time: new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: item[1],
  }));

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  const isPositive = change24h >= 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-2xl text-slate-900">{coinName} Live Chart</h3>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-md">BTC/USDT</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${currentPrice ? currentPrice.toLocaleString() : '78,738'}
            </span>
            <span className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? '+' : ''}{change24h}%
            </span>
          </div>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} tickLine={false} orientation="right" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Price']}
              />
              <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-purple-50/40 rounded-2xl text-slate-400 text-sm">
            Live Chart Data Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
