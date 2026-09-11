import React, { useState } from 'react';
import { submitContact } from '../services/api';
import FinancialDisclaimer from '../components/FinancialDisclaimer';
import { Send, Mail, MessageSquare, User, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setStatus({ type: 'success', msg: 'Your message has been sent! We will respond within 24 hours.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    { icon: Mail, title: 'Email Support', value: 'support@jawadnaseeb.com', sub: 'Response within 24 hours' },
    { icon: MessageSquare, title: 'Telegram Community', value: '@JawadNaseebOfficial', sub: 'Live team updates & support' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Get In Touch</span>
        <h1 className="text-4xl font-extrabold text-slate-900">Contact Jawad Naseeb</h1>
        <p className="text-slate-600 text-sm">Have a question about our educational content, market tools, or platform? Our team will be happy to assist you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{card.title}</h4>
                <p className="text-purple-600 font-semibold text-sm">{card.value}</p>
                <p className="text-xs text-slate-400">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>

        {status && (
          <div className={`flex items-center gap-2.5 p-4 rounded-xl text-sm font-semibold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {status.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span>{status.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Trader" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Course inquiry, technical analysis help, etc." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe your question or topic in detail..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all">
            {loading ? <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Send className="h-4 w-4" /><span>Send Message</span></>}
          </button>
        </form>
      </div>

      <FinancialDisclaimer />
    </div>
  );
};

export default Contact;
