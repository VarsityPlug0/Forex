'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { courses, levelColors, levelText } from '@/lib/courses';
import { useProgress } from '@/lib/useProgress';

export default function CompletePage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === Number(params.id));
  const router = useRouter();
  const { progress } = useProgress(course?.id ?? 0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!course) return;
    if (!progress?.completedAt) {
      router.replace(`/courses/${course.id}`);
      return;
    }
    setTimeout(() => setShow(true), 100);
  }, [course, progress, router]);

  if (!course || !progress?.completedAt) return null;

  const completedDate = new Date(progress.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nextCourseIndex = courses.findIndex((c) => c.id === course.id);
  const nextCourse = courses[nextCourseIndex + 1];

  return (
    <main className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center px-6 py-16">
      <div
        className="max-w-2xl w-full transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* Certificate card */}
        <div
          className="rounded-3xl border border-white/15 p-10 text-center mb-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            boxShadow: '0 0 80px rgba(255,255,255,0.04)',
          }}
        >
          {/* Icon */}
          <div className="text-6xl mb-6">🏆</div>

          {/* Certificate of completion */}
          <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Certificate of Completion</p>
          <h1 className="text-3xl font-black mb-1 tracking-tight">Well done!</h1>
          <p className="text-white/50 text-base mb-6">You've successfully completed</p>

          {/* Course name */}
          <div
            className="inline-block px-6 py-3 rounded-2xl border border-white/10 mb-6"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div className="text-white font-black text-xl">{course.title}</div>
            <span
              className="inline-block px-3 py-0.5 rounded-full text-xs font-medium mt-2"
              style={{ background: levelColors[course.level], color: levelText[course.level] }}
            >
              {course.level}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Lessons', value: course.lessons },
              { label: 'Duration', value: course.duration },
              { label: 'Completed', value: completedDate.split(',')[0] },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-white/10 p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-white/35 text-xs tracking-widest uppercase mb-1">{label}</div>
                <div className="text-white font-bold text-sm">{value}</div>
              </div>
            ))}
          </div>

          <p className="text-white/25 text-xs">Completed on {completedDate}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {nextCourse ? (
            <Link
              href={`/courses/${nextCourse.id}`}
              className="flex-1 py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors text-center"
            >
              Next: {nextCourse.title} →
            </Link>
          ) : (
            <Link
              href="/courses"
              className="flex-1 py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors text-center"
            >
              Browse More Courses →
            </Link>
          )}
          <Link
            href="/courses"
            className="flex-1 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors text-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            All Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
