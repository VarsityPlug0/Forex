'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { courses, levelColors, levelText } from '@/lib/courses';
import { useProgress } from '@/lib/useProgress';

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === Number(params.id));
  const router = useRouter();

  if (!course) {
    if (typeof window !== 'undefined') router.replace('/courses');
    return null;
  }

  const { progress, enroll, resetCourse, progressPercent } = useProgress(course.id);

  const handleEnroll = () => {
    enroll();
    router.push(`/courses/${course.id}/learn`);
  };

  const percent = progressPercent(course.lessons);
  const isEnrolled = !!progress?.enrolled;
  const isCompleted = !!progress?.completedAt;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/courses" className="text-white/40 hover:text-white transition-colors text-sm">
            ← All Courses
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-sm">{course.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Course Header */}
        <div className="mb-12">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-4"
            style={{ background: levelColors[course.level], color: levelText[course.level] }}
          >
            {course.level}
          </span>
          <h1 className="text-4xl font-black mb-4 tracking-tight">{course.title}</h1>
          <p className="text-white/50 text-lg mb-6 max-w-2xl">{course.overview}</p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <span>{course.lessons} lessons</span>
            <span>·</span>
            <span>{course.duration}</span>
            {isEnrolled && (
              <>
                <span>·</span>
                <span style={{ color: levelText[course.level] }}>{percent}% complete</span>
              </>
            )}
          </div>
          {/* Progress bar */}
          {isEnrolled && (
            <div className="mt-4 h-1 bg-white/10 rounded-full max-w-md">
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, background: levelText[course.level] }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Curriculum */}
          <div className="lg:col-span-2">
            <h2 className="text-white font-bold text-lg mb-4">Curriculum</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {course.curriculum.map((lesson, index) => {
                const done = progress?.completedLessons.includes(index) ?? false;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-5 py-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: done ? levelColors[course.level] : 'rgba(255,255,255,0.08)',
                        color: done ? levelText[course.level] : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${done ? 'text-white/40 line-through' : 'text-white/70'}`}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-white/25 text-xs flex-shrink-0">{lesson.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enroll / Continue Card */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl border border-white/10 p-6 sticky top-8"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {isCompleted ? (
                <>
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="text-white font-bold text-lg">Completed!</div>
                    <p className="text-white/40 text-sm mt-1">You finished this course</p>
                  </div>
                  <Link
                    href={`/courses/${course.id}/complete`}
                    className="w-full py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors flex items-center justify-center mb-3"
                  >
                    View Certificate
                  </Link>
                  <button
                    onClick={() => { resetCourse(); router.push(`/courses/${course.id}/learn`); }}
                    className="w-full py-3 rounded-full border border-white/20 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors mb-3"
                  >
                    ↺ Redo Course
                  </button>
                </>
              ) : isEnrolled ? (
                <>
                  <div className="text-white font-black text-xl mb-1">{percent}%</div>
                  <p className="text-white/40 text-sm mb-4">
                    {progress!.completedLessons.length} of {course.lessons} lessons done
                  </p>
                  <div className="h-1 bg-white/10 rounded-full mb-6">
                    <div
                      className="h-1 rounded-full"
                      style={{ width: `${percent}%`, background: levelText[course.level] }}
                    />
                  </div>
                  <Link
                    href={`/courses/${course.id}/learn`}
                    className="w-full py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors flex items-center justify-center mb-3"
                  >
                    Continue Learning
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-white font-black text-2xl mb-1">Free</div>
                  <p className="text-white/40 text-sm mb-6">Full access included</p>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors mb-3"
                  >
                    Enroll Now
                  </button>
                </>
              )}
              <Link
                href="/courses"
                className="w-full py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                Browse all courses
              </Link>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Lessons</span>
                  <span className="text-white/70">{course.lessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Duration</span>
                  <span className="text-white/70">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Level</span>
                  <span style={{ color: levelText[course.level] }}>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
