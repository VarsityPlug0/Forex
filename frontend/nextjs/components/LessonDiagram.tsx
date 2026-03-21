'use client';

import { useState, useEffect, useCallback } from 'react';

// Relative paths — proxied by Next.js to localhost:3001, no CORS issues
const API = '/api/v1/diagrams';

interface DiagramState {
  status: 'idle' | 'loading' | 'generating' | 'ready' | 'error';
  url: string | null;
  error: string | null;
}

interface LessonDiagramProps {
  visualType: string;
  caption?: string;
  autoGenerate?: boolean;
}

export default function LessonDiagram({ visualType, caption, autoGenerate = true }: LessonDiagramProps) {
  const [state, setState] = useState<DiagramState>({ status: 'idle', url: null, error: null });

  const fetchExisting = useCallback(async () => {
    setState(s => ({ ...s, status: 'loading' }));
    try {
      const res = await fetch(`${API}/${encodeURIComponent(visualType)}`);
      if (res.ok) {
        const data = await res.json();
        // data.latestUrl is e.g. "/diagrams/candlestick-basics-abc.jpeg"
        setState({ status: 'ready', url: data.latestUrl, error: null });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [visualType]);

  const generate = useCallback(async () => {
    setState(s => ({ ...s, status: 'generating', error: null }));
    try {
      const res = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualType }),
      });
      const data = await res.json();
      if (data.success && data.publicUrl) {
        setState({ status: 'ready', url: data.publicUrl, error: null });
      } else {
        setState({ status: 'error', url: null, error: data.error || 'Generation failed' });
      }
    } catch (err) {
      setState({ status: 'error', url: null, error: err instanceof Error ? err.message : 'Network error' });
    }
  }, [visualType]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await fetchExisting();
      if (!found && autoGenerate && !cancelled) generate();
      else if (!found && !autoGenerate && !cancelled) setState({ status: 'idle', url: null, error: null });
    })();
    return () => { cancelled = true; };
  }, [visualType, autoGenerate, fetchExisting, generate]);

  if (state.status === 'loading' || state.status === 'generating') {
    return (
      <div
        className="rounded-2xl flex flex-col items-center justify-center gap-3 py-12"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 240 }}
      >
        <div className="relative w-10 h-10">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a855f7, #6366f1)', animation: 'spin 1.2s linear infinite' }}
          />
          <div className="absolute inset-[3px] rounded-full" style={{ background: '#0f1117' }} />
        </div>
        <p className="text-white/50 text-xs tracking-widest uppercase">
          {state.status === 'generating' ? 'Generating diagram…' : 'Loading…'}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <p className="text-red-300 text-sm font-semibold">⚠ Diagram generation failed</p>
        <p className="text-white/50 text-xs">{state.error}</p>
        <button onClick={generate} className="self-start px-4 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
          Retry
        </button>
      </div>
    );
  }

  if (state.status === 'idle') {
    return (
      <div className="rounded-2xl p-5 flex flex-col items-center gap-3 py-10" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.12)' }}>
        <p className="text-white/40 text-xs uppercase tracking-widest">Diagram not yet generated</p>
        <button onClick={generate} className="px-5 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          Generate with Gemini
        </button>
      </div>
    );
  }

  return (
    <figure className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
          <span className="text-white/50 text-xs uppercase tracking-widest">AI-Generated Diagram</span>
        </div>
        <button onClick={generate} className="text-white/30 hover:text-white/70 text-xs transition-colors">↺ Regenerate</button>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.url!}
        alt={caption || `Forex diagram: ${visualType}`}
        className="w-full block"
        style={{ maxHeight: 480, objectFit: 'contain', background: '#0f1117' }}
        loading="lazy"
      />

      {caption && (
        <figcaption className="px-4 py-2.5 text-white/45 text-xs text-center leading-relaxed" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
