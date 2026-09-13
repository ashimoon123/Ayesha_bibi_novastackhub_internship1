import React, { useState } from 'react';
import FinancialDisclaimer from '../components/FinancialDisclaimer';
import { Calculator as CalcIcon, DollarSign, TrendingUp, RefreshCw, ArrowRightLeft } from 'lucide-react';

const Calculator = () => {
  const [investmentUSD, setInvestmentUSD] = useState(10000);
  const [btcPrice, setBtcPrice] = useState(78738);
  const [futureBtcPrice, setFutureBtcPrice] = useState(95000);
  const pkrRate = 278.5; // 1 USD = 278.5 PKR

  const btcReceived = investmentUSD / (btcPrice || 1);
  const futureValueUSD = btcReceived * futureBtcPrice;
  const profitLossUSD = futureValueUSD - investmentUSD;
  const percentageReturn = ((futureValueUSD - investmentUSD) / investmentUSD) * 100;

  const investmentPKR = investmentUSD * pkrRate;
  const futureValuePKR = futureValueUSD * pkrRate;
  const profitLossPKR = profitLossUSD * pkrRate;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          Financial Tool
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Bitcoin & Crypto Calculator</h1>
        <p className="text-slate-600 text-sm">
          Calculate potential Bitcoin returns, USD and PKR valuation, and profit/loss margins dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalcIcon className="h-5 w-5 text-purple-600" />
            <span>Investment Parameters</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Initial Investment (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={investmentUSD}
                  onChange={(e) => setInvestmentUSD(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-xs text-slate-400 mt-1 block">˜ {investmentPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} PKR</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Buy Price (BTC / USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={btcPrice}
                  onChange={(e) => setBtcPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Target / Sell Price (BTC / USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={futureBtcPrice}
                  onChange={(e) => setFutureBtcPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-base font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Calculation Summary</span>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-1">
              <span className="text-xs text-slate-300 uppercase">BTC Acquired</span>
              <div className="text-3xl font-extrabold tracking-tight text-white">
                {btcReceived.toFixed(6)} BTC
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 block">Expected Profit / Loss</span>
                <span className={`text-xl font-extrabold ${profitLossUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${profitLossUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  ˜ {profitLossPKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} PKR
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-slate-300 block">Percentage Return</span>
                <span className={`text-xl font-extrabold ${percentageReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {percentageReturn >= 0 ? '+' : ''}{percentageReturn.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Total Future Value (USD):</span>
                <span className="font-bold text-white">${futureValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Future Value (PKR):</span>
                <span className="font-bold text-white">{futureValuePKR.toLocaleString(undefined, { maximumFractionDigits: 0 })} PKR</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <FinancialDisclaimer />

    </div>
  );
};

export default Calculator;
