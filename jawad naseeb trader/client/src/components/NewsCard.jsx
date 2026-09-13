import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const NewsCard = ({ article }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 font-bold">
            {article.category || 'News'}
          </div>
        )}
        <span className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-purple-500" />
              {new Date(article.createdAt || Date.now()).toLocaleDateString()}
            </span>
            <span>�</span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-indigo-500" />
              {article.author || 'Jawad Naseeb Team'}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {article.content}
          </p>
        </div>

        {/* Read More */}
        <Link
          to={'/news/' + article.slug}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 group-hover:translate-x-1 transition-all"
        >
          <span>Read Article</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
