import React from 'react';
import { Link } from 'react-router-dom';
import { Home, TrendingUp } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center space-y-6 max-w-md">
      <div className="text-8xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">404</div>
      <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-slate-500 text-sm">The page you are looking for does not exist or has been moved.</p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all">
          <Home className="h-4 w-4" /><span>Go Home</span>
        </Link>
        <Link to="/market" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
          <TrendingUp className="h-4 w-4" /><span>View Market</span>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
