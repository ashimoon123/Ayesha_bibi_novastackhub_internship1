import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const [completed, setCompleted] = useState(false);

  const mockLesson = {
    title: 'Introduction to Cryptocurrency & Digital Assets',
    description: 'In this foundational lesson, Jawad Naseeb breaks down the core concepts of cryptocurrency, explaining how cryptographic tokens work, the difference between coins and tokens, and why financial self-sovereignty matters in modern markets.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to={`/education/${courseId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Course Syllabus</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Progress:</span>
          <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className={`h-full bg-purple-600 transition-all ${completed ? 'w-full' : 'w-1/4'}`}></div>
          </div>
          <span className="text-xs font-bold text-slate-700">{completed ? '100%' : '25%'}</span>
        </div>
      </div>

      {/* Main Video & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center relative group">
            <div className="p-8 text-center space-y-4 text-white">
              <div className="h-16 w-16 rounded-full bg-purple-600/90 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">{mockLesson.title}</h3>
              <p className="text-xs text-slate-400">Video Lesson • Jawad Naseeb Education Series</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{mockLesson.title}</h2>
              <button
                onClick={() => setCompleted(!completed)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  completed
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>{completed ? 'Completed' : 'Mark as Completed'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {mockLesson.description}
            </p>
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Module Navigation</h4>
            
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-700 font-semibold flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                <span>1. Intro to Digital Assets</span>
              </div>
              <div className="p-3 rounded-xl hover:bg-slate-50 text-slate-600 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>2. Blockchain Tech</span>
              </div>
              <div className="p-3 rounded-xl hover:bg-slate-50 text-slate-600 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>3. Bitcoin Halving</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Lesson;
