'use client';
import { memo, lazy, Suspense, useState, useEffect } from 'react';

const LessonChart = lazy(() => import('./TradingViewChart'));

const CHART_TYPES = new Set([
  'intro-ta',
  'candlestick-basics', 'candlestick-adv', 'support-resistance', 'trend-lines',
  'moving-averages', 'rsi', 'macd', 'bollinger', 'fibonacci', 'head-shoulders',
  'flags', 'volume', 'backtest', 'drawdown', 'live-chart', 'price-action',
  'market-structure', 'bos', 'choch', 'order-blocks', 'fvg', 'chart',
  // Bevan's Three-Candle Strategy
  'tc-structure', 'tc-supply-demand', 'tc-liquidity', 'tc-mtf', 'tc-walkthrough',
]);

function getVisualType(title: string, _courseId: number): string { // eslint-disable-line @typescript-eslint/no-unused-vars
  const t = title.toLowerCase();

  // Beginner course
  if (t.includes('what is the forex') || t.includes('what is forex')) return 'forex-market';
  if (t.includes('major, minor') || t.includes('major') && t.includes('exotic')) return 'currency-pairs';
  if (t.includes('understanding pips') || t.includes('pips, lots')) return 'pips-lots';
  if (t.includes('reading forex quotes') || t.includes('forex quotes')) return 'spread';
  if (t.includes('market sessions') || (t.includes('session') && t.includes('london'))) return 'sessions';
  if (t.includes('order types') || t.includes('market, limit')) return 'orders';
  if (t.includes('first demo trade') || t.includes('demo trade')) return 'demo-trade';
  if (t.includes('how brokers work') || t.includes('brokers work')) return 'broker';
  if (t.includes('fundamental vs technical')) return 'fund-vs-tech';
  if (t.includes('economic indicators')) return 'economic';
  if (t.includes('building a trading routine') || t.includes('trading routine')) return 'routine';

  // Technical analysis course
  if (t.includes('introduction to technical')) return 'intro-ta';
  if (t.includes('candlestick patterns: advanced') || t.includes('candlestick') && t.includes('advanced')) return 'candlestick-adv';
  if (t.includes('candlestick patterns: basics') || t.includes('candlestick') && t.includes('basics')) return 'candlestick-basics';
  if (t.includes('candlestick')) return 'candlestick-basics';
  if (t.includes('support') && t.includes('resistance')) return 'support-resistance';
  if (t.includes('trend lines') || t.includes('trend line') && t.includes('channel')) return 'trend-lines';
  if (t.includes('head') && t.includes('shoulder')) return 'head-shoulders';
  if (t.includes('flags') && t.includes('pennant')) return 'flags';
  if (t.includes('flag') || t.includes('pennant')) return 'flags';
  if (t.includes('moving average')) return 'moving-averages';
  if (t.includes('rsi &') || t.includes('rsi &amp;') || (t.includes('rsi') && t.includes('stochastic'))) return 'rsi';
  if (t.includes('macd')) return 'macd';
  if (t.includes('bollinger')) return 'bollinger';
  if (t.includes('fibonacci')) return 'fibonacci';
  if (t.includes('volume analysis') || (t.includes('volume') && !t.includes('indicator'))) return 'volume';
  if (t.includes('multi-timeframe') || t.includes('multi timeframe')) return 'multi-timeframe';
  if (t.includes('building a technical strategy')) return 'strategy';
  if (t.includes('backtesting your setup') || t.includes('backtesting strategies')) return 'backtest';
  if (t.includes('live chart walkthroughs') || t.includes('live trade examples')) return 'live-chart';

  // Risk management course — order matters: check longer/specific strings first
  if (t.includes('why most traders fail')) return 'why-fail';
  if (t.includes('risk/reward') || t.includes('risk reward') || (t.includes('risk') && t.includes('reward'))) return 'risk-reward';
  if (t.includes('position siz')) return 'position-sizing';
  if (t.includes('setting stop loss') || t.includes('stop loss') && t.includes('take profit')) return 'stop-loss';
  if (t.includes('managing drawdown') || t.includes('drawdown & risk') || t.includes('drawdown &amp;')) return 'drawdown';
  if (t.includes('psychology of loss') || t.includes('trading psychology') || t.includes('psycholog')) return 'psychology';
  if (t.includes('overcoming revenge') || t.includes('revenge trading')) return 'revenge';
  if (t.includes('building a trading journal') || t.includes('trading journal')) return 'journal';
  if (t.includes('creating a trading plan') || t.includes('trading plan')) return 'trading-plan';

  // PAMM course
  if (t.includes('what is a pamm') || t.includes('pamm account')) return 'pamm-intro';
  if (t.includes('pamm profit sharing') || t.includes('profit sharing')) return 'pamm-sharing';
  if (t.includes('evaluating a pamm') || t.includes('evaluating')) return 'pamm-eval';
  if (t.includes('reading performance statistics') || t.includes('performance statistics')) return 'pamm-stats';
  if (t.includes('diversifying across') || t.includes('diversif')) return 'pamm-diversify';
  if (t.includes('withdrawal strateg')) return 'pamm-withdrawal';

  // Price action course
  if (t.includes('introduction to price action')) return 'price-action';
  if (t.includes('market structure') && (t.includes('high') || t.includes('low'))) return 'market-structure';
  if (t.includes('breaks of structure')) return 'bos';
  if (t.includes('change of character') || t.includes('choch')) return 'choch';
  if (t.includes('order block')) return 'order-blocks';
  if (t.includes('fair value gap') || t.includes('fvg')) return 'fvg';
  if (t.includes('liquidity zone') || t.includes('liquidity')) return 'liquidity';
  if (t.includes('smart money')) return 'smart-money';
  if (t.includes('session timing')) return 'session-timing';
  if (t.includes('confluence')) return 'confluence';
  if (t.includes('trade management with price action')) return 'trade-mgmt';
  if (t.includes('scalping') || t.includes('swing trading')) return 'scalp-swing';
  if (t.includes('building your pa strategy') || t.includes('pa strategy')) return 'pa-strategy';

  // Bevan's Three-Candle Strategy (Course 7)
  if (t.includes('three-candle philosophy') || t.includes('introduction: the three')) return 'tc-intro';
  if (t.includes('market structure') && t.includes('swing')) return 'tc-structure';
  if (t.includes('supply') && t.includes('demand') && t.includes('zone')) return 'tc-supply-demand';
  if (t.includes('liquidity sweep') || (t.includes('liquidity') && t.includes('smart money'))) return 'tc-liquidity';
  if (t.includes('three-candle bullish') || (t.includes('three-candle') && t.includes('bullish'))) return 'tc-bullish';
  if (t.includes('three-candle bearish') || (t.includes('three-candle') && t.includes('bearish'))) return 'tc-bearish';
  if (t.includes('amd') || t.includes('accumulation') || (t.includes('market phase') && t.includes('distribution'))) return 'tc-amd';
  if (t.includes('multi-timeframe analysis') && !t.includes('building')) return 'tc-mtf';
  if (t.includes('entry confirmation') || (t.includes('entry') && t.includes('lower timeframe'))) return 'tc-entry';
  if (t.includes('common mistake') || (t.includes('mistake') && t.includes('exercise'))) return 'tc-mistakes';
  if (t.includes('full strategy walkthrough') || (t.includes('strategy') && t.includes('walkthrough'))) return 'tc-walkthrough';

  // EA / Automated trading course
  if (t.includes('introduction to automated')) return 'ea-intro';
  if (t.includes('metatrader 4') || t.includes('metatrader 5') || t.includes('mt4') || t.includes('mt5')) return 'metatrader';
  if (t.includes('mql4') || t.includes('mql5') || t.includes('mql4/5')) return 'mql';
  if (t.includes('first ea') || t.includes('ea: structure') || t.includes('ea structure')) return 'ea-structure';
  if (t.includes('entry') && t.includes('exit') && t.includes('condition') && t.includes('code')) return 'ea-entries';
  if (t.includes('risk management in code')) return 'ea-risk';
  if (t.includes('optimizing parameter')) return 'optimize';
  if (t.includes('avoiding curve fitting') || t.includes('curve fitting')) return 'curve-fitting';
  if (t.includes('forward testing')) return 'forward-test';
  if (t.includes('running ea') || t.includes('vps')) return 'vps';
  if (t.includes('common ea pitfall') || t.includes('ea pitfall')) return 'ea-pitfalls';
  if (t.includes('community ea') || t.includes('community resource')) return 'community';

  // Shared / generic
  if (t.includes('session')) return 'sessions';
  if (t.includes('final') || t.includes('assessment')) return 'assessment';

  return 'chart';
}

// ─── SVG COMPONENTS ──────────────────────────────────────────────────────────

function ForexMarketSVG() {
  const currencies = [
    { symbol: '€', label: 'EUR', angle: 270 },
    { symbol: '$', label: 'USD', angle: 342 },
    { symbol: '£', label: 'GBP', angle: 54 },
    { symbol: '¥', label: 'JPY', angle: 126 },
    { symbol: 'A$', label: 'AUD', angle: 198 },
  ];
  const cx = 300, cy = 120, r = 85;
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      {currencies.map((c, i) => {
        const rad = (c.angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx={x} cy={y} r="22" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{c.symbol}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="36" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.8)" strokeWidth="2" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">$7.5T</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Daily</text>
      <rect x="60" y="205" width="145" height="38" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      <text x="132" y="221" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">MARKET TYPE</text>
      <text x="132" y="236" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">24/5 Global</text>
      <rect x="227" y="205" width="145" height="38" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      <text x="300" y="221" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">STRUCTURE</text>
      <text x="300" y="236" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OTC Market</text>
      <rect x="394" y="205" width="145" height="38" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      <text x="467" y="221" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">VOLUME</text>
      <text x="467" y="236" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Most Liquid</text>
    </svg>
  );
}

function CurrencyPairsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="30" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">CURRENCY PAIR STRUCTURE</text>
      <rect x="80" y="45" width="160" height="60" rx="8" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="2" />
      <text x="160" y="72" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">EUR</text>
      <text x="160" y="96" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11">BASE CURRENCY</text>
      <text x="300" y="82" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="28">/</text>
      <text x="300" y="105" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">= 1.0850</text>
      <rect x="360" y="45" width="160" height="60" rx="8" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
      <text x="440" y="72" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">USD</text>
      <text x="440" y="96" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11">QUOTE CURRENCY</text>
      <line x1="160" y1="105" x2="160" y2="125" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="160" y="138" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">1 EUR buys 1.0850 USD</text>
      <rect x="40" y="155" width="155" height="88" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="117" y="170" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">MAJORS</text>
      <text x="117" y="184" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">EUR/USD · GBP/USD</text>
      <text x="117" y="196" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">USD/JPY · USD/CHF</text>
      <text x="117" y="208" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">AUD/USD · USD/CAD</text>
      <text x="117" y="220" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">NZD/USD</text>
      <text x="117" y="235" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Tightest spreads · Most liquid</text>
      <rect x="222" y="155" width="155" height="88" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="300" y="173" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">MINORS</text>
      <text x="300" y="190" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">EUR/GBP · EUR/JPY</text>
      <text x="300" y="206" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">GBP/JPY · AUD/NZD</text>
      <text x="300" y="222" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">No USD involved</text>
      <text x="300" y="235" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Moderate spreads</text>
      <rect x="404" y="155" width="155" height="88" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="482" y="173" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">EXOTICS</text>
      <text x="482" y="190" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">USD/TRY · EUR/ZAR</text>
      <text x="482" y="206" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">USD/MXN · USD/SGD</text>
      <text x="482" y="222" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Emerging markets</text>
      <text x="482" y="235" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Wide spreads</text>
    </svg>
  );
}

function PipsLotsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <rect x="60" y="10" width="480" height="30" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">1 PIP = 0.0001 (4th decimal) · JPY pairs: 0.01 (2nd decimal)</text>
      <rect x="40" y="55" width="155" height="120" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
      <text x="117" y="78" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="12" fontWeight="bold">STANDARD LOT</text>
      <text x="117" y="100" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">100k</text>
      <text x="117" y="116" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">units</text>
      <line x1="60" y1="125" x2="174" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="117" y="142" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="bold">$10 / pip</text>
      <text x="117" y="162" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">High capital req.</text>
      <rect x="222" y="55" width="155" height="120" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <text x="300" y="78" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="bold">MINI LOT</text>
      <text x="300" y="100" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">10k</text>
      <text x="300" y="116" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">units</text>
      <line x1="242" y1="125" x2="357" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="300" y="142" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="bold">$1 / pip</text>
      <text x="300" y="162" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Good for learners</text>
      <rect x="404" y="55" width="155" height="120" rx="8" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
      <text x="482" y="78" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="12" fontWeight="bold">MICRO LOT</text>
      <text x="482" y="100" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">1k</text>
      <text x="482" y="116" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">units</text>
      <line x1="424" y1="125" x2="539" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="482" y="142" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="13" fontWeight="bold">$0.10 / pip</text>
      <text x="482" y="162" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Beginners practice</text>
      <rect x="40" y="188" width="520" height="58" rx="8" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="60" y="210" fill="rgba(239,68,68,0.9)" fontSize="14">!</text>
      <text x="78" y="210" fill="rgba(239,68,68,0.9)" fontSize="12" fontWeight="bold">WARNING: </text>
      <text x="168" y="210" fill="rgba(255,255,255,0.8)" fontSize="12">Leverage amplifies both gains AND losses</text>
      <text x="78" y="232" fill="rgba(255,255,255,0.5)" fontSize="10">100:1 leverage means $1,000 controls $100,000 — a 1% move = 100% of your capital</text>
    </svg>
  );
}

function SpreadSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="24" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">BID / ASK SPREAD</text>
      <rect x="30" y="40" width="200" height="90" rx="8" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.6)" strokeWidth="2" />
      <text x="130" y="66" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="11">BID PRICE</text>
      <text x="130" y="100" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">1.08495</text>
      <text x="130" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">You SELL here</text>
      <rect x="370" y="40" width="200" height="90" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
      <text x="470" y="66" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="11">ASK PRICE</text>
      <text x="470" y="100" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">1.08510</text>
      <text x="470" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">You BUY here</text>
      <line x1="240" y1="85" x2="360" y2="85" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <rect x="255" y="68" width="90" height="34" rx="4" fill="rgba(0,0,0,0.6)" />
      <text x="300" y="82" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">SPREAD</text>
      <text x="300" y="96" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="12" fontWeight="bold">= 1.5 pips</text>
      <rect x="100" y="148" width="400" height="30" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="300" y="167" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">You SELL at Bid  |  You BUY at Ask</text>
      <rect x="150" y="192" width="300" height="54" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="212" textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="10" fontWeight="bold">BROKER PROFIT</text>
      <text x="300" y="232" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Spread = broker's commission on each trade</text>
      <text x="300" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Lower spread = cheaper trading costs</text>
    </svg>
  );
}

function SessionsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="22" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FOREX TRADING SESSIONS (GMT)</text>
      {[0,2,4,6,8,10,12,14,16,18,20,22,24].map((h, i) => {
        const x = 40 + (h / 24) * 520;
        return (
          <g key={i}>
            <line x1={x} y1="35" x2={x} y2="145" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <text x={x} y="155" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">{String(h).padStart(2,'0')}</text>
          </g>
        );
      })}
      <rect x="40" y="40" width={195} height="32" rx="4" fill="rgba(59,130,246,0.4)" stroke="rgba(59,130,246,0.7)" strokeWidth="1" />
      <text x="137" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">TOKYO  00:00–09:00</text>
      <rect x={40+8/24*520} y="80" width={195} height="32" rx="4" fill="rgba(16,185,129,0.4)" stroke="rgba(16,185,129,0.7)" strokeWidth="1" />
      <text x={40+12.5/24*520} y="100" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">LONDON  08:00–17:00</text>
      <rect x={40+13/24*520} y="120" width={195} height="32" rx="4" fill="rgba(245,158,11,0.4)" stroke="rgba(245,158,11,0.7)" strokeWidth="1" />
      <text x={40+17.5/24*520} y="140" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">NEW YORK  13:00–22:00</text>
      <rect x={40+13/24*520} y="38" width={86} height="106" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,100,0.5)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={40+15/24*520} y="162" textAnchor="middle" fill="rgba(255,255,100,0.9)" fontSize="10" fontWeight="bold">London+NY</text>
      <text x={40+15/24*520} y="175" textAnchor="middle" fill="rgba(255,255,100,0.7)" fontSize="9">13:00–17:00</text>
      <rect x="115" y="192" width="370" height="52" rx="8" fill="rgba(255,220,0,0.08)" stroke="rgba(255,220,0,0.3)" strokeWidth="1.5" />
      <text x="300" y="212" textAnchor="middle" fill="rgba(255,220,0,0.9)" fontSize="12" fontWeight="bold">Best Time to Trade: 13:00–17:00 GMT</text>
      <text x="300" y="232" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">London &amp; New York overlap = highest volume &amp; tightest spreads</text>
    </svg>
  );
}

function OrdersSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">ORDER TYPES</text>
      <rect x="20" y="35" width="170" height="150" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
      <text x="105" y="58" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">MARKET ORDER</text>
      <line x1="60" y1="68" x2="150" y2="68" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="105" y="88" textAnchor="middle" fill="white" fontSize="22">→</text>
      <text x="105" y="108" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10">Instant execution</text>
      <text x="105" y="124" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Buys/Sells NOW</text>
      <text x="105" y="138" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">at current price</text>
      <text x="105" y="155" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Best for: quick entry</text>
      <text x="105" y="168" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">May slip in fast market</text>
      <rect x="215" y="35" width="170" height="150" rx="8" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.6)" strokeWidth="2" />
      <text x="300" y="58" textAnchor="middle" fill="rgba(99,180,255,0.9)" fontSize="11" fontWeight="bold">LIMIT ORDER</text>
      <line x1="235" y1="68" x2="365" y2="68" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
      <line x1="250" y1="95" x2="350" y2="95" stroke="rgba(99,180,255,0.8)" strokeWidth="2" strokeDasharray="5,3" />
      <text x="300" y="115" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10">Target price level</text>
      <text x="300" y="131" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Executes at your</text>
      <text x="300" y="145" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">price or better</text>
      <text x="300" y="161" textAnchor="middle" fill="rgba(99,180,255,0.7)" fontSize="9">Best for: planned entry</text>
      <text x="300" y="174" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">May not fill if price misses</text>
      <rect x="410" y="35" width="170" height="150" rx="8" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.6)" strokeWidth="2" />
      <text x="495" y="58" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">STOP ORDER</text>
      <line x1="430" y1="68" x2="560" y2="68" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <line x1="450" y1="100" x2="540" y2="100" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="495" y="92" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8">trigger level</text>
      <text x="495" y="118" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Triggers when price</text>
      <text x="495" y="132" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">hits the level</text>
      <text x="495" y="148" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8">Stop Loss: limits risk</text>
      <text x="495" y="162" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="8">Take Profit: locks gains</text>
      <text x="495" y="174" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Used for breakouts too</text>
      <rect x="40" y="200" width="520" height="48" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="218" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Always use Stop Loss and Take Profit orders to manage every trade</text>
      <text x="300" y="236" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Market orders fill immediately · Pending orders (Limit/Stop) wait for price to reach your level</text>
    </svg>
  );
}

function DemoTradeSVG() {
  const steps = [
    { n: '1', label: 'Choose Pair', sub: 'EUR/USD', color: 'rgba(99,102,241,0.7)' },
    { n: '2', label: 'Check Spread', sub: '1.5 pips', color: 'rgba(59,130,246,0.7)' },
    { n: '3', label: 'Direction', sub: 'Buy / Sell', color: 'rgba(16,185,129,0.7)' },
    { n: '4', label: 'Lot Size', sub: '0.01 lot', color: 'rgba(245,158,11,0.7)' },
    { n: '5', label: 'Set SL + TP', sub: '20 / 40 pips', color: 'rgba(239,68,68,0.7)' },
    { n: '6', label: 'Execute', sub: 'Place order', color: 'rgba(16,185,129,0.9)' },
  ];
  const xs = [50, 140, 230, 320, 410, 500];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">YOUR FIRST DEMO TRADE — STEP BY STEP</text>
      {steps.map((s, i) => (
        <g key={i}>
          {i < steps.length - 1 && (
            <line x1={xs[i] + 38} y1="85" x2={xs[i+1] - 8} y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
          )}
          <circle cx={xs[i] + 15} cy="85" r="28" fill={s.color.replace('0.7','0.15').replace('0.9','0.15')} stroke={s.color} strokeWidth="2" />
          <text x={xs[i]+15} y="81" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{s.n}</text>
          <text x={xs[i]+15} y="130" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="bold">{s.label}</text>
          <text x={xs[i]+15} y="143" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">{s.sub}</text>
        </g>
      ))}
      <rect x="40" y="160" width="520" height="36" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="178" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Practice minimum 2 weeks on demo before going live</text>
      <text x="300" y="192" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Demo accounts use virtual money — treat every trade as if it were real</text>
      <rect x="40" y="208" width="520" height="40" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="224" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Goal: Build consistency, not profits. Focus on the process.</text>
      <text x="300" y="240" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Track every demo trade in a journal — review weekly</text>
    </svg>
  );
}

function BrokerSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">BROKER TYPES</text>
      <rect x="20" y="35" width="255" height="155" rx="8" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
      <text x="147" y="58" textAnchor="middle" fill="rgba(99,180,255,0.9)" fontSize="12" fontWeight="bold">MARKET MAKER</text>
      <rect x="110" y="65" width="75" height="30" rx="4" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
      <text x="147" y="84" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Dealing Desk</text>
      <text x="147" y="110" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Fixed spreads</text>
      <text x="147" y="126" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Takes opposite side of trade</text>
      <text x="147" y="142" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">No commission (spread only)</text>
      <text x="147" y="162" textAnchor="middle" fill="rgba(99,180,255,0.8)" fontSize="10" fontWeight="bold">Good for beginners</text>
      <text x="147" y="178" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Conflict of interest risk</text>
      <rect x="325" y="35" width="255" height="155" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
      <text x="452" y="58" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="bold">ECN / STP</text>
      <rect x="415" y="65" width="75" height="30" rx="4" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="452" y="84" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Direct Market</text>
      <text x="452" y="110" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Variable spreads + commission</text>
      <text x="452" y="126" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Routes orders to market</text>
      <text x="452" y="142" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">No dealing desk conflict</text>
      <text x="452" y="162" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">Better for scalpers</text>
      <text x="452" y="178" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Lower spread in liquid hours</text>
      <text x="283" y="85" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11">VS</text>
      <rect x="40" y="205" width="520" height="42" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.35)" strokeWidth="1.5" />
      <text x="300" y="222" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">Always verify regulation before depositing</text>
      <text x="300" y="238" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">FCA (UK) · ASIC (Australia) · CySEC (Cyprus) · NFA (USA)</text>
    </svg>
  );
}

function FundVsTechSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FUNDAMENTAL vs TECHNICAL ANALYSIS</text>
      <rect x="20" y="35" width="245" height="170" rx="8" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
      <text x="142" y="58" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="12" fontWeight="bold">FUNDAMENTAL</text>
      <text x="142" y="73" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">WHY price moves</text>
      <line x1="40" y1="80" x2="245" y2="80" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
      {['Interest Rates','CPI / Inflation','GDP Growth','NFP (Jobs Data)','Central Bank Policy'].map((item, i) => (
        <g key={i}>
          <circle cx="45" cy={96 + i*22} r="4" fill="rgba(245,158,11,0.6)" />
          <text x="56" y={100 + i*22} fill="rgba(255,255,255,0.8)" fontSize="10">{item}</text>
        </g>
      ))}
      <text x="142" y="210" textAnchor="middle" fill="rgba(245,158,11,0.6)" fontSize="9">Long-term view · News events</text>
      <rect x="335" y="35" width="245" height="170" rx="8" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <text x="457" y="58" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="12" fontWeight="bold">TECHNICAL</text>
      <text x="457" y="73" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">WHERE price moves</text>
      <line x1="355" y1="80" x2="560" y2="80" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
      {['Price Charts &amp; Patterns','Support / Resistance','Moving Averages','RSI / MACD / BB','Candlestick Signals'].map((item, i) => (
        <g key={i}>
          <circle cx="360" cy={96 + i*22} r="4" fill="rgba(99,102,241,0.6)" />
          <text x="371" y={100 + i*22} fill="rgba(255,255,255,0.8)" fontSize="10">{item}</text>
        </g>
      ))}
      <text x="457" y="210" textAnchor="middle" fill="rgba(99,102,241,0.6)" fontSize="9">Short-term view · Chart-based</text>
      <text x="300" y="107" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="14" fontWeight="bold">VS</text>
      <rect x="100" y="218" width="400" height="32" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="238" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="bold">Professionals use BOTH for edge</text>
    </svg>
  );
}

function EconomicSVG() {
  const rows = [
    { name: 'Non-Farm Payrolls (NFP)', impact: '★★★', level: 'HIGH', freq: '1st Fri/Mo', asset: 'USD pairs', c: 'rgba(239,68,68,0.8)' },
    { name: 'CPI (Inflation)', impact: '★★★', level: 'HIGH', freq: 'Monthly', asset: 'All pairs', c: 'rgba(239,68,68,0.8)' },
    { name: 'GDP Release', impact: '★★', level: 'MED', freq: 'Quarterly', asset: 'Indices', c: 'rgba(245,158,11,0.8)' },
    { name: 'PMI Manufacturing', impact: '★★', level: 'MED', freq: 'Monthly', asset: 'Comm. pairs', c: 'rgba(245,158,11,0.8)' },
    { name: 'Interest Rate Decision', impact: '★★★', level: 'HIGH', freq: 'Per meeting', asset: 'All markets', c: 'rgba(239,68,68,0.8)' },
  ];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">ECONOMIC CALENDAR — KEY INDICATORS</text>
      <rect x="20" y="26" width="560" height="22" rx="4" fill="rgba(255,255,255,0.07)" />
      {['INDICATOR','IMPACT','FREQ','ASSET'].map((h, i) => (
        <text key={i} x={[30,220,340,450][i]} y="41" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="bold">{h}</text>
      ))}
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="20" y={50+i*33} width="560" height="30" rx="3" fill={i%2===0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)'} />
          <text x="30" y={69+i*33} fill="rgba(255,255,255,0.8)" fontSize="10">{r.name}</text>
          <text x="220" y={69+i*33} fill={r.c} fontSize="11">{r.impact}</text>
          <rect x="256" y={54+i*33} width="32" height="16" rx="3" fill={r.c.replace('0.8','0.2')} />
          <text x="272" y={66+i*33} textAnchor="middle" fill={r.c} fontSize="8" fontWeight="bold">{r.level}</text>
          <text x="340" y={69+i*33} fill="rgba(255,255,255,0.6)" fontSize="9">{r.freq}</text>
          <text x="450" y={69+i*33} fill="rgba(255,255,255,0.6)" fontSize="9">{r.asset}</text>
        </g>
      ))}
      <rect x="20" y="220" width="560" height="30" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="300" y="239" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">Avoid trading 15 min before/after HIGH-impact news releases</text>
    </svg>
  );
}

function RoutineSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">DAILY TRADING ROUTINE</text>
      <line x1="40" y1="85" x2="560" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {[40,215,390,560].map((x,i) => (
        <circle key={i} cx={x} cy="85" r="6" fill={i===3?'rgba(255,255,255,0.1)':'rgba(99,102,241,0.7)'} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      ))}
      <rect x="20" y="100" width="170" height="100" rx="8" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
      <text x="105" y="118" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">PRE-MARKET</text>
      <text x="105" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">08:00 GMT</text>
      <text x="105" y="147" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Check economic calendar</text>
      <text x="105" y="161" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Review higher timeframes</text>
      <text x="105" y="175" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Mark key S/R levels</text>
      <text x="105" y="189" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Note daily bias</text>
      <rect x="210" y="100" width="170" height="100" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="295" y="118" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">IN-SESSION</text>
      <text x="295" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">13:00–17:00 GMT</text>
      <text x="295" y="147" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Monitor setups only</text>
      <text x="295" y="161" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Wait for confirmation</text>
      <text x="295" y="175" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Execute plan-based trades</text>
      <text x="295" y="189" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">No impulse trades</text>
      <rect x="400" y="100" width="170" height="100" rx="8" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="485" y="118" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">POST-SESSION</text>
      <text x="485" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">After close</text>
      <text x="485" y="147" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Review all trades taken</text>
      <text x="485" y="161" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Update trading journal</text>
      <text x="485" y="175" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Identify improvements</text>
      <text x="485" y="189" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Weekly review on Sunday</text>
      <rect x="100" y="215" width="400" height="32" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="235" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Consistency in routine = consistency in results</text>
    </svg>
  );
}


function IntroTaSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TECHNICAL ANALYSIS — READING PRICE TO PREDICT MOVES</text>
      <polyline points="40,180 80,160 110,170 150,130 180,145 220,100 260,115 300,85 340,100 380,70 420,88 460,65 500,80 540,60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="40" y1="135" x2="280" y2="135" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="42" y="130" fill="rgba(16,185,129,0.8)" fontSize="8">Support</text>
      <line x1="200" y1="90" x2="540" y2="90" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="430" y="86" fill="rgba(239,68,68,0.8)" fontSize="8">Resistance</text>
      <line x1="40" y1="180" x2="460" y2="65" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="180" y="168" fill="rgba(245,158,11,0.7)" fontSize="8">Trend Line</text>
      <polyline points="40,185 80,178 120,170 160,162 200,154 240,147 280,140 320,133 360,127 400,122 440,118 480,115 520,114 540,113" fill="none" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5" />
      <text x="510" y="110" fill="rgba(99,102,241,0.8)" fontSize="8">MA</text>
      <rect x="148" y="122" width="10" height="14" rx="1" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1" />
      <line x1="153" y1="118" x2="153" y2="140" stroke="rgba(16,185,129,0.8)" strokeWidth="1" />
      <text x="166" y="134" fill="rgba(255,255,255,0.5)" fontSize="7">Candle</text>
      <rect x="30" y="200" width="540" height="50" rx="6" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="215" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">THREE CORE ASSUMPTIONS OF TECHNICAL ANALYSIS</text>
      <text x="300" y="229" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">1. Price discounts everything  ·  2. Price moves in trends  ·  3. History repeats</text>
      <text x="300" y="243" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Support · Resistance · Trend lines · Indicators · Candlesticks</text>
    </svg>
  );
}

function CandlestickBasicsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">CANDLESTICK ANATOMY</text>
      <line x1="120" y1="40" x2="120" y2="220" stroke="rgba(16,185,129,0.8)" strokeWidth="2" />
      <rect x="100" y="95" width="40" height="85" rx="2" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <line x1="120" y1="40" x2="80" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="72" y="44" textAnchor="end" fill="rgba(255,255,255,0.7)" fontSize="10">HIGH</text>
      <line x1="120" y1="95" x2="80" y2="95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="72" y="99" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="10">CLOSE</text>
      <line x1="120" y1="180" x2="80" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="72" y="184" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="10">OPEN</text>
      <line x1="120" y1="220" x2="80" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="72" y="224" textAnchor="end" fill="rgba(255,255,255,0.7)" fontSize="10">LOW</text>
      <text x="152" y="56" fill="rgba(255,255,255,0.5)" fontSize="10">Upper Wick</text>
      <text x="152" y="137" fill="rgba(16,185,129,0.8)" fontSize="10">Body (Bullish)</text>
      <text x="152" y="215" fill="rgba(255,255,255,0.5)" fontSize="10">Lower Wick</text>
      <text x="290" y="38" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Doji</text>
      <line x1="290" y1="50" x2="290" y2="130" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <rect x="284" y="87" width="12" height="2" rx="1" fill="rgba(255,255,255,0.9)" />
      <text x="290" y="145" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Indecision</text>
      <text x="360" y="38" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Hammer</text>
      <line x1="360" y1="60" x2="360" y2="130" stroke="rgba(16,185,129,0.8)" strokeWidth="2" />
      <rect x="352" y="60" width="16" height="22" rx="2" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <text x="360" y="145" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">Bullish Rev.</text>
      <text x="432" y="38" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Shoot.Star</text>
      <line x1="432" y1="50" x2="432" y2="130" stroke="rgba(239,68,68,0.8)" strokeWidth="2" />
      <rect x="424" y="108" width="16" height="22" rx="2" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" />
      <text x="432" y="145" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="9">Bearish Rev.</text>
      <text x="510" y="38" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Engulfing</text>
      <rect x="498" y="65" width="14" height="40" rx="2" fill="rgba(239,68,68,0.5)" stroke="rgba(239,68,68,0.8)" strokeWidth="1" />
      <rect x="515" y="55" width="14" height="55" rx="2" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <text x="510" y="145" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">Bullish</text>
      <rect x="268" y="160" width="296" height="85" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="416" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">KEY RULES</text>
      <text x="416" y="196" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10">Green body = Bullish (Close &gt; Open)</text>
      <text x="416" y="212" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10">Red body = Bearish (Close &lt; Open)</text>
      <text x="416" y="228" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Wicks show rejected price levels</text>
      <text x="416" y="240" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Body size = conviction of move</text>
    </svg>
  );
}

function CandlestickAdvSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">ADVANCED CANDLESTICK PATTERNS</text>
      <text x="105" y="38" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">MORNING STAR</text>
      <text x="105" y="52" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Bullish Reversal</text>
      <rect x="60" y="70" width="20" height="50" rx="2" fill="rgba(239,68,68,0.7)" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" />
      <line x1="70" y1="62" x2="70" y2="126" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" />
      <text x="70" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Bearish</text>
      <rect x="90" y="112" width="16" height="10" rx="2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      <line x1="98" y1="108" x2="98" y2="126" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <text x="98" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Doji</text>
      <rect x="115" y="75" width="20" height="50" rx="2" fill="rgba(16,185,129,0.7)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <line x1="125" y1="68" x2="125" y2="130" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" />
      <text x="125" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Bullish</text>
      <text x="300" y="38" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">EVENING STAR</text>
      <text x="300" y="52" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="9">Bearish Reversal</text>
      <rect x="255" y="75" width="20" height="50" rx="2" fill="rgba(16,185,129,0.7)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <line x1="265" y1="68" x2="265" y2="130" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" />
      <text x="265" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Bullish</text>
      <rect x="284" y="65" width="16" height="10" rx="2" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
      <line x1="292" y1="60" x2="292" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <text x="292" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Doji</text>
      <rect x="310" y="70" width="20" height="50" rx="2" fill="rgba(239,68,68,0.7)" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" />
      <line x1="320" y1="62" x2="320" y2="126" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" />
      <text x="320" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Bearish</text>
      <text x="490" y="38" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">PIN BAR</text>
      <text x="490" y="52" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="9">Rejection / Reversal</text>
      <line x1="490" y1="58" x2="490" y2="140" stroke="rgba(245,158,11,0.8)" strokeWidth="2" />
      <rect x="482" y="118" width="16" height="16" rx="2" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <text x="515" y="75" fill="rgba(245,158,11,0.7)" fontSize="8">Long upper wick</text>
      <text x="515" y="87" fill="rgba(245,158,11,0.6)" fontSize="7">= price rejected</text>
      <line x1="510" y1="72" x2="496" y2="72" stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="30" y="160" width="540" height="88" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">HOW TO TRADE THESE PATTERNS</text>
      <text x="300" y="196" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10">Morning Star: Enter long on close of 3rd candle · SL below doji low</text>
      <text x="300" y="212" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10">Evening Star: Enter short on close of 3rd candle · SL above doji high</text>
      <text x="300" y="228" textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="10">Pin Bar: Enter in direction of wick rejection · SL beyond wick tip</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">All patterns require context: at key levels = higher probability</text>
    </svg>
  );
}

function SupportResistanceSVG() {
  const points = "60,180 100,150 140,170 180,130 220,155 260,100 300,125 340,80 380,110 420,70 460,95 500,60 540,80";
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">SUPPORT &amp; RESISTANCE LEVELS</text>
      <line x1="40" y1="78" x2="560" y2="78" stroke="rgba(239,68,68,0.7)" strokeWidth="2" strokeDasharray="6,4" />
      <rect x="350" y="60" width="210" height="32" rx="4" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      <text x="455" y="72" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">RESISTANCE</text>
      <text x="455" y="85" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Price reverses DOWN</text>
      <line x1="40" y1="185" x2="560" y2="185" stroke="rgba(16,185,129,0.7)" strokeWidth="2" strokeDasharray="6,4" />
      <rect x="40" y="192" width="210" height="32" rx="4" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="145" y="204" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">SUPPORT</text>
      <text x="145" y="217" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Price bounces UP</text>
      <polyline points={points} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <defs>
        <marker id="upArrSR" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
        </marker>
        <marker id="downArrSR" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" />
        </marker>
      </defs>
      <path d="M130,185 L130,170" stroke="rgba(16,185,129,0.8)" strokeWidth="2" markerEnd="url(#upArrSR)" />
      <path d="M300,185 L300,170" stroke="rgba(16,185,129,0.8)" strokeWidth="2" markerEnd="url(#upArrSR)" />
      <path d="M340,78 L340,95" stroke="rgba(239,68,68,0.8)" strokeWidth="2" markerEnd="url(#downArrSR)" />
      <path d="M460,78 L460,95" stroke="rgba(239,68,68,0.8)" strokeWidth="2" markerEnd="url(#downArrSR)" />
    </svg>
  );
}

function TrendLinesSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TREND LINES &amp; CHANNELS</text>
      <text x="130" y="36" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">BULLISH TREND</text>
      <polyline points="30,200 60,185 80,190 110,170 135,175 165,150 185,158 215,132 235,140 255,118" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <line x1="30" y1="200" x2="255" y2="118" stroke="rgba(16,185,129,0.8)" strokeWidth="2" />
      <line x1="30" y1="178" x2="255" y2="96" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="40" y="195" fill="rgba(16,185,129,0.6)" fontSize="8">HL</text>
      <text x="110" y="165" fill="rgba(16,185,129,0.6)" fontSize="8">HL</text>
      <text x="215" y="127" fill="rgba(16,185,129,0.6)" fontSize="8">HL</text>
      <defs>
        <marker id="upGreen" markerWidth="7" markerHeight="7" refX="3.5" refY="6" orient="auto">
          <path d="M0,7 L3.5,0 L7,7" fill="rgba(16,185,129,0.9)" />
        </marker>
        <marker id="downRed" markerWidth="7" markerHeight="7" refX="3.5" refY="1" orient="auto">
          <path d="M0,0 L3.5,7 L7,0" fill="rgba(239,68,68,0.9)" />
        </marker>
      </defs>
      <path d="M240,118 L260,90" stroke="rgba(16,185,129,0.9)" strokeWidth="2.5" markerEnd="url(#upGreen)" />
      <text x="340" y="36" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">BEARISH TREND</text>
      <polyline points="280,80 310,95 330,88 360,108 380,100 410,122 430,115 460,138 480,130 510,152" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <line x1="280" y1="80" x2="510" y2="152" stroke="rgba(239,68,68,0.8)" strokeWidth="2" />
      <line x1="280" y1="102" x2="510" y2="174" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="308" y="91" fill="rgba(239,68,68,0.6)" fontSize="8">LH</text>
      <text x="380" y="97" fill="rgba(239,68,68,0.6)" fontSize="8">LH</text>
      <text x="455" y="115" fill="rgba(239,68,68,0.6)" fontSize="8">LH</text>
      <path d="M495,152 L515,178" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" markerEnd="url(#downRed)" />
      <rect x="40" y="215" width="520" height="36" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="232" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Higher Lows = bullish trend · Lower Highs = bearish trend</text>
      <text x="300" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Channel = parallel lines · Trade bounces within the channel</text>
    </svg>
  );
}

function MovingAveragesSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">MOVING AVERAGES — 50 SMA &amp; 200 SMA</text>
      <polyline points="40,160 70,140 90,155 120,130 140,145 170,110 190,125 220,95 245,108 270,85 295,98 320,72 345,88 370,65 395,78 420,55 445,68 470,48 500,60 530,42 560,50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <polyline points="40,165 80,148 120,135 160,118 200,108 240,95 280,83 320,75 360,68 400,62 440,57 480,53 520,50 560,48" fill="none" stroke="rgba(234,179,8,0.9)" strokeWidth="2" />
      <polyline points="40,175 80,168 120,158 160,148 200,138 240,128 280,118 320,108 360,98 400,88 440,78 480,68 520,60 560,55" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="2" strokeDasharray="6,3" />
      <circle cx="270" cy="88" r="18" fill="rgba(234,179,8,0.1)" stroke="rgba(234,179,8,0.5)" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="270" y="58" textAnchor="middle" fill="rgba(234,179,8,0.9)" fontSize="10" fontWeight="bold">Golden Cross</text>
      <line x1="270" y1="65" x2="270" y2="72" stroke="rgba(234,179,8,0.5)" strokeWidth="1" />
      <text x="520" y="42" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Bullish</text>
      <text x="520" y="55" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Trend</text>
      <rect x="30" y="195" width="540" height="55" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <rect x="48" y="205" width="10" height="3" fill="rgba(234,179,8,0.9)" />
      <text x="65" y="212" fill="rgba(255,255,255,0.7)" fontSize="10">50 SMA — Fast line, medium-term trend</text>
      <rect x="48" y="223" width="16" height="3" fill="rgba(245,158,11,0.6)" />
      <text x="72" y="230" fill="rgba(255,255,255,0.7)" fontSize="10">200 SMA — Slow line, defines the major trend</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Golden Cross = 50 SMA crosses above 200 SMA = Bullish signal · Death Cross = opposite</text>
    </svg>
  );
}

function RsiSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">RSI — RELATIVE STRENGTH INDEX (0–100)</text>
      <rect x="40" y="30" width="520" height="52" fill="rgba(239,68,68,0.12)" />
      <text x="558" y="48" textAnchor="end" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">OVERBOUGHT</text>
      <text x="558" y="62" textAnchor="end" fill="rgba(239,68,68,0.6)" fontSize="9">70 – 100</text>
      <rect x="40" y="82" width="520" height="96" fill="rgba(255,255,255,0.02)" />
      <text x="558" y="130" textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">NEUTRAL</text>
      <rect x="40" y="178" width="520" height="52" fill="rgba(16,185,129,0.12)" />
      <text x="558" y="196" textAnchor="end" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">OVERSOLD</text>
      <text x="558" y="210" textAnchor="end" fill="rgba(16,185,129,0.6)" fontSize="9">0 – 30</text>
      <line x1="40" y1="82" x2="520" y2="82" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="45" y="79" fill="rgba(239,68,68,0.7)" fontSize="9">70</text>
      <line x1="40" y1="130" x2="520" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3" />
      <text x="45" y="127" fill="rgba(255,255,255,0.3)" fontSize="9">50</text>
      <line x1="40" y1="178" x2="520" y2="178" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="45" y="175" fill="rgba(16,185,129,0.7)" fontSize="9">30</text>
      <polyline points="60,140 90,120 115,75 140,65 160,80 190,100 220,130 255,165 285,185 310,195 335,175 360,145 390,100 415,78 445,68 470,85 490,110 510,130" fill="none" stroke="rgba(99,102,241,0.9)" strokeWidth="2.5" />
      <rect x="40" y="238" width="520" height="16" rx="4" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="250" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">RSI above 70 = potential sell · RSI below 30 = potential buy · Divergence = reversal warning</text>
    </svg>
  );
}

function MacdSVG() {
  const bars = [{x:55,h:30,pos:false},{x:80,h:42,pos:false},{x:105,h:28,pos:false},{x:130,h:12,pos:false},{x:155,h:8,pos:true},{x:180,h:22,pos:true},{x:205,h:38,pos:true},{x:230,h:46,pos:true},{x:255,h:40,pos:true},{x:280,h:28,pos:true},{x:305,h:14,pos:true},{x:330,h:6,pos:false},{x:355,h:18,pos:false},{x:380,h:30,pos:false},{x:405,h:38,pos:false},{x:430,h:30,pos:false},{x:455,h:16,pos:false},{x:480,h:8,pos:true},{x:505,h:20,pos:true},{x:530,h:34,pos:true}];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">MACD — MOVING AVERAGE CONVERGENCE DIVERGENCE</text>
      <line x1="40" y1="140" x2="560" y2="140" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <text x="38" y="138" textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="9">0</text>
      {bars.map((b,i) => (
        <rect key={i} x={b.x-9} y={b.pos?140-b.h:140} width={18} height={b.h} fill={b.pos?'rgba(16,185,129,0.65)':'rgba(239,68,68,0.65)'} stroke={b.pos?'rgba(16,185,129,0.9)':'rgba(239,68,68,0.9)'} strokeWidth="1" />
      ))}
      <polyline points="55,162 80,155 105,148 130,143 155,138 180,128 205,115 230,108 255,112 280,122 305,133 330,142 355,150 380,155 405,152 430,148 455,144 480,140 505,132 530,122" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
      <polyline points="55,158 80,152 105,146 130,142 155,140 180,133 205,122 230,114 255,115 280,124 305,135 330,143 355,150 380,154 405,153 430,150 455,146 480,143 505,138 530,130" fill="none" stroke="rgba(234,179,8,0.85)" strokeWidth="2" />
      <circle cx="155" cy="139" r="10" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <text x="155" y="118" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">Bullish Cross</text>
      <circle cx="330" cy="142" r="10" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" />
      <text x="330" y="168" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="bold">Bearish Cross</text>
      <rect x="40" y="198" width="520" height="52" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <rect x="58" y="210" width="12" height="3" fill="rgba(255,255,255,0.8)" />
      <text x="78" y="214" fill="rgba(255,255,255,0.7)" fontSize="10">MACD Line (fast EMA – slow EMA)</text>
      <rect x="58" y="228" width="12" height="3" fill="rgba(234,179,8,0.8)" />
      <text x="78" y="232" fill="rgba(255,255,255,0.7)" fontSize="10">Signal Line (9-period EMA of MACD)</text>
      <rect x="330" y="208" width="10" height="12" fill="rgba(16,185,129,0.6)" />
      <text x="348" y="218" fill="rgba(255,255,255,0.7)" fontSize="10">Histogram = MACD – Signal</text>
    </svg>
  );
}

function BollingerSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">BOLLINGER BANDS</text>
      <polyline points="40,80 70,75 100,65 130,60 160,58 190,60 220,65 250,70 280,85 310,100 340,115 370,125 400,130 430,128 460,122 490,105 520,90 550,78" fill="none" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeDasharray="6,3" />
      <polyline points="40,175 70,168 100,158 130,150 160,148 190,150 220,155 250,160 280,168 310,175 340,175 370,172 400,168 430,165 460,158 490,148 520,140 550,135" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" strokeDasharray="6,3" />
      <polyline points="40,128 70,122 100,112 130,105 160,103 190,105 220,110 250,115 280,128 310,138 340,145 370,148 400,149 430,147 460,140 490,128 520,115 550,108" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <polyline points="40,130 65,115 85,95 110,80 135,100 155,120 175,115 195,105 215,125 235,145 260,160 285,170 308,162 330,148 350,135 375,120 395,112 420,118 445,105 470,95 495,88 520,82 548,92" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <rect x="130" y="50" width="80" height="110" rx="4" fill="rgba(245,158,11,0.07)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="170" y="172" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="9" fontWeight="bold">SQUEEZE</text>
      <rect x="280" y="30" width="186" height="28" rx="4" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <text x="373" y="48" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">SQUEEZE = Breakout coming!</text>
      <rect x="40" y="200" width="520" height="52" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="218" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Bands WIDEN = high volatility · Bands NARROW = squeeze</text>
      <rect x="58" y="228" width="10" height="3" fill="rgba(239,68,68,0.7)" />
      <text x="76" y="232" fill="rgba(255,255,255,0.6)" fontSize="10">Upper Band</text>
      <rect x="175" y="228" width="10" height="3" fill="rgba(255,255,255,0.6)" />
      <text x="193" y="232" fill="rgba(255,255,255,0.6)" fontSize="10">Middle (20 SMA)</text>
      <rect x="320" y="228" width="10" height="3" fill="rgba(16,185,129,0.7)" />
      <text x="338" y="232" fill="rgba(255,255,255,0.6)" fontSize="10">Lower Band</text>
    </svg>
  );
}

function FibonacciSVG() {
  const levels = [
    { pct: '23.6%', y: 65, color: 'rgba(255,255,255,0.4)', thick: 1 },
    { pct: '38.2%', y: 95, color: 'rgba(255,255,255,0.6)', thick: 1.5 },
    { pct: '50.0%', y: 120, color: 'rgba(255,255,255,0.6)', thick: 1.5 },
    { pct: '61.8%', y: 148, color: 'rgba(234,179,8,0.9)', thick: 2.5 },
    { pct: '78.6%', y: 175, color: 'rgba(255,255,255,0.4)', thick: 1 },
  ];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FIBONACCI RETRACEMENT LEVELS</text>
      <line x1="80" y1="210" x2="80" y2="38" stroke="rgba(16,185,129,0.7)" strokeWidth="3" />
      <polygon points="72,42 80,28 88,42" fill="rgba(16,185,129,0.8)" />
      <text x="80" y="225" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Swing Low</text>
      <text x="80" y="36" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Swing High</text>
      {levels.map((l, i) => (
        <g key={i}>
          <line x1="100" y1={l.y} x2="520" y2={l.y} stroke={l.color} strokeWidth={l.thick} strokeDasharray="5,3" />
          <text x="530" y={l.y + 4} fill={l.color} fontSize="11" fontWeight={l.pct === '61.8%' ? 'bold' : 'normal'}>{l.pct}</text>
        </g>
      ))}
      <line x1="100" y1="28" x2="520" y2="28" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <text x="530" y="32" fill="rgba(16,185,129,0.6)" fontSize="11">100%</text>
      <line x1="100" y1="210" x2="520" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="530" y="214" fill="rgba(255,255,255,0.3)" fontSize="11">0%</text>
      <rect x="100" y="148" width="420" height="30" rx="2" fill="rgba(234,179,8,0.1)" stroke="rgba(234,179,8,0.4)" strokeWidth="1" />
      <text x="310" y="166" textAnchor="middle" fill="rgba(234,179,8,0.7)" fontSize="9">Golden Ratio — Most significant level</text>
      <rect x="100" y="148" width="420" height="62" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="310" y="222" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="11" fontWeight="bold">Buy Zone (61.8% – 78.6% area)</text>
      <text x="310" y="237" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Price often reverses &amp; resumes the original trend here</text>
    </svg>
  );
}

function HeadShouldersSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">HEAD &amp; SHOULDERS — BEARISH REVERSAL PATTERN</text>
      <polyline points="50,190 100,190 140,120 180,150 220,60 260,150 300,120 340,190 390,190" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
      <line x1="50" y1="150" x2="450" y2="150" stroke="rgba(239,68,68,0.7)" strokeWidth="2" strokeDasharray="6,3" />
      <text x="460" y="154" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">Neckline</text>
      <text x="140" y="110" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Left Shoulder</text>
      <text x="220" y="48" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">HEAD</text>
      <text x="300" y="110" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Right Shoulder</text>
      <defs>
        <marker id="sellArrHS" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill="rgba(239,68,68,0.9)" />
        </marker>
      </defs>
      <line x1="390" y1="190" x2="430" y2="150" stroke="rgba(239,68,68,0.8)" strokeWidth="2" />
      <path d="M430,150 L430,200" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" markerEnd="url(#sellArrHS)" />
      <rect x="435" y="145" width="50" height="22" rx="4" fill="rgba(239,68,68,0.25)" stroke="rgba(239,68,68,0.6)" strokeWidth="1" />
      <text x="460" y="160" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="12" fontWeight="bold">SELL</text>
      <rect x="40" y="215" width="350" height="38" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      <text x="215" y="230" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Pattern confirmed on neckline BREAK with volume</text>
      <text x="215" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Target = head-to-neckline distance projected downward</text>
    </svg>
  );
}

function FlagsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FLAG PATTERN — CONTINUATION</text>
      <line x1="120" y1="220" x2="120" y2="70" stroke="rgba(16,185,129,0.9)" strokeWidth="3" />
      <polygon points="112,75 120,55 128,75" fill="rgba(16,185,129,0.8)" />
      <text x="85" y="148" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="10">Flagpole</text>
      <polyline points="120,70 145,80 165,75 185,85 205,82 225,90 245,88" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <line x1="120" y1="70" x2="245" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="120" y1="90" x2="245" y2="120" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="4,3" />
      <defs>
        <marker id="boArrF" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(16,185,129,0.9)" />
        </marker>
      </defs>
      <path d="M245,88 L320,40" stroke="rgba(16,185,129,0.9)" strokeWidth="3" markerEnd="url(#boArrF)" />
      <rect x="255" y="28" width="70" height="22" rx="4" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <text x="290" y="43" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Breakout!</text>
      <line x1="245" y1="88" x2="370" y2="88" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="370" y1="88" x2="370" y2="218" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="120" y1="218" x2="370" y2="218" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="390" y="155" fill="rgba(245,158,11,0.8)" fontSize="10">Target</text>
      <text x="390" y="168" fill="rgba(245,158,11,0.7)" fontSize="9">= Pole</text>
      <text x="390" y="181" fill="rgba(245,158,11,0.7)" fontSize="9">length</text>
      <rect x="40" y="210" width="520" height="42" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="226" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Strong move = flagpole · Consolidation = flag · Breakout continues trend</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Entry: breakout above upper trendline · Target: flagpole length added to breakout</text>
    </svg>
  );
}

function VolumeSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">VOLUME ANALYSIS</text>
      <polyline points="40,120 67,110 94,115 121,100 148,108 175,88 202,94 229,80 256,86 283,68 310,75 337,65 364,72 391,60 418,68 445,55 472,62 499,50 526,57 553,50" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <rect x="40" y="142" width="20" height="58" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="67" y="130" width="20" height="70" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="94" y="148" width="20" height="52" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="121" y="125" width="20" height="75" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="148" y="138" width="20" height="62" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="175" y="112" width="20" height="88" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="202" y="130" width="20" height="70" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="229" y="118" width="20" height="82" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="256" y="135" width="20" height="65" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="283" y="108" width="20" height="92" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="310" y="125" width="20" height="75" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="337" y="142" width="20" height="58" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="364" y="120" width="20" height="80" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="391" y="110" width="20" height="90" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="418" y="100" width="20" height="100" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="445" y="128" width="20" height="72" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="472" y="145" width="20" height="55" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.8)" strokeWidth="0.5" />
      <rect x="499" y="130" width="20" height="70" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="526" y="115" width="20" height="85" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="553" y="105" width="20" height="95" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5" />
      <rect x="30" y="207" width="540" height="45" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <rect x="46" y="216" width="8" height="8" fill="rgba(16,185,129,0.6)" />
      <text x="60" y="224" fill="rgba(255,255,255,0.7)" fontSize="9">High volume + price rise = STRONG MOVE (institutional buying)</text>
      <rect x="46" y="230" width="8" height="8" fill="rgba(239,68,68,0.6)" />
      <text x="60" y="238" fill="rgba(255,255,255,0.7)" fontSize="9">Low volume breakout = WEAK / FALSE · Volume confirms direction</text>
    </svg>
  );
}

function MultiTimeframeSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">MULTI-TIMEFRAME ANALYSIS — TOP-DOWN APPROACH</text>
      <rect x="20" y="28" width="170" height="70" rx="6" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
      <text x="105" y="46" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">DAILY — Trend Direction</text>
      <polyline points="30,82 50,75 70,78 90,65 110,68 130,55 150,58 170,48" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="1.5" />
      <line x1="30" y1="85" x2="170" y2="55" stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="105" y="93" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Uptrend confirmed</text>
      <rect x="215" y="28" width="170" height="70" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <text x="300" y="46" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">4H — Setup Formation</text>
      <polyline points="225,70 240,65 255,75 270,62 285,68 300,58 315,72 330,62 345,55 365,60" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
      <text x="300" y="93" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Flag / pullback forming</text>
      <rect x="410" y="28" width="170" height="70" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
      <text x="495" y="46" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">1H — Entry Signal</text>
      <polyline points="420,70 435,68 450,72 465,65 480,68 495,60 510,55 525,58 540,50 558,52" fill="none" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" />
      <rect x="502" y="48" width="14" height="10" rx="1" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1" />
      <text x="495" y="93" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Pin bar at support</text>
      <defs>
        <marker id="mtfArr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(255,255,255,0.4)" />
        </marker>
      </defs>
      <path d="M195,63 L210,63" stroke="rgba(255,255,255,0.3)" strokeWidth="2" markerEnd="url(#mtfArr)" />
      <path d="M390,63 L405,63" stroke="rgba(255,255,255,0.3)" strokeWidth="2" markerEnd="url(#mtfArr)" />
      <rect x="20" y="112" width="560" height="40" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
      <text x="300" y="128" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">Always trade in the direction of the higher timeframe</text>
      <text x="300" y="144" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Daily = bias · 4H = setup · 1H = entry trigger</text>
      <rect x="20" y="165" width="560" height="82" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="183" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">MTF ANALYSIS PROCESS</text>
      <text x="40" y="200" fill="rgba(255,255,255,0.7)" fontSize="10">1. Check Daily — Is trend up or down? Mark major S/R levels.</text>
      <text x="40" y="216" fill="rgba(255,255,255,0.7)" fontSize="10">2. Check 4H — Is price pulling back? Is a pattern forming?</text>
      <text x="40" y="232" fill="rgba(255,255,255,0.7)" fontSize="10">3. Check 1H — Wait for entry signal in direction of Daily trend.</text>
      <text x="40" y="244" fill="rgba(255,255,255,0.4)" fontSize="9">Never enter on 1H signal that contradicts Daily trend direction</text>
    </svg>
  );
}


function StrategySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <rect x="20" y="10" width="560" height="240" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
      <text x="300" y="32" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="13" fontWeight="bold">TRADE ENTRY CHECKLIST</text>
      <line x1="40" y1="40" x2="560" y2="40" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
      {[
        'Higher TF trend confirms direction',
        'Price at key support / resistance level',
        'Confirmation candle (pin bar / engulfing)',
        'RSI not extreme in wrong direction',
        'Minimum 1:2 Risk/Reward ratio',
      ].map((item, i) => (
        <g key={i}>
          <circle cx="55" cy={68 + i * 34} r="10" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
          <text x="55" y={73 + i * 34} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">☐</text>
          <text x="75" y={73 + i * 34} fill="rgba(255,255,255,0.8)" fontSize="11">{item}</text>
        </g>
      ))}
      <rect x="60" y="210" width="480" height="32" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <text x="300" y="230" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="bold">ALL 5 must be checked before entering</text>
    </svg>
  );
}

function BacktestSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">BACKTEST — EQUITY CURVE</text>
      <line x1="40" y1="170" x2="400" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <polyline points="40,165 58,160 76,155 94,158 112,148 130,142 148,150 166,138 184,130 202,135 220,122 238,115 256,120 274,108 292,100 310,105 328,92 346,85 364,90 382,78 400,70" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2.5" />
      <polyline points="185,130 195,138 205,145 215,148" fill="none" stroke="rgba(239,68,68,0.7)" strokeWidth="2" strokeDasharray="3,2" />
      <text x="200" y="158" fill="rgba(239,68,68,0.6)" fontSize="8">DD</text>
      <polyline points="292,100 302,108 312,112 322,108" fill="none" stroke="rgba(239,68,68,0.7)" strokeWidth="2" strokeDasharray="3,2" />
      <text x="305" y="120" fill="rgba(239,68,68,0.6)" fontSize="8">DD</text>
      <text x="40" y="180" fill="rgba(255,255,255,0.3)" fontSize="8">0</text>
      <text x="200" y="180" fill="rgba(255,255,255,0.3)" fontSize="8">Trade 25</text>
      <text x="370" y="180" fill="rgba(255,255,255,0.3)" fontSize="8">Trade 50</text>
      <rect x="420" y="30" width="162" height="130" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="501" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">BACKTEST STATS</text>
      <line x1="430" y1="55" x2="572" y2="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="435" y="70" fill="rgba(255,255,255,0.6)" fontSize="9">Win Rate:</text>
      <text x="565" y="70" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">52%</text>
      <text x="435" y="86" fill="rgba(255,255,255,0.6)" fontSize="9">Avg R:R:</text>
      <text x="565" y="86" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">1 : 2.1</text>
      <text x="435" y="102" fill="rgba(255,255,255,0.6)" fontSize="9">Profit Factor:</text>
      <text x="565" y="102" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">1.74</text>
      <text x="435" y="118" fill="rgba(255,255,255,0.6)" fontSize="9">Max Drawdown:</text>
      <text x="565" y="118" textAnchor="end" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="bold">-12%</text>
      <text x="435" y="134" fill="rgba(255,255,255,0.6)" fontSize="9">Total Trades:</text>
      <text x="565" y="134" textAnchor="end" fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="bold">50</text>
      <text x="435" y="150" fill="rgba(255,255,255,0.6)" fontSize="9">Net Return:</text>
      <text x="565" y="150" textAnchor="end" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">+38%</text>
      <rect x="40" y="192" width="520" height="56" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="210" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">50+ trades minimum for statistically valid results</text>
      <text x="300" y="226" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">More trades = more reliable expectancy calculation</text>
      <text x="300" y="241" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Backtest past · Forward test demo · Then go live</text>
    </svg>
  );
}

function WhyFailSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">WHY MOST TRADERS FAIL</text>
      <text x="300" y="78" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="52" fontWeight="bold">73%</text>
      <text x="300" y="100" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">of retail forex traders lose money</text>
      {[
        { label: 'No trading edge', x: 85, y: 55 },
        { label: 'Overleveraging', x: 510, y: 55 },
        { label: 'Revenge trading', x: 60, y: 130 },
        { label: 'No stop loss', x: 530, y: 130 },
        { label: 'Poor psychology', x: 85, y: 205 },
        { label: 'Unrealistic goals', x: 510, y: 205 },
      ].map((r, i) => (
        <g key={i}>
          <rect x={r.x - 55} y={r.y - 16} width="110" height="28" rx="6" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
          <text x={r.x} y={r.y + 2} textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="bold">{r.label}</text>
          <line x1={r.x < 300 ? r.x + 55 : r.x - 55} y1={r.y} x2={r.x < 300 ? r.x + 70 : r.x - 70} y2={r.y} stroke="rgba(239,68,68,0.2)" strokeWidth="1" strokeDasharray="3,2" />
        </g>
      ))}
      <rect x="80" y="222" width="440" height="30" rx="6" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="241" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Top 1% treat trading like a BUSINESS — plan, execute, review</text>
    </svg>
  );
}

function RiskRewardSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">RISK : REWARD RATIO</text>
      <line x1="60" y1="60" x2="480" y2="60" stroke="rgba(16,185,129,0.8)" strokeWidth="2.5" strokeDasharray="8,4" />
      <rect x="480" y="48" width="105" height="26" rx="4" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <text x="532" y="65" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">TAKE PROFIT</text>
      <line x1="60" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
      <rect x="480" y="118" width="105" height="26" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="532" y="135" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">ENTRY</text>
      <line x1="60" y1="200" x2="480" y2="200" stroke="rgba(239,68,68,0.8)" strokeWidth="2.5" strokeDasharray="8,4" />
      <rect x="480" y="188" width="105" height="26" rx="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
      <text x="532" y="205" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">STOP LOSS</text>
      <rect x="60" y="60" width="80" height="70" fill="rgba(16,185,129,0.1)" />
      <text x="100" y="100" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="12" fontWeight="bold">REWARD</text>
      <text x="100" y="116" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="11">40 pips</text>
      <rect x="60" y="130" width="80" height="70" fill="rgba(239,68,68,0.1)" />
      <text x="100" y="168" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="12" fontWeight="bold">RISK</text>
      <text x="100" y="184" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="11">20 pips</text>
      <rect x="220" y="90" width="160" height="80" rx="10" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="2" />
      <text x="300" y="120" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">1 : 2</text>
      <text x="300" y="142" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11">Risk : Reward</text>
      <text x="300" y="160" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Need only 34% win rate to profit</text>
      <rect x="100" y="215" width="400" height="34" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="230" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">Minimum acceptable RR: 1 : 1.5</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Never enter a trade with less than 1.5× reward vs risk</text>
    </svg>
  );
}

function PositionSizingSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">POSITION SIZING FORMULA</text>
      <rect x="40" y="35" width="520" height="50" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <text x="300" y="57" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Lot Size = (Balance x Risk%) / (SL pips x Pip Value)</text>
      <text x="300" y="76" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Risk no more than 1-2% of account per trade</text>
      <text x="300" y="112" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">STEP-BY-STEP EXAMPLE</text>
      <rect x="40" y="122" width="155" height="70" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="117" y="142" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">STEP 1</text>
      <text x="117" y="158" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">$5,000 x 1%</text>
      <text x="117" y="174" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="14" fontWeight="bold">= $50 Risk</text>
      <text x="117" y="188" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Dollar risk amount</text>
      <text x="217" y="160" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20">÷</text>
      <rect x="235" y="122" width="155" height="70" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="312" y="142" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">STEP 2</text>
      <text x="312" y="158" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">25 pips x $10</text>
      <text x="312" y="174" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="14" fontWeight="bold">= $250</text>
      <text x="312" y="188" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">SL value per standard lot</text>
      <text x="412" y="160" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="20">=</text>
      <rect x="428" y="115" width="132" height="84" rx="8" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="2" />
      <text x="494" y="138" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">RESULT</text>
      <text x="494" y="162" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="24" fontWeight="bold">0.20</text>
      <text x="494" y="180" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="12">lots</text>
      <text x="494" y="193" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Mini lot size</text>
      <rect x="40" y="210" width="520" height="40" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="227" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Never risk more than you can afford to lose</text>
      <text x="300" y="243" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Consistent position sizing is key to long-term survival</text>
    </svg>
  );
}

function StopLossSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">STOP LOSS &amp; TAKE PROFIT PLACEMENT</text>
      <line x1="40" y1="70" x2="540" y2="70" stroke="rgba(16,185,129,0.8)" strokeWidth="2" strokeDasharray="6,3" />
      <rect x="420" y="55" width="150" height="28" rx="4" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <text x="495" y="73" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">TAKE PROFIT</text>
      <rect x="40" y="70" width="540" height="70" fill="rgba(16,185,129,0.07)" />
      <line x1="40" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <rect x="420" y="126" width="150" height="28" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <text x="495" y="144" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">ENTRY (Long)</text>
      <rect x="40" y="140" width="540" height="60" fill="rgba(239,68,68,0.07)" />
      <line x1="40" y1="200" x2="540" y2="200" stroke="rgba(239,68,68,0.8)" strokeWidth="2" strokeDasharray="6,3" />
      <rect x="420" y="186" width="150" height="28" rx="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
      <text x="495" y="204" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">STOP LOSS</text>
      <text x="80" y="108" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">REWARD ZONE (+40 pips)</text>
      <text x="80" y="165" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">RISK ZONE (-20 pips)</text>
      <text x="285" y="195" fill="rgba(239,68,68,0.6)" fontSize="8">Below key support</text>
      <text x="285" y="68" fill="rgba(16,185,129,0.6)" fontSize="8">At next resistance</text>
      <rect x="40" y="218" width="520" height="30" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="1.5" />
      <text x="300" y="237" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">Never trade without a Stop Loss — protect your capital</text>
    </svg>
  );
}

function DrawdownSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">DRAWDOWN &amp; RECOVERY</text>
      <polyline points="40,195 80,180 120,165 165,150 210,135 230,125 255,150 280,170 295,185 320,175 345,160 370,145 400,125 430,108 460,92 490,78 520,65 550,55" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2.5" />
      <polygon points="230,125 255,150 280,170 295,185 320,175 345,160 370,145 395,130 395,125" fill="rgba(239,68,68,0.2)" stroke="none" />
      <line x1="230" y1="125" x2="395" y2="125" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <line x1="295" y1="185" x2="295" y2="125" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeDasharray="3,2" />
      <rect x="298" y="148" width="130" height="26" rx="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
      <text x="363" y="164" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">Max DD: 25%</text>
      <text x="475" y="75" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10">Recovery</text>
      <text x="475" y="88" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">New High</text>
      <rect x="40" y="205" width="520" height="45" rx="8" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="222" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="11" fontWeight="bold">25% Drawdown requires a 33% gain to recover</text>
      <text x="300" y="240" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">50% DD needs 100% gain  |  Keep risk small to avoid deep drawdowns</text>
    </svg>
  );
}

function PsychologySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TRADING PSYCHOLOGY</text>
      <rect x="30" y="40" width="225" height="130" rx="10" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
      <text x="142" y="68" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="16" fontWeight="bold">FEAR</text>
      <line x1="50" y1="78" x2="235" y2="78" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="142" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Cuts winners early</text>
      <text x="142" y="112" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Misses valid trades</text>
      <text x="142" y="128" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Panic-closes positions</text>
      <text x="142" y="148" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Driven by past losses</text>
      <text x="142" y="162" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Overrides trading rules</text>
      <rect x="345" y="40" width="225" height="130" rx="10" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
      <text x="457" y="68" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="16" fontWeight="bold">GREED</text>
      <line x1="365" y1="78" x2="550" y2="78" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="457" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Holds losers too long</text>
      <text x="457" y="112" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Overleverages trades</text>
      <text x="457" y="128" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11">Chases missed moves</text>
      <text x="457" y="148" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Revenge trading</text>
      <text x="457" y="162" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Ignores stop losses</text>
      <rect x="100" y="190" width="400" height="55" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="212" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="bold">SOLUTION: Follow Your Trading Plan</text>
      <text x="300" y="232" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Pre-define entries, exits &amp; risk before placing the trade</text>
      <text x="300" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Discipline over emotion = consistent profitability</text>
    </svg>
  );
}

function RevengeSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">THE REVENGE TRADING CYCLE</text>
      {[
        { label: 'LOSS', x: 300, y: 65, c: 'rgba(239,68,68,0.8)', bc: 'rgba(239,68,68,0.15)' },
        { label: 'ANGER / PANIC', x: 460, y: 130, c: 'rgba(245,158,11,0.8)', bc: 'rgba(245,158,11,0.15)' },
        { label: 'BIGGER TRADE', x: 380, y: 195, c: 'rgba(239,68,68,0.7)', bc: 'rgba(239,68,68,0.12)' },
        { label: 'BIGGER LOSS', x: 200, y: 195, c: 'rgba(239,68,68,0.9)', bc: 'rgba(239,68,68,0.18)' },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 60} y={n.y - 16} width="120" height="32" rx="8" fill={n.bc} stroke={n.c} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fill={n.c} fontSize="10" fontWeight="bold">{n.label}</text>
        </g>
      ))}
      <defs>
        <marker id="cyc" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(239,68,68,0.5)" />
        </marker>
      </defs>
      <path d="M360,65 Q460,65 460,115" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" markerEnd="url(#cyc)" />
      <path d="M460,147 Q460,195 440,195" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" markerEnd="url(#cyc)" />
      <path d="M260,195 Q160,195 150,130" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" markerEnd="url(#cyc)" />
      <path d="M150,113 Q150,65 240,65" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" markerEnd="url(#cyc)" />
      <line x1="260" y1="110" x2="340" y2="150" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
      <line x1="340" y1="110" x2="260" y2="150" stroke="rgba(239,68,68,0.5)" strokeWidth="2" />
      <rect x="50" y="218" width="500" height="36" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="233" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">BREAK THE CYCLE: Walk away → Reset → Plan-based entry only</text>
      <text x="300" y="248" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">A loss is information, not a reason to gamble more</text>
    </svg>
  );
}

function JournalSVG() {
  const rows = [
    { date:'15 Mar','pair':'EUR/USD','dir':'Long','entry':'1.0820','sl':'1.0800','tp':'1.0860','lot':'0.10','res':'+40','note':'Pin bar at support', win:true },
    { date:'15 Mar','pair':'GBP/USD','dir':'Short','entry':'1.2650','sl':'1.2680','tp':'1.2590','lot':'0.10','res':'-30','note':'SL hit, news spike', win:false },
    { date:'16 Mar','pair':'USD/JPY','dir':'Long','entry':'149.20','sl':'148.90','tp':'149.80','lot':'0.10','res':'+60','note':'London breakout', win:true },
    { date:'17 Mar','pair':'AUD/USD','dir':'Short','entry':'0.6540','sl':'0.6560','tp':'0.6500','lot':'0.05','res':'+40','note':'H&S neckline break', win:true },
  ];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TRADING JOURNAL</text>
      <rect x="10" y="26" width="580" height="20" rx="3" fill="rgba(255,255,255,0.07)" />
      {['Date','Pair','Dir','Entry','SL/TP','Lot','Result','Notes'].map((h, i) => (
        <text key={i} x={[18,68,115,155,205,270,310,370][i]} y="40" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="bold">{h}</text>
      ))}
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="10" y={48+i*42} width="580" height="38" rx="3" fill={r.win ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)'} stroke={r.win ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'} strokeWidth="1" />
          <text x="18" y={71+i*42} fill="rgba(255,255,255,0.6)" fontSize="9">{r.date}</text>
          <text x="68" y={71+i*42} fill="white" fontSize="9" fontWeight="bold">{r.pair}</text>
          <text x="115" y={71+i*42} fill={r.dir==='Long'?'rgba(16,185,129,0.9)':'rgba(239,68,68,0.9)'} fontSize="9" fontWeight="bold">{r.dir}</text>
          <text x="155" y={71+i*42} fill="rgba(255,255,255,0.7)" fontSize="9">{r.entry}</text>
          <text x="205" y={71+i*42} fill="rgba(255,255,255,0.6)" fontSize="8">{r.sl}/{r.tp}</text>
          <text x="270" y={71+i*42} fill="rgba(255,255,255,0.6)" fontSize="9">{r.lot}</text>
          <text x="310" y={71+i*42} fill={r.win?'rgba(16,185,129,0.9)':'rgba(239,68,68,0.9)'} fontSize="10" fontWeight="bold">{r.res} pip</text>
          <text x="370" y={71+i*42} fill="rgba(255,255,255,0.5)" fontSize="8">{r.note}</text>
        </g>
      ))}
      <rect x="10" y="218" width="580" height="32" rx="6" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="238" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">Track every trade — review weekly — identify patterns in your errors</text>
    </svg>
  );
}

function TradingPlanSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <rect x="20" y="10" width="560" height="240" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
      <text x="300" y="34" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="14" fontWeight="bold">MY TRADING PLAN</text>
      <line x1="40" y1="42" x2="560" y2="42" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
      {[
        { label: 'Markets:', value: 'EUR/USD, GBP/USD, USD/JPY' },
        { label: 'Hours:', value: 'London session 08:00–12:00 GMT' },
        { label: 'Risk:', value: '1% per trade, 3% daily max' },
        { label: 'Setup:', value: '4H pin bar at key level' },
        { label: 'Entry/SL/TP:', value: 'Structure-based, never arbitrary' },
        { label: 'Review:', value: 'Every Sunday — weekly analysis' },
      ].map((item, i) => (
        <g key={i}>
          <text x="45" y={68 + i * 28} fill="rgba(245,158,11,0.8)" fontSize="10" fontWeight="bold">{item.label}</text>
          <text x="145" y={68 + i * 28} fill="rgba(255,255,255,0.8)" fontSize="10">{item.value}</text>
          <line x1="40" y1={74 + i * 28} x2="560" y2={74 + i * 28} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </g>
      ))}
      <rect x="60" y="228" width="480" height="16" rx="4" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="300" y="240" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9">A plan followed consistently beats random trading every time</text>
    </svg>
  );
}


function PammIntroSVG() {
  const cx = 175, cy = 125, r = 90;
  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function describeArc(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">PAMM ACCOUNT STRUCTURE</text>
      <path d={describeArc(0, 36)} fill="rgba(99,102,241,0.7)" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      <path d={describeArc(36, 180)} fill="rgba(16,185,129,0.6)" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      <path d={describeArc(180, 360)} fill="rgba(245,158,11,0.6)" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      <text x="165" y="62" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Mgr 10%</text>
      <text x="115" y="135" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Inv A 40%</text>
      <text x="230" y="182" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Inv B 50%</text>
      <rect x="310" y="35" width="260" height="50" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      <text x="440" y="55" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">Fund Manager</text>
      <text x="440" y="73" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Trades the pooled capital · 10% share</text>
      <rect x="310" y="100" width="120" height="50" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="370" y="120" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Investor A</text>
      <text x="370" y="138" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">40% of pool</text>
      <rect x="450" y="100" width="120" height="50" rx="6" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <text x="510" y="120" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">Investor B</text>
      <text x="510" y="138" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">50% of pool</text>
      <rect x="310" y="170" width="260" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="440" y="187" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">PERFORMANCE FEE</text>
      <text x="440" y="203" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="12" fontWeight="bold">20–30% of profits to Manager</text>
      <rect x="40" y="218" width="520" height="32" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="232" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Profits &amp; losses distributed proportionally to each investor's share</text>
      <text x="300" y="245" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Manager earns performance fee only on profits generated</text>
    </svg>
  );
}

function PammSharingSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">PAMM PROFIT SHARING</text>
      <circle cx="120" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path d="M120,100 L120,30 A70,70 0 0,1 183,65 Z" fill="rgba(99,102,241,0.7)" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <path d="M120,100 L183,65 A70,70 0 0,1 183,135 Z" fill="rgba(16,185,129,0.6)" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <path d="M120,100 L183,135 A70,70 0 1,1 120,30 Z" fill="rgba(245,158,11,0.6)" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <text x="148" y="62" fill="white" fontSize="9" fontWeight="bold">Mgr</text>
      <text x="148" y="73" fill="white" fontSize="8">10%</text>
      <text x="155" y="105" fill="white" fontSize="9" fontWeight="bold">Inv A</text>
      <text x="155" y="116" fill="white" fontSize="8">40%</text>
      <text x="65" y="140" fill="white" fontSize="9" fontWeight="bold">Inv B</text>
      <text x="65" y="152" fill="white" fontSize="8">50%</text>
      <rect x="210" y="30" width="360" height="50" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="390" y="50" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">10% profit on $100,000 = $10,000 generated</text>
      <text x="390" y="68" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Total profit to distribute after manager fee</text>
      <defs>
        <marker id="splitArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      <line x1="390" y1="82" x2="390" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="390" y1="100" x2="260" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="390" y1="100" x2="390" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="390" y1="100" x2="520" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <rect x="200" y="108" width="120" height="52" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
      <text x="260" y="126" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">Manager</text>
      <text x="260" y="142" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">$1,000 + 25%</text>
      <text x="260" y="154" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">perf. fee</text>
      <rect x="330" y="108" width="120" height="52" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="390" y="126" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">Investor A</text>
      <text x="390" y="142" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">$4,000 - fee</text>
      <text x="390" y="154" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">40% share</text>
      <rect x="460" y="108" width="120" height="52" rx="6" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <text x="520" y="126" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">Investor B</text>
      <text x="520" y="142" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">$5,000 - fee</text>
      <text x="520" y="154" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">50% share</text>
      <rect x="40" y="178" width="520" height="70" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="196" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">KEY PRINCIPLE</text>
      <text x="300" y="212" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Manager earns performance fee ONLY when investors profit</text>
      <text x="300" y="228" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">High-water mark ensures no double-charging on recovered losses</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="9">Always check the fee structure before investing in any PAMM</text>
    </svg>
  );
}

function PammEvalSVG() {
  const criteria = [
    { dot: 'rgba(16,185,129,0.9)', text: 'Min 12 months verified track record', req: true },
    { dot: 'rgba(16,185,129,0.9)', text: 'Maximum drawdown below 20%', req: true },
    { dot: 'rgba(16,185,129,0.9)', text: 'Consistent monthly returns (not just one spike)', req: true },
    { dot: 'rgba(16,185,129,0.9)', text: "Manager's own capital in the account", req: true },
    { dot: 'rgba(245,158,11,0.9)', text: 'Licensed and regulated broker platform', req: false },
    { dot: 'rgba(245,158,11,0.9)', text: 'Transparent full trade history available', req: false },
  ];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">HOW TO EVALUATE A PAMM MANAGER</text>
      <rect x="20" y="28" width="560" height="192" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {criteria.map((c, i) => (
        <g key={i}>
          <circle cx="48" cy={55 + i * 28} r="7" fill={c.req ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'} stroke={c.dot} strokeWidth="1.5" />
          <circle cx="48" cy={55 + i * 28} r="3" fill={c.dot} />
          <text x="65" y={59 + i * 28} fill="rgba(255,255,255,0.8)" fontSize="10">{c.text}</text>
        </g>
      ))}
      <rect x="20" y="185" width="140" height="22" rx="4" fill="rgba(16,185,129,0.15)" />
      <circle cx="36" cy="196" r="5" fill="rgba(16,185,129,0.6)" />
      <text x="47" y="200" fill="rgba(16,185,129,0.8)" fontSize="9">= Required</text>
      <rect x="170" y="185" width="155" height="22" rx="4" fill="rgba(245,158,11,0.15)" />
      <circle cx="186" cy="196" r="5" fill="rgba(245,158,11,0.6)" />
      <text x="197" y="200" fill="rgba(245,158,11,0.8)" fontSize="9">= Nice to have</text>
      <rect x="20" y="222" width="560" height="28" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="240" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">If ANY required criterion is missing — do not invest</text>
    </svg>
  );
}

function PammStatsSVG() {
  const stats = [
    { label: 'Monthly Return', val: '+4.2%', c: 'rgba(16,185,129,0.9)' },
    { label: 'Annual Return', val: '+51%', c: 'rgba(16,185,129,0.9)' },
    { label: 'Max Drawdown', val: '-8.3%', c: 'rgba(239,68,68,0.9)' },
    { label: 'Win Rate', val: '61%', c: 'rgba(16,185,129,0.9)' },
    { label: 'Profit Factor', val: '2.1', c: 'rgba(99,102,241,0.9)' },
    { label: 'Sharpe Ratio', val: '1.4', c: 'rgba(245,158,11,0.9)' },
  ];
  const cols = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">PAMM PERFORMANCE METRICS DASHBOARD</text>
      {stats.map((s, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 192;
        const y = 30 + row * 90;
        return (
          <g key={i}>
            <rect x={x} y={y} width="178" height="78" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x={x + 89} y={y + 22} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">{s.label}</text>
            <text x={x + 89} y={y + 52} textAnchor="middle" fill={s.c} fontSize="24" fontWeight="bold">{s.val}</text>
          </g>
        );
      })}
      {cols}
      <rect x="20" y="222" width="560" height="28" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="240" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">Always compare returns against drawdown — not returns alone</text>
    </svg>
  );
}

function PammDiversifySVG() {
  function pie(cx: number, pcts: {p:number,c:string}[]) {
    let angle = -90;
    return pcts.map((s, i) => {
      const start = angle;
      const end = angle + s.p * 3.6;
      angle = end;
      const r = 50;
      const sr = ((start) * Math.PI) / 180;
      const er = ((end) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(sr), y1 = 90 + r * Math.sin(sr);
      const x2 = cx + r * Math.cos(er), y2 = 90 + r * Math.sin(er);
      const large = s.p > 50 ? 1 : 0;
      return <path key={i} d={`M${cx},90 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={s.c} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />;
    });
  }
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">DIVERSIFYING ACROSS PAMM MANAGERS</text>
      <rect x="20" y="26" width="560" height="22" rx="4" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="41" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">TOTAL PORTFOLIO — Split across 3 managers</text>
      {pie(100, [{p:40,c:'rgba(99,102,241,0.75)'},{p:35,c:'rgba(16,185,129,0.7)'},{p:25,c:'rgba(245,158,11,0.7)'}])}
      {pie(300, [{p:40,c:'rgba(99,102,241,0.75)'},{p:35,c:'rgba(16,185,129,0.7)'},{p:25,c:'rgba(245,158,11,0.7)'}])}
      {pie(500, [{p:40,c:'rgba(99,102,241,0.75)'},{p:35,c:'rgba(16,185,129,0.7)'},{p:25,c:'rgba(245,158,11,0.7)'}])}
      <text x="100" y="155" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">Manager A</text>
      <text x="100" y="168" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">40% allocation</text>
      <text x="100" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Conservative</text>
      <text x="300" y="155" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Manager B</text>
      <text x="300" y="168" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">35% allocation</text>
      <text x="300" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Moderate</text>
      <text x="500" y="155" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">Manager C</text>
      <text x="500" y="168" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">25% allocation</text>
      <text x="500" y="180" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Aggressive</text>
      <rect x="40" y="195" width="520" height="54" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="213" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="11" fontWeight="bold">Don't put all capital with one manager</text>
      <text x="300" y="229" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">Different styles (scalp, swing, trend) reduce correlation risk</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Monitor each manager's drawdown independently</text>
    </svg>
  );
}

function PammWithdrawalSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">PAMM WITHDRAWAL STRATEGIES</text>
      <rect x="20" y="30" width="80" height="40" rx="6" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
      <text x="60" y="53" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="9" fontWeight="bold">Capital</text>
      <defs>
        <marker id="wdArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.4)" />
        </marker>
      </defs>
      <line x1="100" y1="50" x2="130" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#wdArr)" />
      <rect x="130" y="30" width="100" height="40" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="180" y="53" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">PAMM Pool</text>
      <line x1="230" y1="50" x2="260" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#wdArr)" />
      <rect x="260" y="30" width="100" height="40" rx="6" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="310" y="53" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="9" fontWeight="bold">Trading</text>
      <line x1="360" y1="50" x2="390" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#wdArr)" />
      <rect x="390" y="30" width="100" height="40" rx="6" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <text x="440" y="53" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">Profits</text>
      <path d="M440,70 Q440,100 310,100 Q180,100 60,80" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" fill="none" markerEnd="url(#wdArr)" strokeDasharray="5,3" />
      <text x="250" y="115" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="8">Withdrawal back to investor</text>
      <rect x="20" y="128" width="560" height="120" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="146" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">WITHDRAWAL RULES</text>
      <line x1="40" y1="152" x2="560" y2="152" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x="40" y="168" fill="rgba(245,158,11,0.8)" fontSize="10">Withdrawal periods:</text>
      <text x="200" y="168" fill="rgba(255,255,255,0.7)" fontSize="10">Monthly or Quarterly (varies by PAMM)</text>
      <text x="40" y="184" fill="rgba(245,158,11,0.8)" fontSize="10">Notice required:</text>
      <text x="200" y="184" fill="rgba(255,255,255,0.7)" fontSize="10">1–7 business days typically</text>
      <text x="40" y="200" fill="rgba(245,158,11,0.8)" fontSize="10">Lock-up periods:</text>
      <text x="200" y="200" fill="rgba(255,255,255,0.7)" fontSize="10">Some PAMMs lock capital for 30–90 days</text>
      <rect x="40" y="212" width="520" height="28" rx="4" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="230" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">Avoid withdrawing during active drawdown — wait for recovery</text>
    </svg>
  );
}

function PriceActionSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">INTRODUCTION TO PRICE ACTION</text>
      <polyline points="40,190 80,175 110,182 140,160 165,168 195,140 220,148 248,120 270,130 295,105 315,115 340,88 365,98 388,72 415,85 440,60 460,70 480,50 510,62 540,45" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <line x1="40" y1="155" x2="310" y2="155" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="42" y="150" fill="rgba(16,185,129,0.7)" fontSize="8">Swing Low</text>
      <line x1="295" y1="100" x2="540" y2="100" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="400" y="96" fill="rgba(239,68,68,0.7)" fontSize="8">Swing High</text>
      <rect x="192" y="136" width="10" height="14" rx="1" fill="rgba(16,185,129,0.6)" stroke="rgba(16,185,129,0.9)" strokeWidth="1" />
      <line x1="197" y1="130" x2="197" y2="155" stroke="rgba(16,185,129,0.8)" strokeWidth="1" />
      <text x="214" y="146" fill="rgba(245,158,11,0.8)" fontSize="8">Pin Bar</text>
      <line x1="210" y1="143" x2="204" y2="143" stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="3,2" />
      <path d="M338,85 L370,60" stroke="rgba(99,102,241,0.8)" strokeWidth="2" />
      <text x="375" y="58" fill="rgba(99,102,241,0.8)" fontSize="8">BOS</text>
      <rect x="30" y="208" width="540" height="42" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="226" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="bold">Price Action = Reading RAW price movement</text>
      <text x="300" y="242" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">No indicators needed — price tells the complete story</text>
    </svg>
  );
}

function MarketStructureSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">MARKET STRUCTURE — HIGHS &amp; LOWS</text>
      <polyline points="40,200 90,200 120,160 160,175 200,120 240,145 280,90 320,115 360,155 395,175 430,130 465,150 500,95 540,115" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <text x="120" y="150" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">HH</text>
      <text x="200" y="110" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">HH</text>
      <text x="280" y="80" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">HH</text>
      <text x="160" y="186" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">HL</text>
      <text x="240" y="156" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">HL</text>
      <line x1="40" y1="200" x2="310" y2="100" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="360" y="145" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="9">LH</text>
      <text x="430" y="125" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="9">LH</text>
      <text x="395" y="188" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="bold">LL</text>
      <text x="465" y="163" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="9" fontWeight="bold">LL</text>
      <line x1="320" y1="118" x2="540" y2="118" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <rect x="30" y="210" width="245" height="38" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="152" y="227" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">BULLISH: HH + HL pattern</text>
      <text x="152" y="241" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Higher Highs, Higher Lows</text>
      <rect x="325" y="210" width="245" height="38" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="447" y="227" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">BEARISH: LH + LL pattern</text>
      <text x="447" y="241" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Lower Highs, Lower Lows</text>
    </svg>
  );
}

function BosSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">BREAK OF STRUCTURE (BOS)</text>
      <line x1="40" y1="130" x2="540" y2="130" stroke="rgba(239,68,68,0.6)" strokeWidth="2" strokeDasharray="6,3" />
      <text x="300" y="126" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="8">Resistance level</text>
      <polyline points="40,200 80,195 110,185 140,175 165,178 190,165 220,168 245,160 265,163 280,130" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <polyline points="280,130 300,115 330,90 360,80 400,65 440,55 490,45 540,40" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2.5" />
      <defs>
        <marker id="bosArr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(16,185,129,0.9)" />
        </marker>
      </defs>
      <path d="M280,128 L340,100" stroke="rgba(16,185,129,0.8)" strokeWidth="2" markerEnd="url(#bosArr)" />
      <text x="310" y="155" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">BREAK OF STRUCTURE</text>
      <text x="310" y="170" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Price closes decisively above resistance</text>
      <rect x="280" y="130" width="50" height="50" rx="3" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="305" y="175" fill="rgba(16,185,129,0.6)" fontSize="7">New</text>
      <text x="305" y="184" fill="rgba(16,185,129,0.6)" fontSize="7">Support</text>
      <rect x="20" y="212" width="560" height="36" rx="6" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="228" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">Previous resistance becomes new support (role reversal)</text>
      <text x="300" y="242" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">BOS confirms bullish market structure continuation</text>
    </svg>
  );
}

function ChochSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">CHANGE OF CHARACTER (CHOCH)</text>
      <polyline points="30,200 70,195 100,175 130,180 160,155 190,162 220,138 250,145 275,120" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="2" />
      <text x="60" y="191" fill="rgba(16,185,129,0.6)" fontSize="7">HL</text>
      <text x="130" y="170" fill="rgba(16,185,129,0.6)" fontSize="7">HL</text>
      <text x="100" y="166" fill="rgba(16,185,129,0.8)" fontSize="8">HH</text>
      <text x="160" y="146" fill="rgba(16,185,129,0.8)" fontSize="8">HH</text>
      <line x1="250" y1="145" x2="540" y2="145" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="390" y="140" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="8">Last Higher Low (broken)</text>
      <polyline points="275,120 300,130 325,148 355,162 380,175 410,188 450,195 490,200 530,205" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="2.5" />
      <defs>
        <marker id="chochArr" markerWidth="7" markerHeight="7" refX="3.5" refY="1" orient="auto">
          <path d="M0,0 L3.5,7 L7,0" fill="rgba(239,68,68,0.9)" />
        </marker>
      </defs>
      <path d="M300,128 L320,160" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" markerEnd="url(#chochArr)" />
      <text x="340" y="118" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">CHOCH</text>
      <text x="340" y="130" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="8">First sign of reversal</text>
      <rect x="20" y="210" width="560" height="40" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="227" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">Market shifts from bullish to bearish structure</text>
      <text x="300" y="243" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="9">Early signal — wait for confirmation before entering short</text>
    </svg>
  );
}

function OrderBlocksSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">ORDER BLOCKS — INSTITUTIONAL ZONES</text>
      <polyline points="40,200 80,200 110,190 140,185 160,175 180,130 200,90 230,80 260,65 300,55 340,50 380,48 420,52" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <rect x="138" y="170" width="44" height="18" rx="2" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
      <text x="160" y="203" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="8">Bullish OB</text>
      <text x="160" y="213" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="7">Last bearish candle</text>
      <text x="160" y="222" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="7">before big up move</text>
      <polyline points="420,52 450,60 470,90 490,130 510,150 530,160 555,155" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <rect x="448" y="55" width="44" height="18" rx="2" fill="rgba(239,68,68,0.25)" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" />
      <text x="470" y="45" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8">Bearish OB</text>
      <text x="470" y="90" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7">Last bullish candle</text>
      <text x="470" y="100" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="7">before big down move</text>
      <rect x="20" y="228" width="560" height="24" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="244" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Order blocks = areas of institutional interest where price tends to reverse</text>
    </svg>
  );
}

function FvgSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FAIR VALUE GAP (FVG) — PRICE IMBALANCE</text>
      <rect x="100" y="140" width="20" height="55" rx="2" fill="rgba(239,68,68,0.6)" stroke="rgba(239,68,68,0.9)" strokeWidth="1.5" />
      <line x1="110" y1="130" x2="110" y2="200" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" />
      <text x="110" y="215" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Candle 1</text>
      <rect x="160" y="80" width="24" height="90" rx="2" fill="rgba(16,185,129,0.7)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <line x1="172" y1="70" x2="172" y2="178" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" />
      <text x="172" y="215" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Candle 2 (big)</text>
      <rect x="220" y="75" width="20" height="50" rx="2" fill="rgba(239,68,68,0.5)" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" />
      <line x1="230" y1="65" x2="230" y2="130" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" />
      <text x="230" y="215" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Candle 3</text>
      <rect x="120" y="125" width="100" height="18" rx="2" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="170" y="137" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="8">FVG — Imbalance</text>
      <line x1="120" y1="134" x2="110" y2="134" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="220" y1="125" x2="230" y2="125" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <polyline points="300,70 330,72 355,78 375,95 390,120 400,135 405,143" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="350" y="160" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="8">Price fills</text>
      <text x="350" y="170" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="8">the gap</text>
      <rect x="20" y="220" width="560" height="30" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="238" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">Price tends to retrace into the FVG before continuing the trend</text>
    </svg>
  );
}

function LiquiditySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">LIQUIDITY ZONES — STOP HUNTS</text>
      <line x1="40" y1="80" x2="540" y2="80" stroke="rgba(239,68,68,0.6)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="420" y="75" fill="rgba(239,68,68,0.7)" fontSize="8">Buy-side liquidity (stops above highs)</text>
      <line x1="40" y1="180" x2="540" y2="180" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="420" y="195" fill="rgba(16,185,129,0.7)" fontSize="8">Sell-side liquidity (stops below lows)</text>
      <polyline points="40,150 80,145 110,148 145,140 170,143 200,135 225,138 250,130 270,135 290,125 305,128 315,118 325,85 335,78 340,70" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <polyline points="340,70 345,80 350,95 360,115 375,128 395,138 420,145 460,148 500,150 540,152" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <circle cx="338" cy="73" r="8" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.7)" strokeWidth="1.5" />
      <text x="338" y="60" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="8" fontWeight="bold">Sweep!</text>
      <line x1="338" y1="63" x2="338" y2="67" stroke="rgba(99,102,241,0.5)" strokeWidth="1" />
      <rect x="20" y="210" width="560" height="38" rx="6" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="227" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">Smart money hunts stops before reversing direction</text>
      <text x="300" y="241" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Liquidity sweep = trap retail traders, then move in true direction</text>
    </svg>
  );
}


function SmartMoneySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">SMART MONEY CONCEPTS — MARKET PHASES</text>
      <rect x="20" y="30" width="125" height="80" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="82" y="52" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">ACCUMULATION</text>
      <polyline points="30,90 50,88 65,92 80,87 95,91 110,86 130,88" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
      <text x="82" y="104" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Smart money buys quietly</text>
      <defs>
        <marker id="smArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      <line x1="148" y1="70" x2="168" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#smArr)" />
      <rect x="170" y="30" width="125" height="80" rx="8" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="232" y="52" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">MANIPULATION</text>
      <polyline points="180,70 195,60 210,72 225,58 240,72 255,55 275,68" fill="none" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" />
      <text x="232" y="104" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Stop hunt / false break</text>
      <line x1="298" y1="70" x2="318" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#smArr)" />
      <rect x="320" y="30" width="125" height="80" rx="8" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="382" y="52" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">DISTRIBUTION</text>
      <polyline points="330,45 345,46 360,48 375,50 390,52 405,53 430,55" fill="none" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" />
      <text x="382" y="104" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Smart money sells into buyers</text>
      <line x1="448" y1="70" x2="468" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#smArr)" />
      <rect x="470" y="30" width="110" height="80" rx="8" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
      <text x="525" y="52" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">TREND MOVE</text>
      <polyline points="480,90 495,78 510,65 520,52 530,42 540,35 570,28" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="1.5" />
      <text x="525" y="104" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">True directional move</text>
      <rect x="20" y="128" width="560" height="48" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="148" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold">MANIPULATION — Stop hunts before the real move</text>
      <text x="300" y="164" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">False breakouts · Liquidity sweeps · Inducing retail entries at wrong levels</text>
      <rect x="20" y="188" width="560" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <text x="300" y="206" textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="10">RETAIL vs INSTITUTIONAL</text>
      <text x="300" y="222" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Retail: chases breakouts, buys at highs, sells at lows</text>
      <text x="300" y="237" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9">Institutions: buy during accumulation, sell during distribution</text>
      <text x="300" y="248" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Trade WITH smart money — not against it</text>
    </svg>
  );
}

function SessionTimingSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">SESSION TIMING FOR ENTRIES</text>
      <circle cx="190" cy="118" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {[0,3,6,9,12,15,18,21].map((h,i) => {
        const angle = ((h / 24) * 360 - 90) * Math.PI / 180;
        const x1 = 190 + 85 * Math.cos(angle);
        const y1 = 118 + 85 * Math.sin(angle);
        const x2 = 190 + 95 * Math.cos(angle);
        const y2 = 118 + 95 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />;
      })}
      <path d="M190,118 L190,33 A85,85 0 0,1 258,160 Z" fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />
      <text x="195" y="62" fill="rgba(59,130,246,0.8)" fontSize="8">Tokyo</text>
      <text x="195" y="72" fill="rgba(59,130,246,0.6)" fontSize="7">Low vol</text>
      <path d="M190,118 L111,56 A85,85 0 0,1 190,33 Z" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <text x="140" y="60" fill="rgba(16,185,129,0.8)" fontSize="8">London</text>
      <text x="140" y="70" fill="rgba(16,185,129,0.6)" fontSize="7">Open</text>
      <path d="M190,118 L147,200 A85,85 0 0,0 111,56 Z" fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
      <path d="M190,118 L258,160 A85,85 0 0,1 147,200 Z" fill="rgba(255,200,0,0.4)" stroke="rgba(255,200,0,0.7)" strokeWidth="2" />
      <text x="220" y="175" fill="rgba(255,220,0,0.9)" fontSize="9" fontWeight="bold">BEST</text>
      <text x="220" y="186" fill="rgba(255,220,0,0.9)" fontSize="7">Overlap</text>
      <text x="300" y="45" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold">KEY TIMES (GMT)</text>
      <line x1="295" y1="50" x2="560" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      {[
        { t:'08:00', label:'London Open', c:'rgba(16,185,129,0.9)' },
        { t:'13:00', label:'New York Open', c:'rgba(245,158,11,0.9)' },
        { t:'13:00–17:00', label:'Best overlap window', c:'rgba(255,220,0,0.9)' },
        { t:'00:00–09:00', label:'Tokyo (low volatility)', c:'rgba(59,130,246,0.7)' },
      ].map((item, i) => (
        <g key={i}>
          <text x="305" y={70 + i * 22} fill={item.c} fontSize="9" fontWeight="bold">{item.t}</text>
          <text x="405" y={70 + i * 22} fill="rgba(255,255,255,0.6)" fontSize="9">{item.label}</text>
        </g>
      ))}
      <rect x="295" y="160" width="280" height="46" rx="6" fill="rgba(255,220,0,0.08)" stroke="rgba(255,220,0,0.35)" strokeWidth="1.5" />
      <text x="435" y="179" textAnchor="middle" fill="rgba(255,220,0,0.9)" fontSize="10" fontWeight="bold">Time entries around session opens</text>
      <text x="435" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Most volatility and volume at open</text>
      <rect x="10" y="215" width="580" height="34" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="230" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">13:00–17:00 GMT = London + NY overlap = highest probability entries</text>
      <text x="300" y="243" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Avoid trading during low-liquidity Asian session unless you trade JPY pairs</text>
    </svg>
  );
}

function ConfluenceSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">CONFLUENCE TRADING — OVERLAPPING SIGNALS</text>
      <circle cx="200" cy="115" r="70" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
      <circle cx="300" cy="115" r="70" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
      <circle cx="250" cy="185" r="70" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
      <text x="155" y="100" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">KEY LEVEL</text>
      <text x="155" y="114" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Support /</text>
      <text x="155" y="124" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Resistance</text>
      <text x="345" y="100" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">SIGNAL</text>
      <text x="345" y="114" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Pin bar /</text>
      <text x="345" y="124" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Engulfing</text>
      <text x="250" y="232" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">TREND</text>
      <text x="250" y="246" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Higher TF direction</text>
      <rect x="202" y="130" width="97" height="38" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <text x="250" y="147" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">HIGH PROB</text>
      <text x="250" y="161" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">TRADE SETUP</text>
      <rect x="20" y="12" width="560" height="0" />
      <rect x="360" y="30" width="220" height="128" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="470" y="50" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">CONFLUENCE SCORE</text>
      <line x1="370" y1="56" x2="570" y2="56" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {[
        { score:'1 signal', c:'rgba(239,68,68,0.7)', w:40 },
        { score:'2 signals', c:'rgba(245,158,11,0.7)', w:75 },
        { score:'3 signals', c:'rgba(16,185,129,0.7)', w:110 },
        { score:'4+ signals', c:'rgba(99,102,241,0.9)', w:145 },
      ].map((r, i) => (
        <g key={i}>
          <text x="375" y={74 + i * 24} fill="rgba(255,255,255,0.5)" fontSize="9">{r.score}</text>
          <rect x="445" y={63 + i * 24} width={r.w} height="12" rx="3" fill={r.c} />
        </g>
      ))}
      <text x="470" y="148" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">More confluence = higher probability</text>
    </svg>
  );
}

function TradeMgmtSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TRADE MANAGEMENT WITH PRICE ACTION</text>
      <line x1="40" y1="55" x2="540" y2="55" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" strokeDasharray="6,3" />
      <text x="548" y="59" fill="rgba(16,185,129,0.8)" fontSize="8">TP</text>
      <line x1="40" y1="130" x2="540" y2="130" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <text x="548" y="134" fill="white" fontSize="9" fontWeight="bold">Entry</text>
      <line x1="40" y1="200" x2="540" y2="200" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeDasharray="6,3" />
      <text x="548" y="204" fill="rgba(239,68,68,0.8)" fontSize="8">SL</text>
      <polyline points="40,130 80,128 110,126 140,122 165,118 190,112 210,108 230,100 255,130 260,128 270,122" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <line x1="40" y1="200" x2="165" y2="200" stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" strokeDasharray="4,2" />
      <line x1="165" y1="200" x2="165" y2="130" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="165" y="125" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="8">Move to BE</text>
      <text x="165" y="115" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="7">(at 1:1)</text>
      <polyline points="190,112 200,130 210,128 220,124 230,130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="230" y1="130" x2="230" y2="108" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
      <line x1="240" y1="100" x2="240" y2="82" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" strokeDasharray="3,2" />
      <text x="260" y="100" fill="rgba(16,185,129,0.8)" fontSize="8">Trail stop</text>
      <text x="260" y="110" fill="rgba(16,185,129,0.6)" fontSize="7">behind structure</text>
      <rect x="20" y="8" width="320" height="0" />
      <rect x="30" y="220" width="540" height="30" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="235" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">1. Enter at setup  2. Move to BE at 1:1  3. Trail stop behind structure</text>
      <text x="300" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Let winners run, cut losses short — protect capital above all else</text>
    </svg>
  );
}

function ScalpSwingSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">SCALPING vs SWING TRADING</text>
      <rect x="20" y="30" width="255" height="192" rx="8" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="147" y="54" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="13" fontWeight="bold">SCALPING</text>
      <line x1="40" y1="62" x2="255" y2="62" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      {[
        '1M / 5M / 15M timeframes',
        '5 – 30 pip targets',
        'Multiple trades per day',
        'Requires fast execution',
        'Very high time commitment',
        'High stress / screen time',
      ].map((item, i) => (
        <g key={i}>
          <circle cx="38" cy={80 + i*22} r="3" fill="rgba(239,68,68,0.6)" />
          <text x="48" y={84 + i*22} fill="rgba(255,255,255,0.7)" fontSize="10">{item}</text>
        </g>
      ))}
      <rect x="325" y="30" width="255" height="192" rx="8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="452" y="54" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="13" fontWeight="bold">SWING TRADING</text>
      <line x1="345" y1="62" x2="560" y2="62" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {[
        '4H / Daily chart timeframes',
        '50 – 300 pip targets',
        '1 – 10 trades per week',
        'Less screen time needed',
        'Holds trades overnight',
        'More suitable for beginners',
      ].map((item, i) => (
        <g key={i}>
          <circle cx="343" cy={80 + i*22} r="3" fill="rgba(16,185,129,0.6)" />
          <text x="353" y={84 + i*22} fill="rgba(255,255,255,0.7)" fontSize="10">{item}</text>
        </g>
      ))}
      <text x="293" y="118" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="16" fontWeight="bold">VS</text>
      <rect x="60" y="232" width="480" height="22" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="300" y="247" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">Swing trading recommended for beginners — less noise, more time to think</text>
    </svg>
  );
}

function LiveChartSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">LIVE CHART WALKTHROUGH — COMPLETE TRADE EXAMPLE</text>
      <polyline points="40,180 70,175 95,178 120,165 145,170 170,155 195,160 218,145 235,148 250,140 265,130 280,133 292,128 300,120" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <rect x="288" y="116" width="14" height="16" rx="1" fill="rgba(16,185,129,0.7)" stroke="rgba(16,185,129,0.9)" strokeWidth="1.5" />
      <line x1="295" y1="108" x2="295" y2="136" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" />
      <line x1="40" y1="145" x2="540" y2="145" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="410" y="141" fill="rgba(16,185,129,0.7)" fontSize="8">Support level</text>
      <circle cx="295" cy="124" r="12" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <text x="310" y="100" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">1. Entry</text>
      <text x="310" y="112" fill="rgba(16,185,129,0.7)" fontSize="8">Pin bar at support</text>
      <line x1="295" y1="136" x2="295" y2="170" stroke="rgba(239,68,68,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="270" y1="170" x2="350" y2="170" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="360" y="174" fill="rgba(239,68,68,0.8)" fontSize="8">2. SL below low</text>
      <polyline points="300,120 320,112 345,100 370,88 395,75 420,62 445,50 470,42" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2.5" />
      <line x1="270" y1="72" x2="480" y2="72" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="360" y="68" fill="rgba(245,158,11,0.8)" fontSize="8">3. TP at resistance</text>
      <rect x="40" y="192" width="520" height="58" rx="6" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="300" y="210" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">Result: +45 pips  |  Risk: 20 pips  |  R:R = 1:2.25</text>
      <text x="300" y="226" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">Entry: pin bar at support · SL: below candle low · TP: next resistance level</text>
      <text x="300" y="242" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Always identify entry, SL and TP BEFORE placing the trade</text>
    </svg>
  );
}

function PaStrategySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <rect x="20" y="10" width="560" height="240" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
      <text x="300" y="34" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="13" fontWeight="bold">PRICE ACTION STRATEGY TEMPLATE</text>
      <line x1="40" y1="42" x2="560" y2="42" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
      {[
        { label: 'Bias:', value: 'Higher TF trend direction (Daily or 4H)' },
        { label: 'Zone:', value: 'Key support or resistance level' },
        { label: 'Signal:', value: 'Pin bar or engulfing candle at zone' },
        { label: 'Entry:', value: 'Candle close confirmation' },
        { label: 'SL:', value: 'Below / above the signal candle wick' },
        { label: 'TP:', value: 'Next key structural level' },
      ].map((item, i) => (
        <g key={i}>
          <text x="50" y={68 + i * 28} fill="rgba(99,102,241,0.8)" fontSize="10" fontWeight="bold">{item.label}</text>
          <text x="110" y={68 + i * 28} fill="rgba(255,255,255,0.8)" fontSize="10">{item.value}</text>
          <line x1="40" y1={74 + i * 28} x2="560" y2={74 + i * 28} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </g>
      ))}
      <rect x="60" y="220" width="480" height="22" rx="6" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />
      <text x="300" y="235" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">Repeat this process consistently — edge comes from repetition</text>
    </svg>
  );
}


function EaIntroSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">INTRODUCTION TO AUTOMATED TRADING</text>
      <rect x="238" y="40" width="124" height="90" rx="12" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <rect x="252" y="52" width="96" height="52" rx="6" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="1" />
      <circle cx="278" cy="68" r="6" fill="rgba(255,255,255,0.8)" />
      <circle cx="322" cy="68" r="6" fill="rgba(255,255,255,0.8)" />
      <rect x="270" y="82" width="60" height="6" rx="3" fill="rgba(16,185,129,0.6)" />
      <rect x="248" y="108" width="20" height="16" rx="3" fill="rgba(99,102,241,0.4)" stroke="rgba(99,102,241,0.6)" strokeWidth="1" />
      <rect x="332" y="108" width="20" height="16" rx="3" fill="rgba(99,102,241,0.4)" stroke="rgba(99,102,241,0.6)" strokeWidth="1" />
      <text x="300" y="144" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontWeight="bold">EXPERT ADVISOR (EA)</text>
      {[
        { label: 'Monitors market 24/5', x: 80, y: 65 },
        { label: 'No emotion in decisions', x: 80, y: 88 },
        { label: 'Fully backtestable', x: 480, y: 65 },
        { label: 'Runs on VPS server', x: 480, y: 88 },
      ].map((item, i) => (
        <g key={i}>
          <rect x={item.x - 68} y={item.y - 14} width="136" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x={item.x} y={item.y + 1} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">{item.label}</text>
          <line x1={item.x < 300 ? item.x + 68 : item.x - 68} y1={item.y} x2={item.x < 300 ? item.x + 90 : item.x - 90} y2={item.y} stroke="rgba(99,102,241,0.3)" strokeWidth="1" strokeDasharray="3,2" />
        </g>
      ))}
      <rect x="30" y="162" width="540" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="300" y="178" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">EA = Expert Advisor — automated trading program coded in MQL4 or MQL5</text>
      <text x="300" y="192" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Runs on MetaTrader platform · Executes trades based on coded rules</text>
      <rect x="30" y="210" width="540" height="36" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="226" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="10" fontWeight="bold">No EA works forever — monitor regularly and adapt to market changes</text>
      <text x="300" y="240" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Even well-coded EAs need periodic review as market conditions shift</text>
    </svg>
  );
}

function MetatraderSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">METATRADER 4 vs METATRADER 5</text>
      <rect x="20" y="30" width="255" height="180" rx="8" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
      <text x="147" y="56" textAnchor="middle" fill="rgba(99,180,255,0.9)" fontSize="14" fontWeight="bold">MT4</text>
      <line x1="40" y1="64" x2="255" y2="64" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
      {[
        { t: 'Most popular forex platform', c: 'rgba(255,255,255,0.8)' },
        { t: 'MQL4 programming language', c: 'rgba(255,255,255,0.7)' },
        { t: 'Huge EA / indicator library', c: 'rgba(255,255,255,0.7)' },
        { t: 'Forex pairs focused', c: 'rgba(255,255,255,0.7)' },
        { t: 'Simpler backtesting engine', c: 'rgba(255,255,255,0.6)' },
        { t: 'Free from most brokers', c: 'rgba(16,185,129,0.8)' },
      ].map((item, i) => (
        <g key={i}>
          <circle cx="40" cy={83 + i * 22} r="3" fill="rgba(99,180,255,0.6)" />
          <text x="50" y={87 + i * 22} fill={item.c} fontSize="10">{item.t}</text>
        </g>
      ))}
      <rect x="325" y="30" width="255" height="180" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
      <text x="452" y="56" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="14" fontWeight="bold">MT5</text>
      <line x1="345" y1="64" x2="560" y2="64" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {[
        { t: 'Newer, multi-asset platform', c: 'rgba(255,255,255,0.8)' },
        { t: 'MQL5 programming language', c: 'rgba(255,255,255,0.7)' },
        { t: 'More asset classes (stocks)', c: 'rgba(255,255,255,0.7)' },
        { t: 'Advanced backtesting tools', c: 'rgba(255,255,255,0.7)' },
        { t: 'Better optimisation engine', c: 'rgba(255,255,255,0.6)' },
        { t: 'Free from most brokers', c: 'rgba(16,185,129,0.8)' },
      ].map((item, i) => (
        <g key={i}>
          <circle cx="345" cy={83 + i * 22} r="3" fill="rgba(16,185,129,0.6)" />
          <text x="355" y={87 + i * 22} fill={item.c} fontSize="10">{item.t}</text>
        </g>
      ))}
      <text x="293" y="122" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="13" fontWeight="bold">VS</text>
      <rect x="60" y="222" width="480" height="28" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="240" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">MT4 most common for forex EAs — larger community and more resources</text>
    </svg>
  );
}

function MqlSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">MQL4/5 STRUCTURE — EA BUILDING BLOCKS</text>
      <defs>
        <marker id="mqlArr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      {[
        { fn: 'OnInit()', desc: 'Runs ONCE at EA startup', sub: 'Set variables, validate settings', x: 40, y: 45, c: 'rgba(99,102,241,0.6)' },
        { fn: 'OnTick()', desc: 'Runs on EVERY price tick', sub: 'Main logic: check conditions, place orders', x: 40, y: 120, c: 'rgba(16,185,129,0.7)' },
        { fn: 'OnDeinit()', desc: 'Runs when EA is REMOVED', sub: 'Cleanup, close positions, log results', x: 40, y: 195, c: 'rgba(245,158,11,0.6)' },
      ].map((item, i) => (
        <g key={i}>
          <rect x={item.x} y={item.y - 20} width="250" height="62" rx="8" fill={item.c.replace('0.6','0.1').replace('0.7','0.1')} stroke={item.c} strokeWidth="1.5" />
          <text x={item.x + 10} y={item.y} fill={item.c} fontSize="13" fontWeight="bold" fontFamily="monospace">{item.fn}</text>
          <text x={item.x + 10} y={item.y + 16} fill="rgba(255,255,255,0.7)" fontSize="10">{item.desc}</text>
          <text x={item.x + 10} y={item.y + 30} fill="rgba(255,255,255,0.4)" fontSize="9">{item.sub}</text>
        </g>
      ))}
      <line x1="165" y1="107" x2="165" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#mqlArr)" />
      <line x1="165" y1="182" x2="165" y2="195" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#mqlArr)" />
      <rect x="340" y="30" width="230" height="190" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x="455" y="52" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">EA EXECUTION PIPELINE</text>
      <line x1="350" y1="58" x2="560" y2="58" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {[
        { step: 'Variables', c: 'rgba(99,102,241,0.7)' },
        { step: 'Conditions check', c: 'rgba(245,158,11,0.7)' },
        { step: 'Signal generated', c: 'rgba(16,185,129,0.7)' },
        { step: 'Risk calculated', c: 'rgba(245,158,11,0.7)' },
        { step: 'OrderSend()', c: 'rgba(16,185,129,0.9)' },
        { step: 'Position managed', c: 'rgba(99,102,241,0.7)' },
      ].map((s, i) => (
        <g key={i}>
          <rect x="360" y={70 + i * 24} width="170" height="18" rx="4" fill={s.c.replace('0.7','0.15').replace('0.9','0.15')} stroke={s.c} strokeWidth="1" />
          <text x="445" y={83 + i * 24} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">{s.step}</text>
          {i < 5 && <line x1="445" y1={89 + i * 24} x2="445" y2={93 + i * 24} stroke="rgba(255,255,255,0.2)" strokeWidth="1" markerEnd="url(#mqlArr)" />}
        </g>
      ))}
    </svg>
  );
}

function EaStructureSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">EA LOGIC FLOW — DECISION TREE</text>
      <defs>
        <marker id="eaArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      <rect x="215" y="28" width="170" height="28" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="300" y="46" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">Market tick received</text>
      <line x1="300" y1="56" x2="300" y2="68" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <rect x="215" y="68" width="170" height="28" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      <text x="300" y="86" textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="9">Check conditions</text>
      <line x1="300" y1="96" x2="300" y2="108" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <rect x="215" y="108" width="170" height="28" rx="6" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
      <text x="300" y="126" textAnchor="middle" fill="rgba(99,102,241,0.8)" fontSize="9">Buy/Sell signal?</text>
      <line x1="385" y1="122" x2="430" y2="122" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <text x="407" y="118" fill="rgba(239,68,68,0.6)" fontSize="8">NO</text>
      <rect x="430" y="108" width="140" height="28" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="500" y="126" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="9">Wait for next tick</text>
      <path d="M500,136 Q500,155 300,155 Q300,148" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#eaArr)" />
      <line x1="300" y1="136" x2="300" y2="148" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <text x="274" y="144" fill="rgba(16,185,129,0.6)" fontSize="8">YES</text>
      <rect x="215" y="148" width="170" height="28" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <text x="300" y="166" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9">Check risk rules</text>
      <line x1="300" y1="176" x2="300" y2="188" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <rect x="185" y="188" width="230" height="28" rx="6" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <text x="300" y="206" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9" fontWeight="bold">Place order with SL/TP</text>
      <line x1="300" y1="216" x2="300" y2="228" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#eaArr)" />
      <rect x="215" y="228" width="170" height="24" rx="6" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="300" y="243" textAnchor="middle" fill="rgba(99,102,241,0.7)" fontSize="9">Manage open position</text>
    </svg>
  );
}

function EaEntriesSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">ENTRY &amp; EXIT CONDITIONS IN CODE</text>
      <rect x="20" y="30" width="260" height="170" rx="8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="150" y="52" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">ENTRY CONDITIONS</text>
      <text x="150" y="64" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">ALL must be TRUE to enter</text>
      <line x1="30" y1="70" x2="270" y2="70" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {[
        'Price > 200 EMA ?',
        'RSI > 50 ?',
        'Pin bar on 4H ?',
        'SL distance valid ?',
      ].map((c, i) => (
        <g key={i}>
          <rect x="35" y={82 + i * 28} width="230" height="22" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
          <text x="50" y={97 + i * 28} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace">{c}</text>
        </g>
      ))}
      <rect x="20" y="185" width="260" height="30" rx="6" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <text x="150" y="204" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">if ALL true → OrderSend(BUY)</text>
      <rect x="320" y="30" width="260" height="170" rx="8" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="450" y="52" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">EXIT CONDITIONS</text>
      <text x="450" y="64" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">ANY can close the trade</text>
      <line x1="330" y1="70" x2="570" y2="70" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      {[
        { t: 'Stop Loss hit ?', c: 'rgba(239,68,68,0.7)' },
        { t: 'Take Profit hit ?', c: 'rgba(16,185,129,0.7)' },
        { t: 'Trailing stop triggered ?', c: 'rgba(245,158,11,0.7)' },
        { t: 'Time-based close ?', c: 'rgba(99,102,241,0.7)' },
      ].map((c, i) => (
        <g key={i}>
          <rect x="335" y={82 + i * 28} width="230" height="22" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="350" y={97 + i * 28} fill={c.c} fontSize="10" fontFamily="monospace">{c.t}</text>
        </g>
      ))}
      <rect x="320" y="185" width="260" height="30" rx="6" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
      <text x="450" y="204" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">if ANY true → OrderClose()</text>
      <rect x="20" y="225" width="560" height="26" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="241" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Test all conditions thoroughly in backtest before running live</text>
    </svg>
  );
}

function EaRiskSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">RISK MANAGEMENT IN CODE</text>
      <defs>
        <marker id="erArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>
      {[
        { code: 'RiskPercent  = 1.0', desc: '1% risk per trade', c: 'rgba(99,102,241,0.7)', y: 50 },
        { code: 'Balance      = AccountBalance()', desc: 'Live account balance', c: 'rgba(255,255,255,0.5)', y: 82 },
        { code: 'RiskAmount   = Balance × RiskPercent%', desc: 'Dollar risk in this trade', c: 'rgba(245,158,11,0.7)', y: 114 },
        { code: 'LotSize = RiskAmount ÷ (SL_pips × PipValue)', desc: 'Calculated lot size', c: 'rgba(16,185,129,0.9)', y: 146 },
      ].map((item, i) => (
        <g key={i}>
          <rect x="20" y={item.y - 16} width="410" height="28" rx="5" fill="rgba(255,255,255,0.04)" stroke={item.c.replace('0.7','0.3').replace('0.9','0.3').replace('0.5','0.15')} strokeWidth="1" />
          <text x="32" y={item.y + 1} fill={item.c} fontSize="10" fontFamily="monospace">{item.code}</text>
          {i < 3 && <line x1="225" y1={item.y + 12} x2="225" y2={item.y + 24} stroke="rgba(255,255,255,0.15)" strokeWidth="1" markerEnd="url(#erArr)" />}
          <text x="445" y={item.y + 1} fill="rgba(255,255,255,0.4)" fontSize="9">{item.desc}</text>
        </g>
      ))}
      <line x1="225" y1="162" x2="225" y2="188" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" markerEnd="url(#erArr)" />
      <rect x="100" y="188" width="250" height="32" rx="8" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.6)" strokeWidth="1.5" />
      <text x="225" y="208" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold" fontFamily="monospace">OrderSend( LotSize )</text>
      <rect x="20" y="232" width="560" height="20" rx="4" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="245" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="9" fontWeight="bold">Always use NormalizeDouble(LotSize, 2) and check min/max lot limits</text>
    </svg>
  );
}

function OptimizeSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">OPTIMIZING EA PARAMETERS</text>
      <line x1="40" y1="200" x2="560" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <line x1="40" y1="40" x2="40" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <text x="300" y="218" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">Parameter value (e.g. RSI period: 5 to 50)</text>
      <text x="30" y="120" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" transform="rotate(-90,30,120)">Profit</text>
      <polyline points="55,195 90,185 130,160 170,130 210,100 255,70 285,52 310,48 335,50 360,60 390,80 420,110 450,145 490,170 530,185 555,192" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="2.5" />
      <rect x="255" y="40" width="110" height="120" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="310" y="36" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="9" fontWeight="bold">Optimal Zone</text>
      <circle cx="310" cy="48" r="6" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" />
      <text x="310" y="44" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="9">Peak</text>
      <rect x="40" y="160" width="100" height="40" fill="rgba(245,158,11,0.07)" />
      <text x="90" y="178" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8">Under-</text>
      <text x="90" y="189" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="8">optimised</text>
      <rect x="420" y="160" width="135" height="40" fill="rgba(239,68,68,0.07)" />
      <text x="488" y="178" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="8">Overfit</text>
      <text x="488" y="189" textAnchor="middle" fill="rgba(239,68,68,0.7)" fontSize="8">zone</text>
      <rect x="40" y="220" width="520" height="30" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="235" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">Find the ROBUST range — not the single highest peak</text>
      <text x="300" y="246" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">A parameter that works across a range is more reliable than a one-point peak</text>
    </svg>
  );
}

function CurveFittingSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">AVOIDING CURVE FITTING — OVERFIT vs ROBUST</text>
      <rect x="10" y="28" width="280" height="185" rx="8" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
      <text x="150" y="48" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">OVERFIT STRATEGY</text>
      <line x1="20" y1="90" x2="140" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="80" y="86" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">Backtest</text>
      <line x1="140" y1="90" x2="280" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="210" y="86" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">Live</text>
      <polyline points="20,175 38,162 56,148 74,134 92,119 110,104 128,92 140,90" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="2" />
      <polyline points="140,90 155,108 170,135 185,158 200,175 215,185 230,190 245,195" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="2.5" />
      <text x="200" y="175" fill="rgba(239,68,68,0.8)" fontSize="8">Crashes live!</text>
      <rect x="310" y="28" width="280" height="185" rx="8" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
      <text x="450" y="48" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold">ROBUST STRATEGY</text>
      <line x1="320" y1="90" x2="440" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="380" y="86" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">Backtest</text>
      <line x1="440" y1="90" x2="580" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="510" y="86" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">Live</text>
      <polyline points="320,165 345,152 370,140 395,128 418,118 440,110" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="2" />
      <polyline points="440,110 460,115 480,110 498,118 516,112 535,118 555,112 575,115" fill="none" stroke="rgba(16,185,129,0.9)" strokeWidth="2" />
      <text x="508" y="108" fill="rgba(16,185,129,0.8)" fontSize="8">Consistent</text>
      <rect x="40" y="224" width="520" height="28" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <text x="300" y="242" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">If it is too perfect on history — it will not work live</text>
    </svg>
  );
}

function ForwardTestSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">FORWARD TESTING — THE THREE PHASES</text>
      <rect x="20" y="38" width="165" height="80" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <text x="102" y="58" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="bold">BACKTEST</text>
      <text x="102" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Historical data</text>
      <text x="102" y="84" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">2020 – 2023</text>
      <text x="102" y="100" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Win: 54% · RR: 1.8</text>
      <rect x="217" y="38" width="165" height="80" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="299" y="58" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">FORWARD TEST</text>
      <text x="299" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Demo / Paper trade</text>
      <text x="299" y="84" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">2024 – 3 months min</text>
      <text x="299" y="100" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="9">Verify results hold up</text>
      <rect x="414" y="38" width="165" height="80" rx="8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="496" y="58" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">LIVE TRADING</text>
      <text x="496" y="72" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Small size first</text>
      <text x="496" y="84" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">2025+</text>
      <text x="496" y="100" textAnchor="middle" fill="rgba(16,185,129,0.7)" fontSize="9">Scale up gradually</text>
      <defs>
        <marker id="ftArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>
      <line x1="185" y1="78" x2="212" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#ftArr)" />
      <line x1="382" y1="78" x2="409" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" markerEnd="url(#ftArr)" />
      <rect x="20" y="135" width="560" height="58" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="154" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">CONSISTENCY CHECK</text>
      <text x="300" y="170" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">Backtest results should be consistent with forward test results</text>
      <text x="300" y="184" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Large divergence between backtest and forward test = overfitting</text>
      <rect x="40" y="208" width="520" height="40" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
      <text x="300" y="224" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="11" fontWeight="bold">Never go live without completing forward testing first</text>
      <text x="300" y="240" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Minimum 3 months forward test, 50+ trades, across different market conditions</text>
    </svg>
  );
}

function VpsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">RUNNING EAs ON A VPS</text>
      <rect x="230" y="28" width="140" height="70" rx="8" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.5)" strokeWidth="2" />
      <text x="300" y="52" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="bold">VPS SERVER</text>
      <text x="300" y="66" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Cloud-based</text>
      <text x="300" y="78" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">24/5 uptime</text>
      <defs>
        <marker id="vpsArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.25)" />
        </marker>
        <marker id="vpsArrL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
          <path d="M6,0 L6,6 L0,3 z" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>
      <line x1="230" y1="63" x2="160" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#vpsArr)" />
      <line x1="370" y1="63" x2="440" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" markerEnd="url(#vpsArr)" />
      <rect x="80" y="120" width="140" height="60" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="150" y="143" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">Your EA</text>
      <text x="150" y="157" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Running 24/5</text>
      <text x="150" y="169" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">No PC required</text>
      <rect x="380" y="120" width="140" height="60" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <text x="450" y="143" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="bold">Your Broker</text>
      <text x="450" y="157" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">Low latency</text>
      <text x="450" y="169" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">Fast execution</text>
      <rect x="20" y="196" width="560" height="54" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <text x="300" y="213" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">VPS BENEFITS</text>
      <text x="300" y="228" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">No PC running · No internet outages · Low latency · Consistent execution</text>
      <text x="300" y="244" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">Min 1GB RAM · Providers: ForexVPS, Vultr, AWS · ~$5–20/month</text>
    </svg>
  );
}

function EaPitfallsSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="12" fontWeight="bold">COMMON EA MISTAKES — AVOID THESE</text>
      <rect x="20" y="28" width="560" height="186" rx="8" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
      {[
        'Over-optimized on history — works perfectly in backtest only',
        'No forward testing — went live immediately after backtest',
        'Fixed lot size — no dynamic risk management by balance',
        'No VPS — PC or internet went offline during trades',
        'Ignoring changing market conditions — no periodic review',
        'Buying unverified EAs online with no real track record',
      ].map((item, i) => (
        <g key={i}>
          <rect x="30" y={40 + i * 28} width="540" height="24" rx="4" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" />
          <text x="44" y={56 + i * 28} fill="rgba(239,68,68,0.8)" fontSize="12" fontWeight="bold">X</text>
          <text x="62" y={56 + i * 28} fill="rgba(255,255,255,0.75)" fontSize="10">{item}</text>
        </g>
      ))}
      <rect x="40" y="226" width="520" height="26" rx="6" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <text x="300" y="243" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="10" fontWeight="bold">Monitor your EA weekly — adjust and retire when performance degrades</text>
    </svg>
  );
}

function CommunitySVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="18" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">COMMUNITY EA RESOURCES</text>
      <circle cx="300" cy="118" r="36" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="2" />
      <text x="300" y="113" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="9" fontWeight="bold">COMMUNITY</text>
      <text x="300" y="126" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8">RESOURCES</text>
      {[
        { label: 'MQL5 Market', x: 105, y: 55, c: 'rgba(99,102,241,0.7)' },
        { label: 'ForexFactory', x: 105, y: 165, c: 'rgba(16,185,129,0.7)' },
        { label: 'TradingView', x: 300, y: 40, c: 'rgba(245,158,11,0.7)' },
        { label: 'GitHub Repos', x: 300, y: 196, c: 'rgba(255,255,255,0.6)' },
        { label: 'Telegram Groups', x: 495, y: 55, c: 'rgba(59,130,246,0.8)' },
        { label: 'YouTube Backtests', x: 495, y: 165, c: 'rgba(239,68,68,0.7)' },
      ].map((r, i) => (
        <g key={i}>
          <rect x={r.x - 48} y={r.y - 14} width="96" height="28" rx="6" fill={r.c.replace('0.7','0.12').replace('0.8','0.12').replace('0.6','0.08')} stroke={r.c} strokeWidth="1.5" />
          <text x={r.x} y={r.y + 3} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="bold">{r.label}</text>
          <line x1={r.x < 270 ? r.x + 48 : r.x > 330 ? r.x - 48 : r.x} y1={r.y < 100 ? r.y + 14 : r.y - 14} x2={r.x < 270 ? r.x + 65 : r.x > 330 ? r.x - 65 : r.x} y2={r.y < 100 ? r.y + 30 : r.y - 30} stroke={r.c.replace('0.7','0.3').replace('0.8','0.3').replace('0.6','0.3')} strokeWidth="1" strokeDasharray="3,2" />
        </g>
      ))}
      <rect x="40" y="215" width="520" height="34" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
      <text x="300" y="230" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10" fontWeight="bold">Vet every EA before live use — demand verified real-account results</text>
      <text x="300" y="242" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">Myfxbook or FX Blue verified track record — minimum 6 months live</text>
    </svg>
  );
}


function AssessmentSVG() {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <rect x="270" y="25" width="60" height="50" rx="4" fill="rgba(245,158,11,0.5)" stroke="rgba(245,158,11,0.8)" strokeWidth="2" />
      <ellipse cx="300" cy="75" rx="40" ry="16" fill="rgba(245,158,11,0.5)" stroke="rgba(245,158,11,0.8)" strokeWidth="2" />
      <rect x="285" y="80" width="30" height="20" rx="2" fill="rgba(245,158,11,0.4)" />
      <rect x="270" y="100" width="60" height="10" rx="4" fill="rgba(245,158,11,0.7)" stroke="rgba(245,158,11,0.9)" strokeWidth="1" />
      <line x1="260" y1="45" x2="245" y2="65" stroke="rgba(245,158,11,0.6)" strokeWidth="4" strokeLinecap="round" />
      <line x1="340" y1="45" x2="355" y2="65" stroke="rgba(245,158,11,0.6)" strokeWidth="4" strokeLinecap="round" />
      <text x="300" y="130" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">COURSE COMPLETE!</text>
      <text x="300" y="148" textAnchor="middle" fill="rgba(245,158,11,0.8)" fontSize="11">You have completed this module</text>
      <rect x="60" y="160" width="210" height="88" rx="6" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
      <text x="165" y="178" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="10" fontWeight="bold">WHAT YOU LEARNED</text>
      <text x="80" y="196" fill="rgba(16,185,129,0.9)" fontSize="12">✓</text>
      <text x="98" y="196" fill="rgba(255,255,255,0.7)" fontSize="10">Forex market fundamentals</text>
      <text x="80" y="212" fill="rgba(16,185,129,0.9)" fontSize="12">✓</text>
      <text x="98" y="212" fill="rgba(255,255,255,0.7)" fontSize="10">Technical analysis skills</text>
      <text x="80" y="228" fill="rgba(16,185,129,0.9)" fontSize="12">✓</text>
      <text x="98" y="228" fill="rgba(255,255,255,0.7)" fontSize="10">Risk management rules</text>
      <text x="80" y="244" fill="rgba(16,185,129,0.9)" fontSize="12">✓</text>
      <text x="98" y="244" fill="rgba(255,255,255,0.7)" fontSize="10">Trading psychology</text>
      <rect x="330" y="160" width="210" height="88" rx="6" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
      <text x="435" y="178" textAnchor="middle" fill="rgba(99,102,241,0.8)" fontSize="10" fontWeight="bold">YOUR NEXT STEPS</text>
      <text x="348" y="196" fill="rgba(99,102,241,0.7)" fontSize="11">▸</text>
      <text x="362" y="196" fill="rgba(255,255,255,0.7)" fontSize="10">Open a demo account</text>
      <text x="348" y="212" fill="rgba(99,102,241,0.7)" fontSize="11">▸</text>
      <text x="362" y="212" fill="rgba(255,255,255,0.7)" fontSize="10">Practice the strategies</text>
      <text x="348" y="228" fill="rgba(99,102,241,0.7)" fontSize="11">▸</text>
      <text x="362" y="228" fill="rgba(255,255,255,0.7)" fontSize="10">Keep a trading journal</text>
      <text x="348" y="244" fill="rgba(99,102,241,0.7)" fontSize="11">▸</text>
      <text x="362" y="244" fill="rgba(255,255,255,0.7)" fontSize="10">Explore PAMM investing</text>
    </svg>
  );
}

function ChartSVG() {
  const candles = [
    { x: 55,  o: 160, c: 140, h: 130, l: 170 },
    { x: 90,  o: 140, c: 155, h: 125, l: 162 },
    { x: 125, o: 155, c: 135, h: 122, l: 165 },
    { x: 160, o: 135, c: 148, h: 118, l: 158 },
    { x: 195, o: 148, c: 130, h: 115, l: 155 },
    { x: 230, o: 130, c: 142, h: 108, l: 148 },
    { x: 265, o: 142, c: 122, h: 100, l: 150 },
    { x: 300, o: 122, c: 138, h: 92,  l: 145 },
    { x: 335, o: 138, c: 115, h: 88,  l: 142 },
    { x: 370, o: 115, c: 130, h: 80,  l: 135 },
  ];
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="260" fill="rgba(255,255,255,0.03)" />
      <text x="300" y="20" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">TECHNICAL ANALYSIS</text>
      {candles.map((c, i) => {
        const bull = c.c > c.o;
        const color = bull ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)';
        const bodyTop = Math.min(c.o, c.c);
        const bodyH = Math.abs(c.o - c.c);
        return (
          <g key={i}>
            <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="1.5" />
            <rect x={c.x - 10} y={bodyTop} width="20" height={Math.max(bodyH, 2)} rx="1" fill={color} />
          </g>
        );
      })}
      <line x1="40" y1="170" x2="400" y2="170" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="410" y="174" fill="rgba(16,185,129,0.7)" fontSize="9">Support</text>
      <polyline points="40,175 75,168 110,160 145,152 180,144 215,137 250,130 285,124 320,118 355,113 390,108" fill="none" stroke="rgba(234,179,8,0.7)" strokeWidth="1.5" />
      <text x="395" y="112" fill="rgba(234,179,8,0.7)" fontSize="8">MA</text>
    </svg>
  );
}

// ─── BEVAN'S THREE-CANDLE STRATEGY VISUALS ────────────────────────────────────

function TcIntroSVG() {
  return (
    <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="280" fill="#0d0d0d" />
      {/* Three phase boxes */}
      {[
        { x: 30,  label: 'ACCUMULATION', sub: 'Smart money builds\nposition in a range', color: 'rgba(99,102,241,0.8)', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.35)' },
        { x: 230, label: 'MANIPULATION', sub: 'Liquidity sweep:\nstops hunted by wick', color: 'rgba(245,158,11,0.9)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.35)' },
        { x: 430, label: 'DISTRIBUTION', sub: 'Real move begins:\nfollow smart money', color: 'rgba(16,185,129,0.9)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.35)' },
      ].map((p) => (
        <g key={p.label}>
          <rect x={p.x} y={30} width={160} height={110} rx="10" fill={p.bg} stroke={p.border} strokeWidth="1.5" />
          <text x={p.x + 80} y={60} textAnchor="middle" fill={p.color} fontSize="10" fontWeight="700" letterSpacing="1">{p.label}</text>
          <line x1={p.x + 20} y1={70} x2={p.x + 140} y2={70} stroke={p.border} strokeWidth="1" />
          {p.sub.split('\n').map((line, i) => (
            <text key={i} x={p.x + 80} y={88 + i * 16} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">{line}</text>
          ))}
        </g>
      ))}
      {/* Arrows between phases */}
      {[195, 395].map((x) => (
        <g key={x}>
          <line x1={x} y1={85} x2={x + 28} y2={85} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <polygon points={`${x + 28},81 ${x + 36},85 ${x + 28},89`} fill="rgba(255,255,255,0.2)" />
        </g>
      ))}
      {/* Three-candle pattern mini diagram */}
      <text x="310" y="175" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="600">THE THREE-CANDLE ENTRY SIGNAL</text>
      {/* C1 */}
      <line x1="220" y1="200" x2="220" y2="255" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="210" y="208" width="20" height="28" rx="2" fill="#ef4444" fillOpacity="0.85" />
      <text x="220" y="270" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">C1</text>
      {/* C2 — pivot low */}
      <line x1="280" y1="196" x2="280" y2="262" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="270" y="206" width="20" height="32" rx="2" fill="#ef4444" fillOpacity="0.85" />
      <text x="280" y="270" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">C2</text>
      <text x="280" y="280" textAnchor="middle" fill="rgba(99,102,241,0.8)" fontSize="8">Pivot</text>
      {/* C3 — sweep + rejection */}
      <line x1="340" y1="196" x2="340" y2="248" stroke="#10b981" strokeWidth="1.5" />
      <rect x="330" y="196" width="20" height="22" rx="2" fill="#10b981" fillOpacity="0.85" />
      <text x="340" y="270" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">C3</text>
      <text x="340" y="280" textAnchor="middle" fill="#f59e0b" fontSize="8">Sweep</text>
      {/* C1 low dotted line */}
      <line x1="198" y1="236" x2="395" y2="236" stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="398" y="240" fill="rgba(245,158,11,0.6)" fontSize="8">C1 Low</text>
      {/* Entry arrow */}
      <path d="M 400 208 L 400 190" stroke="#10b981" strokeWidth="2" />
      <polygon points="400,184 396,194 404,194" fill="#10b981" />
      <text x="400" y="180" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700">ENTRY</text>
      <text x="310" y="258" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">C3 sweeps C1 low → closes back above → enter long</text>
    </svg>
  );
}

function TcBullishSVG() {
  // Candles: [x, openY, closeY, highY, lowY, isBull]
  const candles: [number, number, number, number, number, boolean][] = [
    [80,  88,  108, 78,  118, false],  // Context A
    [155, 83,  108, 75,  116, false],  // Context B
    [230, 105, 132, 95,  148, false],  // C1 (C1 low = 148)
    [305, 128, 160, 118, 195, false],  // C2 pivot low (C2 low = 195)
    [380, 153, 113, 106, 165, true],   // C3: wick to 165 (sweeps C1 low 148 ✓, above C2 low 195 ✓), close at 113
    [455, 118, 95,  88,  126, true],   // Post A
    [530, 93,  72,  66,  100, true],   // Post B
  ];
  const W = 22;
  return (
    <svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="300" fill="#0d0d0d" />
      {/* Demand zone box */}
      <rect x="282" y="128" width="118" height="67" rx="4" fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.35)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="287" y="141" fill="rgba(16,185,129,0.6)" fontSize="8" fontWeight="600" letterSpacing="0.5">DEMAND ZONE</text>
      {/* C1 low line (stop hunt level) */}
      <line x1="205" y1="148" x2="510" y2="148" stroke="rgba(245,158,11,0.45)" strokeWidth="1" strokeDasharray="5,3" />
      <text x="515" y="152" fill="rgba(245,158,11,0.7)" fontSize="8">C1 Low</text>
      {/* SL line */}
      <line x1="358" y1="176" x2="510" y2="176" stroke="rgba(239,68,68,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="515" y="180" fill="rgba(239,68,68,0.7)" fontSize="8">SL</text>
      {/* TP line */}
      <line x1="358" y1="45" x2="510" y2="45" stroke="rgba(16,185,129,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="515" y="49" fill="rgba(16,185,129,0.7)" fontSize="8">TP</text>
      {/* Candles */}
      {candles.map(([x, openY, closeY, highY, lowY, bull], i) => {
        const color = bull ? '#10b981' : '#ef4444';
        const bodyTop = Math.min(openY, closeY);
        const bodyH = Math.max(Math.abs(openY - closeY), 3);
        return (
          <g key={i}>
            <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
            <rect x={x - W / 2} y={bodyTop} width={W} height={bodyH} rx="2" fill={color} fillOpacity="0.85" />
          </g>
        );
      })}
      {/* Sweep annotation on C3 wick */}
      <path d="M 360 153 C 368 158 372 162 372 165" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
      <polygon points="372,169 368,160 376,161" fill="#f59e0b" />
      <text x="378" y="172" fill="#f59e0b" fontSize="9" fontWeight="600">⚡ Sweep</text>
      {/* Rejection annotation */}
      <text x="370" y="101" fill="#10b981" fontSize="9">Rejection</text>
      <text x="370" y="112" fill="#10b981" fontSize="9">Close ✓</text>
      {/* Labels */}
      <text x="230" y="162" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C1</text>
      <text x="305" y="210" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C2</text>
      <text x="305" y="221" textAnchor="middle" fill="rgba(99,102,241,0.8)" fontSize="8">Pivot Low</text>
      <text x="380" y="184" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C3</text>
      {/* Entry arrow */}
      <line x1="455" y1="112" x2="455" y2="80" stroke="#10b981" strokeWidth="2.5" />
      <polygon points="455,72 449,84 461,84" fill="#10b981" />
      <text x="455" y="66" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700">ENTRY</text>
      {/* R:R bracket */}
      <line x1="570" y1="45" x2="570" y2="176" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="566" y1="45" x2="574" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="566" y1="176" x2="574" y2="176" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="590" y="115" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">1:2+</text>
      <text x="590" y="126" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">R:R</text>
      <text x="310" y="248" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="600">Three-Candle Bullish Setup — C3 Sweeps C1 Low → Rejection Close → Entry</text>
    </svg>
  );
}

function TcBearishSVG() {
  // Mirror of bullish: C2 is pivot HIGH, C3 wicks above C1 high, closes below
  const candles: [number, number, number, number, number, boolean][] = [
    [80,  115, 92,  108, 122, true],   // Context A
    [155, 110, 88,  102, 118, true],   // Context B
    [230, 132, 108, 145, 98,  true],   // C1 (C1 high = 145)
    [305, 155, 118, 170, 108, true],   // C2 pivot high (C2 high = 170)
    [380, 122, 160, 163, 168, false],  // C3: wick to 163 (sweeps C1 high 145 ✓, below C2 high 170 ✓), close at 160
    [455, 168, 188, 158, 195, false],  // Post A
    [530, 185, 208, 178, 215, false],  // Post B
  ];
  const W = 22;
  return (
    <svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="300" fill="#0d0d0d" />
      {/* Supply zone box */}
      <rect x="282" y="108" width="118" height="67" rx="4" fill="rgba(239,68,68,0.07)" stroke="rgba(239,68,68,0.35)" strokeWidth="1" strokeDasharray="4,3" />
      <text x="287" y="121" fill="rgba(239,68,68,0.6)" fontSize="8" fontWeight="600" letterSpacing="0.5">SUPPLY ZONE</text>
      {/* C1 high line */}
      <line x1="205" y1="145" x2="510" y2="145" stroke="rgba(245,158,11,0.45)" strokeWidth="1" strokeDasharray="5,3" />
      <text x="515" y="149" fill="rgba(245,158,11,0.7)" fontSize="8">C1 High</text>
      {/* SL line */}
      <line x1="358" y1="116" x2="510" y2="116" stroke="rgba(239,68,68,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="515" y="120" fill="rgba(239,68,68,0.7)" fontSize="8">SL</text>
      {/* TP line */}
      <line x1="358" y1="240" x2="510" y2="240" stroke="rgba(16,185,129,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="515" y="244" fill="rgba(16,185,129,0.7)" fontSize="8">TP</text>
      {/* Candles */}
      {candles.map(([x, openY, closeY, highY, lowY, bull], i) => {
        const color = bull ? '#10b981' : '#ef4444';
        const bodyTop = Math.min(openY, closeY);
        const bodyH = Math.max(Math.abs(openY - closeY), 3);
        return (
          <g key={i}>
            <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.5" />
            <rect x={x - W / 2} y={bodyTop} width={W} height={bodyH} rx="2" fill={color} fillOpacity="0.85" />
          </g>
        );
      })}
      {/* Sweep annotation on C3 wick (upward) */}
      <path d="M 360 138 C 368 132 372 128 372 125" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
      <polygon points="372,120 368,130 376,130" fill="#f59e0b" />
      <text x="378" y="118" fill="#f59e0b" fontSize="9" fontWeight="600">⚡ Sweep</text>
      {/* Rejection annotation */}
      <text x="370" y="173" fill="#ef4444" fontSize="9">Rejection</text>
      <text x="370" y="184" fill="#ef4444" fontSize="9">Close ✓</text>
      {/* Labels */}
      <text x="230" y="92" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C1</text>
      <text x="305" y="100" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C2</text>
      <text x="305" y="89" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8">Pivot High</text>
      <text x="380" y="107" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">C3</text>
      {/* Entry arrow (down) */}
      <line x1="455" y1="180" x2="455" y2="212" stroke="#ef4444" strokeWidth="2.5" />
      <polygon points="455,220 449,208 461,208" fill="#ef4444" />
      <text x="455" y="234" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">ENTRY</text>
      <text x="310" y="268" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="600">Three-Candle Bearish Setup — C3 Sweeps C1 High → Rejection Close → Sell</text>
    </svg>
  );
}

function TcAmdSVG() {
  return (
    <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="280" fill="#0d0d0d" />
      {/* Price path */}
      {/* Accumulation range — flat oscillation */}
      <path d="M 30,160 Q 55,150 70,160 Q 85,170 100,160 Q 115,150 130,160 Q 145,170 160,160 Q 175,150 190,162" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="2" />
      {/* Manipulation — false spike down then reverse */}
      <path d="M 190,162 L 210,195 L 220,158" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth="2.5" />
      {/* Distribution — strong up move */}
      <path d="M 220,158 Q 260,140 300,120 Q 340,100 380,85 Q 420,70 460,58 Q 490,50 520,45" fill="none" stroke="rgba(16,185,129,0.85)" strokeWidth="2.5" />
      {/* Phase shading */}
      <rect x="28" y="130" width="167" height="70" rx="6" fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
      <rect x="188" y="140" width="38" height="68" rx="4" fill="rgba(245,158,11,0.07)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
      <rect x="218" y="28" width="308" height="140" rx="6" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
      {/* Phase labels */}
      <text x="112" y="118" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="11" fontWeight="700">ACCUMULATION</text>
      <text x="112" y="132" textAnchor="middle" fill="rgba(99,102,241,0.6)" fontSize="9">Smart money builds</text>
      <text x="112" y="144" textAnchor="middle" fill="rgba(99,102,241,0.6)" fontSize="9">position in range</text>
      <text x="207" y="228" textAnchor="middle" fill="rgba(245,158,11,0.9)" fontSize="10" fontWeight="700">MANIPULATION</text>
      <text x="207" y="240" textAnchor="middle" fill="rgba(245,158,11,0.6)" fontSize="8">Liquidity sweep</text>
      <text x="372" y="44" textAnchor="middle" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="700">DISTRIBUTION</text>
      <text x="372" y="57" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">Real trend — follow</text>
      <text x="372" y="69" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9">smart money</text>
      {/* Sweep wick marker */}
      <line x1="210" y1="194" x2="185" y2="194" stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="3,2" />
      <text x="182" y="198" textAnchor="end" fill="rgba(245,158,11,0.7)" fontSize="8">Stop hunt</text>
      {/* Entry marker */}
      <circle cx="220" cy="158" r="5" fill="rgba(16,185,129,0.9)" />
      <text x="226" y="153" fill="#10b981" fontSize="9" fontWeight="600">← Entry (C3 close)</text>
      {/* Session labels at bottom */}
      <text x="112" y="260" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Asian Session</text>
      <text x="207" y="260" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">London Open</text>
      <text x="370" y="260" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">NY Session</text>
      <text x="310" y="278" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">Accumulation → Manipulation (sweep) → Distribution (the real move)</text>
    </svg>
  );
}

function TcEntrySVG() {
  return (
    <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="280" fill="#0d0d0d" />
      {/* Top-down zoom funnel */}
      {[
        { x: 20,  y: 20,  w: 580, h: 52, label: 'WEEKLY / DAILY', sub: 'Step 1 — Identify trend bias + mark HTF supply / demand zone', color: 'rgba(99,102,241', border: 0.4 },
        { x: 40,  y: 84,  w: 540, h: 52, label: '4-HOUR / 1-HOUR', sub: 'Step 2 — Watch price approach the HTF zone', color: 'rgba(156,163,175', border: 0.35 },
        { x: 60,  y: 148, w: 500, h: 52, label: '15-MINUTE', sub: 'Step 3 — Three-candle pattern forming inside the zone', color: 'rgba(245,158,11', border: 0.45 },
        { x: 80,  y: 212, w: 460, h: 52, label: 'ENTRY (C3 CLOSE)', sub: 'Step 4 — Market buy at C3 close · SL below C3 wick · TP next swing high', color: 'rgba(16,185,129', border: 0.55 },
      ].map((r) => (
        <g key={r.label}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="8" fill={`${r.color},0.06)`} stroke={`${r.color},${r.border})`} strokeWidth="1.5" />
          <text x={r.x + r.w / 2} y={r.y + 19} textAnchor="middle" fill={`${r.color},0.9)`} fontSize="10" fontWeight="700" letterSpacing="0.8">{r.label}</text>
          <text x={r.x + r.w / 2} y={r.y + 35} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">{r.sub}</text>
        </g>
      ))}
      {/* Connecting arrows */}
      {[72, 136, 200].map((y) => (
        <g key={y}>
          <line x1="310" y1={y} x2="310" y2={y + 10} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <polygon points={`310,${y + 13} 306,${y + 6} 314,${y + 6}`} fill="rgba(255,255,255,0.15)" />
        </g>
      ))}
    </svg>
  );
}

function TcMistakesSVG() {
  const mistakes = [
    { icon: '⏰', title: 'Entering on C2', desc: 'Wait for C3 close — C2 is just the pivot, not confirmation' },
    { icon: '📍', title: 'SL inside the zone', desc: 'Stop goes BELOW C3 wick, not inside the demand zone' },
    { icon: '📉', title: 'Trading against HTF', desc: 'Daily downtrend overrides any bullish 15M pattern' },
    { icon: '🎯', title: 'No zone confluence', desc: 'Pattern alone is noise — it must occur inside a valid zone' },
    { icon: '🔒', title: 'No break-even move', desc: 'At 1:1 R:R, move SL to entry. Protect profit first' },
    { icon: '⚡', title: 'Trading every wick', desc: 'Only sweeps at meaningful swing highs/lows are valid setups' },
  ];
  return (
    <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg">
      <rect width="620" height="280" fill="#0d0d0d" />
      <text x="310" y="22" textAnchor="middle" fill="rgba(239,68,68,0.85)" fontSize="11" fontWeight="700" letterSpacing="1">COMMON MISTAKES TO AVOID</text>
      {mistakes.map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 18 + col * 200;
        const y = 38 + row * 108;
        return (
          <g key={i}>
            <rect x={x} y={y} width={186} height={94} rx="8" fill="rgba(239,68,68,0.05)" stroke="rgba(239,68,68,0.2)" strokeWidth="1" />
            <text x={x + 14} y={y + 22} fontSize="16">{m.icon}</text>
            <text x={x + 38} y={y + 22} fill="rgba(255,255,255,0.85)" fontSize="10" fontWeight="700">{m.title}</text>
            {m.desc.split(' — ').map((part, pi) => (
              <text key={pi} x={x + 14} y={y + 46 + pi * 16} fill="rgba(255,255,255,0.5)" fontSize="9">{part}{pi === 0 && m.desc.includes(' — ') ? ' —' : ''}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── VISUAL MAP ───────────────────────────────────────────────────────────────

const visualMap: Record<string, () => JSX.Element> = {
  'forex-market':      ForexMarketSVG,
  'currency-pairs':    CurrencyPairsSVG,
  'pips-lots':         PipsLotsSVG,
  'spread':            SpreadSVG,
  'sessions':          SessionsSVG,
  'orders':            OrdersSVG,
  'demo-trade':        DemoTradeSVG,
  'broker':            BrokerSVG,
  'fund-vs-tech':      FundVsTechSVG,
  'economic':          EconomicSVG,
  'routine':           RoutineSVG,
  'intro-ta':          IntroTaSVG,
  'candlestick-basics':CandlestickBasicsSVG,
  'candlestick-adv':   CandlestickAdvSVG,
  'support-resistance':SupportResistanceSVG,
  'trend-lines':       TrendLinesSVG,
  'head-shoulders':    HeadShouldersSVG,
  'flags':             FlagsSVG,
  'moving-averages':   MovingAveragesSVG,
  'rsi':               RsiSVG,
  'macd':              MacdSVG,
  'bollinger':         BollingerSVG,
  'fibonacci':         FibonacciSVG,
  'volume':            VolumeSVG,
  'multi-timeframe':   MultiTimeframeSVG,
  'strategy':          StrategySVG,
  'backtest':          BacktestSVG,
  'live-chart':        LiveChartSVG,
  'why-fail':          WhyFailSVG,
  'risk-reward':       RiskRewardSVG,
  'position-sizing':   PositionSizingSVG,
  'stop-loss':         StopLossSVG,
  'drawdown':          DrawdownSVG,
  'psychology':        PsychologySVG,
  'revenge':           RevengeSVG,
  'journal':           JournalSVG,
  'trading-plan':      TradingPlanSVG,
  'pamm-intro':        PammIntroSVG,
  'pamm-sharing':      PammSharingSVG,
  'pamm-eval':         PammEvalSVG,
  'pamm-stats':        PammStatsSVG,
  'pamm-diversify':    PammDiversifySVG,
  'pamm-withdrawal':   PammWithdrawalSVG,
  'price-action':      PriceActionSVG,
  'market-structure':  MarketStructureSVG,
  'bos':               BosSVG,
  'choch':             ChochSVG,
  'order-blocks':      OrderBlocksSVG,
  'fvg':               FvgSVG,
  'liquidity':         LiquiditySVG,
  'smart-money':       SmartMoneySVG,
  'session-timing':    SessionTimingSVG,
  'confluence':        ConfluenceSVG,
  'trade-mgmt':        TradeMgmtSVG,
  'scalp-swing':       ScalpSwingSVG,
  'pa-strategy':       PaStrategySVG,
  'ea-intro':          EaIntroSVG,
  'metatrader':        MetatraderSVG,
  'mql':               MqlSVG,
  'ea-structure':      EaStructureSVG,
  'ea-entries':        EaEntriesSVG,
  'ea-risk':           EaRiskSVG,
  'optimize':          OptimizeSVG,
  'curve-fitting':     CurveFittingSVG,
  'forward-test':      ForwardTestSVG,
  'vps':               VpsSVG,
  'ea-pitfalls':       EaPitfallsSVG,
  'community':         CommunitySVG,
  'assessment':        AssessmentSVG,
  'chart':             ChartSVG,
  // Bevan's Three-Candle Strategy
  'tc-intro':          TcIntroSVG,
  'tc-bullish':        TcBullishSVG,
  'tc-bearish':        TcBearishSVG,
  'tc-amd':            TcAmdSVG,
  'tc-entry':          TcEntrySVG,
  'tc-mistakes':       TcMistakesSVG,
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default memo(function LessonVisual({ title, courseId }: { title: string; courseId: number }) {
  const type = getVisualType(title, courseId);

  // Check if an AI-generated diagram exists for this visual type.
  // undefined = still checking, null = none exists, string = URL ready
  const [diagramUrl, setDiagramUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setDiagramUrl(undefined);
    fetch(`/api/v1/diagrams/${encodeURIComponent(type)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setDiagramUrl(data?.latestUrl ?? null))
      .catch(() => setDiagramUrl(null));
  }, [type]);

  // ── Still checking API ────────────────────────────────────────────────
  if (diagramUrl === undefined) {
    return (
      <div style={{
        width: '100%', height: 220, borderRadius: '12px', marginBottom: '1.5rem',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: '50%', display: 'inline-block',
          background: 'conic-gradient(from 0deg,#6366f1,#8b5cf6,#a855f7,#6366f1)',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>Loading diagram…</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── AI diagram found — show it ─────────────────────────────────────────
  if (diagramUrl) {
    return (
      <figure style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.25)', margin: '0 0 1.5rem 0' }}>
        {/* Header badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px', background: 'rgba(99,102,241,0.08)',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'inline-block' }} />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={diagramUrl}
          alt={title}
          style={{ width: '100%', display: 'block', background: '#0f1117', maxHeight: 500, objectFit: 'contain' }}
        />
      </figure>
    );
  }

  // ── No diagram — fallback to TradingView chart or SVG ─────────────────
  if (CHART_TYPES.has(type)) {
    return (
      <div style={{ width: '100%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <Suspense fallback={<div style={{ height: 280, background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading chart…</div>}>
          <LessonChart type={type} />
        </Suspense>
      </div>
    );
  }

  const Visual = visualMap[type] ?? visualMap['chart'];
  return (
    <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
      <Visual />
    </div>
  );
});
