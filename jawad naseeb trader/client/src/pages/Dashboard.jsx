import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart2, User, TrendingUp, PlayCircle, ArrowRight, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const enrolledCourses = [
    { id: '1', title: 'Complete Crypto & Blockchain Masterclass', progress: 65, category: 'Cryptocurrency Basics', difficulty: 'Beginner' },
    { id: '2', title: 'Advanced Technical Analysis', progress: 30, category: 'Technical Analysis', difficulty: 'Advanced' },
    { id: '3', title: 'Risk Management Essentials', progress: 90, category: 'Risk Management', difficulty: 'Intermediate' }
  ];

  const stats = [
    { label: 'Enrolled Courses', value: '3', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Completed Lessons', value: '12', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Learning Hours', value: '8.5h', icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Account Role', value: user?.role || 'User', icon: User, color: 'bg-orange-50 text-orange-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-purple-300 text-sm font-semibold uppercase tracking-wider">My Learning Dashboard</p>
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.name || 'Trader'}! ??</h1>
          <p className="text-slate-300 text-sm">Continue your learning journey and track your market education progress.</p>
        </div>
        <Link to="/education" className="px-6 py-3 rounded-2xl bg-white text-purple-700 font-bold text-sm hover:bg-purple-50 shadow-md flex items-center gap-2 shrink-0 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span>Browse Courses</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">My Learning Progress</h2>
          <Link to="/education" className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
            <span>Find More</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5 hover:shadow-md transition-all">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{course.category}</span>
                <h4 className="font-bold text-slate-900 mt-2 leading-snug">{course.title}</h4>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress</span>
                  <span className={course.progress >= 80 ? 'text-emerald-600' : 'text-purple-600'}>{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${course.progress >= 80 ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                    style={{ width: course.progress + '%' }}
                  />
                </div>
              </div>

              <Link
                to={'/education/' + course.id}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Continue Learning</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <h3 className="font-bold text-xl text-slate-900 mb-6">Profile Information</h3>
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center">
            {user?.name?.substring(0, 2) || 'JN'}
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-lg text-slate-900">{user?.name || 'User'}</h4>
            <p className="text-sm text-slate-500">{user?.email || 'user@example.com'}</p>
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full">{user?.role || 'User'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
