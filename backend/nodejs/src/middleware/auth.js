const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Extract and verify JWT from Authorization header.
 * Attaches req.user = { id, email, role }
 */
const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'username', 'role', 'is_active', 'full_name', 'avatar_url'],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account has been disabled' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Require specific role(s). Must be used AFTER requireAuth.
 * Usage: requireRole('admin') or requireRole('admin', 'moderator')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

/** Shorthand: admin-only */
const requireAdmin = requireRole('admin');

/** Optional auth — attaches user if token present, continues if not */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'username', 'role', 'is_active'],
      });
      if (user && user.is_active) {
        req.user = user;
      }
    }
  } catch (_) {
    // Token invalid — continue as unauthenticated
  }
  next();
};

module.exports = { requireAuth, requireRole, requireAdmin, optionalAuth };
