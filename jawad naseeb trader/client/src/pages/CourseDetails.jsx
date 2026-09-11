import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, getLessons } from '../services/api';
import Loader from '../components/Loader';
import { Clock, User, Award, CheckCircle, PlayCircle, Lock, BookOpen } from 'lucide-react';

const CourseDetails = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockCourse = {
    _id: slug || '1',
    title: 'Complete Crypto & Blockchain Masterclass',
    category: 'Cryptocurrency Basics',
    difficulty: 'Beginner',
    duration: '4.5 hrs',
    description: 'Everything you need to know about Bitcoin, wallets, security, and market fundamentals. Designed for beginners who want to build solid financial and crypto literacy.',
    instructor: 'Jawad Naseeb'
  };

  const mockLessons = [
    { _id: 'l1', title: 'Introduction to Cryptocurrency & Digital Assets', duration: '15 mins', order: 1 },
    { _id: 'l2', title: 'How Blockchain Technology Works', duration: '25 mins', order: 2 },
    { _id: 'l3', title: 'Bitcoin Architecture & Halving Cycles', duration: '30 mins', order: 3 },
    { _id: 'l4', title: 'Crypto Wallets & Security Best Practices', duration: '20 mins', order: 4 },
    { _id: 'l5', title: 'Order Books, Exchanges & Market Basics', duration: '35 mins', order: 5 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courseData } = await getCourseById(slug);
        setCourse(courseData);
        const { data: lessonData } = await getLessons(courseData._id);
        setLessons(lessonData.length > 0 ? lessonData : mockLessons);
      } catch (err) {
        setCourse(mockCourse);
        setLessons(mockLessons);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <Loader label="Loading course syllabus..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Banner Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs bg-white/10 border border-white/20 text-purple-200 px-3 py-1 rounded-full font-semibold">
            {course.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{course.title}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>Duration: <strong className="text-white">{course.duration}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Level: <strong className="text-white">{course.difficulty}</strong></span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to={`/lesson/${course._id}/${lessons[0]?._id || 'l1'}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-500/30 transition-all"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Start Course Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Syllabus / Lesson List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Course Syllabus</h3>
          <p className="text-sm text-slate-500">{lessons.length} structured lessons included in this module.</p>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson._id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    {lesson.title}
                  </h4>
                  <span className="text-xs text-slate-400">{lesson.duration || '20 mins'}</span>
                </div>
              </div>

              <Link
                to={`/lesson/${course._id}/${lesson._id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 group-hover:bg-purple-600 group-hover:text-white transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Watch</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CourseDetails;
