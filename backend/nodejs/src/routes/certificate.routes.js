const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();

const { generateCertificate } = require('../services/geminiService');

const CERTS_DIR = path.join(__dirname, '..', '..', 'public', 'certificates');
if (!fs.existsSync(CERTS_DIR)) fs.mkdirSync(CERTS_DIR, { recursive: true });

// ── POST /api/v1/certificates/generate ──────────────────────────────────────
// Body: { studentName, courseTitle, courseLevel, completedDate, lessons, duration, courseId }
router.post('/generate', async (req, res) => {
  const { studentName, courseTitle, courseLevel, completedDate, lessons, duration, courseId } = req.body;

  if (!courseTitle) return res.status(400).json({ error: 'courseTitle is required' });

  const name = (studentName || 'Trader').trim();

  // Deterministic certificate ID: hash of name + courseId
  const certificateId = crypto
    .createHash('sha256')
    .update(`${name}-${courseId || courseTitle}`)
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();

  // Return cached certificate if it already exists
  const existing = fs.readdirSync(CERTS_DIR).find(f => f.includes(certificateId));
  if (existing) {
    return res.json({ success: true, cached: true, publicUrl: `/certificates/${existing}`, certificateId });
  }

  try {
    const result = await generateCertificate(
      { studentName: name, courseTitle, courseLevel: courseLevel || 'Intermediate', completedDate, lessons, duration, certificateId },
      CERTS_DIR
    );
    res.json({ success: true, cached: false, ...result });
  } catch (err) {
    console.error('[CertGen] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/v1/certificates/:id ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const file = fs.readdirSync(CERTS_DIR).find(f => f.includes(id.toUpperCase()));
  if (!file) return res.status(404).json({ error: 'Certificate not found' });
  res.json({ certificateId: id, publicUrl: `/certificates/${file}` });
});

module.exports = router;
