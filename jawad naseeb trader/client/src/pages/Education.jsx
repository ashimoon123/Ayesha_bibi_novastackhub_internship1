import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import { getCourses } from '../services/api';
import { Search, Filter, BookOpen } from 'lucide-react';

const Education = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const defaultCourses = [
    { _id: '1', title: 'Complete Crypto & Blockchain Masterclass', category: 'Cryptocurrency Basics', difficulty: 'Beginner', duration: '4.5 hrs', description: 'Everything you need to know about Bitcoin, wallets, security, and market fundamentals.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=600&auto=format&fit=crop' },
    { _id: '2', title: 'Advanced Technical Analysis & Charting', category: 'Technical Analysis', difficulty: 'Advanced', duration: '6 hrs', description: 'Master candlestick patterns, support/resistance, RSI, MACD, and market structure.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop' },
    { _id: '3', title: 'Risk Management & Trading Psychology', category: 'Risk Management', difficulty: 'Intermediate', duration: '3 hrs', description: 'Build a bulletproof trading plan and master risk control to stay profitable.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop' },
    { _id: '4', title: 'Fundamental Analysis & On-Chain Metrics', category: 'Fundamental Analysis', difficulty: 'Intermediate', duration: '4 hrs', description: 'Evaluate project whitepapers, tokenomics, active addresses, and network security.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=600&auto=format&fit=crop' },
    { _id: '5', title: 'Smart Contracts & DeFi Architecture', category: 'Blockchain', difficulty: 'Advanced', duration: '5.5 hrs', description: 'Explore decentralized finance protocols, liquidity pools, and yield mechanics.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=600&auto=format&fit=crop' },
    { _id: '6', title: 'Forex & Global Macro Trading Basics', category: 'Forex Basics', difficulty: 'Beginner', duration: '3.5 hrs', description: 'Understand central banks, interest rate policies, and currency pair dynamics.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop' }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await getCourses();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(defaultCourses);
        }
      } catch (err) {
        setCourses(defaultCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ['All', 'Cryptocurrency Basics', 'Technical Analysis', 'Risk Management', 'Blockchain', 'Fundamental Analysis', 'Forex Basics'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          Structured Learning
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Trading & Crypto Education</h1>
        <p className="text-slate-600 text-sm">
          Browse our structured courses covering cryptocurrency, technical analysis, risk management, and market fundamentals.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Course Grid */}
      {loading ? (
        <Loader label="Loading educational courses..." />
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No courses match your criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms or category filter.</p>
        </div>
      )}

    </div>
  );
};

export default Education;
