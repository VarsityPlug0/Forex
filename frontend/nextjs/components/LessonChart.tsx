'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function tradingDate(base: Date, offset: number): string {
  const d = new Date(base);
  let added = 0;
  while (added < offset) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}

// ─── OHLC generator ───────────────────────────────────────────────────────────
type Bar = { time: string; open: number; high: number; low: number; close: number };

function genBars(n: number, start = 1.085, vol = 0.0025, drift = 0.00005, seed = 42): Bar[] {
  const r = rng(seed);
  const base = new Date('2024-09-02');
  const bars: Bar[] = [];
  let price = start;
  for (let i = 0; i < n; i++) {
    const open = price;
    const chg = (r() - 0.5) * 2 * vol + drift;
    const close = +(open + open * chg).toFixed(5);
    const wickFactor = vol * 0.55 * r();
    const high = +(Math.max(open, close) + open * wickFactor).toFixed(5);
    const low = +(Math.min(open, close) - open * wickFactor).toFixed(5);
    bars.push({ time: tradingDate(base, i), open: +open.toFixed(5), high, low, close });
    price = close;
  }
  return bars;
}

// ─── Pattern generators ───────────────────────────────────────────────────────
function genHeadShoulders(): Bar[] {
  const base = new Date('2024-09-02');
  const neckline = 1.0820;
  const pts = [
    { i: 0,  p: 1.0780 }, { i: 12, p: 1.0882 }, { i: 20, p: neckline + 0.0004 },
    { i: 35, p: 1.0942 }, { i: 45, p: neckline + 0.0004 },
    { i: 57, p: 1.0875 }, { i: 70, p: neckline - 0.0005 }, { i: 78, p: neckline - 0.0042 },
  ];
  const bars: Bar[] = [];
  for (let i = 0; i < 79; i++) {
    let p0 = pts[0], p1 = pts[1];
    for (let j = 0; j < pts.length - 1; j++) {
      if (i >= pts[j].i && i < pts[j + 1].i) { p0 = pts[j]; p1 = pts[j + 1]; }
    }
    const t = (i - p0.i) / Math.max(1, p1.i - p0.i);
    const mid = p0.p + (p1.p - p0.p) * t;
    const noise = Math.sin(i * 2.7) * 0.00045 + ((i * 7919 + 12345) % 100 - 50) * 0.000006;
    const close = +(mid + noise).toFixed(5);
    const open = i === 0 ? close : bars[i - 1].close;
    const wick = 0.00045;
    bars.push({ time: tradingDate(base, i), open: +open.toFixed(5), high: +(Math.max(open, close) + wick).toFixed(5), low: +(Math.min(open, close) - wick).toFixed(5), close });
  }
  return bars;
}

function genFlag(): Bar[] {
  const base = new Date('2024-09-02');
  const bars: Bar[] = [];
  for (let i = 0; i < 60; i++) {
    let mid: number;
    if (i < 20)      mid = 1.0800 + (i / 20) * 0.0185;
    else if (i < 40) mid = 1.0985 - ((i - 20) / 20) * 0.0055;
    else             mid = 1.0930 + ((i - 40) / 20) * 0.0175;
    const noise = Math.sin(i * 3.1) * 0.00035;
    const close = +(mid + noise).toFixed(5);
    const open = i === 0 ? close : bars[i - 1].close;
    const wick = i < 20 ? 0.0009 : i < 40 ? 0.00035 : 0.0007;
    bars.push({ time: tradingDate(base, i), open: +open.toFixed(5), high: +(Math.max(open, close) + wick).toFixed(5), low: +(Math.min(open, close) - wick).toFixed(5), close });
  }
  return bars;
}

// ─── Indicators ───────────────────────────────────────────────────────────────
function sma(bars: Bar[], period: number) {
  return bars.map((_, i) =>
    i < period - 1 ? null : +(bars.slice(i - period + 1, i + 1).reduce((s, b) => s + b.close, 0) / period).toFixed(5)
  );
}

function bollinger(bars: Bar[], period = 20, mult = 2) {
  const mid = sma(bars, period);
  return bars.map((_, i) => {
    if (mid[i] === null) return { mid: null, upper: null, lower: null };
    const m = mid[i]!;
    const sd = Math.sqrt(bars.slice(i - period + 1, i + 1).reduce((s, b) => s + (b.close - m) ** 2, 0) / period);
    return { mid: +m.toFixed(5), upper: +(m + mult * sd).toFixed(5), lower: +(m - mult * sd).toFixed(5) };
  });
}

function rsi(bars: Bar[], period = 14): (number | null)[] {
  return bars.map((_, i) => {
    if (i < period) return null;
    let g = 0, l = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const d = bars[j].close - bars[j - 1].close;
      d > 0 ? (g += d) : (l -= d);
    }
    return +(100 - 100 / (1 + g / (l || 0.0001))).toFixed(2);
  });
}

function macd(bars: Bar[], fast = 12, slow = 26, signal = 9) {
  const ema = (p: number) => {
    const k = 2 / (p + 1);
    return bars.reduce((acc: number[], b, i) => {
      acc.push(i === 0 ? b.close : b.close * k + acc[i - 1] * (1 - k));
      return acc;
    }, []);
  };
  const fastE = ema(fast), slowE = ema(slow);
  const line = fastE.map((f, i) => +(f - slowE[i]).toFixed(5));
  const k = 2 / (signal + 1);
  const sig: number[] = [];
  line.forEach((v, i) => { sig.push(i === 0 ? v : v * k + sig[i - 1] * (1 - k)); });
  const hist = line.map((v, i) => +(v - sig[i]).toFixed(5));
  return { line, sig, hist };
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG = '#0d0d0d';
const GRID = 'rgba(255,255,255,0.05)';
const TEXT = 'rgba(255,255,255,0.45)';
const BORDER = 'rgba(255,255,255,0.08)';
const GREEN = '#10b981';
const RED = '#ef4444';
const PURPLE = '#6366f1';
const AMBER = '#f59e0b';
const TEAL = '#06b6d4';

function chartOpts(h: number) {
  return {
    layout: { background: { type: ColorType.Solid as const, color: BG }, textColor: TEXT },
    grid: { vertLines: { color: GRID }, horzLines: { color: GRID } },
    crosshair: { mode: CrosshairMode.Normal },
    timeScale: { borderColor: BORDER, timeVisible: false },
    rightPriceScale: { borderColor: BORDER },
    height: h,
  };
}

// ─── Per-type chart builder ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function build(type: string, mainEl: HTMLElement, subEl?: HTMLElement): any[] {
  const charts = [];
  const mainH = subEl ? 195 : 260;
  const chart = createChart(mainEl, { ...chartOpts(mainH), width: mainEl.clientWidth });
  charts.push(chart);

  const cs = () => chart.addCandlestickSeries({
    upColor: GREEN, downColor: RED,
    borderUpColor: GREEN, borderDownColor: RED,
    wickUpColor: 'rgba(16,185,129,0.65)', wickDownColor: 'rgba(239,68,68,0.65)',
  });

  switch (type) {

    case 'intro-ta': {
      // Uptrending bars so all concepts (S/R, trend, MA) are visible
      const bars = genBars(80, 1.0720, 0.0022, 0.00022, 17);
      const series = cs();
      series.setData(bars);

      // Accurately calculated 20-period SMA
      const s20 = sma(bars, 20);
      const maLine = chart.addLineSeries({ color: '#6366f1', lineWidth: 2, priceLineVisible: false, lastValueVisible: true, title: 'MA(20)' });
      maLine.setData(bars.map((b, i) => s20[i] !== null ? { time: b.time, value: s20[i]! } : null).filter(Boolean) as { time: string; value: number }[]);

      // Support: lowest low in first third of data
      const support = +(Math.min(...bars.slice(0, 30).map(b => b.low))).toFixed(5);
      // Resistance: highest high in first two thirds
      const resistance = +(Math.max(...bars.slice(10, 60).map(b => b.high))).toFixed(5);
      series.createPriceLine({ price: support,    color: GREEN, lineWidth: 2, lineStyle: LineStyle.Dashed, title: 'Support'    });
      series.createPriceLine({ price: resistance, color: RED,   lineWidth: 2, lineStyle: LineStyle.Dashed, title: 'Resistance' });

      // Trend line: connect first and last significant swing low
      const swingLows = bars.map((b, i) => ({ b, i })).filter(({ b, i }) =>
        i > 1 && i < bars.length - 2 &&
        b.low < bars[i - 1].low && b.low < bars[i + 1].low
      );
      if (swingLows.length >= 2) {
        const first = swingLows[0];
        const last  = swingLows[swingLows.length - 1];
        const trendLine = chart.addLineSeries({ color: AMBER, lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, title: 'Trend' });
        trendLine.setData([
          { time: first.b.time, value: first.b.low },
          { time: last.b.time,  value: last.b.low  },
        ]);
      }

      // Mark one candle as the "example" candlestick
      series.setMarkers([{ time: bars[10].time, position: 'aboveBar', color: TEAL, shape: 'arrowDown', text: 'Candle' }]);
      chart.applyOptions({ watermark: { color: 'rgba(255,255,255,0.05)', visible: true, text: 'TECHNICAL ANALYSIS', fontSize: 13, horzAlign: 'center', vertAlign: 'top' } });
      break;
    }

    case 'candlestick-basics':
    case 'candlestick-adv':
    case 'live-chart':
    case 'chart':
    default: {
      const bars = genBars(80, 1.0850);
      cs().setData(bars);
      break;
    }

    case 'support-resistance': {
      const bars = genBars(80, 1.0820, 0.0025, 0.00008, 11);
      const series = cs();
      series.setData(bars);
      const resistance = +(Math.max(...bars.slice(10, 55).map(b => b.high))).toFixed(5);
      const support    = +(Math.min(...bars.slice(10, 55).map(b => b.low))).toFixed(5);
      const mid        = +((resistance + support) / 2).toFixed(5);
      series.createPriceLine({ price: resistance, color: RED,    lineWidth: 2, lineStyle: LineStyle.Solid,  title: 'Resistance' });
      series.createPriceLine({ price: support,    color: GREEN,  lineWidth: 2, lineStyle: LineStyle.Solid,  title: 'Support'    });
      series.createPriceLine({ price: mid,        color: AMBER,  lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'Mid'        });
      break;
    }

    case 'trend-lines': {
      const bars = genBars(70, 1.0750, 0.0020, 0.00025, 77);
      const series = cs();
      series.setData(bars);
      const trend = chart.addLineSeries({ color: PURPLE, lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
      trend.setData([
        { time: bars[4].time,             value: bars[4].low  },
        { time: bars[bars.length - 5].time, value: bars[bars.length - 5].low },
      ]);
      break;
    }

    case 'moving-averages': {
      const bars = genBars(100, 1.0800, 0.0025, 0.00008, 33);
      const series = cs();
      series.setData(bars);
      const s20 = sma(bars, 20);
      const s50 = sma(bars, 50);
      const ma20 = chart.addLineSeries({ color: TEAL,  lineWidth: 2, priceLineVisible: false, title: '20 SMA' });
      const ma50 = chart.addLineSeries({ color: AMBER, lineWidth: 2, priceLineVisible: false, title: '50 SMA' });
      ma20.setData(bars.map((b, i) => s20[i] !== null ? { time: b.time, value: s20[i]! } : null).filter(Boolean) as { time: string; value: number }[]);
      ma50.setData(bars.map((b, i) => s50[i] !== null ? { time: b.time, value: s50[i]! } : null).filter(Boolean) as { time: string; value: number }[]);
      break;
    }

    case 'bollinger': {
      const bars = genBars(80, 1.0850, 0.0022, 0, 55);
      const series = cs();
      series.setData(bars);
      const bb = bollinger(bars);
      const upper = chart.addLineSeries({ color: PURPLE, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, title: 'Upper' });
      const mid   = chart.addLineSeries({ color: 'rgba(255,255,255,0.35)', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, title: 'Mid' });
      const lower = chart.addLineSeries({ color: PURPLE, lineWidth: 1, priceLineVisible: false, lastValueVisible: false, title: 'Lower' });
      const bbData = bars.map((b, i) => bb[i].mid !== null ? { time: b.time, ...bb[i] } : null).filter(Boolean) as { time: string; upper: number; mid: number; lower: number }[];
      upper.setData(bbData.map(d => ({ time: d.time, value: d.upper })));
      mid.setData(bbData.map(d => ({ time: d.time, value: d.mid })));
      lower.setData(bbData.map(d => ({ time: d.time, value: d.lower })));
      break;
    }

    case 'fibonacci': {
      const bars = genBars(60, 1.0700, 0.0018, 0.0003, 22);
      const series = cs();
      series.setData(bars);
      const hi = Math.max(...bars.map(b => b.high));
      const lo = Math.min(...bars.map(b => b.low));
      const range = hi - lo;
      ([0, 0.236, 0.382, 0.5, 0.618, 1] as const).forEach(lvl => {
        const price = +(hi - lvl * range).toFixed(5);
        const colors: Record<number, string> = { 0: GREEN, 0.236: TEAL, 0.382: AMBER, 0.5: 'rgba(255,255,255,0.5)', 0.618: AMBER, 1: RED };
        series.createPriceLine({ price, color: colors[lvl], lineWidth: 1, lineStyle: LineStyle.Dashed, title: `${(lvl * 100).toFixed(1)}%` });
      });
      break;
    }

    case 'head-shoulders': {
      const bars = genHeadShoulders();
      const series = cs();
      series.setData(bars);
      series.createPriceLine({ price: 1.0820, color: PURPLE, lineWidth: 2, lineStyle: LineStyle.Solid, title: 'Neckline' });
      series.setMarkers([
        { time: bars[12].time, position: 'aboveBar', color: TEAL, shape: 'arrowDown', text: 'L. Shoulder' },
        { time: bars[35].time, position: 'aboveBar', color: RED,  shape: 'arrowDown', text: 'Head'        },
        { time: bars[57].time, position: 'aboveBar', color: TEAL, shape: 'arrowDown', text: 'R. Shoulder' },
      ]);
      break;
    }

    case 'flags': {
      const bars = genFlag();
      const series = cs();
      series.setData(bars);
      series.setMarkers([
        { time: bars[20].time, position: 'aboveBar', color: AMBER, shape: 'arrowDown', text: 'Flag Start' },
        { time: bars[40].time, position: 'aboveBar', color: GREEN, shape: 'arrowUp',   text: 'Breakout'   },
      ]);
      break;
    }

    case 'rsi': {
      if (!subEl) { cs().setData(genBars(80, 1.0850)); break; }
      const bars = genBars(80, 1.0850, 0.003, 0, 7);
      cs().setData(bars);
      const sub = createChart(subEl, { ...chartOpts(80), width: subEl.clientWidth });
      charts.push(sub);
      const rsiVals = rsi(bars);
      const rsiLine = sub.addLineSeries({ color: TEAL, lineWidth: 2, priceLineVisible: false });
      rsiLine.setData(bars.map((b, i) => rsiVals[i] !== null ? { time: b.time, value: rsiVals[i]! } : null).filter(Boolean) as { time: string; value: number }[]);
      rsiLine.createPriceLine({ price: 70, color: RED,   lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'OB 70' });
      rsiLine.createPriceLine({ price: 30, color: GREEN, lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'OS 30' });
      sub.applyOptions({ watermark: { color: 'rgba(255,255,255,0.12)', visible: true, text: 'RSI (14)', fontSize: 11, horzAlign: 'left', vertAlign: 'top' } });
      break;
    }

    case 'macd': {
      if (!subEl) { cs().setData(genBars(80, 1.0850)); break; }
      const bars = genBars(80, 1.0850, 0.003, 0, 9);
      cs().setData(bars);
      const sub = createChart(subEl, { ...chartOpts(80), width: subEl.clientWidth });
      charts.push(sub);
      const { line, sig, hist } = macd(bars);
      const histS = sub.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
      histS.setData(bars.slice(26).map((b, i) => ({ time: b.time, value: hist[i + 26], color: hist[i + 26] >= 0 ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)' })));
      const macdL = sub.addLineSeries({ color: TEAL,  lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
      const sigL  = sub.addLineSeries({ color: AMBER, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
      macdL.setData(bars.slice(26).map((b, i) => ({ time: b.time, value: line[i + 26] })));
      sigL.setData(bars.slice(26).map((b, i) => ({ time: b.time, value: sig[i + 26] })));
      sub.applyOptions({ watermark: { color: 'rgba(255,255,255,0.12)', visible: true, text: 'MACD (12,26,9)', fontSize: 11, horzAlign: 'left', vertAlign: 'top' } });
      break;
    }

    case 'volume': {
      if (!subEl) { cs().setData(genBars(80, 1.0850)); break; }
      const bars = genBars(80, 1.0850, 0.0025, 0, 13);
      cs().setData(bars);
      const sub = createChart(subEl, { ...chartOpts(80), width: subEl.clientWidth });
      charts.push(sub);
      const volS = sub.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
      const r = rng(77);
      volS.setData(bars.map(b => ({ time: b.time, value: +(500000 + r() * 800000).toFixed(0), color: b.close >= b.open ? 'rgba(16,185,129,0.55)' : 'rgba(239,68,68,0.55)' })));
      sub.applyOptions({ watermark: { color: 'rgba(255,255,255,0.12)', visible: true, text: 'Volume', fontSize: 11, horzAlign: 'left', vertAlign: 'top' } });
      break;
    }

    case 'backtest':
    case 'drawdown': {
      const r2 = rng(99);
      const base2 = new Date('2024-01-02');
      let eq = 10000;
      const equity: { time: string; value: number }[] = [];
      for (let i = 0; i < 80; i++) {
        const d = new Date(base2);
        d.setDate(d.getDate() + i * 3);
        if (d.getDay() === 0) d.setDate(d.getDate() + 1);
        eq += (r2() - 0.41) * 320;
        equity.push({ time: d.toISOString().slice(0, 10), value: +eq.toFixed(2) });
      }
      const line = chart.addLineSeries({ color: GREEN, lineWidth: 2, priceLineVisible: false });
      line.setData(equity);
      const peakI = equity.reduce((m, e, i) => e.value > equity[m].value ? i : m, 0);
      const troughI = equity.slice(peakI).reduce((m, e, i) => e.value < equity[peakI + m].value ? i : m, 0) + peakI;
      if (peakI < troughI) {
        const dd = chart.addLineSeries({ color: 'rgba(239,68,68,0.7)', lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
        dd.setData([{ time: equity[peakI].time, value: equity[peakI].value }, { time: equity[troughI].time, value: equity[troughI].value }]);
        line.createPriceLine({ price: equity[peakI].value, color: 'rgba(239,68,68,0.4)', lineWidth: 1, lineStyle: LineStyle.Dotted, title: 'Peak' });
      }
      chart.applyOptions({ watermark: { color: 'rgba(255,255,255,0.06)', visible: true, text: 'Equity Curve', fontSize: 13, horzAlign: 'center', vertAlign: 'center' } });
      break;
    }

    case 'price-action':
    case 'market-structure': {
      const bars = genBars(80, 1.0780, 0.0022, 0.00015, 44);
      const series = cs();
      series.setData(bars);
      const highs = bars.map((b, i) => ({ b, i })).filter(({ b, i }) => i > 2 && i < bars.length - 2 && b.high > bars[i - 1].high && b.high > bars[i + 1].high && b.high > bars[i - 2].high);
      const lows  = bars.map((b, i) => ({ b, i })).filter(({ b, i }) => i > 2 && i < bars.length - 2 && b.low < bars[i - 1].low  && b.low < bars[i + 1].low  && b.low < bars[i - 2].low);
      const markers = [
        ...highs.slice(0, 2).map(({ b }, idx) => ({ time: b.time, position: 'aboveBar' as const, color: TEAL, shape: 'arrowDown' as const, text: idx === 0 ? 'HH' : 'LH' })),
        ...lows.slice(0, 2).map(({ b }, idx) => ({ time: b.time, position: 'belowBar' as const, color: AMBER, shape: 'arrowUp' as const, text: idx === 0 ? 'HL' : 'LL' })),
      ];
      if (markers.length) series.setMarkers(markers.sort((a, b) => a.time < b.time ? -1 : 1));
      break;
    }

    case 'bos': {
      const bars = genBars(70, 1.0800, 0.0022, 0.0002, 61);
      const series = cs();
      series.setData(bars);
      const peakB = bars.reduce((m, b) => b.high > m.high ? b : m, bars[0]);
      series.createPriceLine({ price: peakB.high, color: PURPLE, lineWidth: 2, lineStyle: LineStyle.Solid, title: 'BOS Level' });
      series.setMarkers([{ time: peakB.time, position: 'aboveBar', color: RED, shape: 'arrowDown', text: 'BOS ↑' }]);
      break;
    }

    case 'choch': {
      const bars = genBars(70, 1.0920, 0.0022, -0.0002, 63);
      const series = cs();
      series.setData(bars);
      const troughB = bars.reduce((m, b) => b.low < m.low ? b : m, bars[0]);
      series.createPriceLine({ price: troughB.low, color: PURPLE, lineWidth: 2, lineStyle: LineStyle.Solid, title: 'CHoCH Level' });
      series.setMarkers([{ time: troughB.time, position: 'belowBar', color: GREEN, shape: 'arrowUp', text: 'CHoCH ↓' }]);
      break;
    }

    case 'order-blocks': {
      const bars = genBars(80, 1.0800, 0.0022, 0.0001, 37);
      const series = cs();
      series.setData(bars);
      const obIdx = Math.floor(bars.length * 0.35);
      series.createPriceLine({ price: bars[obIdx].high, color: AMBER, lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'OB High' });
      series.createPriceLine({ price: bars[obIdx].low,  color: AMBER, lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'OB Low'  });
      series.setMarkers([{ time: bars[obIdx].time, position: 'belowBar', color: AMBER, shape: 'square', text: 'Order Block' }]);
      break;
    }

    case 'fvg': {
      const bars = genBars(60, 1.0820, 0.0018, 0, 29);
      const series = cs();
      series.setData(bars);
      const fi = 28;
      if (fi > 0 && fi < bars.length - 1) {
        series.createPriceLine({ price: bars[fi - 1].low,  color: TEAL, lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'FVG Top' });
        series.createPriceLine({ price: bars[fi + 1].high, color: TEAL, lineWidth: 1, lineStyle: LineStyle.Dashed, title: 'FVG Bot' });
        series.setMarkers([{ time: bars[fi].time, position: 'aboveBar', color: TEAL, shape: 'square', text: 'FVG' }]);
      }
      break;
    }
  }

  chart.timeScale().fitContent();
  return charts;
}

// ─── Component ────────────────────────────────────────────────────────────────
const NEEDS_SUB = new Set(['rsi', 'macd', 'volume']);

export default function LessonChart({ type }: { type: string }) {
  const mainRef = useRef<HTMLDivElement>(null);
  const subRef  = useRef<HTMLDivElement>(null);
  const hasSub  = NEEDS_SUB.has(type);

  useEffect(() => {
    if (!mainRef.current) return;
    const charts = build(type, mainRef.current, hasSub ? (subRef.current ?? undefined) : undefined);

    const ro = new ResizeObserver(() => {
      if (mainRef.current) charts[0]?.applyOptions({ width: mainRef.current.clientWidth });
      if (subRef.current  && charts[1]) charts[1].applyOptions({ width: subRef.current.clientWidth });
    });
    ro.observe(mainRef.current);

    return () => { ro.disconnect(); charts.forEach(c => c.remove()); };
  }, [type, hasSub]);

  return (
    <div style={{ background: BG, borderRadius: '12px', overflow: 'hidden', padding: '8px 8px 4px' }}>
      <div ref={mainRef} style={{ height: hasSub ? 195 : 260, width: '100%' }} />
      {hasSub && <div ref={subRef} style={{ height: 80, width: '100%', marginTop: 2 }} />}
    </div>
  );
}
