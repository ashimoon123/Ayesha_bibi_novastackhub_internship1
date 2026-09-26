import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import NewsCard from '../components/NewsCard';
import CryptoCard from '../components/CryptoCard';
import Chart from '../components/Chart';
import FinancialDisclaimer from '../components/FinancialDisclaimer';
import {
  TrendingUp, BookOpen, ShieldCheck, Award, ChevronDown, ChevronUp,
  ArrowRight, Users, CheckCircle, Send, Sparkles, Cpu, Lock, BarChart3
} from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const achievements = [
    { title: 'Best Crypto Education Platform 2025', publication: 'FinTech Excellence Awards', date: '2025', desc: 'Recognized for top-tier financial literacy & interactive crypto learning modules.' },
    { title: 'Top Market Analysis Team', publication: 'Global Trading Summit', date: '2025', desc: 'Awarded for precision technical analysis & real-time data-driven market insights.' },
    { title: 'Community Impact Award', publication: 'Financial Literacy Forum', date: '2024', desc: 'Over 50,000+ students educated in risk management and blockchain fundamentals.' },
    { title: 'Media Excellence Recognition', publication: 'Crypto Weekly', date: '2024', desc: 'Highlighted for clear, beginner-friendly crypto market commentary & tutorials.' }
  ];

  const faqs = [
    { q: 'What is Cryptocurrency?', a: 'Cryptocurrency is a digital or virtual currency that is secured by cryptography, making it nearly impossible to counterfeit or double-spend. Most cryptocurrencies run on decentralized networks using blockchain technology.' },
    { q: 'What is Bitcoin?', a: 'Bitcoin (BTC) is the first and most widely used decentralized digital cryptocurrency, created in 2009 by an anonymous entity named Satoshi Nakamoto. It serves as both a store of value and medium of exchange.' },
    { q: 'What is Blockchain?', a: 'A blockchain is a distributed digital ledger that records transactions across a network of computers. It ensures data immutability, transparency, and security without requiring a central authority.' },
    { q: 'What is Trading?', a: 'Trading involves buying and selling financial assets—such as cryptocurrencies, stocks, or forex—with the goal of generating profit from price fluctuations.' },
    { q: 'What is Risk Management?', a: 'Risk management in trading is the practice of identifying, analyzing, and mitigating investment risks. Key tactics include position sizing, stop-loss orders, and maintaining a proper risk-to-reward ratio.' },
    { q: 'What is Technical Analysis?', a: 'Technical analysis is a trading discipline used to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.' },
    { q: 'What is Fundamental Analysis?', a: 'Fundamental analysis evaluates an asset by examining related economic, financial, regulatory, and technological factors to measure its intrinsic value.' }
  ];

  const categories = [
    { name: 'Blockchain', count: '12 Lessons', icon: Cpu, desc: 'Master distributed ledger technology & smart contracts.' },
    { name: 'Cryptocurrency Basics', count: '15 Lessons', icon: Lock, desc: 'Understand wallets, security, and digital assets.' },
    { name: 'Technical Analysis', count: '20 Lessons', icon: BarChart3, desc: 'Learn chart patterns, indicators, and price action.' },
    { name: 'Fundamental Analysis', count: '10 Lessons', icon: BookOpen, desc: 'Analyze tokenomics, whitepapers, and market metrics.' },
    { name: 'Risk Management', count: '8 Lessons', icon: ShieldCheck, desc: 'Protect your capital with stop loss and position sizing.' },
    { name: 'Trading Psychology', count: '7 Lessons', icon: Sparkles, desc: 'Control emotions, discipline, and execution.' },
    { name: 'Bitcoin', count: '10 Lessons', icon: TrendingUp, desc: 'Deep dive into Bitcoinhalving, cycle & economics.' },
    { name: 'Forex Basics', count: '14 Lessons', icon: Users, desc: 'Currency pairs, leverage, and global macro factors.' }
  ];

  const sampleCourses = [
    { _id: '1', title: 'Complete Crypto & Blockchain Masterclass', category: 'Cryptocurrency Basics', difficulty: 'Beginner', duration: '4.5 hrs', description: 'Everything you need to know about Bitcoin, wallets, security, and market fundamentals.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=600&auto=format&fit=crop' },
    { _id: '2', title: 'Advanced Technical Analysis & Charting', category: 'Technical Analysis', difficulty: 'Advanced', duration: '6 hrs', description: 'Master candlestick patterns, support/resistance, RSI, MACD, and market structure.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop' },
    { _id: '3', title: 'Risk Management & Trading Psychology', category: 'Risk Management', difficulty: 'Intermediate', duration: '3 hrs', description: 'Build a bulletproof trading plan and master risk control to stay profitable.', instructor: 'Jawad Naseeb', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop' }
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-white">
        
        {/* Glow Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 text-purple-800 text-xs font-bold uppercase tracking-wider border border-purple-200 shadow-sm">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Modern Trading & Crypto Education
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
                Data First. <br />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Decisions Follow.
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Jawad Naseeb helps you understand cryptocurrency, trading and financial markets through education, market data and practical learning tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/education"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all text-center"
                >
                  Start Learning
                </Link>
                <Link
                  to="/market"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all text-center"
                >
                  Explore Markets
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>50,000+ Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Verified Market Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Risk Management First</span>
                </div>
              </div>
            </div>

            {/* Right Card / Graphic */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 shadow-2xl shadow-purple-500/10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">JN</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Jawad Naseeb Platform</h4>
                      <p className="text-xs text-slate-400">Live Crypto Education</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold">Active Learning</span>
                </div>

                {/* Sample Chart Preview */}
                <Chart currentPrice={78738} change24h={3.42} />

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                    <span className="text-slate-400 block">Total Courses</span>
                    <span className="font-extrabold text-slate-900 text-base">25+ Modules</span>
                  </div>
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 block">Community</span>
                    <span className="font-extrabold text-slate-900 text-base">Telegram & Live</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST / ACHIEVEMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Recognized Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Welcome to the Award Winning Trading Team
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Our educational framework and market insights are backed by years of market experience and industry recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-purple-600 font-semibold">{item.publication} • {item.date}</span>
                <h4 className="font-bold text-slate-900 text-base mt-1">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE YOU BEGIN / FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Essential Knowledge</span>
            <h2 className="text-3xl font-extrabold">Before You Begin</h2>
            <p className="text-slate-300 text-sm">Key concepts every beginner should master before entering crypto markets.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-base text-white hover:text-purple-200 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-5 w-5 shrink-0 text-purple-300" /> : <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-200 leading-relaxed border-t border-white/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION SERVICES CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Curriculum & Courses</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Our Education Services</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Comprehensive modules designed for all experience levels—from absolute beginner to expert technical analyst.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 flex items-center justify-center transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{cat.count}</span>
                  <h4 className="font-bold text-slate-900 text-lg mt-2 group-hover:text-purple-600 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{cat.desc}</p>
                </div>
                <Link to="/education" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 pt-2">
                  <span>Explore Course</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Learning Modules</h2>
            <p className="text-sm text-slate-500 mt-1">Start learning step-by-step with structured video lessons.</p>
          </div>
          <Link to="/education" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      {/* TELEGRAM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Join Our Official Telegram Community</h3>
            <p className="text-purple-100 text-sm max-w-xl">
              Get daily market commentary, educational updates, and team announcements directly on Telegram.
            </p>
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-2xl font-bold bg-white text-purple-700 hover:bg-purple-50 shadow-md flex items-center gap-2 shrink-0 transition-all"
          >
            <Send className="h-5 w-5 text-purple-600" />
            <span>Join Our Telegram</span>
          </a>
        </div>
      </section>

      {/* FINANCIAL DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FinancialDisclaimer />
      </section>

    </div>
  );
};

export default Home;
