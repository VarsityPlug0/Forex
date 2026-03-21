'use client';

import { memo, lazy, Suspense } from 'react';
import { Block } from '@/lib/lesson-types';

const LessonDiagram = lazy(() => import('./LessonDiagram'));

const calloutStyles = {
  info: {
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.3)',
    icon: 'ℹ',
    iconColor: 'rgb(96,165,250)',
    titleColor: 'rgb(147,197,253)',
  },
  warning: {
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.3)',
    icon: '⚠',
    iconColor: 'rgb(251,146,60)',
    titleColor: 'rgb(253,186,116)',
  },
  tip: {
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.3)',
    icon: '✦',
    iconColor: 'rgb(74,222,128)',
    titleColor: 'rgb(134,239,172)',
  },
  key: {
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.3)',
    icon: '◆',
    iconColor: 'rgb(167,139,250)',
    titleColor: 'rgb(196,181,253)',
  },
};

const BOLD_RE = /(\*\*[^*]+\*\*)/g;

function renderInline(text: string) {
  const parts = text.split(BOLD_RE);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function LessonRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        switch (block.t) {

          case 'intro':
            return (
              <div
                key={idx}
                className="pl-4 py-1"
                style={{ borderLeft: '3px solid rgba(255,255,255,0.2)' }}
              >
                <p className="text-white/80 text-base italic leading-relaxed">{block.text}</p>
              </div>
            );

          case 'heading':
            return (
              <div key={idx} className="mt-8 mb-1">
                <h3 className="text-white font-bold text-lg">{block.text}</h3>
                <div className="h-px mt-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
            );

          case 'text':
            return (
              <p key={idx} className="text-white/65 text-sm leading-relaxed">
                {renderInline(block.text)}
              </p>
            );

          case 'bullets':
            return (
              <div key={idx} className="space-y-1">
                {block.title && (
                  <p className="text-white/70 text-sm font-semibold mb-2">{block.title}</p>
                )}
                <ul className="space-y-1.5">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/65 leading-relaxed">
                      <span
                        className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.35)' }}
                      />
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'numbered':
            return (
              <div key={idx} className="space-y-1">
                {block.title && (
                  <p className="text-white/70 text-sm font-semibold mb-2">{block.title}</p>
                )}
                <ol className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/65 leading-relaxed">
                      <span
                        className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white/50 mt-0.5"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        {i + 1}
                      </span>
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case 'callout': {
            const s = calloutStyles[block.variant];
            return (
              <div
                key={idx}
                className="rounded-xl p-4"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0 mt-0.5" style={{ color: s.iconColor }}>{s.icon}</span>
                  <div>
                    {block.title && (
                      <p className="text-sm font-semibold mb-1" style={{ color: s.titleColor }}>{block.title}</p>
                    )}
                    <p className="text-sm text-white/70 leading-relaxed">{renderInline(block.text)}</p>
                  </div>
                </div>
              </div>
            );
          }

          case 'table':
            return (
              <div key={idx} className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {block.headers.map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-white/70 font-semibold text-xs uppercase tracking-wider border-b border-white/10">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        style={{ background: ri % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                      >
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-white/60 border-b border-white/5 leading-snug">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'example':
            return (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderLeft: '3px solid rgba(255,255,255,0.2)',
                }}
              >
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2 font-semibold">Example</p>
                <p className="text-white/80 text-sm font-semibold mb-2">{block.title}</p>
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{block.body}</p>
              </div>
            );

          case 'steps':
            return (
              <div key={idx} className="space-y-0">
                {block.title && (
                  <p className="text-white/70 text-sm font-semibold mb-4">{block.title}</p>
                )}
                {block.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        {i + 1}
                      </div>
                      {i < block.steps.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                      <p className="text-white/60 text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'compare':
            return (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  <p className="text-green-300 font-semibold text-sm mb-3">{block.left.title}</p>
                  <ul className="space-y-2">
                    {block.left.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                        <span className="text-green-400 shrink-0 mt-0.5">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}
                >
                  <p className="text-red-300 font-semibold text-sm mb-3">{block.right.title}</p>
                  <ul className="space-y-2">
                    {block.right.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                        <span className="text-red-400 shrink-0 mt-0.5">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );

          case 'formula':
            return (
              <div
                key={idx}
                className="rounded-xl p-5 font-mono"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{block.label}</p>
                <p className="text-white font-bold text-xl tracking-wide mb-2">{block.formula}</p>
                {block.explanation && (
                  <p className="text-white/50 text-sm font-sans leading-relaxed">{block.explanation}</p>
                )}
              </div>
            );

          case 'takeaways':
            return (
              <div
                key={idx}
                className="rounded-xl p-5 mt-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">Key Takeaways</p>
                <ul className="space-y-2.5">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                      <span className="text-white/40 shrink-0 mt-0.5 text-base">✓</span>
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'visual': {
            const maxVal = Math.max(...block.rows.map(r => parseFloat(r.value) || 0)) || 1;
            return (
              <div
                key={idx}
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-4">{block.title}</p>
                <div className="space-y-3">
                  {block.rows.map((row, i) => {
                    const numeric = parseFloat(row.value) || 0;
                    const pct = maxVal > 0 ? Math.min(100, (numeric / maxVal) * 100) : 50;
                    const barColor = row.color || 'rgba(255,255,255,0.4)';
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-white/50 text-xs w-28 shrink-0 text-right">{row.label}</span>
                        <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: barColor }}
                          />
                        </div>
                        <span className="text-white/60 text-xs w-16 shrink-0">{row.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          case 'diagram':
            return (
              <div key={idx} className="my-6">
                <Suspense
                  fallback={
                    <div
                      className="rounded-2xl flex items-center justify-center py-12"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <p className="text-white/30 text-xs uppercase tracking-widest">Loading diagram…</p>
                    </div>
                  }
                >
                  <LessonDiagram visualType={block.visualType} caption={block.caption} />
                </Suspense>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default memo(LessonRenderer);
