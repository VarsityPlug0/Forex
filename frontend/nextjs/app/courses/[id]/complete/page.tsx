'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { courses, levelColors, levelText } from '@/lib/courses';
import { useProgress } from '@/lib/useProgress';

type CertState = 'name-input' | 'generating' | 'ready' | 'error';

export default function CompletePage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === Number(params.id));
  const router = useRouter();
  const { progress } = useProgress(course?.id ?? 0);
  const [show, setShow] = useState(false);

  // Certificate state
  const [certState, setCertState] = useState<CertState>('name-input');
  const [studentName, setStudentName] = useState('');
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [certId, setCertId] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!course) return;
    if (!progress?.completedAt) {
      router.replace(`/courses/${course.id}`);
      return;
    }
    setTimeout(() => setShow(true), 100);
    // Pre-fill name from localStorage
    const saved = typeof window !== 'undefined' ? localStorage.getItem('studentName') : '';
    if (saved) setStudentName(saved);
  }, [course, progress, router]);

  if (!course || !progress?.completedAt) return null;

  const completedDate = new Date(progress.completedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const nextCourse = courses[courses.findIndex((c) => c.id === course.id) + 1];

  const handleGenerate = async () => {
    const name = studentName.trim() || 'Trader';
    if (typeof window !== 'undefined') localStorage.setItem('studentName', name);

    setCertState('generating');
    setCertError(null);

    try {
      const res = await fetch('/api/v1/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name,
          courseTitle: course.title,
          courseLevel: course.level,
          completedDate,
          lessons: course.lessons,
          duration: course.duration,
          courseId: course.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.publicUrl) {
        setCertUrl(data.publicUrl);
        setCertId(data.certificateId);
        setCertState('ready');
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      setCertError(err instanceof Error ? err.message : 'Something went wrong');
      setCertState('error');
    }
  };

  const handleDownload = () => {
    if (!certUrl) return;
    const a = document.createElement('a');
    a.href = certUrl;
    a.download = `ForexEdge-Certificate-${course.title.replace(/\s+/g, '-')}.jpg`;
    a.click();
  };

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #0a0e1a 0%, #0f1117 60%, #0d1020 100%)' }}>

      <div
        className="max-w-3xl w-full transition-all duration-700 space-y-6"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* ── Completion header ─────────────────────────────────────── */}
        <div className="text-center mb-2">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-1">Course Completed</p>
          <h1 className="text-3xl font-black tracking-tight">{course.title}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: levelColors[course.level], color: levelText[course.level] }}>
              {course.level}
            </span>
            <span className="text-white/30 text-xs">{course.lessons} lessons · {course.duration}</span>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Lessons', value: String(course.lessons) },
            { label: 'Duration', value: course.duration },
            { label: 'Completed', value: completedDate.split(',')[0] },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white/35 text-xs tracking-widest uppercase mb-1">{label}</p>
              <p className="text-white font-bold text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Certificate section ───────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.03)' }}>

          {/* Section header */}
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(251,191,36,0.12)', background: 'rgba(251,191,36,0.05)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#fbbf24' }} />
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-widest">Your Certificate</p>
            <span className="ml-auto text-white/20 text-xs">Powered by Gemini AI</span>
          </div>

          <div className="p-6">

            {/* NAME INPUT STATE */}
            {certState === 'name-input' && (
              <div className="flex flex-col items-center gap-5 py-4">
                <p className="text-white/60 text-sm text-center max-w-sm">
                  Enter your name exactly as you want it to appear on your certificate.
                </p>
                <div className="w-full max-w-sm flex flex-col gap-3">
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && studentName.trim() && handleGenerate()}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl text-white text-center font-semibold text-lg outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(251,191,36,0.3)',
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!studentName.trim()}
                    className="w-full py-3 rounded-xl text-sm font-bold tracking-wide disabled:opacity-40 transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#0a0e1a' }}
                  >
                    ✦ Generate My Certificate
                  </button>
                </div>
              </div>
            )}

            {/* GENERATING STATE */}
            {certState === 'generating' && (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                {/* Animated ring */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(from 0deg, #d97706, #fbbf24, #fde68a, #d97706)', animation: 'spin 1.5s linear infinite' }} />
                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center"
                    style={{ background: '#0a0e1a' }}>
                    <span className="text-xl">🏅</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-amber-300 text-sm font-semibold">Gemini is crafting your certificate…</p>
                  <p className="text-white/30 text-xs mt-1">This takes about 15–30 seconds</p>
                </div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {/* ERROR STATE */}
            {certState === 'error' && (
              <div className="flex flex-col items-center gap-4 py-6">
                <p className="text-red-400 text-sm">{certError}</p>
                <button onClick={() => setCertState('name-input')}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
                  Try Again
                </button>
              </div>
            )}

            {/* READY STATE — show certificate */}
            {certState === 'ready' && certUrl && (
              <div className="flex flex-col gap-4">
                {/* Certificate image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: '1px solid rgba(251,191,36,0.3)', boxShadow: '0 0 60px rgba(251,191,36,0.08)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={certUrl}
                    alt={`Certificate of Completion — ${course.title}`}
                    className="w-full block"
                    style={{ background: '#0a0e1a' }}
                  />
                </div>

                {/* Certificate ID */}
                {certId && (
                  <p className="text-center text-white/25 text-xs font-mono tracking-widest">
                    Certificate ID: {certId}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold tracking-wide transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#0a0e1a' }}
                  >
                    ↓ Download Certificate
                  </button>
                  <button
                    onClick={() => { setCertUrl(null); setCertId(null); setCertState('name-input'); }}
                    className="px-4 py-3 rounded-xl text-xs font-semibold text-white/50 hover:text-white/80 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    ↺ Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {nextCourse ? (
            <Link href={`/courses/${nextCourse.id}`}
              className="flex-1 py-3 rounded-full bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors text-center">
              Next: {nextCourse.title} →
            </Link>
          ) : (
            <Link href="/courses"
              className="flex-1 py-3 rounded-full bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors text-center">
              Browse More Courses →
            </Link>
          )}
          <Link href="/courses"
            className="flex-1 py-3 rounded-full text-white text-sm font-medium hover:bg-white/5 transition-colors text-center"
            style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
            All Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
