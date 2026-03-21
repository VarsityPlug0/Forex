'use client';

import { useEffect, useRef, useId } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { TradingView: any; }
}

// ─── Per-lesson config ────────────────────────────────────────────────────────
type Step = { tool: string; action: string };
type LessonConfig = {
  symbol: string;
  interval: string;
  studies: string[];
  title: string;
  steps: Step[];
};

const LESSONS: Record<string, LessonConfig> = {
  'intro-ta': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['MASimple@tv-basicstudies'],
    title: 'Reading a Price Chart',
    steps: [
      { tool: 'Zoom (scroll wheel)', action: 'Zoom into the last 6 months to see daily candles clearly' },
      { tool: 'Horizontal Line', action: 'Find a price level where price bounced twice — draw a Support line there' },
      { tool: 'Horizontal Line', action: 'Find a price ceiling where price reversed — draw a Resistance line' },
      { tool: 'Trend Line', action: 'Connect rising lows with the Trend Line tool to show bullish momentum' },
      { tool: 'Indicator → MA', action: 'Add a 20 SMA — watch how price stays above it in uptrends' },
    ],
  },
  'candlestick-basics': {
    symbol: 'FX:EURUSD', interval: 'D', studies: [],
    title: 'Identifying Candlestick Anatomy',
    steps: [
      { tool: 'Magnifying glass / zoom', action: 'Zoom into a recent bullish candle — identify open, close, high, low' },
      { tool: 'Measure tool', action: 'Use the Measure tool to see the exact pip range of one candle body vs wick' },
      { tool: 'Rectangle', action: 'Draw a rectangle around 3 consecutive bearish candles — note the range' },
      { tool: 'Arrow', action: 'Mark a Doji candle with the Arrow tool — note the equal wicks showing indecision' },
    ],
  },
  'candlestick-adv': {
    symbol: 'FX:GBPUSD', interval: 'D', studies: [],
    title: 'Spotting Reversal Patterns',
    steps: [
      { tool: 'Zoom', action: 'Zoom into a recent swing high or low' },
      { tool: 'Arrow ↓', action: 'Find an Engulfing candle pattern — mark the trigger candle' },
      { tool: 'Text label', action: 'Label a Hammer or Pin Bar at a key support level' },
      { tool: 'Horizontal Line', action: 'Draw the entry level just above the pattern\'s high' },
      { tool: 'Horizontal Line', action: 'Draw the stop loss below the pattern\'s wick' },
    ],
  },
  'support-resistance': {
    symbol: 'FX:EURUSD', interval: 'D', studies: [],
    title: 'Drawing Support & Resistance',
    steps: [
      { tool: 'Zoom out', action: 'Zoom out to see 1 year of daily data — identify major turning points' },
      { tool: 'Horizontal Line', action: 'Draw a line at each price level where the market reversed at least twice' },
      { tool: 'Rectangle', action: 'If price bounced in a zone (not exact level), draw a Rectangle to mark the zone' },
      { tool: 'Zoom in', action: 'Zoom into a current resistance level — watch how candles react (wicks vs closes)' },
      { tool: 'Text', action: 'Label each level: "Strong Support", "Weak Resistance", etc. for future reference' },
    ],
  },
  'trend-lines': {
    symbol: 'FX:EURUSD', interval: 'W', studies: [],
    title: 'Drawing Trend Lines & Channels',
    steps: [
      { tool: 'Trend Line', action: 'In an uptrend: click the first swing low, then the second swing low — extend right' },
      { tool: 'Parallel Channel', action: 'Right-click the trend line → Add parallel channel to create a price channel' },
      { tool: 'Zoom in', action: 'Switch to Daily — check if the weekly trend line still holds on shorter timeframes' },
      { tool: 'Arrow', action: 'Mark each touch of the trend line — more touches = stronger line' },
      { tool: 'Horizontal Line', action: 'When the trend line breaks, mark the breakout candle\'s close as new support' },
    ],
  },
  'moving-averages': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['MASimple@tv-basicstudies', 'MAExp@tv-basicstudies'],
    title: 'Using Moving Averages',
    steps: [
      { tool: 'Indicator: MA (20)', action: 'Add a 20 SMA — this tracks short-term momentum' },
      { tool: 'Indicator: MA (50)', action: 'Add a 50 SMA — when price is above both MAs, trend is bullish' },
      { tool: 'Indicator: EMA (200)', action: 'Add a 200 EMA — this is the major trend filter used by institutions' },
      { tool: 'Arrow', action: 'Find where the 20 SMA crosses above the 50 SMA — mark it as a Golden Cross' },
      { tool: 'Zoom in', action: 'Find a pullback to the 20 SMA in an uptrend — this is a buy opportunity zone' },
    ],
  },
  'rsi': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['RSI@tv-basicstudies'],
    title: 'Reading RSI Overbought & Oversold',
    steps: [
      { tool: 'Indicator: RSI (14)', action: 'RSI is already loaded below — watch how it moves between 0 and 100' },
      { tool: 'Horizontal Line (RSI pane)', action: 'Mark the 70 level (overbought) and 30 level (oversold) on the RSI pane' },
      { tool: 'Zoom in', action: 'Find where RSI went above 70 — check if price reversed shortly after' },
      { tool: 'Arrow', action: 'Mark an RSI divergence: price makes a higher high but RSI makes a lower high' },
      { tool: 'Text', action: 'Label the divergence "Bearish Divergence" — this signals weakening momentum' },
    ],
  },
  'macd': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['MACD@tv-basicstudies'],
    title: 'Trading MACD Crossovers & Divergence',
    steps: [
      { tool: 'Indicator: MACD', action: 'MACD (12,26,9) is loaded — the histogram shows momentum strength' },
      { tool: 'Arrow', action: 'Find where the MACD line crosses above the signal line — mark the bullish crossover' },
      { tool: 'Zoom in', action: 'Look for large histogram bars — they signal strong momentum in that direction' },
      { tool: 'Trend Line (MACD pane)', action: 'Draw a trend line on the histogram to spot momentum divergence' },
      { tool: 'Vertical Line', action: 'Mark the exact candle where crossover happens to practice timing entries' },
    ],
  },
  'bollinger': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['BB@tv-basicstudies'],
    title: 'Bollinger Band Squeeze & Breakout',
    steps: [
      { tool: 'Indicator: BB', action: 'Bollinger Bands are loaded — the bands expand in volatile markets and contract in calm ones' },
      { tool: 'Zoom in', action: 'Find where the bands are very narrow (squeeze) — this signals an explosive move is coming' },
      { tool: 'Rectangle', action: 'Draw a box around the squeeze zone to highlight the consolidation period' },
      { tool: 'Arrow', action: 'Mark the candle that breaks outside the band — this is the breakout entry signal' },
      { tool: 'Horizontal Line', action: 'Set a target at the opposite band (upper/lower) for the breakout trade' },
    ],
  },
  'fibonacci': {
    symbol: 'FX:EURUSD', interval: 'W', studies: [],
    title: 'Drawing Fibonacci Retracements',
    steps: [
      { tool: 'Fibonacci Retracement', action: 'Find a clear swing: click the swing low, drag to the swing high' },
      { tool: 'Zoom in', action: 'Watch which Fibonacci level price respects most (38.2%, 50%, or 61.8%)' },
      { tool: 'Horizontal Line', action: 'Mark the 61.8% level with a horizontal line — this is the "Golden Ratio" entry zone' },
      { tool: 'Rectangle', action: 'Draw a zone between 50% and 61.8% — this is the high-probability reversal zone' },
      { tool: 'Trend Line', action: 'Combine Fibonacci with a trend line — when they meet it\'s a high-confluence entry' },
    ],
  },
  'volume': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['Volume@tv-basicstudies'],
    title: 'Volume Confirms Price Moves',
    steps: [
      { tool: 'Indicator: Volume', action: 'Volume bars are loaded at the bottom — green = buying pressure, red = selling' },
      { tool: 'Zoom in', action: 'Find a breakout candle — check if volume is significantly higher than recent bars' },
      { tool: 'Arrow', action: 'Mark a high-volume candle in a trend — this confirms strong institutional participation' },
      { tool: 'Rectangle', action: 'Find a low-volume consolidation zone — draw a box around it' },
      { tool: 'Text', action: 'Note: "High volume + price move = real move. Low volume + price move = possible fake-out"' },
    ],
  },
  'head-shoulders': {
    symbol: 'FX:GBPUSD', interval: 'W', studies: [],
    title: 'Identifying Head & Shoulders',
    steps: [
      { tool: 'Zoom out', action: 'Go to Weekly timeframe and look for a 3-peak formation (left, head, right)' },
      { tool: 'Arrow', action: 'Mark the Left Shoulder, Head, and Right Shoulder with arrows' },
      { tool: 'Trend Line', action: 'Draw the Neckline connecting the two troughs between the shoulders' },
      { tool: 'Measure tool', action: 'Measure the height from neckline to head — this is the projected price target' },
      { tool: 'Horizontal Line', action: 'Project the target below the neckline break for the short trade' },
    ],
  },
  'flags': {
    symbol: 'FX:EURUSD', interval: '60', studies: [],
    title: 'Trading Bull & Bear Flags',
    steps: [
      { tool: 'Zoom in', action: 'Switch to 1H chart — look for a strong impulsive move (the pole)' },
      { tool: 'Rectangle', action: 'Draw a box around the tight consolidation after the impulse — this is the flag' },
      { tool: 'Trend Line', action: 'Draw parallel lines along the flag\'s highs and lows (the channel)' },
      { tool: 'Arrow', action: 'Mark the breakout candle when price leaves the flag with momentum' },
      { tool: 'Measure tool', action: 'Measure the pole height — add it to the breakout point for your price target' },
    ],
  },
  'price-action': {
    symbol: 'FX:EURUSD', interval: '60', studies: [],
    title: 'Reading Pure Price Action',
    steps: [
      { tool: 'Zoom', action: 'Use 1H chart with NO indicators — read price structure alone' },
      { tool: 'Arrow', action: 'Mark each Higher High (HH) and Higher Low (HL) in the current uptrend' },
      { tool: 'Horizontal Line', action: 'Draw a line at the last significant swing high — this is the key level to break' },
      { tool: 'Rectangle', action: 'Mark consolidation zones where price is "building energy" before the next move' },
      { tool: 'Text', action: 'Label the current market structure: "Uptrend / Ranging / Downtrend"' },
    ],
  },
  'market-structure': {
    symbol: 'FX:EURUSD', interval: '60', studies: [],
    title: 'Mapping Market Structure',
    steps: [
      { tool: 'Arrow ↑', action: 'Mark each Higher High (HH) at swing highs in an uptrend' },
      { tool: 'Arrow ↑', action: 'Mark each Higher Low (HL) at swing lows — these are buy opportunities' },
      { tool: 'Horizontal Line', action: 'Draw a line at each significant swing high — these become support once broken' },
      { tool: 'Text', action: 'Label the sequence: HL → HH → HL → HH to map the full trend structure' },
      { tool: 'Zoom in', action: 'Zoom into the current HL formation — is price respecting it? Set your entry here' },
    ],
  },
  'bos': {
    symbol: 'FX:EURUSD', interval: '15', studies: [],
    title: 'Identifying Break of Structure (BOS)',
    steps: [
      { tool: 'Horizontal Line', action: 'Mark the last significant swing high in a downtrend' },
      { tool: 'Zoom in', action: 'Watch for a candle that closes ABOVE this level — this is the BOS' },
      { tool: 'Arrow', action: 'Mark the BOS candle — this signals a potential trend reversal to bullish' },
      { tool: 'Rectangle', action: 'Draw a zone around the BOS level — price often retests this before continuing up' },
      { tool: 'Text', action: 'Label: "BOS → Look for bullish continuation entries on retest"' },
    ],
  },
  'choch': {
    symbol: 'FX:EURUSD', interval: '15', studies: [],
    title: 'Change of Character (CHoCH)',
    steps: [
      { tool: 'Arrow ↓', action: 'Identify a Lower High (LH) in the current downtrend — mark it' },
      { tool: 'Horizontal Line', action: 'Draw a line at the most recent swing high (the LH level)' },
      { tool: 'Zoom in', action: 'Watch for a candle to close above the LH — this is the CHoCH signal' },
      { tool: 'Rectangle', action: 'Mark the CHoCH zone and the retest area for your entry' },
      { tool: 'Measure', action: 'Measure the new bullish move to set a realistic target (1:2 RR minimum)' },
    ],
  },
  'order-blocks': {
    symbol: 'FX:EURUSD', interval: '15', studies: [],
    title: 'Marking Order Blocks',
    steps: [
      { tool: 'Zoom in', action: 'Find a strong impulsive move — scroll back to where it originated' },
      { tool: 'Rectangle', action: 'Draw a box around the LAST bearish candle before a bullish impulse — this is a bullish OB' },
      { tool: 'Text', action: 'Label it "Bullish OB" — when price returns here, look for buy entries' },
      { tool: 'Horizontal Line', action: 'Mark the 50% midpoint of the OB — price often reacts most strongly here' },
      { tool: 'Arrow', action: 'If price retests the OB and shows a bullish candle — mark your entry point' },
    ],
  },
  'fvg': {
    symbol: 'FX:EURUSD', interval: '15', studies: [],
    title: 'Finding Fair Value Gaps (FVG)',
    steps: [
      { tool: 'Zoom in', action: 'Find a 3-candle sequence where the middle candle moves so fast it leaves a gap' },
      { tool: 'Rectangle', action: 'Draw a box between candle 1\'s low and candle 3\'s high — this is the FVG' },
      { tool: 'Text', action: 'Label: "FVG — Unfilled Gap" — price tends to return and fill this zone' },
      { tool: 'Horizontal Line', action: 'Mark the 50% of the FVG — the "equilibrium" — as your entry target' },
      { tool: 'Arrow', action: 'When price returns to fill the FVG, mark the entry and place stop below the zone' },
    ],
  },
  'backtest': {
    symbol: 'FX:EURUSD', interval: 'D', studies: [],
    title: 'Backtesting on a Chart',
    steps: [
      { tool: 'Zoom out', action: 'Go back 1 year on the Daily chart — pick a strategy to test (e.g. MA crossover)' },
      { tool: 'Arrow', action: 'Mark every signal your strategy would have generated (buy/sell arrows)' },
      { tool: 'Measure tool', action: 'Measure each trade\'s outcome — record the pips gained or lost' },
      { tool: 'Text', action: 'Label each trade result: "+32 pips" or "-15 pips" directly on the chart' },
      { tool: 'Rectangle', action: 'Draw a box around losing streaks (drawdown periods) to assess your strategy\'s weakness' },
    ],
  },
  'live-chart': {
    symbol: 'FX:EURUSD', interval: 'D', studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies'],
    title: 'Live Chart Walkthrough',
    steps: [
      { tool: 'Multi-timeframe', action: 'Start on Weekly → identify the major trend direction' },
      { tool: 'Switch to Daily', action: 'Mark key S/R levels on the Daily chart — these are your key zones' },
      { tool: 'Switch to 4H', action: 'Look for a setup forming near a Daily level — this is your entry timeframe' },
      { tool: 'Trend Line', action: 'Draw the short-term structure on 4H to time the entry' },
      { tool: 'Measure tool', action: 'Calculate R:R from your entry — only take the trade if it\'s at least 1:2' },
    ],
  },

  // ── Bevan's Three-Candle Strategy ──────────────────────────────────────────
  'tc-structure': {
    symbol: 'FX:GBPUSD', interval: '60', studies: [],
    title: 'Mapping Market Structure (Swing Highs & Lows)',
    steps: [
      { tool: 'Zoom out', action: 'Switch to 1H chart — zoom out to see the last 3 months of price action clearly' },
      { tool: 'Arrow ↑ (swing highs)', action: 'Mark every swing high with an up-arrow. Label each: HH (higher high) or LH (lower high)' },
      { tool: 'Arrow ↓ (swing lows)', action: 'Mark every swing low with a down-arrow. Label each: HL (higher low) or LL (lower low)' },
      { tool: 'Text', action: 'Write the current market state at the right edge: "Uptrend / Downtrend / Ranging"' },
      { tool: 'Horizontal Line', action: 'Draw a line at the most recent swing high — this is the key level price must break to confirm trend continuation' },
    ],
  },
  'tc-supply-demand': {
    symbol: 'FX:EURUSD', interval: '240', studies: [],
    title: 'Drawing Supply & Demand Zones',
    steps: [
      { tool: 'Zoom out', action: 'Switch to 4H chart — identify 2-3 strong impulsive moves (candles that moved fast and far)' },
      { tool: 'Rectangle (demand)', action: 'Find the last candle before a bullish impulse. Draw a box from that candle\'s open to its low — this is the demand zone' },
      { tool: 'Rectangle (supply)', action: 'Find the last candle before a bearish impulse. Draw a box from that candle\'s open to its high — this is the supply zone' },
      { tool: 'Text', action: 'Label each zone: "D1 Demand — Fresh" or "4H Supply — Tested" based on whether price has returned to it' },
      { tool: 'Zoom in', action: 'Now switch to 1H — notice how price reacts when it reaches your marked zones. Does it bounce or consolidate?' },
    ],
  },
  'tc-liquidity': {
    symbol: 'FX:GBPUSD', interval: '15', studies: [],
    title: 'Identifying Liquidity Sweeps',
    steps: [
      { tool: 'Zoom in', action: 'Switch to 15M chart. Find a recent swing low where price made a clear wick extending below it' },
      { tool: 'Horizontal Line', action: 'Draw a line exactly at the swing low. Notice: did the wick pierce through and then close back above? That is the sweep' },
      { tool: 'Arrow ↓', action: 'Mark the sweep candle — place a down-arrow at the wick tip labeled "Liquidity Hunt"' },
      { tool: 'Arrow ↑', action: 'Mark the rejection: place an up-arrow at the candle\'s close labeled "Rejection / Entry Zone"' },
      { tool: 'Measure tool', action: 'Measure the wick versus the candle body — a valid sweep has a wick at least 2× the body size' },
    ],
  },
  'tc-mtf': {
    symbol: 'FX:EURUSD', interval: 'D', studies: [],
    title: 'Multi-Timeframe Analysis — Top-Down',
    steps: [
      { tool: 'Weekly chart', action: 'Start on the Weekly. Mark the trend: is price making higher highs and higher lows (bullish) or lower highs and lower lows (bearish)?' },
      { tool: 'Switch to Daily', action: 'Drop to Daily. Find the nearest untested demand zone (for bullish bias) or supply zone (for bearish bias). Draw the zone box' },
      { tool: 'Switch to 4H', action: 'Drop to 4H. Is price approaching your Daily zone? Mark the 4H swing points near the zone' },
      { tool: 'Switch to 1H', action: 'Drop to 1H. Watch for the three-candle pattern forming inside the Daily zone. Mark C1, C2, and C3 as they form' },
      { tool: 'Text', action: 'Label your full analysis: "W1: Bullish → D1 Demand at [price] → Waiting for 1H three-candle setup"' },
    ],
  },
  'tc-walkthrough': {
    symbol: 'FX:GBPUSD', interval: '60', studies: [],
    title: 'Full Strategy Walkthrough — Live Chart',
    steps: [
      { tool: 'Weekly', action: 'Open GBPUSD Weekly — confirm the trend direction and mark major swing points' },
      { tool: 'Daily — zone', action: 'Switch to Daily — draw your highest-quality demand or supply zone. Mark the proximal and distal lines' },
      { tool: '1H — pattern', action: 'Switch to 1H — wait for price to reach your zone. Mark C1, C2, and C3 when you can see a potential three-candle setup' },
      { tool: 'Rectangle', action: 'Draw a box around the three-candle pattern (C1, C2, C3) — highlight the sweep wick with an arrow labeled "Liquidity Sweep"' },
      { tool: 'Measure tool', action: 'Set your entry at C3 close. Measure from entry to the stop (below C3 wick) and to the TP (next swing high). Confirm R:R ≥ 1:2 before taking the trade' },
    ],
  },
};

const DEFAULT_LESSON: LessonConfig = {
  symbol: 'FX:EURUSD', interval: 'D', studies: [],
  title: 'Practice on a Live Chart',
  steps: [
    { tool: 'Zoom', action: 'Zoom into the last 3 months using the scroll wheel' },
    { tool: 'Trend Line', action: 'Connect 2 or more swing lows to draw an uptrend line' },
    { tool: 'Horizontal Line', action: 'Mark a key support and resistance level' },
    { tool: 'Indicator', action: 'Add the 20 SMA from the Indicators menu' },
    { tool: 'Practice', action: 'Try to identify the current market structure: trending or ranging?' },
  ],
};

// ─── TradingView script loader (singleton) ────────────────────────────────────
let tvScriptPromise: Promise<void> | null = null;
function loadTV(): Promise<void> {
  if (tvScriptPromise) return tvScriptPromise;
  if (typeof window !== 'undefined' && window.TradingView) return (tvScriptPromise = Promise.resolve());
  tvScriptPromise = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/tv.js';
    s.async = true;
    s.onload = () => res();
    s.onerror = () => rej(new Error('TradingView failed to load'));
    document.head.appendChild(s);
  });
  return tvScriptPromise;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TradingViewChart({ type }: { type: string }) {
  const uid = useId().replace(/:/g, '');
  const containerId = `tv-${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const cfg = LESSONS[type] ?? DEFAULT_LESSON;

  useEffect(() => {
    let dead = false;
    loadTV().then(() => {
      if (dead || !containerRef.current || !window.TradingView) return;
      new window.TradingView.widget({
        container_id: containerId,
        autosize: true,
        symbol: cfg.symbol,
        interval: cfg.interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#161616',
        enable_publishing: false,
        allow_symbol_change: true,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_side_toolbar: false,
        withdateranges: true,
        save_image: true,
        studies: cfg.studies,
        disabled_features: ['header_symbol_search'],
        enabled_features: ['study_templates', 'use_localstorage_for_settings', 'side_toolbar_in_fullscreen_mode'],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor':         '#10b981',
          'mainSeriesProperties.candleStyle.downColor':       '#ef4444',
          'mainSeriesProperties.candleStyle.borderUpColor':   '#10b981',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
          'mainSeriesProperties.candleStyle.wickUpColor':     '#10b981',
          'mainSeriesProperties.candleStyle.wickDownColor':   '#ef4444',
          'paneProperties.background':                        '#111111',
          'paneProperties.backgroundType':                    'solid',
          'paneProperties.vertGridProperties.color':          'rgba(255,255,255,0.04)',
          'paneProperties.horzGridProperties.color':          'rgba(255,255,255,0.04)',
          'scalesProperties.textColor':                       'rgba(255,255,255,0.45)',
        },
      });
    }).catch(console.error);
    return () => { dead = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
      {/* Chart */}
      <div style={{ width: '100%', height: 500, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div id={containerId} ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Practice Guide */}
      <div style={{ marginTop: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '16px' }}>📋</span>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '13px' }}>
            Practice Guide — {cfg.title}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            Replicate these steps on the chart above ↑
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cfg.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{
                minWidth: '22px', height: '22px', borderRadius: '50%',
                background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: 'rgba(99,102,241,1)', flexShrink: 0,
              }}>{i + 1}</span>
              <div>
                <span style={{
                  display: 'inline-block', fontSize: '10px', fontWeight: 600,
                  color: '#f59e0b', background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.25)', borderRadius: '4px',
                  padding: '1px 7px', marginBottom: '3px',
                }}>
                  {step.tool}
                </span>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {step.action}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
          💡 Tip: Use the drawing toolbar on the left side of the chart. Right-click any drawing to edit or delete it.
        </div>
      </div>
    </div>
  );
}
