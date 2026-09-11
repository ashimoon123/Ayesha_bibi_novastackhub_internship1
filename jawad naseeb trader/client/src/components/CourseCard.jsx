import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User, BarChart2 } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-gradient-to-tr from-purple-900 to-indigo-900 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            <BookOpen className="h-12 w-12" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
          {course.category}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs px-2.5 py-1 rounded-full font-semibold">
          {course.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Stats & Meta */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-purple-500" />
            <span>{course.instructor || 'Jawad Naseeb'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span>{course.duration || '2 hrs'}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={'/education/' + (course._id || course.slug)}
          className="w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-200"
        >
          Explore Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
