import Link from 'next/link';
import { courses, levelColors, levelText } from '@/lib/courses';

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">
            ← Back
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-sm">Courses</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/60 text-xs font-medium tracking-widest uppercase mb-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
            </svg>
            All Courses
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Master Forex Trading</h1>
          <p className="text-white/50 text-lg max-w-xl">
            Structured courses from beginner to advanced. Learn at your own pace.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="rounded-2xl border border-white/10 p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Level badge */}
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                  style={{ background: levelColors[course.level], color: levelText[course.level] }}
                >
                  {course.level}
                </span>
                <span className="text-white/30 text-xs">{course.duration}</span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-white font-bold text-lg mb-2 leading-tight">{course.title}</h2>
                <p className="text-white/45 text-sm leading-relaxed">{course.description}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <span className="text-white/35 text-xs">{course.lessons} lessons</span>
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  Start course
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
