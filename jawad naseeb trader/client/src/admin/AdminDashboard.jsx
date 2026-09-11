import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getContacts } from '../services/api';
import { Users, BookOpen, Newspaper, MessageSquare, TrendingUp, ArrowRight, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/dashboard');
    }
    const fetchContacts = async () => {
      try {
        const { data } = await getContacts();
        setContacts(data);
      } catch (err) {}
    };
    fetchContacts();
  }, [user, navigate]);

  const stats = [
    { label: 'Total Users', value: '52,400+', icon: Users, color: 'from-purple-500 to-indigo-500' },
    { label: 'Active Courses', value: '25', icon: BookOpen, color: 'from-indigo-500 to-blue-500' },
    { label: 'News Articles', value: '148', icon: Newspaper, color: 'from-emerald-500 to-teal-500' },
    { label: 'Contact Messages', value: contacts.length || '0', icon: MessageSquare, color: 'from-orange-500 to-pink-500' }
  ];

  const sections = [
    { title: 'Manage Courses', desc: 'Add, edit or remove education modules and lessons.', path: '/admin/courses', icon: BookOpen },
    { title: 'Manage News', desc: 'Publish market updates, crypto news, and blog posts.', path: '/admin/news', icon: Newspaper },
    { title: 'Manage Users', desc: 'View all registered accounts and update roles.', path: '/admin/users', icon: Users },
    { title: 'View Contact Messages', desc: 'Read and manage all inquiries submitted by users.', path: '/admin/contacts', icon: MessageSquare }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="h-4 w-4" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-slate-300 text-sm">Manage all platform content, users, and settings from here.</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white font-extrabold text-xl">
          {user?.name?.substring(0, 2) || 'AD'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden relative">
              <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 translate-x-8 -translate-y-8`}></div>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center mb-4`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{section.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{section.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
        <h3 className="font-bold text-xl text-slate-900">Recent Contact Messages</h3>
        {contacts.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Contact messages will appear here once users submit inquiries.</p>
        ) : (
          <div className="space-y-3">
            {contacts.slice(0, 5).map((msg, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{msg.name}</p>
                  <p className="text-xs text-purple-600 font-semibold">{msg.subject}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{msg.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-4">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
