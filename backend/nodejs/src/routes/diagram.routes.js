const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const { generateDiagram, generateBatch, ALL_VISUAL_TYPES, DIAGRAM_PROMPTS } = require('../services/geminiService');

const DIAGRAMS_DIR = path.join(__dirname, '..', '..', 'public', 'diagrams');

// Ensure output directory exists
if (!fs.existsSync(DIAGRAMS_DIR)) {
  fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
}

// ── GET /api/v1/diagrams ─────────────────────────────────────────────────────
// List all available visual types and which diagrams have already been generated
router.get('/', (req, res) => {
  const generated = {};
  if (fs.existsSync(DIAGRAMS_DIR)) {
    const files = fs.readdirSync(DIAGRAMS_DIR);
    files.forEach(f => {
      // filename pattern: <slug>-<hash>.<ext>
      const parts = f.replace(/\.[^.]+$/, '').split('-');
      // Reconstruct the visual type slug by dropping the last 8-char hash segment
      const slug = parts.slice(0, -1).join('-');
      if (!generated[slug]) generated[slug] = [];
      generated[slug].push(`/diagrams/${f}`);
    });
  }

  const types = ALL_VISUAL_TYPES.map(vt => ({
    visualType: vt,
    hasPrompt: !!DIAGRAM_PROMPTS[vt],
    generatedFiles: generated[vt] || [],
    latestUrl: (generated[vt] || [])[0] || null,
  }));

  res.json({ total: types.length, visualTypes: types });
});

// ── GET /api/v1/diagrams/:visualType ────────────────────────────────────────
// Get the latest generated diagram URL for a visual type
router.get('/:visualType', (req, res) => {
  const { visualType } = req.params;

  if (!fs.existsSync(DIAGRAMS_DIR)) {
    return res.status(404).json({ error: 'No diagrams generated yet' });
  }

  const files = fs.readdirSync(DIAGRAMS_DIR);
  const matching = files
    .filter(f => f.startsWith(visualType + '-'))
    .sort()
    .reverse();

  if (matching.length === 0) {
    return res.status(404).json({ error: `No diagram found for visual type: ${visualType}` });
  }

  res.json({
    visualType,
    latestUrl: `/diagrams/${matching[0]}`,
    allUrls: matching.map(f => `/diagrams/${f}`),
  });
});

// ── POST /api/v1/diagrams/generate ──────────────────────────────────────────
// Generate a single diagram
// Body: { visualType: string }
router.post('/generate', async (req, res) => {
  const { visualType } = req.body;

  if (!visualType) {
    return res.status(400).json({ error: 'visualType is required' });
  }

  try {
    const result = await generateDiagram(visualType, DIAGRAMS_DIR);
    res.json({
      success: true,
      message: `Diagram generated for: ${visualType}`,
      ...result,
    });
  } catch (err) {
    console.error(`[DiagramGen] Error generating ${visualType}:`, err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      visualType,
    });
  }
});

// ── POST /api/v1/diagrams/generate-batch ────────────────────────────────────
// Generate multiple diagrams (streams progress via JSON-lines)
// Body: { visualTypes?: string[] }  — omit to generate all
router.post('/generate-batch', async (req, res) => {
  const { visualTypes } = req.body;
  const targets = Array.isArray(visualTypes) && visualTypes.length > 0
    ? visualTypes
    : ALL_VISUAL_TYPES;

  // Stream NDJSON progress
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  const results = await generateBatch(targets, DIAGRAMS_DIR, (progress) => {
    res.write(JSON.stringify(progress) + '\n');
  });

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  res.write(JSON.stringify({
    status: 'complete',
    total: results.length,
    succeeded,
    failed,
    results,
  }) + '\n');
  res.end();
});

// ── DELETE /api/v1/diagrams/:visualType ─────────────────────────────────────
// Delete generated diagrams for a visual type (force regeneration)
router.delete('/:visualType', (req, res) => {
  const { visualType } = req.params;

  if (!fs.existsSync(DIAGRAMS_DIR)) {
    return res.status(404).json({ error: 'No diagrams directory' });
  }

  const files = fs.readdirSync(DIAGRAMS_DIR);
  const matching = files.filter(f => f.startsWith(visualType + '-'));

  matching.forEach(f => fs.unlinkSync(path.join(DIAGRAMS_DIR, f)));

  res.json({ deleted: matching.length, visualType });
});

module.exports = router;
