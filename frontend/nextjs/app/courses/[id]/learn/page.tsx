'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { courses, levelColors, levelText } from '@/lib/courses';
import { useProgress } from '@/lib/useProgress';

export default function LearnPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === Number(params.id));
  const router = useRouter();

  const { progress, loaded, progressPercent } = useProgress(course?.id ?? 0);

  useEffect(() => {
    if (loaded && course && !progress?.enrolled) {
      router.replace(`/courses/${course.id}`);
    }
  }, [loaded, course, progress, router]);

  if (!course || !loaded || !progress?.enrolled) return null;

  const percent = progressPercent(course.lessons);
  const nextLesson = course.curriculum.findIndex((_, i) => !progress.completedLessons.includes(i));
  const isCompleted = !!progress.completedAt;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/courses/${course.id}`} className="text-white/40 hover:text-white transition-colors text-sm">
              ← Course Overview
            </Link>
          </div>
          <span className="text-white/40 text-sm">{percent}% complete</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Course title + progress */}
        <div className="mb-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-3"
            style={{ background: levelColors[course.level], color: levelText[course.level] }}
          >
            {course.level}
          </span>
          <h1 className="text-3xl font-black mb-3">{course.title}</h1>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, background: levelText[course.level] }}
              />
            </div>
            <span className="text-white/50 text-sm w-12 text-right">{percent}%</span>
          </div>
          <p className="text-white/40 text-sm">
            {progress.completedLessons.length} of {course.lessons} lessons completed
          </p>
        </div>

        {/* Completed banner */}
        {isCompleted && (
          <div
            className="rounded-2xl border border-white/10 p-6 mb-8 flex items-center justify-between"
            style={{ background: 'rgba(74,222,128,0.06)' }}
          >
            <div>
              <div className="text-white font-bold mb-1">🎉 Course Complete!</div>
              <p className="text-white/50 text-sm">You've finished all lessons.</p>
            </div>
            <Link
              href={`/courses/${course.id}/complete`}
              className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Get Certificate
            </Link>
          </div>
        )}

        {/* Continue button */}
        {!isCompleted && nextLesson >= 0 && (
          <Link
            href={`/courses/${course.id}/learn/${nextLesson}`}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors mb-10"
          >
            {progress.completedLessons.length === 0 ? 'Start First Lesson' : 'Continue'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}

        {/* Lesson list */}
        <h2 className="text-white font-bold text-lg mb-4">Lessons</h2>
        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {course.curriculum.map((lesson, index) => {
            const done = progress.completedLessons.includes(index);
            const isCurrent = index === nextLesson && !isCompleted;
            return (
              <Link
                key={index}
                href={`/courses/${course.id}/learn/${index}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                style={isCurrent ? { background: 'rgba(255,255,255,0.06)' } : undefined}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: done ? levelColors[course.level] : isCurrent ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                    color: done ? levelText[course.level] : isCurrent ? '#fff' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {done ? '✓' : index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${done ? 'text-white/35 line-through' : isCurrent ? 'text-white' : 'text-white/65'}`}>
                    {lesson.title}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white/25 text-xs">{lesson.duration}</span>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                      Up next
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
