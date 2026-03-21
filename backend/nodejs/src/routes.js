const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const blogRoutes = require('./routes/blog.routes');
const pammRoutes = require('./routes/pamm.routes');
const investmentRoutes = require('./routes/investment.routes');
const communityRoutes = require('./routes/community.routes');
const adminRoutes = require('./routes/admin.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const diagramRoutes = require('./routes/diagram.routes');
const certificateRoutes = require('./routes/certificate.routes');

// API version prefix
const API_PREFIX = '/v1';

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'forex-trading-platform-api' });
});

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/courses`, courseRoutes);
router.use(`${API_PREFIX}/blog`, blogRoutes);
router.use(`${API_PREFIX}/pamm`, pammRoutes);
router.use(`${API_PREFIX}/investments`, investmentRoutes);
router.use(`${API_PREFIX}/community`, communityRoutes);
router.use(`${API_PREFIX}/admin`, adminRoutes);
router.use(`${API_PREFIX}/analytics`, analyticsRoutes);
router.use(`${API_PREFIX}/diagrams`, diagramRoutes);
router.use(`${API_PREFIX}/certificates`, certificateRoutes);

// 404 handler for API routes
router.use(`${API_PREFIX}/*`, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested API endpoint ${req.originalUrl} does not exist`
  });
});

module.exports = router;
