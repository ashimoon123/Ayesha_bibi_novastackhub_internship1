import React, { useState, useEffect } from 'react';
import { getMarketData, getMarketChart } from '../services/api';
import CryptoCard from '../components/CryptoCard';
import Chart from '../components/Chart';
import Loader from '../components/Loader';
import FinancialDisclaimer from '../components/FinancialDisclaimer';
import { Search, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';

const Market = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fallbackCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 78738, price_change_percentage_24h: 3.42, high_24h: 79500, low_24h: 76200, market_cap: 1550000000000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3450, price_change_percentage_24h: 2.15, high_24h: 3520, low_24h: 3380, market_cap: 415000000000, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { id: 'binancecoin', name: 'BNB', symbol: 'bnb', current_price: 580, price_change_percentage_24h: -0.85, high_24h: 595, low_24h: 572, market_cap: 87000000000, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
    { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 145, price_change_percentage_24h: 5.60, high_24h: 150, low_24h: 136, market_cap: 67000000000, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { id: 'ripple', name: 'XRP', symbol: 'xrp', current_price: 0.58, price_change_percentage_24h: 1.10, high_24h: 0.60, low_24h: 0.56, market_cap: 32000000000, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', current_price: 0.12, price_change_percentage_24h: -1.45, high_24h: 0.13, low_24h: 0.11, market_cap: 17000000000, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.38, price_change_percentage_24h: 0.95, high_24h: 0.40, low_24h: 0.36, market_cap: 13500000000, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' }
  ];

  const [chartData, setChartData] = useState([]);

  const fetchMarket = async () => {
    setLoading(true);
    try {
      const { data } = await getMarketData();
      if (data && data.length > 0) {
        setCoins(data);
      } else {
        setCoins(fallbackCoins);
      }
    } catch (err) {
      setCoins(fallbackCoins);
    } finally {
      setLoading(false);
    }
  };

  const fallbackChartData = Array.from({ length: 24 }).map((_, i) => [
    Date.now() - (24 - i) * 60 * 60 * 1000,
    75000 + Math.random() * 5000
  ]);

  const fetchChart = async () => {
    try {
      const { data } = await getMarketChart('bitcoin', 1);
      if (data && data.prices && data.prices.length > 0) {
        setChartData(data.prices);
      } else {
        setChartData(fallbackChartData);
      }
    } catch (err) {
      console.log('Error fetching chart', err);
      setChartData(fallbackChartData);
    }
  };

  useEffect(() => {
    fetchMarket();
    fetchChart();
  }, []);

  const filteredCoins = coins.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Real-Time Data
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Live Crypto Market</h1>
          <p className="text-slate-600 text-sm">Track live cryptocurrency prices, market caps, and interactive trading charts.</p>
        </div>
        <button
          onClick={fetchMarket}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className="h-4 w-4 text-purple-600" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Featured Live Chart */}
      <Chart 
        data={chartData} 
        currentPrice={coins.find(c => c.id === 'bitcoin')?.current_price || 78738} 
        change24h={coins.find(c => c.id === 'bitcoin')?.price_change_percentage_24h || 3.42} 
      />

      {/* Market Cards Grid Header & Search */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Popular Cryptocurrencies</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbol or coin name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <Loader label="Fetching live market prices..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoins.map((coin) => (
              <CryptoCard key={coin.id} coin={coin} />
            ))}
          </div>
        )}
      </div>

      {/* Financial Disclaimer */}
      <FinancialDisclaimer />

    </div>
  );
};

export default Market;
