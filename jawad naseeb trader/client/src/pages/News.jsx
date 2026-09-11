import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';
import { getNews } from '../services/api';
import { Search, Newspaper } from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const defaultArticles = [
    { _id: '1', slug: 'bitcoin-hits-new-ath-2025', title: 'Bitcoin Sets New All-Time High in 2025 Bull Cycle', category: 'Bitcoin', author: 'Jawad Naseeb', content: 'Bitcoin surpassed its previous ATH driven by institutional inflows and ETF approvals globally, signaling a new bull market phase.', createdAt: new Date().toISOString(), image: '' },
    { _id: '2', slug: 'ethereum-layer2-adoption', title: 'Ethereum Layer-2 Networks See Record Transaction Volume', category: 'Ethereum', author: 'Jawad Naseeb', content: 'Arbitrum, Optimism, and Base recorded their highest-ever weekly transaction volumes as DeFi and NFT activity surged.', createdAt: new Date().toISOString(), image: '' },
    { _id: '3', slug: 'sec-crypto-regulation-2025', title: 'SEC Releases Comprehensive Crypto Regulation Framework', category: 'Regulation', author: 'Jawad Naseeb', content: 'The Securities and Exchange Commission unveiled a landmark crypto regulatory framework providing legal clarity for digital asset markets.', createdAt: new Date().toISOString(), image: '' },
    { _id: '4', slug: 'defi-tvl-reaches-200b', title: 'DeFi Total Value Locked Crosses $200 Billion Milestone', category: 'DeFi', author: 'Jawad Naseeb', content: 'Decentralized finance protocols collectively locked over $200 billion in assets, marking a pivotal milestone in blockchain financial services.', createdAt: new Date().toISOString(), image: '' },
    { _id: '5', slug: 'solana-institutional-adoption', title: 'Solana Gains Institutional Momentum with High-Speed TPS', category: 'Market Analysis', author: 'Jawad Naseeb', content: 'Major financial institutions began integrating Solana for payments and settlement, citing its 65,000 TPS throughput and low fees.', createdAt: new Date().toISOString(), image: '' },
    { _id: '6', slug: 'crypto-trading-risk-management', title: 'Expert Risk Management Guide for Crypto Traders in 2025', category: 'Trading', author: 'Jawad Naseeb', content: 'Comprehensive guide covering position sizing, stop-loss strategies, and capital preservation techniques for volatile crypto markets.', createdAt: new Date().toISOString(), image: '' }
  ];

  const categories = ['All', 'Bitcoin', 'Ethereum', 'DeFi', 'Regulation', 'Market Analysis', 'Trading', 'Blockchain'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await getNews();
        setArticles(data && data.length > 0 ? data : defaultArticles);
      } catch (err) {
        setArticles(defaultArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Market Intelligence</span>
        <h1 className="text-4xl font-extrabold text-slate-900">Crypto & Market News</h1>
        <p className="text-slate-600 text-sm">Stay updated with the latest cryptocurrency news, market analysis, regulatory developments, and blockchain insights.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search news articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${category === cat ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? <Loader label="Loading market news..." /> : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => <NewsCard key={article._id} article={article} />)}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3">
          <Newspaper className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No articles found</h3>
          <p className="text-xs text-slate-400">Try adjusting the search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default News;
