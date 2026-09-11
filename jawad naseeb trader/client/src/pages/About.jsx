import React from 'react';
import FinancialDisclaimer from '../components/FinancialDisclaimer';
import { Award, BookOpen, ShieldCheck, Users, Target, Eye, HeartHandshake } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Enrolled Students', value: '50,000+' },
    { label: 'Educational Resources', value: '150+' },
    { label: 'Years Experience', value: '8+ Years' },
    { label: 'Community Members', value: '100,000+' }
  ];

  const teamMembers = [
    { name: 'Jawad Naseeb', position: 'Founder & Chief Market Strategist', desc: 'Over 8 years of experience in market analysis, technical trading, and financial education.', date: 'Joined 2018' },
    { name: 'Market Research Team', position: 'Crypto & Blockchain Analysts', desc: 'Specialized in on-chain analytics, tokenomics research, and macroeconomic trend forecasting.', date: 'Established 2020' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          Brand & Philosophy
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">About Jawad Naseeb</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Jawad Naseeb is an educational platform designed to help learners understand trading, cryptocurrency, blockchain and financial markets through data-driven education and practical market tools.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm hover:shadow-md transition-all space-y-1">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block">
              {stat.value}
            </span>
            <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl p-8 shadow-xl space-y-4">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold">Our Mission</h3>
          <p className="text-slate-200 text-sm leading-relaxed">
            To demystify cryptocurrency and financial markets by providing clear, structured, and objective educational materials that empower traders to make data-backed decisions with strict risk management.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-lg space-y-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Eye className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            To become a globally recognized benchmark for financial literacy, fostering a community where education precedes execution, and financial clarity replaces speculative emotion.
          </p>
        </div>
      </div>

      {/* Team Acknowledgements */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Team Acknowledgements</h2>
          <p className="text-sm text-slate-500">Dedicated professionals committed to financial literacy & market research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xl shrink-0">
                {member.name.substring(0, 2)}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600">{member.date}</span>
                <h4 className="font-bold text-lg text-slate-900">{member.name}</h4>
                <p className="text-xs font-semibold text-indigo-600">{member.position}</p>
                <p className="text-xs text-slate-500 pt-2 leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Disclaimer */}
      <FinancialDisclaimer />

    </div>
  );
};

export default About;
