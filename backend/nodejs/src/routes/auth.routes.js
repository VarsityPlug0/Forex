const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

// POST /register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('username').isLength({ min: 3, max: 50 }).trim().withMessage('Username must be 3-50 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').optional().trim().isLength({ max: 100 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, username, password, full_name } = req.body;
      const password_hash = await bcrypt.hash(password, 12);

      const user = await User.create({ email, username, password_hash, full_name });

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({
        user: { id: user.id, email: user.email, username: user.username, role: user.role, full_name: user.full_name },
        token,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account has been disabled' });
      }

      await user.update({ last_login: new Date() });

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        user: { id: user.id, email: user.email, username: user.username, role: user.role, full_name: user.full_name, avatar_url: user.avatar_url },
        token,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) return res.status(401).json({ error: 'Invalid refresh token' });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      full_name: req.user.full_name,
      avatar_url: req.user.avatar_url,
    },
  });
});

module.exports = router;
