const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

// OpenRouter endpoint — OpenAI-compatible chat completions
const OPENROUTER_BASE = 'openrouter.ai';
const MODEL = 'google/gemini-3.1-flash-image-preview';

// ── Detailed forex diagram prompts keyed by visual type ───────────────────────
const DIAGRAM_PROMPTS = {

  // BEGINNER COURSE
  'forex-market': `
Draw a professional forex market overview diagram on a DARK #0f1117 background (not white).
Show a simplified world map outline with 4 glowing city markers:
- London (Europe) amber/gold dot — label "London 08:00–17:00 GMT"
- New York (Americas) blue dot — label "New York 13:00–22:00 GMT"
- Tokyo (Asia) teal dot — label "Tokyo 00:00–09:00 GMT"
- Sydney (Pacific) purple dot — label "Sydney 22:00–07:00 GMT"
Draw curved arc lines connecting the cities. Bright glow on London/New York overlap — label "Highest Volume Overlap".
Title "Global Forex Market Sessions" white bold top-centre.
Style: minimal, clean, dark background, white sans-serif labels, no artistic flair.`,

  'currency-pairs': `
Create a forex currency pairs reference card on DARK #0f1117 background.
Three colour-coded sections in a grid:
MAJOR PAIRS (green header): EUR/USD GBP/USD USD/JPY USD/CHF USD/CAD AUD/USD NZD/USD — each a small card showing "High Liquidity".
MINOR PAIRS (blue header): EUR/GBP EUR/JPY GBP/JPY — 3 cards.
EXOTIC PAIRS (orange header): USD/TRY USD/ZAR — 2 cards with "Wide Spread" badge.
White text on dark rounded cards. Title "Currency Pair Categories" white at top.`,

  'pips-lots': `
Forex pips and lot sizes infographic on DARK #0f1117 background.
Panel 1 — Pip: EUR/USD quote 1.1050 → 1.1051 with arrow "1 Pip = 0.0001". Underline the 4th decimal.
Panel 2 — Lots table: Standard 100,000 units $10/pip | Mini 10,000 units $1/pip | Micro 1,000 units $0.10/pip. Green values.
Panel 3 — Leverage diagram: scale/balance showing "$1,000 Margin" controls "$100,000" labelled "100:1 Leverage".
Title "Pips, Lots & Leverage" white bold. Dark professional style.`,

  'spread': `
Forex bid/ask spread diagram on DARK #0f1117 background.
Large quote box: BID 1.10452 (red text) | ASK 1.10470 (green text).
Bracket between them — "Spread = 1.8 pips".
Number line below showing BID marker (red), ASK marker (green), shaded zone "Broker Cost".
Annotation "You BUY at ASK — You SELL at BID" in white.
Title "Bid/Ask Spread" white at top.`,

  'sessions': `
Forex 24-hour trading sessions timeline on DARK #0f1117 background.
Horizontal bar 00:00–24:00 GMT with overlapping coloured bands:
Sydney 22:00–07:00 (purple transparent), Tokyo 00:00–09:00 (teal), London 08:00–17:00 (amber), New York 13:00–22:00 (blue).
Overlap zones brighter: "London/New York 13:00–17:00 ★ HIGHEST VOLUME".
Hour markers every 2 hours. Title "Forex Market Sessions (GMT)".`,

  // TECHNICAL ANALYSIS
  'candlestick-basics': `
Candlestick anatomy diagram on DARK #0f1117 background.
Four large labelled candlesticks:
1. BULLISH (solid green body): leader lines to Open (body bottom), Close (body top), High (wick top), Low (wick bottom), Upper Wick, Lower Wick, Body.
2. BEARISH (solid red body): Open (body top), Close (body bottom), High, Low.
3. DOJI (no body, equal wicks): "Doji — Indecision".
4. HAMMER (tiny body at top, long lower wick, green): "Hammer — Bullish Signal".
Dark grid behind. Title "Candlestick Anatomy" white bold.`,

  'candlestick-adv': `
Advanced candlestick patterns reference on DARK #0f1117 background.
Six patterns in a 2x3 grid, each showing the candle sequence:
1. Bullish Engulfing — small red then large green — "Strong Bullish Reversal"
2. Bearish Engulfing — small green then large red
3. Morning Star — red + doji + green — "3-Candle Bottom"
4. Evening Star — green + doji + red
5. Shooting Star — small body bottom, long upper wick, red — "Bearish Rejection"
6. Hammer — tiny body top, long lower wick, green — "Bullish Bounce"
Direction arrows before each. Title "Advanced Candlestick Patterns".`,

  'support-resistance': `
Support and resistance chart on DARK #0f1117 background. ~40 candlesticks.
GREEN dashed horizontal line at 1.1050 — price bounces 3 times — green circles at touches — "Support Zone (Buyers)".
RED dashed horizontal line at 1.1250 — price rejected 3 times — red circles — "Resistance Zone (Sellers)".
Near candle 30: price breaks above resistance, line turns green — "Breakout! Resistance → Support (Role Reversal)".
Title "Support & Resistance + Role Reversal".`,

  'trend-lines': `
Trend lines educational diagram on DARK #0f1117 background. Three panels:
Left — UPTREND: rising price, green diagonal line touching 3 higher lows, green dots, arrow up "Uptrend Support Line".
Middle — DOWNTREND: falling price, red diagonal touching 3 lower highs "Downtrend Resistance Line".
Right — CHANNEL: price between two parallel lines, red upper, green lower, price bouncing "Price Channel".
Title "Trend Lines & Price Channels".`,

  'moving-averages': `
Moving averages chart on DARK #0f1117 background. ~60 candles, clear uptrend.
Overlay: 20 SMA (white/blue reactive), 50 SMA (orange smoother), 200 SMA (purple very smooth).
Events with vertical dashed lines:
"Golden Cross" — 20 SMA crosses above 50 SMA → green arrow "Buy Signal".
"Death Cross" — 20 SMA crosses below 50 SMA → red arrow "Sell Signal".
Colour-coded legend top-right. Title "Moving Averages: 20, 50 & 200 SMA".`,

  'rsi': `
Dual-panel RSI diagram on DARK #0f1117 background.
Top: candlestick chart 60 candles.
Bottom: RSI line (cyan), 0–100 scale, red dashed at 70 "Overbought", green dashed at 30 "Oversold". Red zone above 70, green zone below 30.
Three synced events: RSI above 70 "Potential Reversal", RSI below 30 "Potential Bounce", Bearish Divergence — price new high but RSI lower high "⚠ Divergence".
Title "RSI (Relative Strength Index)".`,

  'macd': `
Dual-panel MACD diagram on DARK #0f1117 background.
Top: candlestick chart.
Bottom: MACD Line (blue), Signal Line (orange), Histogram (green bars above zero, red bars below), Zero Line (white dashed).
Events: MACD crosses above Signal "Bullish — Buy", crosses below "Bearish — Sell", histogram growing "Momentum Up", shrinking "Fading — Caution".
Legend. Title "MACD Indicator".`,

  'bollinger': `
Bollinger Bands chart on DARK #0f1117 background. 50 candles.
20 SMA middle band (white dashed), upper band 2SD (blue), lower band 2SD (blue). Semi-transparent blue zone between bands.
Five labelled events: price on upper band "Overbought", lower band "Oversold", bands narrow "Squeeze — Breakout Coming" (yellow highlight), breakout expansion, price walking upper band "Trending".
Title "Bollinger Bands".`,

  'fibonacci': `
Fibonacci retracement diagram on DARK #0f1117 background.
Clear rally from swing low (bottom-left) to swing high (top-right).
Horizontal dashed lines: 0% (swing high, white), 23.6% (grey), 38.2% (blue), 50.0% (white), 61.8% (GOLD — "Golden Ratio" glow), 78.6% (orange), 100% (swing low).
Price pulls back, bounces off 61.8% gold level with green candle and arrow "Price Respects Golden Ratio — Long Entry".
Title "Fibonacci Retracement Levels".`,

  'head-shoulders': `
Head and shoulders pattern on DARK #0f1117 background.
Price line: Left Shoulder (1.1200), Head (1.1350 highest), Right Shoulder (1.1220).
Red dashed neckline connecting the two troughs "Neckline".
Sharp red candle breaks below neckline "SELL — Break of Neckline". Arrow down with "Price Target = Head-to-Neckline Distance".
Small inset showing inverse head and shoulders (bullish).
Title "Head & Shoulders Pattern".`,

  'flags': `
Flag and pennant patterns on DARK #0f1117 background.
Left — BULL FLAG: Green pole up, slight downward channel consolidation (flag body), breakout up with target arrow = pole length. Labels: Flagpole / Flag / Breakout / Target.
Right — PENNANT: Green pole, symmetrical converging triangle consolidation, breakout up. Labels: Flagpole / Pennant / Breakout / Target.
Dashed boundary lines. Title "Flag & Pennant Continuation Patterns".`,

  // PRICE ACTION / SMART MONEY
  'market-structure': `
Market structure diagram on DARK #0f1117 background. Two panels:
Left — BULLISH: price series HH (Higher Highs) and HL (Higher Lows). Blue up-triangles for HH, down-triangles for HL. Connecting dashed lines. "HH + HL = Uptrend".
Right — BEARISH: LH (Lower Highs) and LL (Lower Lows). Red triangles. "LH + LL = Downtrend".
Title "Market Structure: HH/HL vs LH/LL".`,

  'bos': `
Break of Structure (BOS) diagram on DARK #0f1117 background.
Top: uptrend HH/HL. Dashed line at swing high "Structure High". Bullish candle CLOSES above it — orange glow — "BOS Bullish Continuation". Up arrow "Trade continuation".
Bottom: downtrend. Swing low dashed line. Bearish candle breaks below — "BOS Bearish Continuation". Down arrow.
Title "Break of Structure (BOS)".`,

  'choch': `
Change of Character (CHoCH) diagram on DARK #0f1117 background.
Left — BULLISH CHoCH: downtrend LH/LL (red). Price breaks above most recent LH — gold glow "CHoCH — Shift to Bullish". Up arrow.
Right — BEARISH CHoCH: uptrend HH/HL (green). Price breaks below HL — gold glow "CHoCH — Shift to Bearish". Down arrow.
Title "Change of Character (CHoCH)".`,

  'order-blocks': `
Order Blocks diagram on DARK #0f1117 background. ~50 candle chart.
BULLISH OB: last red candle before sharp rally — teal rectangle — "Bullish OB — Last Bearish Candle Before Rally". Price returns to zone, bounces up. Entry arrow "Long on Retest".
BEARISH OB: last green candle before sharp drop — red rectangle — "Bearish OB — Last Bullish Candle Before Drop". Price returns, sells off. Entry arrow "Short on Retest".
Note "Institutional Footprint". Title "Order Blocks".`,

  'fvg': `
Fair Value Gap (FVG) diagram on DARK #0f1117 background.
BULLISH FVG: 3 candles — red, very large green (gap creator), green. Light green shading between Candle 1 HIGH and Candle 3 LOW "Bullish FVG — Returns to fill". Arrow "Fill then continue up".
BEARISH FVG: green, large red, red. Light red shading "Bearish FVG". Arrow "Fill then continue down".
Zoom boxes around each gap. Title "Fair Value Gap (FVG)".`,

  'tc-structure': `
Bevan Three-Candle Strategy market structure on DARK #0f1117 background.
Clear HH/HL uptrend. Minor pullback to swing low. Three-candle bullish reversal pattern at swing low highlighted with subtle glow.
Title "Three-Candle Strategy: Market Structure".`,

  'tc-supply-demand': `
Supply and demand zones on DARK #0f1117 background.
DEMAND ZONE (green rectangle): area price launched from "Strong Demand Base — Buyers". Price returns, reacts up. Three-candle confirmation at zone edge.
SUPPLY ZONE (red rectangle): area price dropped from "Strong Supply Base — Sellers". Price returns, drops.
Title "Supply & Demand Zones — Three-Candle Strategy".`,

  'tc-liquidity': `
Liquidity sweeps diagram on DARK #0f1117 background.
Consolidation range. Equal highs at top "Buy-side Liquidity — Stop Losses Above". Equal lows at bottom "Sell-side Liquidity — Stop Losses Below".
Price spikes ABOVE equal highs (engineered move), sharply reverses with large red candle. Red arrow down "Sweep Complete — Short Opportunity". Three-candle reversal forming.
Title "Liquidity Sweeps & Stop Hunts".`,

  'tc-mtf': `
Multi-timeframe analysis on DARK #0f1117 background. Three side-by-side panels with arrows:
1. Daily: uptrend — "Higher TF Bias = BULLISH"
2. H4: pullback to demand zone — "Mid Frame: Pullback to Key Level"
3. M15: three-candle bullish pattern — "Entry TF: Three-Candle Trigger"
Arrow labels "Top-Down Analysis →". Title "Multi-Timeframe Analysis (MTF)".`,

  'tc-walkthrough': `
Three-Candle Strategy full trade on DARK #0f1117 background. 40 candles.
Downtrend into green demand zone. Three-candle reversal: Candle 1 red, Candle 2 doji, Candle 3 strong bullish "ENTRY ▲".
Entry (blue dashed), SL below zone (red dashed "30 pips"), TP (green dashed "90 pips").
Red/pink risk zone shading, green reward zone. Trade path to TP.
"R:R = 1:3 ✓". Title "Three-Candle Strategy: Trade Walkthrough".`,

  // RISK MANAGEMENT
  'risk-reward': `
Risk/Reward comparison on DARK #0f1117 background.
Left — 1:1 R:R: Entry, SL 50 pips, TP 50 pips. 10 trades at 50% = break-even bar chart. "1:1 — Need 50% to break even".
Right — 1:3 R:R: Entry, SL 30 pips, TP 90 pips. 10 trades at 40% = profitable (green final balance). "1:3 — 40% win rate is profitable".
Title "Risk/Reward Ratio".`,

  'position-sizing': `
Position sizing formula infographic on DARK #0f1117 background.
Flow:
Step 1: $10,000 balance, 1% risk = $100 (pie chart slice).
Step 2: SL = 50 pips (mini price chart).
Step 3: Formula box — Position Size = $100 ÷ (50 × $1) = 2 Mini Lots.
Step 4: Green result "Trade 2 Mini Lots (0.2 lots)".
Traffic light: 0.5% green (conservative), 1% amber (standard), 2% red (aggressive).
Title "Position Sizing Formula".`,

  'stop-loss': `
Stop loss and take profit diagram on DARK #0f1117 background. Buy trade setup:
Entry 1.1100 (blue arrow up), SL 1.1050 (red dashed "50 pips"), TP1 1.1200 (green dashed "1:2"), TP2 1.1250 (green dashed "1:3").
Red/pink risk zone between entry and SL. Green reward zone entry to TP2.
Price candles move up hitting TP1 (star), then TP2 (star). Title "Stop Loss & Take Profit Placement".`,

  'drawdown': `
Account drawdown equity curve on DARK #0f1117 background.
Line chart: equity $0–$12,000 (Y), 50 trades (X). Start $10,000 (white dashed reference "Initial Balance"), rise to $11,500, drop to $9,200 (red/pink shading "Max Drawdown $2,300 — 20%" double-headed arrow), recover above $10,000.
Sub-panel: drawdown % line 0% to -25%.
Title "Account Drawdown & Recovery".`,

  // PAMM
  'pamm-overview': `
PAMM account structure diagram on DARK #0f1117 background.
Hierarchy: "Fund Manager" top (gold star). Five investor nodes below connected with arrows — each "$5,000 — 20% share". Master account total "$25,000".
Profit arrows flowing from manager to investors. Small pie chart showing allocation.
Title "PAMM Account Structure".`,
};

/**
 * Build the complete prompt with non-negotiable style rules.
 */
function buildPrompt(visualType) {
  const base = (DIAGRAM_PROMPTS[visualType] || DIAGRAM_PROMPTS['forex-market']).trim();
  return [
    'MANDATORY STYLE RULES — follow exactly:',
    '• Background: DARK #0f1117 — never white or light',
    '• Bullish/buy = green (#22c55e) | Bearish/sell = red (#ef4444) | Text = white (#f9fafb) | Key levels = gold (#fbbf24)',
    '• Clean sans-serif font, high contrast, every line labelled',
    '• No watermarks, no artistic decorations, no textures',
    '• Subtle dark-grey grid behind charts',
    '• Candles: solid fill, no outlines',
    '• Professional trading chart — precision and clarity, not art',
    '',
    base,
  ].join('\n');
}

/**
 * Make a POST request to OpenRouter and return the parsed JSON.
 */
function openRouterPost(path, body, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request({
      hostname: OPENROUTER_BASE,
      path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ForexEdge Academy',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          reject(new Error(`Failed to parse OpenRouter response: ${data.slice(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Generate a single diagram via OpenRouter → Gemini image model.
 * The image is returned in message.images[0].image_url.url as a base64 data URL.
 */
async function generateDiagram(visualType, outputDir) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in environment');

  const prompt = buildPrompt(visualType);

  const { status, body } = await openRouterPost('/api/v1/chat/completions', {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096,
  }, apiKey);

  if (status !== 200) {
    const errMsg = body?.error?.message || JSON.stringify(body).slice(0, 200);
    throw new Error(`OpenRouter error ${status}: ${errMsg}`);
  }

  // Image data lives in message.images[0].image_url.url as a base64 data URL
  const dataUrl = body?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) throw new Error(`No image returned for: ${visualType}`);

  // Parse data URL → Buffer
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!matches) throw new Error(`Unexpected image_url format for: ${visualType}`);

  const mimeType = matches[1];          // e.g. "image/jpeg"
  const imageData = Buffer.from(matches[2], 'base64');
  const ext = mimeType.split('/')[1] || 'jpg';

  const slug = visualType.replace(/[^a-z0-9-]/g, '-');
  const hash = crypto.createHash('md5').update(prompt).digest('hex').slice(0, 8);
  const filename = `${slug}-${hash}.${ext}`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, imageData);

  return {
    filename,
    filePath,
    mimeType,
    publicUrl: `/diagrams/${filename}`,
    visualType,
    promptHash: hash,
  };
}

/**
 * Generate diagrams for a batch of visual types in sequence.
 */
async function generateBatch(visualTypes, outputDir, onProgress) {
  const results = [];
  for (let i = 0; i < visualTypes.length; i++) {
    const vt = visualTypes[i];
    try {
      if (onProgress) onProgress({ index: i, total: visualTypes.length, visualType: vt, status: 'generating' });
      const result = await generateDiagram(vt, outputDir);
      results.push({ success: true, ...result });
      if (onProgress) onProgress({ index: i, total: visualTypes.length, visualType: vt, status: 'done', publicUrl: result.publicUrl });
    } catch (err) {
      results.push({ success: false, visualType: vt, error: err.message });
      if (onProgress) onProgress({ index: i, total: visualTypes.length, visualType: vt, status: 'error', error: err.message });
    }
  }
  return results;
}

const ALL_VISUAL_TYPES = Object.keys(DIAGRAM_PROMPTS);

// ── Certificate generation ────────────────────────────────────────────────────

function buildCertificatePrompt({ studentName, courseTitle, courseLevel, completedDate, lessons, duration, certificateId }) {
  return `
Create a stunning, professional forex trading certificate of completion. This is a FORMAL CERTIFICATE IMAGE — not a chart.

CERTIFICATE DETAILS:
- Student Name: ${studentName}
- Course: ${courseTitle}
- Level: ${courseLevel}
- Completed: ${completedDate}
- Lessons Completed: ${lessons}
- Total Duration: ${duration}
- Certificate ID: ${certificateId}

DESIGN REQUIREMENTS:
- Landscape orientation, 1400×990px proportions
- Deep dark background: rich dark navy or charcoal (#0a0e1a or #0f1117) — NOT white
- Elegant gold (#fbbf24 / #d4af37) and white (#f9fafb) color scheme
- Ornate decorative border: double-line gold border with corner flourishes or filigree
- Subtle geometric pattern or watermark in the background (very faint gold grid or lines)

LAYOUT (top to bottom, centred):
1. Top: "ForexEdge Academy" in small gold uppercase tracking-widest letters
2. Decorative gold divider line with small diamond or star accent
3. Large header text: "Certificate of Completion" in elegant serif-style white font, bold
4. Subtitle: "This certifies that" in small italic white/grey
5. STUDENT NAME in very large (60–70px), gold, bold serif font — the most prominent element
6. "has successfully completed" in regular white text
7. Course title "${courseTitle}" in large (32px) white bold, inside a subtle gold-bordered box
8. Level badge: "${courseLevel}" in a small rounded gold pill badge
9. Stats row: three small cards — "Lessons: ${lessons}" | "Duration: ${duration}" | "Completed: ${completedDate}"
10. Bottom section: ForexEdge Academy logo/seal (circular gold seal with star), and Certificate ID in tiny grey monospace

STYLE:
- Premium luxury feel — like a university degree certificate but dark-themed
- All text clearly readable with high contrast
- Gold accents throughout: borders, dividers, student name, seal
- No clipart, no photos, no forex charts — pure elegant typography and decoration
- Professional, serious, impressive
`.trim();
}

/**
 * Generate a personalised certificate using Gemini.
 */
async function generateCertificate({ studentName, courseTitle, courseLevel, completedDate, lessons, duration, certificateId }, outputDir) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in environment');

  const prompt = buildCertificatePrompt({ studentName, courseTitle, courseLevel, completedDate, lessons, duration, certificateId });

  const { status, body } = await openRouterPost('/api/v1/chat/completions', {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096,
  }, apiKey);

  if (status !== 200) {
    const errMsg = body?.error?.message || JSON.stringify(body).slice(0, 200);
    throw new Error(`OpenRouter error ${status}: ${errMsg}`);
  }

  const dataUrl = body?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) throw new Error('No image returned from Gemini for certificate');

  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!matches) throw new Error('Unexpected image format for certificate');

  const mimeType = matches[1];
  const imageData = Buffer.from(matches[2], 'base64');
  const ext = mimeType.split('/')[1] || 'jpg';
  const filename = `cert-${certificateId}.${ext}`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, imageData);

  return {
    filename,
    filePath,
    mimeType,
    publicUrl: `/certificates/${filename}`,
    certificateId,
  };
}

module.exports = { generateDiagram, generateBatch, buildPrompt, ALL_VISUAL_TYPES, DIAGRAM_PROMPTS, generateCertificate };
