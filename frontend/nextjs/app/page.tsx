import Link from 'next/link';
import dynamic from 'next/dynamic';

const WaveCanvas = dynamic(() => import('@/components/WaveCanvas'), { ssr: false });

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#111111] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Animated Wave Background */}
        <WaveCanvas />

        {/* Subtle radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(60,60,60,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/70 text-xs font-medium tracking-widest uppercase mb-10"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
            </svg>
            By Bevan Ndzhaka Mkhabele · Age 22
          </div>

          {/* Heading */}
          <h1 className="font-black leading-[1.05] mb-6 tracking-tight text-balance">
            <span className="block text-white" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              Learn forex trading
            </span>
            <span className="block text-white/40" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              the way I learned it
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/50 max-w-2xl leading-relaxed mb-6 text-balance"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
          >
            I&apos;m Bevan — a 22-year-old self-taught forex trader. I built this platform to share everything
            I&apos;ve learned: from reading price action and managing risk, to running PAMM accounts and
            building automated strategies. No fluff. Just real skills that work in live markets.
          </p>

          {/* What I teach */}
          <div
            className="grid grid-cols-2 gap-3 max-w-xl w-full mb-10 text-left"
            style={{ fontSize: '13px' }}
          >
            {[
              { icon: '📈', text: 'Technical Analysis & Price Action' },
              { icon: '🛡️', text: 'Risk Management & Position Sizing' },
              { icon: '🤖', text: 'Automated Trading with Expert Advisors' },
              { icon: '💼', text: 'PAMM Accounts & Managed Investing' },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span className="text-white/70 font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 mb-10 flex-wrap justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors"
            >
              Start Learning
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center px-7 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              Browse courses
            </Link>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {['Live TradingView Charts', 'PAMM Training', 'Beginner to Advanced', 'EA Development'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-white/15 text-white/50 text-xs font-medium tracking-widest uppercase"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="relative z-10 w-full px-6 pb-8">
        <div
          className="max-w-4xl mx-auto rounded-2xl border border-white/10 grid grid-cols-3 divide-x divide-white/10"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {[
            { label: 'Years Trading', value: '4+' },
            { label: 'Course Lessons', value: '77' },
            { label: 'Strategies Taught', value: '12+' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-8 px-4"
            >
              <span className="text-white/35 text-[10px] font-medium tracking-widest uppercase mb-2">
                {label}
              </span>
              <span className="text-white text-3xl font-bold tracking-tight">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
