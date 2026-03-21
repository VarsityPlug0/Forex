'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, BookOpen, Clock, BarChart3,
  PlayCircle, FileText, CheckCircle, Circle, Lock,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const demoCourse = {
  title: 'Market Foundations',
  slug: 'market-foundations',
  description: 'Learn the fundamental concepts of Forex trading. This module covers everything from basic terminology to understanding how the global currency market operates.',
  difficulty: 'beginner',
  estimated_hours: 6,
  thumbnail_url: '',
  category: { name: 'Market Foundations', slug: 'market-foundations' },
  lessons: [
    { id: '1', title: 'What is Forex?', slug: 'what-is-forex', is_published: true, video_url: 'https://...', video_duration: 780, sort_order: 1 },
    { id: '2', title: 'Currency Pairs Explained', slug: 'currency-pairs', is_published: true, video_duration: 640, sort_order: 2 },
    { id: '3', title: 'How the Forex Market Works', slug: 'how-market-works', is_published: true, video_duration: 920, sort_order: 3 },
    { id: '4', title: 'Pips, Lots, and Leverage', slug: 'pips-lots-leverage', is_published: true, video_duration: 560, sort_order: 4 },
    { id: '5', title: 'Market Sessions and Timing', slug: 'market-sessions', is_published: true, video_duration: 480, sort_order: 5 },
    { id: '6', title: 'Your First Demo Trade', slug: 'first-demo-trade', is_published: true, video_url: 'https://...', video_duration: 1200, sort_order: 6 },
  ],
  userProgress: [
    { lesson_id: '1', completed: true },
    { lesson_id: '2', completed: true },
    { lesson_id: '3', completed: false },
  ],
};

const diffStyle: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  advanced: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, setCourse] = useState(demoCourse);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API}/courses/${params.slug}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setCourse(data.course);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchCourse();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-4 w-24 bg-surface-100 rounded" />
        <div className="h-10 w-1/2 bg-surface-100 rounded" />
        <div className="h-[300px] bg-surface-100 rounded-2xl" />
      </div>
    );
  }

  const completedLessons = course.userProgress?.filter((p: any) => p.completed).length || 0;
  const totalLessons = course.lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const diff = diffStyle[course.difficulty] || diffStyle.beginner;

  const isCompleted = (lessonId: string) =>
    course.userProgress?.some((p: any) => p.lesson_id === lessonId && p.completed);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m} min` : '';
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/academy" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Academy
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-gold">{course.title}</span>
        </div>

        {/* Course header */}
        <div className="bg-surface-100 rounded-2xl border border-white/5 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
              {course.difficulty}
            </span>
            {course.category && (
              <span className="text-xs text-slate-500">{course.category.name}</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{course.title}</h1>
          <p className="text-slate-400 leading-relaxed mb-6">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> {totalLessons} lessons
            </span>
            {course.estimated_hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> ~{course.estimated_hours}h total
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" /> {progressPercent}% complete
            </span>
          </div>

          {/* Progress bar */}
          {totalLessons > 0 && (
            <div className="mt-5">
              <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-gold to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1.5">{completedLessons} of {totalLessons} completed</p>
            </div>
          )}
        </div>

        {/* Lessons list */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-gold" /> Course Lessons
          </h2>

          {course.lessons?.map((lesson: any, i: number) => {
            const completed = isCompleted(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/academy/${course.slug}/${lesson.slug}`}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                  completed
                    ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20'
                    : 'bg-surface-100 border-white/5 hover:border-brand-gold/20'
                }`}
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-brand-gold transition-colors" />
                  )}
                </div>

                {/* Number */}
                <span className="text-sm font-mono text-slate-600 w-6">{String(i + 1).padStart(2, '0')}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${completed ? 'text-emerald-300' : 'text-white'}`}>
                    {lesson.title}
                  </p>
                </div>

                {/* Type + Duration */}
                <div className="flex items-center gap-3 shrink-0">
                  {lesson.video_url ? (
                    <PlayCircle className="w-4 h-4 text-blue-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-500" />
                  )}
                  {lesson.video_duration && (
                    <span className="text-xs text-slate-600">{formatDuration(lesson.video_duration)}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-gold transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
