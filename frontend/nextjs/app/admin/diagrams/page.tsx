'use client';

import { useState, useEffect, useRef } from 'react';

// All API calls go through Next.js proxy → localhost:3001 (same-origin, no CORS)
const API = '/api/v1/diagrams';

const VISUAL_GROUPS: { label: string; color: string; types: { id: string; name: string }[] }[] = [
  {
    label: 'Forex Fundamentals',
    color: '#22c55e',
    types: [
      { id: 'forex-market', name: 'Forex Market Overview' },
      { id: 'currency-pairs', name: 'Currency Pair Categories' },
      { id: 'pips-lots', name: 'Pips, Lots & Leverage' },
      { id: 'spread', name: 'Bid/Ask Spread' },
      { id: 'sessions', name: 'Trading Sessions' },
    ],
  },
  {
    label: 'Technical Analysis',
    color: '#6366f1',
    types: [
      { id: 'candlestick-basics', name: 'Candlestick Anatomy' },
      { id: 'candlestick-adv', name: 'Advanced Candlestick Patterns' },
      { id: 'support-resistance', name: 'Support & Resistance' },
      { id: 'trend-lines', name: 'Trend Lines & Channels' },
      { id: 'moving-averages', name: 'Moving Averages' },
      { id: 'rsi', name: 'RSI Oscillator' },
      { id: 'macd', name: 'MACD Indicator' },
      { id: 'bollinger', name: 'Bollinger Bands' },
      { id: 'fibonacci', name: 'Fibonacci Retracement' },
      { id: 'head-shoulders', name: 'Head & Shoulders Pattern' },
      { id: 'flags', name: 'Flag & Pennant Patterns' },
    ],
  },
  {
    label: 'Price Action / Smart Money',
    color: '#f59e0b',
    types: [
      { id: 'market-structure', name: 'Market Structure (HH/HL)' },
      { id: 'bos', name: 'Break of Structure (BOS)' },
      { id: 'choch', name: 'Change of Character (CHoCH)' },
      { id: 'order-blocks', name: 'Order Blocks' },
      { id: 'fvg', name: 'Fair Value Gap (FVG)' },
    ],
  },
  {
    label: "Bevan's Three-Candle Strategy",
    color: '#ec4899',
    types: [
      { id: 'tc-structure', name: 'Structure for TC Strategy' },
      { id: 'tc-supply-demand', name: 'Supply & Demand Zones' },
      { id: 'tc-liquidity', name: 'Liquidity Sweeps' },
      { id: 'tc-mtf', name: 'Multi-Timeframe Analysis' },
      { id: 'tc-walkthrough', name: 'Full Strategy Walkthrough' },
    ],
  },
  {
    label: 'Risk Management',
    color: '#ef4444',
    types: [
      { id: 'risk-reward', name: 'Risk/Reward Ratio' },
      { id: 'position-sizing', name: 'Position Sizing Formula' },
      { id: 'stop-loss', name: 'Stop Loss & Take Profit' },
      { id: 'drawdown', name: 'Drawdown & Recovery' },
    ],
  },
  {
    label: 'PAMM Accounts',
    color: '#14b8a6',
    types: [
      { id: 'pamm-overview', name: 'PAMM Structure' },
    ],
  },
];

interface DiagramStatus {
  visualType: string;
  status: 'idle' | 'generating' | 'ready' | 'error';
  url: string | null;
  error: string | null;
}

export default function AdminDiagramsPage() {
  const [diagrams, setDiagrams] = useState<Record<string, DiagramStatus>>({});
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchLog, setBatchLog] = useState<string[]>([]);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Load existing diagrams on mount
  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        const next: Record<string, DiagramStatus> = {};
        (data.visualTypes || []).forEach((vt: { visualType: string; latestUrl: string | null }) => {
          next[vt.visualType] = {
            visualType: vt.visualType,
            // Use relative URL — served via Next.js proxy from /diagrams/*
            status: vt.latestUrl ? 'ready' : 'idle',
            url: vt.latestUrl ?? null,   // e.g. "/diagrams/candlestick-basics-abc.jpeg"
            error: null,
          };
        });
        setDiagrams(next);
      })
      .catch(err => console.error('Failed to load diagrams:', err));
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [batchLog]);

  const generateOne = async (visualType: string) => {
    setDiagrams(d => ({
      ...d,
      [visualType]: { ...(d[visualType] ?? { visualType, url: null, error: null }), status: 'generating' },
    }));
    try {
      const res = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualType }),
      });
      const data = await res.json();
      if (data.success) {
        setDiagrams(d => ({
          ...d,
          [visualType]: { visualType, status: 'ready', url: data.publicUrl, error: null },
        }));
      } else {
        setDiagrams(d => ({
          ...d,
          [visualType]: { ...(d[visualType] ?? { visualType, url: null }), status: 'error', error: data.error || 'Failed' },
        }));
      }
    } catch (err) {
      setDiagrams(d => ({
        ...d,
        [visualType]: { ...(d[visualType] ?? { visualType, url: null }), status: 'error', error: String(err) },
      }));
    }
  };

  const generateAll = async () => {
    setBatchRunning(true);
    setBatchLog(['Starting batch generation…']);

    const allTypes = VISUAL_GROUPS.flatMap(g => g.types.map(t => t.id));

    try {
      const res = await fetch(`${API}/generate-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visualTypes: allTypes }),
      });
      if (!res.body) throw new Error('No streaming body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.status === 'complete') {
              setBatchLog(l => [...l, `✓ Complete — ${data.succeeded}/${data.total} succeeded`]);
            } else if (data.status === 'generating') {
              setBatchLog(l => [...l, `⟳ Generating: ${data.visualType} (${data.index + 1}/${data.total})`]);
              setDiagrams(d => ({
                ...d,
                [data.visualType]: { visualType: data.visualType, status: 'generating', url: d[data.visualType]?.url ?? null, error: null },
              }));
            } else if (data.status === 'done') {
              setBatchLog(l => [...l, `✓ Done: ${data.visualType}`]);
              setDiagrams(d => ({
                ...d,
                [data.visualType]: { visualType: data.visualType, status: 'ready', url: data.publicUrl, error: null },
              }));
            } else if (data.status === 'error') {
              setBatchLog(l => [...l, `✗ Error: ${data.visualType} — ${data.error}`]);
              setDiagrams(d => ({
                ...d,
                [data.visualType]: { ...(d[data.visualType] ?? { visualType: data.visualType, url: null }), status: 'error', error: data.error },
              }));
            }
          } catch { /* non-JSON line */ }
        }
      }
    } catch (err) {
      setBatchLog(l => [...l, `✗ Batch failed: ${err instanceof Error ? err.message : String(err)}`]);
    }

    setBatchRunning(false);
  };

  const allTypes = VISUAL_GROUPS.flatMap(g => g.types.map(t => t.id));
  const readyCount = allTypes.filter(id => diagrams[id]?.status === 'ready').length;

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#0b0d12', color: '#f9fafb' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            ✦
          </span>
          <h1 className="text-2xl font-bold text-white">Forex Diagram Generator</h1>
        </div>
        <p className="text-white/50 text-sm">Generate AI-powered educational forex trading diagrams using Google Gemini.</p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${allTypes.length > 0 ? (readyCount / allTypes.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              }}
            />
          </div>
          <span className="text-white/40 text-xs shrink-0">{readyCount}/{allTypes.length} generated</span>
        </div>
      </div>

      {/* Batch actions */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={generateAll}
          disabled={batchRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {batchRunning ? '⟳ Generating…' : '✦ Generate All Diagrams'}
        </button>
        <span className="text-white/30 text-xs">{allTypes.length} diagrams total</span>
      </div>

      {/* Batch log */}
      {batchLog.length > 0 && (
        <div
          ref={logRef}
          className="mb-8 rounded-xl p-4 font-mono text-xs space-y-0.5 overflow-y-auto"
          style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', maxHeight: 180 }}
        >
          {batchLog.map((line, i) => (
            <p key={i} className={line.startsWith('✓') ? 'text-green-400' : line.startsWith('✗') ? 'text-red-400' : 'text-white/50'}>
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Groups */}
      <div className="space-y-10">
        {VISUAL_GROUPS.map(group => (
          <section key={group.label}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: group.color }} />
              <h2 className="text-white font-semibold text-base">{group.label}</h2>
              <span className="text-white/30 text-xs ml-1">
                {group.types.filter(t => diagrams[t.id]?.status === 'ready').length}/{group.types.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.types.map(({ id, name }) => {
                const d = diagrams[id] ?? { status: 'idle', url: null, error: null };
                const isGenerating = d.status === 'generating';
                const isReady = d.status === 'ready' && !!d.url;
                const isError = d.status === 'error';

                return (
                  <div
                    key={id}
                    className="rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isReady ? 'rgba(34,197,94,0.25)' : isError ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative overflow-hidden flex items-center justify-center"
                      style={{ height: 160, background: '#0f1117', cursor: isReady ? 'pointer' : 'default' }}
                      onClick={() => isReady && d.url && setPreview({ url: d.url, name })}
                    >
                      {isReady && d.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.url}
                          alt={name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : isGenerating ? (
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{
                              background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a855f7, #6366f1)',
                              animation: 'spin 1.2s linear infinite',
                            }}
                          />
                          <p className="text-white/40 text-xs">Generating…</p>
                        </div>
                      ) : (
                        <p className="text-white/20 text-xs uppercase tracking-widest">No diagram yet</p>
                      )}

                      {isReady && (
                        <div
                          className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ background: 'rgba(34,197,94,0.2)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' }}
                        >
                          ✓ Ready
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{name}</p>
                        <p className="text-white/30 text-xs truncate">{id}</p>
                        {isError && <p className="text-red-400 text-xs truncate">{d.error}</p>}
                      </div>
                      <button
                        onClick={() => generateOne(id)}
                        disabled={isGenerating || batchRunning}
                        className="shrink-0 px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-80"
                        style={{
                          background: isReady
                            ? 'rgba(255,255,255,0.08)'
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        }}
                      >
                        {isGenerating ? '⟳' : isReady ? '↺' : '✦ Generate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={preview.name} className="w-full block" style={{ background: '#0f1117' }} />
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-white/70 text-sm font-semibold">{preview.name}</p>
              <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white/80 text-sm transition-colors">
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
