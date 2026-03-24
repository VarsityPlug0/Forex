const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables BEFORE anything else
dotenv.config();

const { sequelize } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const { generateDiagram, ALL_VISUAL_TYPES } = require('./services/geminiService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

// Health check (before all other middleware — no overhead)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limiting first — reject abusers before any processing
app.use('/api/', rateLimiter);

// Security middleware
app.use(helmet());
const DEV_ORIGINS = /^http:\/\/localhost:\d+$/;
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return cb(null, true);
    // In development: allow any localhost port
    if (process.env.NODE_ENV !== 'production' && DEV_ORIGINS.test(origin)) return cb(null, true);
    // In production: use CLIENT_URL env var
    if (origin === process.env.CLIENT_URL) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(compression());

// Serve generated diagrams as static files
app.use('/diagrams', express.static(path.join(__dirname, '..', 'public', 'diagrams')));
app.use('/certificates', express.static(path.join(__dirname, '..', 'public', 'certificates')));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

async function startServer() {
  // Try DB connection but don't block server startup
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced.');
    }
  } catch (error) {
    console.warn('Database unavailable — running without DB:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api/v1`);

    // Auto-generate missing diagrams in the background after startup
    if (process.env.OPENROUTER_API_KEY) {
      const DIAGRAMS_DIR = path.join(__dirname, '..', 'public', 'diagrams');
      if (!require('fs').existsSync(DIAGRAMS_DIR)) {
        require('fs').mkdirSync(DIAGRAMS_DIR, { recursive: true });
      }
      (async () => {
        const existing = require('fs').readdirSync(DIAGRAMS_DIR).map(f => f.split('-').slice(0, -1).join('-'));
        const missing = ALL_VISUAL_TYPES.filter(vt => !existing.some(e => e === vt));
        if (missing.length === 0) return console.log('[Diagrams] All diagrams already generated.');
        console.log(`[Diagrams] Generating ${missing.length} missing diagrams...`);
        for (const vt of missing) {
          try {
            await generateDiagram(vt, DIAGRAMS_DIR);
            console.log(`[Diagrams] ✓ ${vt}`);
          } catch (err) {
            console.error(`[Diagrams] ✗ ${vt}:`, err.message);
          }
        }
        console.log('[Diagrams] Done.');
      })();
    }
  });
}

startServer();

module.exports = app;
