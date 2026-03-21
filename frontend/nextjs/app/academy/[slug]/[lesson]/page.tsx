'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ChevronLeft, CheckCircle,
  BookOpen, Clock, PlayCircle, Download, ArrowRight,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const demoLesson = {
  title: 'What is Forex?',
  slug: 'what-is-forex',
  content: `
## Introduction to Forex

The foreign exchange market (Forex/FX) is the largest financial market in the world, with a daily trading volume exceeding **$7.5 trillion**. It operates 24 hours a day, 5 days a week, across major financial centers worldwide.

### What Makes Forex Unique?

Unlike stock markets, Forex has no centralized exchange. It operates through an electronic **over-the-counter (OTC)** network of banks, brokers, and individual traders.

### Key Characteristics

**1. High Liquidity** — The massive daily volume means you can enter and exit positions quickly at fair prices.

**2. 24-Hour Market** — Trading follows the sun around the globe: Sydney → Tokyo → London → New York.

**3. Leverage** — Forex brokers offer leverage ranging from 1:10 to 1:500, allowing you to control large positions with a small deposit.

**4. Low Barriers to Entry** — You can start with as little as $50-100 on many brokers.

### Who Trades Forex?

- **Central Banks** — Managing monetary policy and foreign reserves
- **Commercial Banks** — Processing international transactions
- **Hedge Funds** — Speculating on currency movements
- **Corporations** — Hedging international business exposure
- **Retail Traders** — Individual traders like you and me

### Currency Pairs

Currencies are always traded in pairs. The first currency is the **base**, and the second is the **quote**. For example:

- **EUR/USD** = How many US dollars does 1 Euro cost?
- **GBP/JPY** = How many Japanese Yen does 1 British Pound cost?

### Major Pairs

The most traded pairs involve the USD:
- EUR/USD (Euro/Dollar)
- GBP/USD (Pound/Dollar)
- USD/JPY (Dollar/Yen)
- USD/CHF (Dollar/Swiss Franc)

### Next Steps

Now that you understand the basics of what Forex is, let's dive deeper into currency pairs in the next lesson.
  `,
  video_url: '',
  video_duration: 780,
  resources_json: JSON.stringify([
    { name: 'Forex Basics PDF', url: '#', type: 'pdf' },
    { name: 'Currency Pair Cheat Sheet', url: '#', type: 'pdf' },
  ]),
};

const demoCourse = {
  title: 'Market Foundations',
  slug: 'market-foundations',
  lessons: [
    { id: '1', slug: 'what-is-forex', title: 'What is Forex?' },
    { id: '2', slug: 'currency-pairs', title: 'Currency Pairs Explained' },
    { id: '3', slug: 'how-market-works', title: 'How the Forex Market Works' },
    { id: '4', slug: 'pips-lots-leverage', title: 'Pips, Lots, and Leverage' },
    { id: '5', slug: 'market-sessions', title: 'Market Sessions and Timing' },
    { id: '6', slug: 'first-demo-trade', title: 'Your First Demo Trade' },
  ],
};

export default function LessonPage({ params }: { params: { slug: string; lesson: string } }) {
  const [lesson, setLesson] = useState(demoLesson);
  const [course, setCourse] = useState(demoCourse);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API}/courses/${params.slug}/${params.lesson}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setLesson(data.lesson);
          setCourse(data.course || demoCourse);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchLesson();
  }, [params.slug, params.lesson]);

  const markComplete = async () => {
    setCompleted(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API}/courses/progress/${lesson.slug}/complete`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (_) {}
  };

  // Find prev/next lessons
  const currentIdx = course.lessons?.findIndex((l: any) => l.slug === params.lesson) ?? -1;
  const prevLesson = currentIdx > 0 ? course.lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < (course.lessons?.length || 0) - 1 ? course.lessons[currentIdx + 1] : null;

  let resources: any[] = [];
  try { resources = JSON.parse(lesson.resources_json || '[]'); } catch (_) {}

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-4 w-32 bg-surface-100 rounded" />
        <div className="h-8 w-2/3 bg-surface-100 rounded" />
        <div className="h-[400px] bg-surface-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/academy" className="hover:text-brand-gold transition-colors">Academy</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/academy/${course.slug}`} className="hover:text-brand-gold transition-colors">{course.title}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-gold truncate">{lesson.title}</span>
        </div>

        {/* Lesson header */}
        <div className="mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            Lesson {currentIdx + 1} of {course.lessons?.length || 0}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{lesson.title}</h1>
          {lesson.video_duration && (
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Clock className="w-4 h-4" /> {Math.floor(lesson.video_duration / 60)} min
            </span>
          )}
        </div>

        {/* Video placeholder */}
        {lesson.video_url && (
          <div className="aspect-video bg-surface-100 rounded-2xl border border-white/5 mb-8 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-brand-gold/40" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-10
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-brand-gold prose-strong:font-semibold
          prose-ul:text-slate-300 prose-li:marker:text-brand-gold
          prose-code:text-brand-gold prose-code:bg-surface-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          {lesson.content.split('\n').map((line: string, i: number) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.slice(4)}</h3>;
            if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.slice(3)}</h2>;
            if (trimmed.startsWith('- ')) return <p key={i} className="ml-4">• {trimmed.slice(2)}</p>;
            if (!trimmed) return null;
            return <p key={i} dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />;
          })}
        </div>

        {/* Resources */}
        {resources.length > 0 && (
          <div className="bg-surface-100 rounded-2xl border border-white/5 p-5 mb-8">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-gold" /> Downloadable Resources
            </h3>
            <div className="space-y-2">
              {resources.map((r: any, i: number) => (
                <a key={i} href={r.url} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-brand-gold" />
                  <span className="text-sm text-slate-300 group-hover:text-white">{r.name}</span>
                  <span className="text-[10px] text-slate-600 uppercase">{r.type}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mark complete */}
        <div className="mb-8">
          <button
            onClick={markComplete}
            disabled={completed}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              completed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'bg-brand-gold text-dark-500 hover:bg-brand-gold-light'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            {completed ? 'Lesson Completed' : 'Mark as Complete'}
          </button>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/5">
          {prevLesson ? (
            <Link href={`/academy/${course.slug}/${prevLesson.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> {prevLesson.title}
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/academy/${course.slug}/${nextLesson.slug}`} className="flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors">
              {nextLesson.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link href={`/academy/${course.slug}`} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Back to Course <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
