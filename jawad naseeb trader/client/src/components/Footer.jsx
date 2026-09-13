import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FinancialDisclaimer from './FinancialDisclaimer';
import { Send, TrendingUp, Mail, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post('/api/newsletter', { email });
      setStatus({ type: 'success', msg: 'Subscribed successfully!' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Subscription failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                JN
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Jawad Naseeb
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Jawad Naseeb is a modern Trading, Cryptocurrency Education, Market Analysis and Financial Learning platform. Smart financial decisions follow data and practical learning.
            </p>
            
            {/* Newsletter Form */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-white mb-2">Subscribe to Team Updates</h4>
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              {status && (
                <p className={`text-xs mt-2 ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {status.msg}
                </p>
              )}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/education" className="hover:text-purple-400 transition-colors">Education Courses</Link></li>
              <li><Link to="/market" className="hover:text-purple-400 transition-colors">Crypto Market</Link></li>
              <li><Link to="/news" className="hover:text-purple-400 transition-colors">Market News</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Tools & Social</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/calculator" className="hover:text-purple-400 transition-colors">Bitcoin Calculator</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Support</Link></li>
              <li><a href="https://t.me" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">Telegram Updates</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">YouTube Channel</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">X / Twitter</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-purple-400 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-purple-400 cursor-pointer">Risk Disclosure</span></li>
            </ul>
          </div>

        </div>

        {/* Financial Disclaimer Banner */}
        <div className="py-8">
          <FinancialDisclaimer compact={true} />
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Jawad Naseeb. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            <span>Jawad Naseeb</span>
            <span>•</span>
            <span>Trading & Crypto Education Platform</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
