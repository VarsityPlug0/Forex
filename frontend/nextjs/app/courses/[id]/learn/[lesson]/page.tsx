'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { courses, levelColors, levelText } from '@/lib/courses';
import { useProgress } from '@/lib/useProgress';

const LessonVisual = dynamic(() => import('@/components/LessonVisual'), { ssr: false });

const BOLD_LINE_RE = /^\*\*([^*]+)\*\*$/;
const BOLD_INLINE_RE = /(\*\*[^*]+\*\*)/g;

function renderInline(line: string) {
  const parts = line.split(BOLD_INLINE_RE);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function parseTable(lines: string[]): JSX.Element {
  const rows = lines.map(l => l.split('|').map(c => c.trim()).filter(Boolean));
  const headers = rows[0] ?? [];
  const body = rows.filter((_, i) => i !== 0 && !rows[i].every(c => /^[-:]+$/.test(c)));
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 text-white font-semibold text-xs tracking-wide border-b border-white/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-white/65 text-xs border-b border-white/5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderContent(text: string): JSX.Element[] {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Table block
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<div key={`tbl-${i}`}>{parseTable(tableLines)}</div>);
      continue;
    }

    // Section heading (full line **bold**)
    const headingMatch = line.match(BOLD_LINE_RE);
    if (headingMatch) {
      elements.push(
        <div key={i} className="flex items-center gap-3 mt-6 mb-2">
          <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.4)' }} />
          <h3 className="text-white font-bold text-base">{headingMatch[1]}</h3>
        </div>
      );
      i++;
      continue;
    }

    // Warning / callout line
    if (line.startsWith('⚠️') || line.includes('⚠️')) {
      elements.push(
        <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3 my-3"
          style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.25)' }}>
          <span style={{ color: '#fb923c', fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,186,116,0.9)' }}>
            {renderInline(line.replace('⚠️', '').trim())}
          </p>
        </div>
      );
      i++;
      continue;
    }

    // Takeaway / success line
    if (line.startsWith('✅')) {
      elements.push(
        <div key={i} className="flex items-start gap-3 py-1.5">
          <span style={{ color: '#4ade80', fontSize: 14, flexShrink: 0, marginTop: 2 }}>✅</span>
          <p className="text-sm leading-relaxed text-white/75">{renderInline(line.replace('✅', '').trim())}</p>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list — collect consecutive bullets
    if (line.startsWith('- ')) {
      const bullets: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        bullets.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2 ml-1">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2.5 text-sm text-white/65 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.35)' }} />
              {renderInline(b)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-2 ml-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-3 text-sm text-white/65 leading-relaxed">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                {ii + 1}
              </span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Code fence
    if (line.startsWith('```')) {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-white/65 text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Confetti dot
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const dots = [
    { x: -30, y: -40, color: '#4ade80', delay: 0 },
    { x: 30, y: -50, color: '#60a5fa', delay: 50 },
    { x: -50, y: -20, color: '#f59e0b', delay: 100 },
    { x: 50, y: -25, color: '#f87171', delay: 75 },
    { x: 0, y: -55, color: '#a78bfa', delay: 25 },
    { x: -20, y: -45, color: '#34d399', delay: 150 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: d.color,
            top: '50%',
            left: '50%',
            animation: `confettiBurst 0.6s ease-out ${d.delay}ms forwards`,
            transform: 'translate(-50%, -50%)',
            '--tx': `${d.x}px`,
            '--ty': `${d.y}px`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confettiBurst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function LessonPage({ params }: { params: { id: string; lesson: string } }) {
  const course = courses.find((c) => c.id === Number(params.id));
  const lessonIndex = Number(params.lesson);
  const router = useRouter();
  const [marking, setMarking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Scroll to top of lesson content whenever lesson index changes
  useEffect(() => {
    const el = document.getElementById('lesson-top');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonIndex]);

  const goTo = (index: number) => {
    if (transitioning) return;
    setTransitioning(true);
    const url = index === course!.lessons ? `/courses/${course!.id}/complete` : `/courses/${course!.id}/learn/${index}`;
    router.push(url);
    setTimeout(() => setTransitioning(false), 600);
  };

  const { progress, loaded, completeLesson, uncompleteLesson, isLessonComplete, progressPercent } = useProgress(course?.id ?? 0);

  useEffect(() => {
    if (loaded && course && !progress?.enrolled) {
      router.replace(`/courses/${course.id}`);
    }
  }, [loaded, course, progress, router]);

  if (!course || !loaded || !progress?.enrolled) return null;

  const lesson = course.curriculum[lessonIndex];
  if (!lesson) {
    router.replace(`/courses/${course.id}/learn`);
    return null;
  }

  const done = isLessonComplete(lessonIndex);
  const isLast = lessonIndex === course.lessons - 1;
  const prevLesson = lessonIndex > 0 ? lessonIndex - 1 : null;
  const nextLesson = lessonIndex < course.lessons - 1 ? lessonIndex + 1 : null;
  const percent = progressPercent(course.lessons);
  const xp = (lessonIndex + 1) * 5;

  const handleComplete = async () => {
    setMarking(true);
    setShowConfetti(true);
    completeLesson(lessonIndex, course.lessons);
    await new Promise((r) => setTimeout(r, 700));
    setShowConfetti(false);
    if (isLast) {
      router.push(`/courses/${course.id}/complete`);
    } else {
      router.push(`/courses/${course.id}/learn/${lessonIndex + 1}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#111111] text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: '#111111' }}>
        <Link href={`/courses/${course.id}/learn`} className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Lessons
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
            ⚡ {xp} XP
          </span>
          <div className="w-28 h-1 bg-white/10 rounded-full hidden sm:block">
            <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: levelText[course.level] }} />
          </div>
          <span className="text-white/40 text-xs">{percent}%</span>
        </div>
      </div>

      {/* Transitioning overlay */}
      {transitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none" style={{ background: 'rgba(17,17,17,0.6)', backdropFilter: 'blur(2px)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        </div>
      )}

      <div id="lesson-top" className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Lesson meta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
              style={{ background: levelColors[course.level], color: levelText[course.level] }}>
              {course.level}
            </span>
            <span className="text-white/25 text-xs">Lesson {lessonIndex + 1} of {course.lessons}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/35 text-xs">{lesson.duration}</span>
            {done && (
              <>
                <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                  ✓ Completed
                </span>
                <button
                  onClick={() => uncompleteLesson(lessonIndex)}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-2"
                >
                  Redo
                </button>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{lesson.title}</h1>
        </div>

        {/* Visual diagram */}
        <div className="mb-6 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <LessonVisual title={lesson.title} courseId={course.id} />
        </div>

        {/* Content card */}
        <div className="rounded-2xl mb-8 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="p-6 sm:p-8 space-y-1">
            {renderContent(lesson.content)}
          </div>
        </div>

        {/* Navigation + Complete */}
        <div className="flex items-center justify-between gap-4 pb-10">
          <div className="flex-1">
            {prevLesson !== null && (
              <button
                onClick={() => goTo(prevLesson)}
                className="inline-flex flex-col gap-0.5 px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-white/35 text-xs flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                  Previous
                </span>
                <span className="text-white/60 text-xs font-medium truncate max-w-[140px]">
                  {course.curriculum[prevLesson]?.title}
                </span>
              </button>
            )}
          </div>

          <div className="relative">
            <Confetti active={showConfetti} />
            {done ? (
              nextLesson !== null ? (
                <button
                  onClick={() => goTo(nextLesson)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors"
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              ) : (
                <button
                  onClick={() => goTo(course.lessons)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-colors"
                >
                  Get Certificate 🎉
                </button>
              )
            ) : (
              <button
                onClick={handleComplete}
                disabled={marking}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-all disabled:opacity-60"
                style={{ boxShadow: marking ? 'none' : '0 0 20px rgba(255,255,255,0.15)' }}
              >
                {marking ? '⚡ +5 XP' : isLast ? 'Complete Course ✓' : 'Mark Complete'}
                {!marking && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            {nextLesson !== null && !done && (
              <button
                onClick={() => goTo(nextLesson)}
                className="inline-flex flex-col gap-0.5 px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 transition-colors items-end"
              >
                <span className="text-white/35 text-xs flex items-center gap-1">
                  Skip
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
                <span className="text-white/60 text-xs font-medium truncate max-w-[140px]">
                  {course.curriculum[nextLesson]?.title}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
