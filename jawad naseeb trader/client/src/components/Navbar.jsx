import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, TrendingUp, User, LogOut, BookOpen, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Education', path: '/education' },
    { name: 'Market', path: '/market' },
    { name: 'News', path: '/news' },
    { name: 'Tools', path: '/calculator' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100/60 bg-white/85 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              JN
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent">
                Jawad Naseeb
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-purple-600">
                Trading & Crypto Education
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-purple-700 bg-purple-50/80 font-semibold'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA / Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user.role === 'Admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-purple-600 hover:bg-purple-50/50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/education"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Learning
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-purple-100 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-purple-700 bg-purple-50 font-semibold'
                  : 'text-slate-700 hover:text-purple-600 hover:bg-purple-50/50'
              }`}
            >
              <span>{link.name}</span>
              <ChevronRight className="h-4 w-4 text-purple-400" />
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'Admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-semibold bg-purple-50 text-purple-700"
                >
                  <User className="h-5 w-5" />
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-3 rounded-xl text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/education"
                  onClick={() => setIsOpen(false)}
                  className="text-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
